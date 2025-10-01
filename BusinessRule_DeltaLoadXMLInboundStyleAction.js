/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DeltaLoadXMLInboundStyleAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeltaLoadXMLInboundStyleAction",
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
exports.operation0 = function (node,manager,LKT) {
function AutoTriggerWorkflow(wfID, wfStates, wfNode) {
	// placeholder for the triggerByID return message
	var errorMessage = null;

	wfStates.forEach(function (state) {
		// make sure node is in the current state
		var isInState = wfNode.isInState(wfID, state);
		log.info(wfNode.getID() + " is in " + state + " state? " + isInState);

		if (isInState == true) {
			// get a workflow object by ID
			var workflowObject = manager.getWorkflowHome().getWorkflowByID(wfID);

			// get state object from workflow object
			var wfObjectState = workflowObject.getStateByID(state);

			// get wf transition for given state
			var transition = wfObjectState.getTransitions().toArray()[0];

			// get wf event for given state
			var event = transition.getEvents().toArray()[0].getID();
			log.info("Event: " + event);

			if (state == "NewStyleEnrich_Copy1") {
				if (sourceCopyStatus == "Complete") {
					errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
				}
				else {
					wfNode.getValue("a_error_message").setSimpleValue("Skipped Copy Complete as Copy is not Complete in PacMan");
				}
			}
			else if (state == "NewStyleEnrich_Final") {
				if (sourceLifeStatus == "Approved") {
					// trigger node in workflow event
					errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
				}
				else {
					wfNode.getValue("a_error_message").setSimpleValue("Skipped Approval as Style is not Approved in PacMan");
				}
			}
			else {
				// trigger node in workflow event
				errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
				//log.info("triggerByID result: " + errorMessage);
			}
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
var currentContext = manager.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
//log.info(currentContext);

if (currentContext.contains("EN_") == true) {
	var stepLifeStatus = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	var sourceLifeStatus = node.getValue("a_Source_Style_Life_Cycle_Status").getSimpleValue();
	var sourceCopyStatus = node.getValue("a_Source_Copy_Complete_Status").getSimpleValue();
	var endDate = node.getValue("a_Style_End_Date").getSimpleValue();
	var mktDesignation = node.getValue("a_Style_Market_Designation").getSimpleValue();
	var states = new Array("NewStyleEnrichState1", "NewStyleEnrich_Copy1", "NewStyleEntrich_WebMerch1", "WaitingForFirst_CC", "NewStyleEnrich_Final");

	if (mktDesignation != null) {
		if (mktDesignation.contains(currentMarket)) {
			if (currentContext == "EN_US") {
				var wf = "wf_NewStyleEnrichment";
			}
			if (currentContext == "EN_CA") {
				var wf = "wf_NewStyleEnrichmentCanada";
			}
			if (currentContext == "EN_JP") {
				var wf = "wf_NewStyleEnrichmentJapan";
			}

			//get today's date
			var today = new Date().toISOString().split('T')[0];
			//log.info("today is " + today);

			if (endDate == null) {
				const timestamp = Date.parse("12/31/9999");
				endDate = new Date(timestamp).toISOString().split('T')[0];
				//log.info("endDate was null");
			}

			if (sourceLifeStatus != "Purged" && sourceLifeStatus != null) {
				//log.info("end date is " + endDate);
				if (endDate >= today && stepLifeStatus != "Approved") {
					if (!node.isInWorkflow(wf)) {
						node.startWorkflowByID(wf, "Delta Load based initiation");
					}
					log.info("Current Workflow is: " + wf);
					AutoTriggerWorkflow(wf, states, node);
				}
			}

		}
	}
}
}
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,manager) {
/*
 * Only trigger IIEP Post Processor when conditions are met
 * Binds: Current Object as node, STEP Manager as manager
 */

var currentContext = manager.getCurrentContext().getID();
var result = false;

if (currentContext == "EN_US" || currentContext == "EN_CA" || currentContext == "EN_JP") {
    var sourceLifeStatus = node.getValue("a_Source_Style_Life_Cycle_Status").getSimpleValue();
    var stepLifeStatus = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
    
    //get today's date
    var today = new Date().toISOString().split('T')[0];
    //log.info("today is " + today);

    //get endDate
    var endDate = node.getValue("a_Style_End_Date").getSimpleValue();

    if (!endDate) {
        const timestamp = Date.parse("12/31/9999");
        endDate = new Date(timestamp).toISOString().split('T')[0];
        //log.info("endDate was null");
    }

    if (sourceLifeStatus != "Purged" || sourceLifeStatus != null) {
    	//log.info("end date is " + endDate);
        if (endDate >= today && stepLifeStatus != "Approved") {
            result = true;
        }
    }
}
return result;
}