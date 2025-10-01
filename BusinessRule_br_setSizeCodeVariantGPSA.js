/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setSizeCodeVariantGPSA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_setSizeCodeVariantGPSA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ColorPalette" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var cpName = node.getValue("a_Source_Color_Palette_Name").getSimpleValue();

if(cpName!=null || cpName !=''){
node.setName(cpName);
}
}