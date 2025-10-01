/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "IsCategoryReferencingStyle_JP",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "IsCategoryReferencingStyle_JP",
  "description" : "Business Condition to check for Flag visibility",
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
var currentContext = manager.getCurrentContext().getID();
var obj = node.getValue("a_WebCategory_Product_Type").getSimpleValue();
if((currentContext == "EN_JP" || currentContext == "JA_JP" ) && obj == "Style")
{
	return true;
}
else if ((currentContext == "EN_JP" || currentContext == "JA_JP" ) && obj == "CC")
{
	return true;
}
else
{
	return false;
}

}