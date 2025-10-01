/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "MoveNodetoInProgressEvent",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "MoveNodetoInProgressEvent",
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
exports.operation0 = function (node,log,step) {
try{
	logger.info("Entering the move product to inprogress block");
	var objType = node.getObjectType().getID();
	if(objType == "Style"){
		//If Style is in Draft state of Style Enrichment, attempt submit to next state.
		 if (node.isInState("wf_NewStyleEnrichment", "NewStyleEnrichState1") == true){
		 	node.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving Style out of draft through event processor");
		    }
	 }
		 else if(objType == "CustomerChoice"){
		 	var style = node.getParent();
		 	if (style.isInState("wf_NewStyleEnrichment", "NewStyleEnrichState1") == true){
		 	style.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving Style out of draft through event processor");
		    }else if (node.isInState("wf_CCEnrichment", "NewCCEnrichState1") == true){
		    	node.getWorkflowInstanceByID("wf_CCEnrichment").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment","Moving CC out of draft through event processor");
		    }
		 }
			 else if(objType == "SKU"){
			 	var style = node.getParent().getParent();
			 	var cc = node.getParent();
			 	if (style.isInState("wf_NewStyleEnrichment", "NewStyleEnrichState1") == true){
			 	style.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving Style out of draft through event processor");
			    }
			    else if (cc.isInState("wf_CCEnrichment", "NewCCEnrichState1") == true){
			    	cc.getWorkflowInstanceByID("wf_CCEnrichment").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment","Moving CC out of draft through event processor");
			    }
			    else if (node.isInState("wf_NewSKUEnrichment", "NewSKUEnrich1") == true){
			    	node.getWorkflowInstanceByID("wf_NewSKUEnrichment").getTaskByID("NewSKUEnrich1").triggerByID("Submit","Moving CC out of draft through event processor");
			    }
			 }
}
catch(e){
	logger.info("Move Product To In Progress Event Processor Failed for ID : " + node.getID());

	throw(e);
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_CheckCatSyncUserUpdate"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
