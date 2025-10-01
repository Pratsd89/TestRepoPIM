/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CheckCurrentContextForUSWorkflow",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Current Context For US Workflow",
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
var currentContext=stepManager.getCurrentContext().getID();
if(currentContext == "EN_US"){
	return true;
}
else{
	return 'The US workflow for Style/CC/SKU can only be triggered from the EN_US context. Please select the appropriate context and try again.';
}

}