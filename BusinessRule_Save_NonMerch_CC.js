/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Save_NonMerch_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save_NonMerch_CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Populating_Marketing_Flag_Position"
  } ],
  "pluginType" : "Operation"
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
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
exports.operation1 = function (node,portal,stepManager) {
if (stepManager.getCurrentWorkspace().getID() == "Main")
{
var time1 = new java.util.Date();
var iso1 = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//logger.info(iso.format(time));
node.getValue("a_main_last_modified_date").setSimpleValue(iso1.format(time1));
log.info(node.getValue("a_main_last_modified_date").getSimpleValue());

// For Non-Merch Cc, if start date is not populated, show an error
if(node.getValue("a_CC_Start_Date").getSimpleValue() == "" || node.getValue("a_CC_Start_Date").getSimpleValue() == null) {
	portal.showAlert("ERROR", "Required field of CC Publication Date is missing.");
}
}
else if (stepManager.getCurrentWorkspace().getID() == "Approved")
{
	portal.showAlert("Warning", "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (node,stepManager) {
if (stepManager.getCurrentWorkspace().getID() == "Main")
{
/* if(node.isInWorkflow("wf_CCEnrichment"))
{
	portal.showAlert("ERROR",null,"The CC is in Enrichment Workflow. Please complete the enrichment to initiate it in the Maintainance Workflow.");
}
else
{ */
//node.startWorkflowByID("wf_StyleMaintenanceWorkflow","");
var wfInstances = node.getWorkflowInstances().toArray();
if(wfInstances.length == 0) {
	// object is not in any workflow so start maintenance
	node.startWorkflowByID("wf_StyleMaintenanceWorkflow","Starting Maintenance Workflow from WebUI CC Screen");
	//portal.showAlert("SUCCESS",null,"The CC is initiated in the Maintainance Workflow.");
}
//}
}
}