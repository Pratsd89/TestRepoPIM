/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_attributeToGroupMapping",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Attribute to Group Mapping",
  "description" : "Attribute to Group Mapping",
  "scope" : "Global",
  "validObjectTypes" : [ "stibo.normalattribute" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
exports.operation0 = function (step,node) {
//var viewOnlyGrp = step.getAttributeGroupHome().getAttributeGroupByID("ag_Style_Editable_US_CA_MC");
//node.addAttributeGroup(viewOnlyGrp);
var editableAttributeGrp = step.getAttributeGroupHome().getAttributeGroupByID("PacmanAttributes");
node.addAttributeGroup(editableAttributeGrp);
}