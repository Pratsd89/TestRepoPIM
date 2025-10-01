/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CategoryEndDate_errorMessage",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_CategoryEndDate_errorMessage",
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,webui) {
//PPIM-4787 end date of child category should be less than or equal to end date of parent CID.

var endDate = node.getValue("a_WebCategory_End_Date").getSimpleValue();
var parentEndDate = node.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();

if(endDate > parentEndDate){

	webui.showAlert("ERROR", "Error" ,"Current Web Category/Sub Category cannot have an end date later than parent Web Category/Sub Category.");
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node) {
var categoryDescription = node.getValue("a_Category_Description").getSimpleValue();
if(categoryDescription!=null){
	return true;
} else return false;
}