/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CCImagePreview",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "CCImagePreview",
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
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ ]
}
*/
exports.operation0 = function () {
return "<html><iframe id=\"approve\" width=\"930\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"https://www.onol.wip.gidapps.com/browse/product.do?pid="+node.getID()+"&amp;date=10/23/2019&amp;locale=en_US\"></iframe></html>"
}