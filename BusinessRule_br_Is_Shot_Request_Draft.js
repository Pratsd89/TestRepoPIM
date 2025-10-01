/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Is_Shot_Request_Draft",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Is Shot Request Life Cycle Status Draft",
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
if (lifeCycleStatus == 'Draft'){
	return true;
}
else{
	return false;
}

}