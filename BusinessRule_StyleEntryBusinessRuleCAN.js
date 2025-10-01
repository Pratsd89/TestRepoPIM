/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StyleEntryBusinessRuleCAN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "StyleEntryBusinessRuleCAN",
  "description" : "Style Entry Business Rule",
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
    "value" : "Draft"
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
    "value" : "1. Standard"
  }, {
    "id" : "ToAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Translation_Urgency"
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
    "value" : "br_setMainLastUpdateDate"
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
    "value" : "br_movePPHNodesToInProgress"
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
    "value" : "In Progress"
  }, {
    "id" : "ToAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Copy_Complete_Status"
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
exports.operation6 = function (node,step) {
//As per PPIM-4994

/*var translationStatus = node.getValue('a_Translation_Status').getSimpleValue();
if(translationStatus!='Submitted' && translationStatus != 'Complete'){
	node.getValue('a_Translation_Status').setSimpleValue('Needed');
}*/

//As per PPIM-7625
step.executeInContext('EN_CA', function (caContextManager) {
	
	var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());
	var styleMarketDesignation = caCurrentProduct.getValue('a_Style_Market_Designation').getSimpleValue();
	var translationStatus = caCurrentProduct.getValue('a_Translation_Status').getSimpleValue();
	
	var translationUrgency = caCurrentProduct.getValue('a_Translation_Urgency').setSimpleValue('1. Standard');
	

	//if(styleMarketDesignation != 'US' && translationStatus!='Submitted' && translationStatus != 'Complete'){
 	if(translationStatus != 'Submitted' && translationStatus != 'Complete'){
		caCurrentProduct.getValue('a_Translation_Status').setSimpleValue('Needed');
	}
});	
log.info(node.getValue('a_Translation_Status').getSimpleValue());
log.info(node.getValue('a_Translation_Urgency').getSimpleValue());

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Set_StyleSearchIndexable"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateTriggerStateFlowEvent",
  "parameters" : [ {
    "id" : "currentStateID",
    "type" : "java.lang.String",
    "value" : "NewStyleEnrichState1"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "ReadyForEnrichment"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : "Auto Submit"
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_NewStyleEnrichmentCanada"
  } ],
  "pluginType" : "Operation"
}
*/
