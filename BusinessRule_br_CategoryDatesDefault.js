/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CategoryDatesDefault",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_CategoryDatesDefault",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "LOG",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (NODE,LOG) {
var categoryStartDate = NODE.getValue("a_WebCategory_Start_Date").getSimpleValue();
var categoryEndDate = NODE.getValue("a_WebCategory_End_Date").getSimpleValue();
var time1 = new java.util.Date();
var iso1 = new java.text.SimpleDateFormat("yyyy-MM-dd");

if(categoryStartDate == null || categoryStartDate == ""){
	NODE.getValue("a_WebCategory_Start_Date").setSimpleValue(iso1.format(time1));
}
if(categoryEndDate == null || categoryEndDate == ""){
	NODE.getValue("a_WebCategory_End_Date").setSimpleValue("2400-01-01");
}
}