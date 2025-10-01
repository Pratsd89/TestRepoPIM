/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ApproveStyleFromMaintenanceWF",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "(DEP) br_ApproveStyleFromMaintenanceWF",
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
exports.operation0 = function (node,stepManager) {
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
if(node.isInWorkflow('wf_NewStyleEnrichment') || node.isInWorkflow('wf_NewStyleEnrichmentCanada')){
	return 'Style is in New Style Enrichment workflow so cannot be approved from this Web UI screen. ';
} else if(node.isInState("wf_StyleMaintenanceWorkflow","StyleMaintenance")) {
    var wf = node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow");
    var wfSubmit = wf.getTaskByID("StyleMaintenance").triggerByID("ApproveStyle", "Approving Style from Style Details Screen");
    if (wfSubmit.isRejectedByScript()) {
		return wfSubmit.getScriptMessage();
    }
} else if(node.isInState("wf_StyleMaintenanceWorkflow","AssignCopy")) {
    var wf = node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow");
    var wfSubmit = wf.getTaskByID("AssignCopy").triggerByID("Approve", "Approving Style from Style Details Screen");
    if (wfSubmit.isRejectedByScript()) {
		return wfSubmit.getScriptMessage();
    }
}

return true;
}
else if(stepManager.getCurrentWorkspace().getID()== "Approved")
{
	return " Modifications anot allowed in Approved workspace. Please switch to Main workspace.";


	///test
}
}