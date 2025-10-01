/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "MoveNodetoInProgressEventJPN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "MoveNodetoInProgressEventJPN",
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
exports.operation0 = function (node,log) {
//The following Business Rule is implemented as part of Japan Requirements -PPIM-7582
try{
	var objType = node.getObjectType().getID();
	if(objType == "Style"){
		//If Style is in Draft state of Style Enrichment, attempt submit to next state.
		 if (node.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrichState1") == true){
		 	node.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving Style out of draft through event processor");
		    }
	 }
		 else if(objType == "CustomerChoice"){
		 	var style = node.getParent();
		 	if (style.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrichState1") == true){
		 	style.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving Style out of draft through event processor");
		    }else if (node.isInState("wf_CCEnrichmentJapan", "NewCCEnrichState1") == true){
		    	node.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment","Moving CC out of draft through event processor");
		    }
		 }
			 else if(objType == "SKU"){
			 	var style = node.getParent().getParent();
			 	var cc = node.getParent();
			 	if (style.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrichState1") == true){
			 	style.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving Style out of draft through event processor");
			    }
			    else if (cc.isInState("wf_CCEnrichmentJapan", "NewCCEnrichState1") == true){
			    	cc.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment","Moving CC out of draft through event processor");
			    }
			    else if (node.isInState("wf_NewSKUEnrichmentJapan", "NewSKUEnrich1") == true){
			    	node.getWorkflowInstanceByID("wf_NewSKUEnrichmentJapan").getTaskByID("NewSKUEnrich1").triggerByID("Submit","Moving CC out of draft through event processor");
			    }
			 }
}
catch(e){
	log.info("Move Product To In Progress Event Processor Failed for ID : " + node.getID());
}

}