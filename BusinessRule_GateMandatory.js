/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "GateMandatory",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "GateMandatory",
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
if(node.getValue("a_Restriction_Types").getSimpleValue() == null || node.getValue("a_Restriction_Types").getSimpleValue() == " " ||
node.getValue("a_Allowed_Selling_Channels").getSimpleValue() == null || node.getValue("a_Allowed_Selling_Channels").getSimpleValue() == " " ||
{
	return true;
}
else
{
	return false;
}
}