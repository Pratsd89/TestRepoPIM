/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StyleMaintenanceToApproved",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "StyleMaintenanceToApproved",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
var deactivationDate = node.getValue('a_Style_End_Date').getSimpleValue();
var deactivationReason = node.getValue('a_Style_Deactivation_Reason').getSimpleValue();

if (( deactivationDate == null || deactivationDate == '') && (deactivationReason == null || deactivationReason == '')){
	return true;
}
else{
	return false;	
}
}