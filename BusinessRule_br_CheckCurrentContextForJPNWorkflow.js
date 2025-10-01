/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CheckCurrentContextForJPNWorkflow",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Current Context For Japan Workflow",
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
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (stepManager) {
//The Business condition is developed as part of Japan Requirements:PPIM-7551
var currentContext=stepManager.getCurrentContext().getID();
if(currentContext == "EN_JP" || currentContext == "JA_JP"){
	return true;
}
else{
	return 'The Japan workflow for Style/CC/SKU can only be triggered from the EN_JP or JA_JP context. Please select the appropriate context and try again.';
}
}