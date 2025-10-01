/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "PhotoShotLifeCycleSetStatus",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Photo Shot Life Cycle Set Status",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentWorkflowBindContract",
    "alias" : "workflow",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,workflow) {
if(node.isInState(workflow, "Draft")){
	node.getValue("a_Shot_Request_Lifecycle_Status").setSimpleValue("Draft");
}else if(node.isInState(workflow, "Submitted")){
	node.getValue("a_Shot_Request_Lifecycle_Status").setSimpleValue("Submitted");
}else if(node.isInState(workflow, "Ready to Review")){
	node.getValue("a_Shot_Request_Lifecycle_Status").setSimpleValue("Ready to Review");
}else if(node.isInState(workflow, "Approved")){
	node.getValue("a_Shot_Request_Lifecycle_Status").setSimpleValue("Complete");
}

}