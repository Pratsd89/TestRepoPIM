/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "wf_CC_Can_NewCCEnchParalStat_FinalVali",
  "type" : "BusinessAction",
  "setupGroups" : [ "CA_Workflow_Triggers" ],
  "name" : "acn-be9972da-e783-4545-9324-52dcf4bd733f_Global",
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
step.executeInContext('EN_US',function(enContextManager){
	var wfErrorMessageStyle = null;
	var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());
	var lifecycle = enCurrentProduct.getParent().getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	if(lifecycle == "Approved" && (!(enCurrentProduct.getParent().isInWorkflow("wf_NewStyleEnrichment")))){
		if (node.getParent().isInState("wf_NewStyleEnrichmentCanada","NewStyleEnrich_Final")){
			try{
				wfErrorMessageStyle = node.getParent().getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation","Style Trigger from NewStyleEnrich_Final through CC").getScriptMessage();
				}
				catch(e){
					if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
			            log.info(e);
			            node.getParent().getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Final").triggerLaterByID("FinalValidation","Style Trigger from NewStyleEnrich_Final through CC");
			            }
					}
			}
		}
});

}