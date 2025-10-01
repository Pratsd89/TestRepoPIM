/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "IscontextcheckJP",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Is Context Check for JP",
  "description" : "Business Condition to check if current object is a Class object",
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
var objBrand = node.getValue("a_Brand_Number").getSimpleValue();
if(objBrand == "GPS"){
	return false;
}
var currentContext = manager.getCurrentContext().getID();
if(currentContext == "EN_JP" || currentContext == "JA_JP") 
	return true;
else
	return false;
}