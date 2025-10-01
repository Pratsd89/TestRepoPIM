/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SetLifeCycleStatus",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetLifeCycleStatus",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var shotRequestLifeCycleStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
if(shotRequestLifeCycleStatus == 'Submitted'){
	node.getValue('a_Shot_Request_Lifecycle_Status').setSimpleValue('Ready for Review');
	if(node.isInWorkflow("wf_ShortRequestLifeCycle")){
		var task=node.getTaskByID("wf_ShortRequestLifeCycle","Submitted");
     	var triggerResult = task.triggerByID("Ready_to_Review",'');
	}
	
}

}