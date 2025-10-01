/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "GetObjectType",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Get Object Type",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log) {
var obj = node.getObjectType().getID();

if(obj == "Style")
{
if (node.isInState("wf_StyleMaintenanceWorkflow", "InitialState")) {
		node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow").getTaskByID("InitialState").triggerByID("SubmitStyle", "Moved to 'Style' Maintenance Workflow");
	}
}
else if (obj == "CustomerChoice")
{
	if (node.isInState("wf_StyleMaintenanceWorkflow", "InitialState")) {
		node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow").getTaskByID("InitialState").triggerByID("SubmitCC", "Moved to 'CC' Maintenance Workflow");
	}
}
else
{
	throw "The Object is not Style or CC";
}
}