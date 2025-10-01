/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ImportProductShotRequestValidations",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Create Shot Request Bulk Import Validations",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
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
    "contract" : "ImportChangeInfoBind",
    "alias" : "changeInfo",
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
exports.operation0 = function (node,changeInfo,step) {
// Shot requests should not be created if any one of required fields are missing: Shot Code, Shot Type, Site Placement, CC Number, Shared Markets
var logArray = new Array();
var shotCode = node.getValue("a_Shot_Code").getSimpleValue();
var shotType = node.getValue("a_Shot_Type").getSimpleValue();
var shotPlacement = node.getValue("a_Site_Placement").getSimpleValue();
var shotCC = node.getValue("a_Shot_CC_Number").getSimpleValue();
var shotMarkets = node.getValue("a_Shared_Markets").getSimpleValue();

if (shotCode == null) {
	logArray.push("\n<b>Required data missing for " + step.getAttributeHome().getAttributeByID("a_Shot_Code").getName() + "</b>");
}
if (shotType == null) {
	logArray.push("\n<b>Required data missing for " + step.getAttributeHome().getAttributeByID("a_Shot_Type").getName() + "</b>");
}
if (shotPlacement == null) {
	logArray.push("\n<b>Required data missing for " + step.getAttributeHome().getAttributeByID("a_Site_Placement").getName() + "</b>");
}
if (shotCC == null) {
	logArray.push("\n<b>Required data missing for " + step.getAttributeHome().getAttributeByID("a_Shot_CC_Number").getName() + "</b>");
}
if (shotMarkets == null) {
	logArray.push("\n<b>Required data missing for " + step.getAttributeHome().getAttributeByID("a_Shared_Markets").getName() + "</b>");
}

if (logArray.length > 0) {
	// validations failed, inform user of issues
	return "<b>Shot Request was not created for " + shotCC + " due to the following reasons: " + logArray;
}
else if (changeInfo.isCreatedByCurrentProcess() == false) {
	return "<b>Shot Request was not modified, as this import is for creating Shot Requests</b>";
}
else {
	// all validations passed, return true
	return true;
}
}