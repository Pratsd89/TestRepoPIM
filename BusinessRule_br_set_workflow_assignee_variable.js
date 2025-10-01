/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_set_workflow_assignee_variable",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Workflow Assignee Variable",
  "description" : "assigns workflow tasks to appropriate user/group based on user group assignment",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentWorkflowBindContract",
    "alias" : "WF",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,WF) {
/*
  THIS RUNS ON EXIT OF ANY WORK STATE

  Each work state, on entry, should assign the product based on the wfAssignee workflow variable.
*/

// get the currentUser
var currUser = step.getCurrentUser();

// if currentUser is STIBOCATALOGSYNCUSER
if (currUser.getID() == "STIBOCATALOGSYNCUSER") {
	//set wfAssigee to STIBOCATALOGSYNCUSER
	node.getWorkflowInstance(WF).setSimpleVariable("wfAssignee", currUser.getID());
}
else {
	// get the current Brand Number from the Node
	var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
	
	// get the appropriate User Group based on the Brand Number
	var brandUserGroup = LKT.getLookupTableValue("LKT_BrandNumberToUserGroup", brandNum);

	// get user groups that the currentUser is a member of
	var allGroups = currUser.getAllGroups().toArray();

	var foundBrandGroup = false;
 
	// forEach user group the currentUser is a member of 
	allGroups.forEach(function (grp) {
		if (grp.getID() == brandUserGroup) {
			foundBrandGroup = true;
		}
	});

	// if currentUser is NOT a member of the Brand User Group 
	if (foundBrandGroup == false) {
		// set the wfAssignee workflow variable to the brand User Group
		node.getWorkflowInstance(WF).setSimpleVariable("wfAssignee", brandUserGroup);
	}
	else {
		// set the wfAssignee workflow variable to the current user
		node.getWorkflowInstance(WF).setSimpleVariable("wfAssignee", currUser.getID());	
	}
}
}