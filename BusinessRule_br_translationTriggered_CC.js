/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_translationTriggered_CC",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Translation Triggered - CC",
  "description" : "This is show the \"Re-Trigger Translation\" Button",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var translationStatus = node.getValue("a_CC_Translation_Status").getSimpleValue();
var brand = node.getValue("a_Brand_Number").getSimpleValue();
var markets = node.getValue("a_Market_Designation").getSimpleValue();

if (brand != "GPS" && (translationStatus == "Submitted" || translationStatus == "Complete") && (markets.contains("CAN") || markets.contains("JPN"))){
	return true;
}
else {
	return false;
}

}