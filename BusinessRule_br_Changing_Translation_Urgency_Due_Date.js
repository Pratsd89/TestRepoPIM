/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Changing_Translation_Urgency_Due_Date",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Changing Translation Urgency Due Date",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "helper"
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
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,web,helper) {
if (stepManager.getCurrentWorkspace().getID() == "Main") {
	var markets = node.getValue('a_Style_Market_Designation').getSimpleValue();
	
	if (markets.indexOf("CAN") > -1) {
		helper.setTranslationDueDate(node, manager, "EN_CA");
	}
	if (markets.indexOf("JPN") > -1) {
		helper.setTranslationDueDate(node, manager, "EN_JP");
	}
}
else if (stepManager.getCurrentWorkspace().getID() == "Approved") {
	web.showAlert(
		"Warning",
		
		"Modifications not allowed in Approved workspace. Please switch to Main workspace."
	);
}
}