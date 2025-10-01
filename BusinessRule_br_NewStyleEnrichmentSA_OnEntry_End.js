/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_NewStyleEnrichmentSA_OnEntry_End",
  "type" : "BusinessAction",
  "setupGroups" : [ "Workflows" ],
  "name" : "NewStyleEnrichmentSA_OnEntry_End",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_AutoTriggerWorkflowInSA",
    "libraryAlias" : "lib"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_PopulateStateEntryTimestamp"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "SetAttributeValueBusinessAction",
  "parameters" : [ {
    "id" : "FromAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : null
  }, {
    "id" : "FromWorkflow",
    "type" : "com.stibo.core.domain.state.unstable.stateflow.StateFlow",
    "value" : null
  }, {
    "id" : "FromWorkflowVariableName",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "TextValue",
    "type" : "java.lang.String",
    "value" : "Approved"
  }, {
    "id" : "ToAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Style_Life_Cycle_Status"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Remove_Error_Message_On_Approval"
  } ],
  "pluginType" : "Operation"
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation3 = function (node,step,lib) {
//first appprove the Style 
step.executeInContext('EN_SA',function(saContextManager) {
	var saCurrentProduct = saContextManager.getProductHome().getProductByID(node.getID());
	saCurrentProduct.approve();
});

//When Style is approved, trigger auto approval of CCs that were waiting for Style Approval..
var CCList = node.getChildren();

for(var i = 0; i < CCList.size(); i++) {
	var cc = CCList.get(i);

	 lib.triggerSATransitionForCC(cc,step,"NewCCEnrich_Final","Submit");
	/*if(cc.isInState("wf_CCEnrichmentSA","NewCCEnrich_Final")) {
		cc.getTaskByID("wf_CCEnrichmentSA","NewCCEnrich_Final").triggerLaterByID("Submit", "Auto-approving CC from New Style Enrichment workflow");
	}*/
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "RemoveObjectFromWorkflowAction",
  "parameters" : [ {
    "id" : "Workflow",
    "type" : "com.stibo.core.domain.state.Workflow",
    "value" : null
  }, {
    "id" : "Message",
    "type" : "java.lang.String",
    "value" : "Style Approved. Exiting the workflow"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_setMaintLastUpdateDate"
  } ],
  "pluginType" : "Operation"
}
*/
