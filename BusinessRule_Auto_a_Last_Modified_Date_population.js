/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Auto_a_Last_Modified_Date_population",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Auto_a_Last_Modified_Date_population",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Brand", "Class", "Department", "Division", "SubClass" ],
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
var id= node.getID();
var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
		logger.info(iso.format(time));
		node.getValue("a_Last_Modified_Date").setSimpleValue(iso.format(time));
		logger.info(node.getValue("a_Last_Modified_Date").getSimpleValue())
}