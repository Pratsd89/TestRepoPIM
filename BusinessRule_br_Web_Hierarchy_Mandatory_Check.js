/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Web_Hierarchy_Mandatory_Check",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Web Hierarchy Mandatory Check",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "slug"
  } ]
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
exports.operation0 = function (node,slug) {
var categoryDescription = node.getValue('a_Category_Description').getSimpleValue();
var categoryStartDate = node.getValue('a_WebCategory_Start_Date').getSimpleValue();
var categoryDisplayType = node.getValue('a_Category_Display_Type').getSimpleValue();
var divisionDisplayType = node.getValue('a_Division_Display_Type').getSimpleValue();
var objectType = node.getObjectType().getID();
var logArray = [];
var nlumsg = slug.checkNLUmessage(node);
if (objectType == "WebDivision") {
	if (categoryStartDate == null || categoryStartDate == "") {
		logArray.push("\n" + nlumsg + "Please provide a Start Date and try again.");
	}
	if (divisionDisplayType == null || divisionDisplayType == "") {
		logArray.push("\n" + nlumsg + "Please provide a Division Display Type and try again.");
	}
}
else if(objectType == "WebCategory"){
	var RedirectURL = node.getValue('a_Redirect_URL').getSimpleValue();
	if(categoryDisplayType == "Standard: Content" && RedirectURL == null ){
		logArray.push("\n" + nlumsg + "Category Redirect URL is mandatory if Category Display Type is Standard: Content");
	}
	if (categoryDisplayType == null || categoryDisplayType == '') {
		logArray.push("\nPlease provide a Category Display Type and try again.");
	}
	var children  = node.getChildren();
	if(categoryDisplayType == "Standard: Content" && children.size()>0){
		logArray.push("\n" + nlumsg + "Kindly move/delete the Sub-categories under this Category if you want to set Category Display Type as Standard: Content");
	}
	
}
else {
	/*if (categoryDescription == null || categoryDescription == '') {
		logArray.push("\nPlease provide a Category Name and try again.");
	}*/
	

	if (categoryDisplayType == null || categoryDisplayType == '') {
		logArray.push("\nPlease provide a Category Display Type and try again.");
	}
	var RedirectURL = node.getValue('a_Redirect_URL').getSimpleValue();
	if(categoryDisplayType == "Standard: Content" && RedirectURL == null ){
		logArray.push("\n" + nlumsg + "Category Redirect URL is mandatory if Category Display Type is Standard: Content");
	}
}

if (logArray.length > 0) {
	throw "\n<b>Error: " + logArray + "\n</b>";
}
}