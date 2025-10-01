/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "InboundBasedWorkflowInitiation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "InboundBasedWorkflowInitiation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
if (node.isInState("wf_ShortRequestLifeCycle","Rejected")){
		var wf = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
		wf.getTaskByID("Rejected").triggerByID("Rejected_Needs_Approval","Photoshot Inbound Based Rejected Needs Approval Invocation");
		}
else if (node.isInState("wf_ShortRequestLifeCycle","Submitted")){
		var wf = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
		wf.getTaskByID("Submitted").triggerByID("Ready_to_Review","Photoshot Inbound Based Ready to Review Invocation");
		}
}