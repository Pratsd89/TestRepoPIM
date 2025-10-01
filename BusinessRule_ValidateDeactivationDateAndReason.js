/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ValidateDeactivationDateAndReason",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Validate Deactivation Date And Reason",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "UI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (NODE,UI) {
/**
 * 
 * Rule which validates that both Deactivation Date and Deactivation Reason are filled.
 * 
 */
var date = "";
var reason = "";
var dateAttribute = "";
var reasonAttribute = "";
var nodeObjectType = NODE.getObjectType();
var nodeObjectTypeName = nodeObjectType.getName();
var severity = "ERROR";
var headline = "Deactivation not possible";

switch(true){
	case (nodeObjectTypeName == "Style"):
		dateAttribute = "a_Style_End_Date";
		reasonAttribute = "a_Style_Deactivation_Reason";
		break;
	case (nodeObjectTypeName == "CC"):
		dateAttribute = "a_CC_End_Date";
		reasonAttribute = "a_CC_Deactivation_Reason";
		break;
	case (nodeObjectTypeName == "SKU"):
		dateAttribute = "a_SKU_End_Date";
		reasonAttribute = "a_Sku_Deactivation_Reason";
		break;
}

date = NODE.getValue(dateAttribute).getSimpleValue();
reason = NODE.getValue(reasonAttribute).getSimpleValue();

if ((date != "" && date != null) && (reason == "" || reason == null)){
	UI.showAlert(severity, headline, "Deactivation Reason is not populated and it is required when Deactivation Date is selected.");
	NODE.getValue(dateAttribute).setSimpleValue("");
} else if ((reason != "" && reason != null) && (date == "" || date == null)){
	UI.showAlert(severity, headline, "Deactivation Date is not populated and it is required when Deactivation Reason is selected.");
	NODE.getValue(reasonAttribute).setSimpleValue("");
}
}