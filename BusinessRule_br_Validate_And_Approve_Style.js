/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Validate_And_Approve_Style",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Validate And Approve Style",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
if(!(node.isInWorkflow('wf_NewStyleEnrichment')|| node.isInWorkflow('wf_NewStyleEnrichmentCanada') )){
	return 'Validation for style in workflow : The Style is currently not in the Style Enrichment Workflow , hence it can not be approved';
	
}
else{
	if(!(node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_Final") || node.isInState("wf_NewStyleEnrichmentCanada","NewStyleEnrich_Final"))) {
		return 'Validation for style in workflow : The Style is not in the Final Validation step of the Style Enrichment Workflow , hence it can not be approved';		
	}
	else{
		return true;
	}
	
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_Style_Enrichment_Final_Validation"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Operation"
}
*/

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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (node,step) {
var context = step.getCurrentContext().getID();
if( context == "EN_US")
{
if(node.isInWorkflow('wf_NewStyleEnrichment')){
	if(node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_Final") ) {
		var wf = node.getWorkflowInstanceByID("wf_NewStyleEnrichment");
		wf.getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation","");		
		return true;
		
	}
	
}
}
else(context == "EN_CA" || context == "FR_CA")
{
 if(node.isInWorkflow('wf_NewStyleEnrichmentCanada')){
	if(node.isInState("wf_NewStyleEnrichmentCanada","NewStyleEnrich_Final") ) {
		var wf = node.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada");
		wf.getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation","");		
		return true;		
	}	
}
}

}