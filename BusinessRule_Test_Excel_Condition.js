/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Excel_Condition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Test_Business_Rules" ],
  "name" : "TEST Excel Condition",
  "description" : null,
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
//PPIM-12639
var startDateStr = node.getValue("a_Product_Grouping_Start_date").getSimpleValue();
var endDateStr = node.getValue("a_Product_Grouping_End_Date").getSimpleValue();
var startDate = null;
var endDate = null;
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var warning = null;

if (startDateStr != null) {
    startDate = java.time.LocalDate.parse(startDateStr, formatter);
}
if (endDateStr != null) {
    endDate = java.time.LocalDate.parse(endDateStr, formatter);
}

if (startDate > endDate) {
    warning = "Product Group Start Date is greater than Product Group End Date.";
}

if (warning != null) {
    return warning;
}
return true;
}