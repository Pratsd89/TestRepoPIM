/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_StyleCC_State1_Enrichment_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Style CC State1 Enrichment",
  "description" : null,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var lastModifiedUser = node.getRevision().getUserID();
if (lastModifiedUser.toUpperCase() != "STIBOCATALOGSYNCUSER"){
	var cc = node.getParent();
	if(cc.isInState("wf_CCEnrichmentSA","NewCCEnrichState1")) {
		//var wf = cc.getWorkflowInstanceByID("wf_CCEnrichmentSA");
			//wf.getTaskByID("wf_CCEnrichmentSA","NewCCEnrichState1");//triggerByID("CCReadyForEnrichment", "Moving to In Progress automatically from SKU Enrichment");
		cc.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment","Moving to In Progress automatically from SKU Enrichment");
			
	}
	
	var style = node.getParent().getParent();
	if(style.isInState("wf_NewStyleEnrichmentSA","NewStyleEnrichState1")) {
		//var wf = style.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA");
	    style.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Moving to In Progress automatically from SKU Enrichment");
	  //  wf.getTaskByID("wf_NewStyleEnrichmentSA","NewStyleEnrichState1").triggerByID("ReadyForEnrichment", "Moving to In Progress automatically from SKU Enrichment");
	}
}





//wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview","CC CAN Workflow movement from NewCCEnrich_Photo2 - SKU").getScriptMessage();
}