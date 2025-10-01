/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Validate_And_Approve_Style_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Validate And Approve Style Action",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
if(node.isInWorkflow('wf_NewStyleEnrichment')){
	if(node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_Final") ) {
		var wf = node.getWorkflowInstanceByID("wf_NewStyleEnrichment");
		wf.getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation","");
		 
	}
	else{
		throw 'The Style is not in the Final Validation step of the Style Enrichment Workflow , hence it can not be approved';
	}
}
else{
	throw 'The Style is currently not in the Style Enrichment Workflow , hence it can not be approved';
}

}