/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "tetest_br_CategoryEndDate_errorMessage",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "tetest_br_CategoryEndDate_errorMessage",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
//PPIM-4787 end date of child category should be less than or equal to end date of parent CID.

var endDate = node.getValue("a_WebCategory_End_Date").getSimpleValue();
var parentEndDate = node.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();

/*if(endDate > parentEndDate){

	webui.showAlert("ERROR", "Error" ,"Current Web Category/Sub Category cannot have an end date later than parent Web Category/Sub Category.");
}
*/
}