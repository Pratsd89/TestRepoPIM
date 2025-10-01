/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_FinalValidation_Style_Trigger_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br FinalValidation Style Trigger SA",
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
var styleNode = node.getParent();
var wfErrorMessage=null;

if ((styleNode.isInState("wf_NewStyleEnrichmentSA","NewStyleEnrich_Final"))){
              var myTask = styleNode.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Final");
             if (myTask != null || myTask != "") {
               // myTask.triggerByID("FinalValidation", "Auto Trigger");
            } else {
                wfErrorMessage = "No Such task NewStyleEnrich_Final";
            }
            if (wfErrorMessage != null) {
                styleNode.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }

}
            
            
            
            
         
}