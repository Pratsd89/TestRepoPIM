/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Auto_Trigger_SA_WF_When_JP_Complete",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Auto Trigger SA WF When JP Complete",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
if(node.getObjectType().getID()=='CustomerChoice'){
    var autoTrigger = false;
    var wfErrorMessage = null;
    stepManager.executeInContext("EN_JP",function(jpContextManager){
        var jpProduct = jpContextManager.getProductHome().getProductByID(node.getID());
        var jpLifeCycleStatus = jpProduct.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
        if(jpLifeCycleStatus == 'Approved' ){
        	autoTrigger = true;   
        }
        
    });

    if(autoTrigger == true){
    		if ((node.isInState("wf_CCEnrichmentSA","NewCCEnrich_Photo2"))){
                try {
                    wfErrorMessage = node.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview","Auto Trigger").getScriptMessage();
                }
                catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                        node.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo2").triggerLaterByID("SubmitForReview","Auto Trigger");
                    }
                }
            if(wfErrorMessage != null){
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }

         if ((node.isInState("wf_CCEnrichmentSA","NewCCEnrich_Photo3"))){
            try {
                wfErrorMessage = node.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo3").triggerByID("Submit","Auto Trigger").getScriptMessage();
            }
            catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                    node.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo3").triggerLaterByID("Submit","Auto Trigger");
                }
            }
            
            if(wfErrorMessage != null){
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }
    }
}
else if(node.getObjectType().getID()=='Style'){
	var autoTrigger = false;
	var wfErrorMessage = null;
     stepManager.executeInContext("EN_JP",function(jpContextManager){
        var jpProduct = jpContextManager.getProductHome().getProductByID(node.getID());
        var jpLifeCycleStatus = jpProduct.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
        if(jpLifeCycleStatus == 'Approved' ){
            if(!jpProduct.isInWorkflow('wf_NewStyleEnrichmentJapan')){
                autoTrigger = true;   
            }            
        }
        
     });

     if(autoTrigger == true){
    		if ((node.isInState("wf_NewStyleEnrichmentSA","NewStyleEnrich_Copy1"))){
                try {
                   // wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete","Auto Trigger").getScriptMessage();
                }
                catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                        node.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Copy1").triggerLaterByID("Copy_Complete","Auto Trigger");
                    }
                }
            
            if(wfErrorMessage != null){
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }

         if ((node.isInState("wf_NewStyleEnrichmentSA","NewStyleEnrich_Final"))){
            try {
                wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation","Auto Trigger").getScriptMessage();
            }
            catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                    node.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Final").triggerLaterByID("FinalValidation","Auto Trigger");
                }
            }
            
            if(wfErrorMessage != null){
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }
    }
}
}