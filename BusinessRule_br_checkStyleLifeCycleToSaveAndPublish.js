/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_checkStyleLifeCycleToSaveAndPublish",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check StyleLifeCycleStatus To Save and Publish",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
//PPIM-9714 :Business Condition created to distinguish the "Save Style Attributes"" Button in Basic Style Attributes" Screen.
var styleLifeCycleStatus = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue()

if(styleLifeCycleStatus == null)
	return true
else if(styleLifeCycleStatus.toUpperCase()!="DRAFT" && styleLifeCycleStatus.toUpperCase()!="IN PROGRESS")
	return true
else
	return false 
}