/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "BusinessFunctionTesting",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Actions" ],
  "name" : "Business Function Testing",
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
  "pluginId" : "JavaScriptBusinessFunctionWithBinds",
  "binds" : [ {
    "contract" : "AttributeBindContract",
    "alias" : "Name",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Name",
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "Name",
    "message" : "Getting Name value",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ {
    "contract" : "AttributeBindContract",
    "alias" : "Name",
    "parameterClass" : "null",
    "value" : null,
    "description" : "No desc"
  } ]
}
*/
exports.operation0 = function (Name,Name,Name) {

}