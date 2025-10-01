/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_merge_att_values",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Merge Attribute Values",
  "description" : "Modify to suit. In use for PPIM-9716. Check Status of Story before Modifying",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
var attValueToSet = node.getValue("a_Tax_Code").getSimpleValue();

//set value using attValueToSet
node.getValue("z_Tax_Code").setValue(attValueToSet);
}