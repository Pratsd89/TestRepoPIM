/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setSharedMarketOnImport",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Shared Market on Import",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
exports.operation0 = function (node,step) {
// PPIM-1437 
// set a_Shared_Market to US for US file and CA for CA file. if shot request is in both, a_Shared_Market should contain both

var currentContext = step.getCurrentContext().getID();

if(currentContext == "EN_US") {
	node.getValue('a_Shared_Markets').addValue("US");
	node.getValue('a_Old_Shared_Markets').addValue("US"); //Changes for defect PPIM-2014 
	
} else if(currentContext == "EN_CA") {
	node.getValue('a_Shared_Markets').addValue("CAN");
	node.getValue('a_Old_Shared_Markets').addValue("CAN");//Changes for defect PPIM-2014
}
    
/* 
Shot Requests should be placed in their correct Shot Request Lifecycle  workflow state:
if a_Shot_Request_Lifecycle_Status = Submitted, object should be in Submitted state.
if a_Shot_Request_Lifecycle_Status = Ready for Review, object should be in Ready to Review state
if a_Shot_Request_Lifecycle_Status = Rejected, object should be in Rejected state
all other statuses do not need to be in the workflow.
*/


var status = node.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();

if(status == "Submitted") {
	if(!node.isInWorkflow("wf_ShortRequestLifeCycle")) {
		var wfInstance = node.startWorkflowByID("wf_ShortRequestLifeCycle","Shot Request workflow initiated during initial data load");
   		wfInstance.getTaskByID("Draft").triggerByID("Submit","Shot Request submitted during initial data load");
	}
} else if(status == "Ready for Review") {
	if(!node.isInWorkflow("wf_ShortRequestLifeCycle")) {
		var wfInstance = node.startWorkflowByID("wf_ShortRequestLifeCycle","Shot Request workflow initiated during initial data load");
   		wfInstance.getTaskByID("Draft").triggerByID("Submit","Shot Request submitted during initial data load");
   		wfInstance.getTaskByID("Submitted").triggerByID("Ready_to_Review","Shot Request submitted during initial data load");
   		
	}
	
} else if(status == "Rejected") {
	if(!node.isInWorkflow("wf_ShortRequestLifeCycle")) {
		var wfInstance = node.startWorkflowByID("wf_ShortRequestLifeCycle","Shot Request workflow initiated during initial data load");
   		wfInstance.getTaskByID("Draft").triggerByID("Submit","Shot Request submitted during initial data load");
   		wfInstance.getTaskByID("Submitted").triggerByID("Ready_to_Review","Shot Request submitted during initial data load");
   		wfInstance.getTaskByID("Ready_to_Review").triggerByID("Reject","Shot Request rejected during initial data load");
	}
	
}

}