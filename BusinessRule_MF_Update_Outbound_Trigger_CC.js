/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "MF_Update_Outbound_Trigger_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Marketing_Flag_Update_Outbound_Trigger_CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Brand", "Class", "CustomerChoice", "Department", "Division", "Style", "SubClass" ],
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
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
node.getValue('a_CC_MF_Maintainance_Last_Update_Date').setSimpleValue(iso.format(time));
}