/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Set_Style_Name",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Style Name",
  "description" : "PPIM-11782",
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
// br_Set_Style_Name
var styleName = node.getName();
var sourceStyleName = node.getValue("a_Source_Style_Name").getSimpleValue();

if (styleName == null) {
    node.setName(sourceStyleName);
}
}