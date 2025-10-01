/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SizeDimensionPublish",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_SizeDimensionPublish",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Dimension_Value" ],
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
//
var ObjectType = node.getObjectType().getID();

if (ObjectType == "Dimension Value") {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
} 

}