/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_TestStyleEnrichmentCa_OnEntry_End",
  "type" : "BusinessAction",
  "setupGroups" : [ "Workflows" ],
  "name" : "TestNewStyleEnrichmentCanada_OnEntry_End",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
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
exports.operation2 = function (node,step) {
//first appprove the Style 


// Translation IIEP completed so set translation status to complete and delete due date

// auto approve in CA if translation is complete
if (node.getValue("a_Translation_Status").getSimpleValue() == "Complete") {
	step.executeInContext('EN_CA',function(caContextManager) {
		var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());
		caCurrentProduct.approve();
	});
	step.executeInContext('FR_CA',function(frContextManager) {
		var frCurrentProduct = frContextManager.getProductHome().getProductByID(node.getID());
		frCurrentProduct.approve();
	});
}
//When Style is approved, trigger auto approval of CCs that were waiting for Style Approval..
var CCList = node.getChildren();

for(var i = 0; i < CCList.size(); i++) {
	var cc = CCList.get(i);
	if(cc.isInState("wf_CCEnrichmentCanada","NewCCEnrich_Final")) {
		cc.getTaskByID("wf_CCEnrichmentCanada","NewCCEnrich_Final").triggerByID("Submit", "Auto-approving CC from New Style Enrichment workflow");
	}
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "RemoveObjectFromWorkflowAction",
  "parameters" : [ {
    "id" : "Workflow",
    "type" : "com.stibo.core.domain.state.Workflow",
    "value" : "wf_NewStyleEnrichmentCanada"
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
    "value" : "br_triggerPublishOnApprovedSave"
  } ],
  "pluginType" : "Operation"
}
*/
