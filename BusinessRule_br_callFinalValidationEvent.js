/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_callFinalValidationEvent",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Call Final Validation WF Event",
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
    "contract" : "LoggerBindContract",
    "alias" : "LOG",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "NODE",
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
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (LOG,NODE,manager,webui) {
//Declare variables
var returnMsg = "";
var targetWorkflow = "wf_NewStyleEnrichment";
var targetState = "NewStyleEnrich_Final";


var fvEvent = "FinalValidation";

var currentContext = manager.getCurrentContext().getID();
var context;
if (currentContext == "EN_US") {
	context = "US";
} else if (currentContext == "EN_CA" || currentContext == "FR_CA") {
	context = "CA";
} else if (currentContext == "EN_JP" || currentContext == "JA_JP") { //PPIM-7536 supprt EN_JP and JA_JP contexts
	context = "JP";
}

//if the Context is not EN_US, EN_CA, or FR_CA, EN_JP or JA_JP then this logic will not apply
if (context != "US" && context != "CA" && context != "JP") {
	appliesConditionConext = false;
	returnMsg = 'The New Style Enrichment Workflow can only be triggered from the EN_US, EN_CA or FR_CA, EN_JP or JA_JP context. Please select the appropriate context and try again.';
	//webui.showAlert("Error", "Button Does Not Apply", returnMsg);
	return;
}

//Check that the style is in the target workflow (depending on the context) to determine the value for appliesCondition1
if (context == "US") {
	//Check that the style is in the target workflow: New Style Enrichment(wf_NewStyleEnrichment)
	//and that the Style is in the target states: Missing Web Merchandising State(NewStyleEntrich_WebMerch1)
	if (NODE.isInWorkflow(targetWorkflow)) {
		if (!NODE.isInState(targetWorkflow, targetState)) {
			//Style is in the target workflow, but NOT in the target state
			returnMsg = "Style is not in the \'Final Validation\' state for the New Style Enrichment Workflow";
			webui.showAlert("Error", "Button Does Not Apply", returnMsg);			
			return;
		}
	}else {
		//Style is NOT in the target workflow
		appliesCondition1 = false;
		returnMsg = "Style is not in the \'New Style Enrichment Workflow\'";
		webui.showAlert("Error", "Button Does Not Apply", returnMsg);		
		return;
	}
}
if (context == "CA") {
	targetWorkflow = targetWorkflow + "Canada";
	//Check that the style is in the target workflow: New Style Enrichment Canada (wf_NewStyleEnrichmentCanada)
	//and that the Style is in the target states: Missing Web Merchandising State(NewStyleEntrich_WebMerch1)
	if (NODE.isInWorkflow(targetWorkflow)) {
		if (!NODE.isInState(targetWorkflow, targetState)) {
			//Style is in the target workflow, but NOT in the target state			
			returnMsg = "Style is not in the \'Final Validation\' state for the New Style Enrichment Workflow Canada";			
			webui.showAlert("Error", "Button Does Not Apply", returnMsg);		
			return;
		}
	}else {
		//Style is NOT in the target workflow		
		returnMsg = "Style is not in the \'New Style Enrichment Workflow Canada\'";
		webui.showAlert("Error", "Button Does Not Apply", returnMsg);		
		return;
	}

	// Otherwise, trigger final validation event
}
//PPIM-7536 supprt EN_JP and JA_JP contexts 
if (context == "JP") {
	targetWorkflow = targetWorkflow + "Japan";
	//Check that the style is in the target workflow: New Style Enrichment Japan (wf_NewStyleEnrichmentJapan)
	//and that the Style is in the target states: Missing Web Merchandising State(NewStyleEntrich_WebMerch1)
	if (NODE.isInWorkflow(targetWorkflow)) {
		if (!NODE.isInState(targetWorkflow, targetState)) {
			//Style is in the target workflow, but NOT in the target state			
			returnMsg = "Style is not in the \'Final Validation\' state for the New Style Enrichment Workflow Japan";			
			webui.showAlert("Error", "Button Does Not Apply", returnMsg);		
			return;
		}
	}else {
		//Style is NOT in the target workflow		
		returnMsg = "Style is not in the \'New Style Enrichment Workflow Japan\'";
		webui.showAlert("Error", "Button Does Not Apply", returnMsg);		
		return;
	}

	// Otherwise, trigger final validation event
}
//PPIM-7536 supprt EN_JP and JA_JP contexts

	var task = NODE.getTaskByID(targetWorkflow, targetState);
	var wfResult =  task.triggerByID(fvEvent,"");
	var wfErrorMessage =  wfResult.isRejectedByScript();
	if(wfErrorMessage){
	webui.showAlert("ERROR", "",wfResult.getScriptMessage());
	}


}