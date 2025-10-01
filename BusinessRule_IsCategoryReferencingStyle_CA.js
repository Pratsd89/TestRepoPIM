/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "IsCategoryReferencingStyle_CA",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "IsCategoryReferencingStyle_CA",
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
if((currentContext == "EN_CA" || currentContext == "FR_CA" ) && obj == "Style")
{
	return true;
}
else if ((currentContext == "EN_CA" || currentContext == "FR_CA" ) && obj == "CC")
{
	return true;
}
else
{
	return false;
}

}