/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Import_Style_ATTs_WF_Transitions",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Import Style Attributes Workflow Transitions",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DataIssuesContextBind",
    "alias" : "messages",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,logger,messages,LKT) {
function AutoTriggerWorkflow(wfID, wfStates, wfNode) {
	// placeholder for the triggerByID return message
	var errorMessage = null;

	wfStates.forEach(function (state) {
		// make sure node is in the current state
		var isInState = wfNode.isInState(wfID, state);
		log.info(wfNode.getID() + " is in " + state + " state? " + isInState);

		if (isInState == true) {
			// get a workflow object by ID
			var workflowObject = step.getWorkflowHome().getWorkflowByID(wfID);

			// get state object from workflow object
			var wfObjectState = workflowObject.getStateByID(state);

			// get wf transition for given state
			var transition = wfObjectState.getTransitions().toArray()[0];

			// get wf event for given state
			var event = transition.getEvents().toArray()[0].getID();

			// trigger node in workflow event
			errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
		}
	});

	if (errorMessage != null) {
		wfNode.getValue("a_error_message").setSimpleValue(currentContext + " : " + errorMessage);
	}
	else {
		if (wfNode.getValue("a_error_message").getSimpleValue() != null) {
			wfNode.getValue("a_error_message").deleteCurrent();
		}
	}
}

//get current context
var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
//get valid markets for the Style
var mktDesignation = node.getValue("a_Style_Market_Designation").getSimpleValue();
//log.info(currentContext);

if (mktDesignation.contains(currentMarket) == true) {
	var objectType = node.getObjectType().getID();
	var sourceLifeStatus = node.getValue("a_Source_Style_Life_Cycle_Status").getSimpleValue();
	var stepLifeStatus = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	var states = new Array("NewStyleEnrichState1");

	//To get the appropriate workflow based on the current context using LKT PPIM-10459
	var wf = LKT.getLookupTableValue("LKT_Context_to_Style_Enrich_Workflows", currentContext);

	if (node.isInWorkflow(wf) == true) {
		AutoTriggerWorkflow(wf, states, node);
	}
	else {
		var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	}
}
else {
	throw "\n<b>You are currently modifying this Syle in context " + currentContext + ". This context is not valid for the Style you are modifying. Please switch contexts and try again</b>";
}
}