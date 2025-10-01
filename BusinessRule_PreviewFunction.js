/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "PreviewFunction",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "PreviewFunction",
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
  "binds" : [ ],
  "messages" : [ {
    "variable" : "msg",
    "message" : "Very nice",
    "translations" : [ {
      "language" : "hi",
      "message" : "Bahut ache"
    } ]
  } ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (node,msg) {
return  "<html>"
	 + "<a href =	\"https://oldnavy.gap.com/browse/product.do?pid=" + node.getId() + " target=\"_blank\">Click Here</a><br>"
	 + "</html>";


}