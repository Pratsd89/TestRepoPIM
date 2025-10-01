/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestAutoApprovalAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ShotRequestAutoApprovalAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  }, {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  }, {
    "libraryId" : "lib_PhotoShot",
    "libraryAlias" : "photo"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
    "alias" : "CCToPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step,CCToPhotoShotRef,LKT,compCheck,helper,photo) {
/*
 * Update based on PPIM-1802
 * 1. Modify current business rule ShotRequestAutoApprovalAction to remove requirement to NOT autoapprove when a_Site_Placement = 5.  
 * Instead, when CC already has P01 and any other site placements fulfilled for any market, auto-approve all subsequent shot requests.
 * i.e. if shot has an approved CC attached to it and at least a Main P1 approved attached to that CC, shot can be auto approved.
 * 
 * 2. When auto-approving shot request where a_Site_Placement = 5, if CC is already approved before in CA context and a_CC_Autoapproval="Y", set 
 * a_CC_Autoapproval= blank and approve in US context CC and all references.
 */

/*PPIM-10268: Fix Shot Request Auto-Approval 
If a Shot Request is sent to the Ready to Review state of the Shot Request Lifecycle workflow, it will automatically trigger the “Approve” task/transition if 
it is referenced by a CC that is approved with a Complete Main P1 shot request, in any market that is applicable to the Shot Request, based on that Shot Requests shared markets value.*/

var autoApprove = false;

function autoApproveCCs(context) {
    step.executeInContext(context, function (otherManager) {
    			var shotReferencingCCs = new java.util.ArrayList();
			    shotReferencingCCs.addAll(node.getReferencedByProducts());
			    if (!shotReferencingCCs.isEmpty()) {
      			for (var num = 0; num < shotReferencingCCs.size(); num++) {
      			  var cc = shotReferencingCCs.get(num).getSource();	
      			  if(!autoApprove){
      			    var brand = cc.getValue('a_Brand_Number').getSimpleValue();	
      			    var autoApproveBrand = LKT.getLookupTableValue("LKT_Brand_to_SR_Auto_Approval",brand);
      			    
      			    if(autoApproveBrand == 'Yes' && cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue() == 'Approved') {
      			    		var shotRequestRefs = cc.getReferences(CCToPhotoShotRef).toArray();
      			    		
      			    		for(var i = 0 ; i < shotRequestRefs.length ; i++){
      			    			var shotRequest = shotRequestRefs[i].getTarget();
      			    			
      			    			if(shotRequest.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue() == 'Complete' 
      			    					&& shotRequest.getValue('a_Site_Placement').getLOVValue().getID() == "5")	{
      			    				autoApprove = true;		
      			    				break;						
      			    			}
      			    		}
      			    }
      			}
      		}
      	}
    });
    if(autoApprove){
         if (node.isInState("wf_ShortRequestLifeCycle", "Ready_to_Review")) {
	        var wf = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
	        wf.getTaskByID("Ready_to_Review").triggerLaterByID("Approve", "AutoApprove Photoshot");
	    }
	    var rejectStatus = node.getValue('a_Shot_Request_Rejection_Status').getSimpleValue();
	    node.getValue("a_Shot_Request_Autoapproved").setSimpleValue("Yes");
	    if (rejectStatus != null && rejectStatus == "Was Rejected Needs Approval") {
	        node.getValue("a_Shot_Request_Rejection_Status").setSimpleValue("Was Rejected Is Approved");
	    }
    }   
}

// if Site Placement != Main P1 , get all shared makrtes and contexts from lookup table and call func. autoApproveCCs for all contexts
if (node.getValue('a_Site_Placement').getLOVValue()!=null && node.getValue('a_Site_Placement').getLOVValue().getID() != "5") {
  var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();
  var contexts = new Array();
  sharedMarkets.forEach(function (market) {
    contexts.push(LKT.getLookupTableValue("LKT_MarketDesignationToMarket",market.getSimpleValue()));
  });
  
  if (sharedMarkets != null) {
    contexts.forEach(function (context) {
    	 autoApproveCCs(context);
     });
  }
}

}