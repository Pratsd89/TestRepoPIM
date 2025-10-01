/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Copy_Complete_WF_Transitions",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Copy Complete Workflow Transitions",
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,logger,messages,LKT,webUI) {
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
			log.info("Event: " + event);

			// trigger node in workflow event
			errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
			log.info("triggerByID result: " + errorMessage);
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
	if (currentContext == "EN_US") {
		var inheritOption = node.getValue("a_Inherit_US_Copy_Option").getValues().toArray();
		if (inheritOption != null) {
			var urgency = node.getValue("a_Translation_Urgency").getSimpleValue();
			if (urgency != null) {
				inheritOption.forEach(function (mkt) {
					var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());
					step.executeInContext(context, function (otherStepManager) {
						var otherNode = otherStepManager.getObjectFromOtherManager(node);
						otherNode.getValue("a_Translation_Urgency").setSimpleValue(urgency);
					});
				});
			}
		}
	}

	var objectType = node.getObjectType().getID();
	var sourceLifeStatus = node.getValue("a_Source_Style_Life_Cycle_Status").getSimpleValue();
	var stepLifeStatus = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	var states = new Array("NewStyleEnrichState1", "NewStyleEnrich_Copy1");

	//To fetch the appropriate workflow based on the current context using LKT -PPIM-10456
	var wf = LKT.getLookupTableValue("LKT_Context_to_Style_Enrich_Workflows", currentContext);

	if (node.isInWorkflow(wf) == true) {
		log.info("Current Workflow is: " + wf);
		AutoTriggerWorkflow(wf, states, node);

		var errorMsg = node.getValue("a_error_message").getSimpleValue();
		var copyStatus = node.getValue("a_Copy_Complete_Status").getSimpleValue();

		if (node.isInWorkflow(wf) == true) {

			if (copyStatus == "Complete") {

				webUI.showAlert("ACKNOWLEDGMENT", "Copy Status is now Complete");
			}
			else if (errorMsg != null) {

				webUI.showAlert("WARNING",  "Unable to complete copy. Workflow validation failed in " + errorMsg);
			}
			else if (errorMsg == null) {

				webUI.showAlert("WARNING",  "Workflow validation failed for an unknown reason. Please contact tech support.");
			}
		}
	}
	else {
		var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	}
}
else {
	throw "\n<b>You are currently modifying this Style in context " + currentContext + ". This context is not valid for the Style you are modifying. Please switch contexts, apply changes, and try again</b>";
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_updateLinkedDSGName"
  } ],
  "pluginType" : "Operation"
}
*/
