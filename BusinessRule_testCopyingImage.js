/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testCopyingImage",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "testCopyingImage",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
var styleNode = node.getParent();
var wfErrorMessage=null;


if ((styleNode.isInState("wf_NewStyleEnrichmentSA","NewStyleEnrich_Final"))){
            try {
                wfErrorMessage = styleNode.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation","Auto Trigger").getScriptMessage();
            }
            catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                    styleNode.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Final").triggerLaterByID("FinalValidation","Auto Trigger");
                }
            }
            
            if(wfErrorMessage != null){
                styleNode.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }
}