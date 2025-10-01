/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PacmanPhotoshots_Approval",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Pacman Photoshots Approval",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var ccSourceLifeCycleStatus=node.getValue('a_Source_CC_Life_Cycle_Status').getSimpleValue()
var ccLifeCycleStatus=node.getValue('a_CC_Life_Cycle_Status').getSimpleValue()

if(ccSourceLifeCycleStatus=='Approved' && ccSourceLifeCycleStatus!=ccLifeCycleStatus){
	var shotRequestReferences = node.getReferences(manager.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef")).toArray();
	if(shotRequestReferences.length != 0 ){
	    for(var i=0;i<shotRequestReferences.length; i++ ){
		        var shotRequest = shotRequestReferences[i].getTarget();
		        	var shotSourceLifeCycleStatus=shotRequest.getValue('a_Source_Shot_Request_Lifecycle_Status').getSimpleValue()
		        	var shotLastModifiedUser = shotRequest.getRevision().getUserID();
		           if(shotSourceLifeCycleStatus=='Ready for Review' && shotLastModifiedUser=='STIBOCATALOGSYNCUSER'){
					var shotRequestWF = shotRequest.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
					if(shotRequestWF!=null){
						var review = shotRequestWF.getTaskByID("Ready_to_Review");
						wfErrorMessage = review.triggerByID("Approve","Shot Request approved as Source CC Life Cycle Status is approved").getScriptMessage(); 
						if(wfErrorMessage != null)
						{
							shotRequest.getValue("a_error_message").setSimpleValue(context+" : "+wfErrorMessage);
						}
						else
						{
							if(shotRequest.getValue("a_error_message").getSimpleValue() != null)
							{
								shotRequest.getValue("a_error_message").deleteCurrent();
							}  
							var styleWfID=null;
							var ccWfID=null;
							var context=manager.getCurrentContext().getID();
							if(context=="EN_US"){
								styleWfID="wf_NewStyleEnrichment";
								ccWfID="wf_CCEnrichment"
							}
							else if(context=="EN_CA" ||context=="FR_CA" ){
								styleWfID="wf_NewStyleEnrichmentCanada";
								ccWfID="wf_CCEnrichmentCanada"
							}
							else if(context=="EN_JP" ||context=="JA_JP" ){
								styleWfID="wf_NewStyleEnrichmentJapan";
								ccWfID="wf_CCEnrichmentJapan"
							}
							var styleIsInFinalState= node.getParent().isInState(styleWfID,"NewStyleEnrich_Final")
							var ccIsInFinalState= node.isInState(ccWfID,"NewCCEnrich_Final")
							if(ccIsInFinalState && styleIsInFinalState){
								var styleWf = node.getParent().getWorkflowInstanceByID(styleWfID);
								var finalState = styleWf.getTaskByID("NewStyleEnrich_Final");
								var styleWfErrorMessage = finalState.triggerByID("FinalValidation","Approving the Style, As CC is in Final Validation and Shot Approved based on the Source CC Life Cycle Status").getScriptMessage();
								if(styleWfErrorMessage != null) {
									node.getParent().getValue("a_error_message").setSimpleValue(context+" : "+styleWfErrorMessage);
								}
								else {
									if(node.getParent().getValue("a_error_message").getSimpleValue() != null) {
										node.getParent().getValue("a_error_message").deleteCurrent();
									}
								}
							} else if(ccIsInFinalState){
								var ccWf = node.getWorkflowInstanceByID(ccWfID);
								var finalState = ccWf.getTaskByID("NewCCEnrich_Final");
								var ccWfErrorMessage = finalState.triggerByID("Submit","Approving the CC, As Shot Approved based on the Source CC Life Cycle Status").getScriptMessage();
								if(ccWfErrorMessage != null) {
									node.getValue("a_error_message").setSimpleValue(context+" : "+ccWfErrorMessage);
								}
								else {
									if(node.getValue("a_error_message").getSimpleValue() != null) {
										node.getValue("a_error_message").deleteCurrent();
									}
								}
							}
						}
				   	}
				   }
		}
	}
}
}