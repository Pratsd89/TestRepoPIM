/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Auto_Trigger_CA_WF_When_US_Complete",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Auto Trigger CA WF When US Complete",
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
    stepManager.executeInContext("EN_US",function(enContextManager){
        var enProduct = enContextManager.getProductHome().getProductByID(node.getID());
        var usLifeCycleStatus = enProduct.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
        if(usLifeCycleStatus == 'Approved' ){
        	autoTrigger = true;   
        }
        
    });

    if(autoTrigger == true){
    	log.info("NewCCEnrich_Photo2="+node.isInState("wf_CCEnrichmentCanada","NewCCEnrich_Photo2"));
    		if ((node.isInState("wf_CCEnrichmentCanada","NewCCEnrich_Photo2"))){
                try {
                    wfErrorMessage = node.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview","Auto Trigger").getScriptMessage();
                }
                catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                        //node.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo2").triggerLaterByID("SubmitForReview","Auto Trigger");
                    }
                }
            if(wfErrorMessage != null){
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }
log.info("NewCCEnrich_Photo3="+node.isInState("wf_CCEnrichmentCanada","NewCCEnrich_Photo3"));
         if ((node.isInState("wf_CCEnrichmentCanada","NewCCEnrich_Photo3"))){
            try {
                wfErrorMessage = node.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo3").triggerByID("Submit","Auto Trigger").getScriptMessage();
            }
            catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                    node.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo3").triggerLaterByID("Submit","Auto Trigger");
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
     stepManager.executeInContext("EN_US",function(enContextManager){
        var enProduct = enContextManager.getProductHome().getProductByID(node.getID());
        var usLifeCycleStatus = enProduct.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
        if(usLifeCycleStatus == 'Approved' ){
            if(!enProduct.isInWorkflow('wf_NewStyleEnrichment')){
                autoTrigger = true;   
            }            
        }
        
     });

     if(autoTrigger == true){
    		if ((node.isInState("wf_NewStyleEnrichmentCanada","NewStyleEnrich_Copy1"))){
                try {
                    wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete","Auto Trigger").getScriptMessage();
                }
                catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                        node.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Copy1").triggerLaterByID("Copy_Complete","Auto Trigger");
                    }
                }
            
            if(wfErrorMessage != null){
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }

         if ((node.isInState("wf_NewStyleEnrichmentCanada","NewStyleEnrich_Final"))){
            try {
                //wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation","Auto Trigger").getScriptMessage();
            }
            catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                    node.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Final").triggerLaterByID("FinalValidation","Auto Trigger");
                }
            }
            
            if(wfErrorMessage != null){
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }
    }

     
}
}