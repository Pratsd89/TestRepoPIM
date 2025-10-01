/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Final_Validation_Style_Trigger_SA_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br FinalValidation Style Trigger SA CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
var BusinessRuleHome = step.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
step.executeInContext('EN_US',function(enContextManager){
	var wfErrorMessageStyle = null;
	var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());
	var lifecycle = enCurrentProduct.getParent().getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	if(lifecycle == "Approved" && (!(enCurrentProduct.getParent().isInWorkflow("wf_NewStyleEnrichment")))){
		if (node.getParent().isInState("wf_NewStyleEnrichmentSA","NewStyleEnrich_Final")){
			/*try{
				wfErrorMessageStyle = node.getParent().getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation","Style Trigger from NewStyleEnrich_Final through CC").getScriptMessage();
				}
				catch(e){
					if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
			            
			            node.getParent().getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Final").triggerLaterByID("FinalValidation","Style Trigger from NewStyleEnrich_Final through CC");
			            }
					}*/
			
		 var myTask = node.getParent().getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Final");
             if (myTask != null || myTask != "") {
             	BusinessRuleHome.getBusinessActionByID("wf_NewStyleEnrichSA_NewStyleEnrich_Final").execute(node);
               // myTask.triggerLaterByID("FinalValidation", "Auto Trigger");
            } else {
                wfErrorMessageStyle = "Style Trigger from NewStyleEnrich_Final through CC";
            }
            if (wfErrorMessageStyle != null) {
                node.getParent().getValue("a_error_message").setSimpleValue(wfErrorMessageStyle);
            }
			}
			
		}
});

}