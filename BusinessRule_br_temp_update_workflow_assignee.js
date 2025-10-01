/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_temp_update_workflow_assignee",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Update Workflow Assignee (Temp)",
  "description" : "Fixing current workflow assignment",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
  "allObjectTypesValid" : false,
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
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
exports.operation0 = function (node,LKT,step) {
function updateAssignee(wfID, wfStates, wfNode) {
	var workflow = step.getWorkflowHome().getWorkflowByID(wfID);
	
	wfStates.forEach(function (state) {
		// make sure node is in the current state
		var isInState = wfNode.isInState(wfID, state);
		log.info(wfNode.getID() + " is in " + state + " state? " + isInState);

		if (isInState) {
			// get task, get assignee, run new logic to set assignee
			var wfInstance = node.getWorkflowInstance(workflow);
			log.info("wfInstance is " + wfInstance);

			var wfTask = wfInstance.getTaskByID(state);
			log.info("wfTask is " + wfTask);

			var wfAssignee = wfTask.getAssignee();
			log.info("wfAssignee is " + wfAssignee);

			// get the current Brand Number from the Node
			var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
			log.info("brandNum is " + brandNum);

			// get the appropriate User Group based on the Brand Number
			var brandUserGroup = LKT.getLookupTableValue("LKT_BrandNumberToUserGroup", brandNum);
			log.info("brandUserGroup is " + brandUserGroup);

			var foundBrandGroup = false;

			// covert assignee to user object, null if not a user
			var user = step.getUserHome().getUserByID(wfAssignee.getID());
			log.info(" user is: " + user);

			// if user isn't a group
			if (user != null) {
				// get user groups that the currentUser is a member of
				var allGroups = user.getAllGroups().toArray();

				// forEach user group the currentUser is a member of 
				allGroups.forEach(function (grp) {
					log.info("group is: " + grp.getID());
					if (grp.getID() == brandUserGroup) {
						foundBrandGroup = true;
					}
				});
			}

			// if currentUser is NOT a member of the Brand User Group OR current user is a group
			if (foundBrandGroup == false) {
				// set the wfAssignee workflow variable to the brand User Group
				wfInstance.setSimpleVariable("wfAssignee", brandUserGroup);
				
				var userGroup = step.getGroupHome().getGroupByID(brandUserGroup);
				wfTask.reassign(userGroup);
				log.info("new wfAssignee is: " + wfTask.getAssignee());
			}
		}
	});
}

var StyleStates = new Array("NewStyleEnrichState1", "NewStyleEntrich_WebMerch1", "NewStyleEnrich_Copy1", "WaitingForFirst_CC", "NewStyleEnrich_Final");
var CCStates = new Array("NewCCEnrichState1", "NewCCEnrich_Copy1", "NewCCEnrich_Photo1", "NewCCEnrich_Photo2", "NewCCEnrich_Photo3", "NewCCEnrich_Final");
var SKUStates = new Array("NewSKUEnrich1", "NewSKUEnrich2");

var objectType = node.getObjectType().getName();

if (objectType == "Style") {
	if (node.isInWorkflow("wf_NewStyleEnrichment")) {
		updateAssignee("wf_NewStyleEnrichment", StyleStates, node);
	}
	if (node.isInWorkflow("wf_NewStyleEnrichmentCanada")) {
		updateAssignee("wf_NewStyleEnrichmentCanada", StyleStates, node);
	}
	if (node.isInWorkflow("wf_NewStyleEnrichmentJapan")) {
		updateAssignee("wf_NewStyleEnrichmentJapan", StyleStates, node);
	}
}
else if (objectType == "CustomerChoice") {
	if (node.isInWorkflow("wf_CCEnrichment")) {
		updateAssignee("wf_CCEnrichment", CCStates, node);
	}
	if (node.isInWorkflow("wf_CCEnrichmentCanada")) {
		updateAssignee("wf_CCEnrichmentCanada", CCStates, node);
	}
	if (node.isInWorkflow("wf_CCEnrichmentJapan")) {
		updateAssignee("wf_CCEnrichmentJapan", CCStates, node);
	}
}
else if (objectType == "SKU") {
	if (node.isInWorkflow("wf_NewSKUEnrichment")) {
		updateAssignee("wf_NewSKUEnrichment", SKUStates, node);
	}
	if (node.isInWorkflow("wf_NewSKUEnrichmentCanada")) {
		updateAssignee("wf_NewSKUEnrichmentCanada", SKUStates, node);
	}
	if (node.isInWorkflow("wf_NewSKUEnrichmentJapan")) {
		updateAssignee("wf_NewSKUEnrichmentJapan", SKUStates, node);
	}
}
}