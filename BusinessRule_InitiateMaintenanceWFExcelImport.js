/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "InitiateMaintenanceWFExcelImport",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "InitiateMaintenanceWFExcelImport",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var wfInstances = node.getWorkflowInstances().toArray();
if(wfInstances.length == 0) {
	// object is not in any workflow so start maintenance
	node.startWorkflowByID("wf_StyleMaintenanceWorkflow","Starting Maintenance Workflow through Import");
}

}