/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Is_Shot_Request_After_Submitted",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Is Shot Request Life Cycle Status After Submitted",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
var lifeCycleStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
if (lifeCycleStatus == 'Submitted' || lifeCycleStatus == 'Draft'){
	return false;
}
else{
	return true;
}
}