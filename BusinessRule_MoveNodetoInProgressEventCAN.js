/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "MoveNodetoInProgressEventCAN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "MoveNodetoInProgressEventCAN",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log) {
try{
	var objType = node.getObjectType().getID();
	if(objType == "Style"){
		//If Style is in Draft state of Style Enrichment, attempt submit to next state.
		 if (node.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrichState1") == true){
		 	node.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving Style out of draft through event processor");
		    }
	 }
		 else if(objType == "CustomerChoice"){
		 	var style = node.getParent();
		 	if (style.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrichState1") == true){
		 	style.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving Style out of draft through event processor");
		    }else if (node.isInState("wf_CCEnrichmentCanada", "NewCCEnrichState1") == true){
		    	node.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment","Moving CC out of draft through event processor");
		    }
		 }
			 else if(objType == "SKU"){
			 	var style = node.getParent().getParent();
			 	var cc = node.getParent();
			 	if (style.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrichState1") == true){
			 	style.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving Style out of draft through event processor");
			    }
			    else if (cc.isInState("wf_CCEnrichmentCanada", "NewCCEnrichState1") == true){
			    	cc.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment","Moving CC out of draft through event processor");
			    }
			    else if (node.isInState("wf_NewSKUEnrichmentCanada", "NewSKUEnrich1") == true){
			    	node.getWorkflowInstanceByID("wf_NewSKUEnrichmentCanada").getTaskByID("NewSKUEnrich1").triggerByID("Submit","Moving CC out of draft through event processor");
			    }
			 }
}
catch(e){
	logger.info("Move Product To In Progress Event Processor Failed for ID : " + node.getID());

	throw(e);
}

}