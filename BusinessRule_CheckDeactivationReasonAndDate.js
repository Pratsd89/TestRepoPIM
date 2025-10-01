/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckDeactivationReasonAndDate",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Deactivation Reason And Date",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (NODE) {
/**
 * 
 * Rule which validates that both Deactivation Date and Deactivation Reason are filled.
 * 
 */
var date = "";
var reason = "";
var nodeObjectType = NODE.getObjectType();
var nodeObjectTypeName = nodeObjectType.getName();

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
	return "Deactivation Reason is not populated and it is required when Deactivation Date is selected.";
} else if ((reason != "" && reason != null) && (date == "" || date == null)){
	return "Deactivation Date is not populated and it is required when Deactivation Reason is selected.";
} else {
	return true;
}

}