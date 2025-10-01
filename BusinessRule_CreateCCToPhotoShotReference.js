/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CreateCCToPhotoShotReference",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create CC To Photo Shot Reference during Shot Request Import",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "ccAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Number",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "otherManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,log,node,qh,ccAttr,otherManager) {
function getCCByShotCCNumber(shotCCNumber) {
	if (shotCCNumber != null) {
		var c = com.stibo.query.condition.Conditions;
		var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
			c.valueOf(ccAttr).eq(shotCCNumber)
			.and(c.objectType(step.getObjectTypeHome().getObjectTypeByID("CustomerChoice")))
		);
		var res = querySpecification.execute();
		// if search returns something, just get the first CC. a_CC_Number is a unique value so should only get one record in result.
		if (res.asList(1).size() > 0) {
			var ccRes = res.asList(1).get(0);
			return ccRes;
		}
	}
	// if search didn't return or shot_cc_number is blank, return null
	return null;
}

function removeShotRequestRefs(shot, contextID) {
	step.executeInContext(contextID, function(otherManager) {
		var otherShot = otherManager.getObjectFromOtherManager(shot);
		var refByList = otherShot.getReferencedByProducts();
		   if (refByList != null) {
		   	var refByListIterator = refByList.iterator();
		   	while(refByListIterator.hasNext()) {
				var ref = refByListIterator.next();
				if(ref.getReferenceTypeString() == "CCToPhotoShotRef") {
					ref.delete();
				}
			}
		   }
	});
	
}
var cc = getCCByShotCCNumber(node.getValue("a_Shot_CC_Number").getSimpleValue());

// following will prevent exception if the reference already exists
try {
   cc.createReference(node, "CCToPhotoShotRef");
} catch (e) {
   if (e instanceof com.stibo.core.domain.LinkTypeNotValidException ) {
   		throw e;
   }
}

// If a Market code is removed, need to remove links from that context.
// first grab shared markets to see which contexts to run this in
var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
if(sharedMarkets != null) {
	
	if(sharedMarkets.indexOf("US") < 0) {
		removeShotRequestRefs(node, "EN_US");
	}
	
	if(sharedMarkets.indexOf("CAN") < 0) {
		removeShotRequestRefs(node, "EN_CA") 
	}

}

//Attributes for Styling Pieces - a_Styling_Piece_CC_Number_Import & a_Styling_Piece_Instructions_Import

// build references for styling piece
var stylingPieceCCs = node.getValue("a_Styling_Piece_CC_Number_Import").getSimpleValue();
if(stylingPieceCCs != null) {
	var stylingPieceCCArray = stylingPieceCCs.split(",");
	for (var x = 0; x < stylingPieceCCArray.length; x++) {
		var sCC = getCCByShotCCNumber(stylingPieceCCArray[x]);
		try {
		   node.createReference(sCC, "ShotRequestToStylingPieceCCRef");
		} catch (e) {
		   if (e instanceof com.stibo.core.domain.LinkTypeNotValidException ) {
		   		throw e;
		   }
		}
	}
}
// set instructions
var stylingPieceInstr = node.getValue("a_Styling_Piece_Instructions_Import").getSimpleValue();
var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");
var sShotReqToCCRefs = node.getReferences(sReferenceType);

if(stylingPieceInstr != null) {

var stylingPieceInstrArray = stylingPieceInstr.split(",");
	for (var x = 0; x < stylingPieceInstrArray.length; x++) {
		if (!sShotReqToCCRefs.isEmpty()) {
		   for (var p = 0; p < sShotReqToCCRefs.size(); p++) {
				if(sShotReqToCCRefs.get(p)){
					sShotReqToCCRefs.get(p).getValue("a_Styling_Piece_Instructions").addValue(stylingPieceInstrArray[x]);
				}
		   }
		}	
	}

}
// remove values from import attributes
node.getValue("a_Styling_Piece_CC_Number_Import").deleteCurrent();
node.getValue("a_Styling_Piece_Instructions_Import").deleteCurrent();

// update shot request method to 'Bulk'

node.getValue("a_Shot_Request_Method").setSimpleValue("Bulk");


// trigger workflow transition to Submitted status
/*
if (node.isInState("wf_ShortRequestLifeCycle","Draft")) {
   node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerLaterByID("Submit","Shot Request submitted via Bulk Upload");
} 
else if(!(node.isInWorkflow("wf_ShortRequestLifeCycle"))){
	node.startWorkflowByID("wf_ShortRequestLifeCycle","Shot Request workflow initiated via Bulk Upload");
	var wf = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
	var task = wf.getTaskByID("Draft");
	logger.info(task.getState());
	task.triggerLaterByID("Submit","Shot Request submitted via Bulk Upload");
}
*/

}