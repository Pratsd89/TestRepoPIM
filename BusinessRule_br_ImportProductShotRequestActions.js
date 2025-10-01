/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ImportProductShotRequestActions",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Product Shot Request Bulk Import Actions",
  "description" : "Ensure Shot Request has reference to CC in applicable Markets. Ensures Styling Piece reference is established and CC is initiated into Maintenance WF, when applicable",
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
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
exports.operation0 = function (step,node,qh,ccAttr,otherManager) {
function createShotRequestToStylingPieceCCRef(sCC,contextID,stylingPieceInstruction){
	step.executeInContext(contextID, function(otherManager) {
			var refExist = false;
			var otherShot = otherManager.getObjectFromOtherManager(node);
			var otherCC = otherManager.getObjectFromOtherManager(sCC);
			var ar_shotToCCReferencesNew = otherShot.getReferences().asList();
			for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
				var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
				if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
					var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
					if(a_oCC.getID() == otherCC.getID()){
						refExist = true;
					}
				}
			}
			if(refExist == false){
				try{
					var shotRef=otherShot.createReference(sCC, "ShotRequestToStylingPieceCCRef");
					shotRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(stylingPieceInstruction)
				} catch (e) {
					if (e instanceof com.stibo.core.domain.LinkTypeNotValidException ){
		   				throw e;
				  	}
				}
			}
		})


}

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
//following lines of code added for PPIM-3051
var wf = step.getWorkflowHome().getWorkflowByID("wf_StyleMaintenanceWorkflow");
if(cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Approved" && !cc.getWorkflowInstanceByID("wf_CCEnrichment") && !cc.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow"))
{
	wf.start(cc, "Started");
}
//update Shared Markets on Shot Request to have same values as Market designation in CC
// adding in JP context per PPIM-7404
var ccMarkets = cc.getValue("a_Market_Designation").getSimpleValue();
if(ccMarkets == "US"){
	step.executeInContext('EN_US',function(step) {
	var enCurrentEntity= step.getEntityHome().getEntityByID(node.getID());
	var value= "1"+ " : " + ccMarkets;
	enCurrentEntity.getValue("a_Shot_Market_Number").setSimpleValue(value);
	})
	}
else if(ccMarkets == "CAN"){
	step.executeInContext('EN_CA',function(step) {
		var enCurrentEntity= step.getEntityHome().getEntityByID(node.getID());
		var value= "4"+ " : " + ccMarkets;
	enCurrentEntity.getValue("a_Shot_Market_Number").setSimpleValue(value);
	})
	}
else if(ccMarkets == "JPN"){
	step.executeInContext('EN_JP',function(step) {
		var enCurrentEntity= step.getEntityHome().getEntityByID(node.getID());
		var value= "6"+ " : " + ccMarkets;
	enCurrentEntity.getValue("a_Shot_Market_Number").setSimpleValue(value);
	})
	}
else{
	
	step.executeInContext('EN_US',function(step) {
		var enCurrentEntity= step.getEntityHome().getEntityByID(node.getID());
				var value= "1" + " : " + "US";
	enCurrentEntity.getValue("a_Shot_Market_Number").setSimpleValue(value);
	})
	
	step.executeInContext('EN_CA',function(step) {
		var enCurrentEntity= step.getEntityHome().getEntityByID(node.getID());
		var value= "4"+ " : " + "CAN";
	enCurrentEntity.getValue("a_Shot_Market_Number").setSimpleValue(value);
	})
	step.executeInContext('EN_JP',function(step) {
		var enCurrentEntity= step.getEntityHome().getEntityByID(node.getID());
		var value= "6"+ " : " + "JPN";
	enCurrentEntity.getValue("a_Shot_Market_Number").setSimpleValue(value);
	})
}

var shotMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
// if shot has US & CA but CC only has one market, update shot request.
// adding in JP context per PPIM-7404
if((shotMarkets.indexOf("US") >= 0) && (shotMarkets.indexOf("CAN") >= 0) && (shotMarkets.indexOf("JPN") >=0)) {
	 if((ccMarkets.indexOf("US") < 0) || (ccMarkets.indexOf("CAN") < 0) || (ccMarkets.indexOf("JPN") < 0))
	 	node.getValue("a_Shared_Markets").setSimpleValue(ccMarkets);
	 	
	 shotMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
} 

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
// adding in JP context per PPIM-7404
var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
if(sharedMarkets != null) {
	
	if(sharedMarkets.indexOf("US") < 0) {
		removeShotRequestRefs(node, "EN_US");
	}
	
	if(sharedMarkets.indexOf("CAN") < 0) {
		removeShotRequestRefs(node, "EN_CA") 
	}
	if(sharedMarkets.indexOf("JPN") < 0) {
		removeShotRequestRefs(node, "EN_JP") 
	}
	
	var currentContext = step.getCurrentContext().getID();
	if(currentContext == "EN_US" && sharedMarkets.indexOf("CAN") >= 0) {
		step.executeInContext("EN_CA", function(otherManager) {
			var otherShot = otherManager.getObjectFromOtherManager(node);
			var otherCC = otherManager.getObjectFromOtherManager(cc);
			// following will prevent exception if the reference already exists
			try {
			   otherCC.createReference(otherShot, "CCToPhotoShotRef");
			   otherShot.getValue("a_Shot_CC_Number").setSimpleValue(otherCC.getValue("a_CC_Number").getSimpleValue());
			} catch (e) {
			   if (e instanceof com.stibo.core.domain.LinkTypeNotValidException ) {
			   		throw e;
			   }
			}
		});
	}
	//adding in JP context per PPIM-7404
	if(currentContext == "EN_US" && sharedMarkets.indexOf("JPN") >= 0) {
		step.executeInContext("EN_JP", function(otherManager) {
			var otherShot = otherManager.getObjectFromOtherManager(node);
			var otherCC = otherManager.getObjectFromOtherManager(cc);
			// following will prevent exception if the reference already exists
			try {
			   otherCC.createReference(otherShot, "CCToPhotoShotRef");
			   otherShot.getValue("a_Shot_CC_Number").setSimpleValue(otherCC.getValue("a_CC_Number").getSimpleValue());
			} catch (e) {
			   if (e instanceof com.stibo.core.domain.LinkTypeNotValidException ) {
			   		throw e;
			   }
			}
		});
	}

	if(currentContext == "EN_CA" && sharedMarkets.indexOf("US") >= 0) {
		step.executeInContext("EN_US", function(otherManager) {
			var otherShot = otherManager.getObjectFromOtherManager(node);
			var otherCC = otherManager.getObjectFromOtherManager(cc);
			// following will prevent exception if the reference already exists
			try {
			   otherCC.createReference(otherShot, "CCToPhotoShotRef");
			   otherShot.getValue("a_Shot_CC_Number").setSimpleValue(otherCC.getValue("a_CC_Number").getSimpleValue());
			} catch (e) {
			   if (e instanceof com.stibo.core.domain.LinkTypeNotValidException ) {
			   		throw e;
			   }
			}
		});
	}
	//adding in JP context per PPIM-7404
	if(currentContext == "EN_CA" && sharedMarkets.indexOf("JPN") >= 0) {
		step.executeInContext("EN_JP", function(otherManager) {
			var otherShot = otherManager.getObjectFromOtherManager(node);
			var otherCC = otherManager.getObjectFromOtherManager(cc);
			// following will prevent exception if the reference already exists
			try {
			   otherCC.createReference(otherShot, "CCToPhotoShotRef");
			   otherShot.getValue("a_Shot_CC_Number").setSimpleValue(otherCC.getValue("a_CC_Number").getSimpleValue());
			} catch (e) {
			   if (e instanceof com.stibo.core.domain.LinkTypeNotValidException ) {
			   		throw e;
			   }
			}
		});
	}
	//adding in JP context per PPIM-7404
	if(currentContext == "EN_JP" && sharedMarkets.indexOf("US") >= 0) {
		step.executeInContext("EN_US", function(otherManager) {
			var otherShot = otherManager.getObjectFromOtherManager(node);
			var otherCC = otherManager.getObjectFromOtherManager(cc);
			// following will prevent exception if the reference already exists
			try {
			   otherCC.createReference(otherShot, "CCToPhotoShotRef");
			   otherShot.getValue("a_Shot_CC_Number").setSimpleValue(otherCC.getValue("a_CC_Number").getSimpleValue());
			} catch (e) {
			   if (e instanceof com.stibo.core.domain.LinkTypeNotValidException ) {
			   		throw e;
			   }
			}
		});
	}
	//adding in JP context per PPIM-7404
	if(currentContext == "EN_JP" && sharedMarkets.indexOf("CAN") >= 0) {
		step.executeInContext("EN_CA", function(otherManager) {
			var otherShot = otherManager.getObjectFromOtherManager(node);
			var otherCC = otherManager.getObjectFromOtherManager(cc);
			// following will prevent exception if the reference already exists
			try {
			   otherCC.createReference(otherShot, "CCToPhotoShotRef");
			   otherShot.getValue("a_Shot_CC_Number").setSimpleValue(otherCC.getValue("a_CC_Number").getSimpleValue());
			} catch (e) {
			   if (e instanceof com.stibo.core.domain.LinkTypeNotValidException ) {
			   		throw e;
			   }
			}
		});
	}	
}



//Attributes for Styling Pieces - a_Styling_Piece_CC_Number_Import & a_Styling_Piece_Instructions_Import

// build references for styling piece


var ar_shotToCCReferencesNew = node.getReferences().asList();	
var stylingPieceCCs = node.getValue("a_Styling_Piece_CC_Number_Import").getSimpleValue();
var stylingPieceInstr = node.getValue("a_Styling_Piece_Instructions_Import").getSimpleValue();
var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");
var sShotReqToCCRefs = node.getReferences(sReferenceType);

var newStylingPieceInstrArray = [];
if(stylingPieceInstr != null){
	var stylingPieceInstrArray = stylingPieceInstr.split(",");
	for (var x = 0; x < stylingPieceInstrArray.length; x++){
		newStylingPieceInstrArray.push(stylingPieceInstrArray[x]);
	}
}
if(stylingPieceCCs != null) {
	var stylingPieceCCArray = stylingPieceCCs.split(",");
	for (var x = 0; x < stylingPieceCCArray.length; x++) {
		var sCC = getCCByShotCCNumber(stylingPieceCCArray[x]);
		for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){		
			var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
			if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){		
				var a_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
				var a_cc_num_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_CC_Number").getSimpleValue();
				if(stylingPieceCCArray[x] == a_cc_num_val){
					if(a_val == null){
						newStylingPieceInstrArray.splice(x, 0, " ");
					}
				}
			}
		}
	}
	log.info("New Instructions: " + newStylingPieceInstrArray);
}

//This has been modified as part of PPIM-7403., which will create StyleToStylePieceCCRef in the respective market based on shared market value as it should be available
var stylingPieceCCs = node.getValue("a_Styling_Piece_CC_Number_Import").getSimpleValue();
if(stylingPieceCCs != null) {
	var stylingPieceCCArray = stylingPieceCCs.split(",");
	for (var x = 0; x < stylingPieceCCArray.length; x++) {
		var sCC = getCCByShotCCNumber(stylingPieceCCArray[x]);
		if(sCC != null) {
			if(sharedMarkets.indexOf("US") >= 0) {
				createShotRequestToStylingPieceCCRef(sCC,"EN_US",newStylingPieceInstrArray[x])
			}
			if(sharedMarkets.indexOf("CAN") >= 0) {
				createShotRequestToStylingPieceCCRef(sCC,"EN_CA",newStylingPieceInstrArray[x])
			}
			if(sharedMarkets.indexOf("JPN") >= 0) {
				createShotRequestToStylingPieceCCRef(sCC,"EN_JP",newStylingPieceInstrArray[x])
			}
		}
	}
}

/*// set instructions
var stylingPieceInstr = node.getValue("a_Styling_Piece_Instructions_Import").getSimpleValue();
var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");
var sShotReqToCCRefs = node.getReferences(sReferenceType);

if(stylingPieceInstr != null) {
	//var stylingPieceInstrArray = stylingPieceInstr.split(",");
	for (var x = 0; x < newStylingPieceInstrArray.length; x++) {
		if (!sShotReqToCCRefs.isEmpty()) {
			sShotReqToCCRefs.get(x).getValue("a_Styling_Piece_Instructions").setSimpleValue(newStylingPieceInstrArray[x]);
		}	
	}
}*/
// remove values from import attributes
node.getValue("a_Styling_Piece_CC_Number_Import").deleteCurrent();
node.getValue("a_Styling_Piece_Instructions_Import").deleteCurrent();

// update shot request method to 'Bulk'

node.getValue("a_Shot_Request_Method").setSimpleValue("Bulk");


// trigger workflow transition to Submitted status

/*if (node.isInState("wf_ShortRequestLifeCycle","Draft")) {
   node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit","Shot Request submitted via Bulk Upload");
} 
else if(!(node.isInWorkflow("wf_ShortRequestLifeCycle"))){
	node.startWorkflowByID("wf_ShortRequestLifeCycle","Shot Request workflow initiated via Bulk Upload");
	if (node.isInState("wf_ShortRequestLifeCycle","Draft")) {
   		node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit","Shot Request submitted via Bulk Upload");
	} 
}*/
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "SetVisibilityAction"
  } ],
  "pluginType" : "Operation"
}
*/
