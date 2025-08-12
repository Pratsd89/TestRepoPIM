/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ApproveStyle",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ApproveStyle",
  "description" : "BusinessRule To Approve Style ",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
try {
							node.approve();
							} 
							catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.synchronize.exception.SynchronizeException) {
							throw(e);
							} 
							}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateTriggerStateFlowEvent",
  "parameters" : [ {
    "id" : "currentStateID",
    "type" : "java.lang.String",
    "value" : "StyleMaintenance"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "ApproveStyle"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : "Approved"
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_StyleMaintenanceWorkflow"
  } ],
  "pluginType" : "Operation"
}
*/
