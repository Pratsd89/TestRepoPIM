/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Cancel_Shot_Request",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Cancel Shot Request",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "CurrentCtxNode",
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "referenceString",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (CurrentCtxNode,log,step,referenceString,portal) {
if(step.getCurrentWorkspace().getID()== "Main")
{
//getting CC of the shot request
var sReferencingCCs = new java.util.ArrayList();
var ccID;
sReferencingCCs.addAll(CurrentCtxNode.getReferencedByProducts());
if (!sReferencingCCs.isEmpty()) {
	for (var num = 0; num < sReferencingCCs.size(); num++) {
		ccID=sReferencingCCs.get(num).getSource().getID();				
	}
}
var CC = step.getProductHome().getProductByID(ccID);
		//Seperate Screen Movement for Non Merch CC - PPIM-1406
		var nonMerchType = CC.getParent().getValue("a_product_merch_type").getSimpleValue();
		if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")){
			var fwdScreen = "CC_Details_Screen";
			}
			else{
				var fwdScreen = "GAPNonMerchCCDetailsList";
				}
		//End
//end of getting CC code

if(CurrentCtxNode.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue() == "Draft"){

	var contextHome = step.getContextHome();
	var contexts = contextHome.getContexts();
	var id = CurrentCtxNode.getID();
	var node;
	
	var itr = contexts.iterator();

	while(itr.hasNext()){
		var ctx = itr.next().getID();
		log.info("Running for " + ctx + " Context");
		setVisibility(ctx);
	}
	CurrentCtxNode.delete();
	//portal.navigate("homepage", null);
	portal.navigate(fwdScreen,CC);
}else{
	portal.showAlert("ERROR",  "Shot Request cannot be deleted as LifeCycle Status is not Draft");
	portal.navigate(fwdScreen,CC);
	//throw "<Shot Request cannot be deleted as LifeCycle Status is not Draft>";
}
}
else if(step.getCurrentWorkspace().getID()== "Approved")
{
	portal.showAlert("Warning",  "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
function setVisibility(ctx){

	step.executeInContext(ctx, function(step)
	{
		node = step.getEntityHome().getEntityByID(id);		
		
		//Below code to delete workflow instances (if any)
		
		if(!((node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle")) == null)){
			node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").delete("");
		}
		
		//Below code is to delete reference by links
		
		var sReferencingCCs = new java.util.ArrayList();
		sReferencingCCs.addAll(node.getReferencedByProducts());
		log.info("sReferencingCCs " + sReferencingCCs);
		if (!sReferencingCCs.isEmpty()) {
			for (var i = 0; i < sReferencingCCs.size(); i++) {
		     	var refCC = sReferencingCCs.get(i);
		       	var oStyleCC = refCC.getSource();
		       	var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef");
				var sCCToShotReqRefs = oStyleCC.getReferences(sReferenceType);
				
				log.info("sCCToShotReqRefs ---> " + sCCToShotReqRefs);
				if (!sCCToShotReqRefs.isEmpty()) {
					for (var j = 0; j< sCCToShotReqRefs.size(); j++) {
						if(sCCToShotReqRefs.get(j)){
							if(sCCToShotReqRefs.get(j).getTarget().getID() == node.getID()){
	                        			log.info("MATCHED -- " + node.getID());
	                        			sCCToShotReqRefs.get(j).delete();
	                        			//oStyleCC.approve();            
	                        		}	
						}
				   	}
				}
			}
		}
		
		//Below code to delete referenced links
		var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");
		var sShotReqToCCRefs = node.getReferences(sReferenceType);
	
		log.info("sShotReqToCCRefs - " + sShotReqToCCRefs);
		if (!sShotReqToCCRefs.isEmpty()) {
		   for (var p = 0; p < sShotReqToCCRefs.size(); p++) {
			if(sShotReqToCCRefs.get(p)){
				sShotReqToCCRefs.get(p).delete();
			}
		   }
		}
	
	});
}

}