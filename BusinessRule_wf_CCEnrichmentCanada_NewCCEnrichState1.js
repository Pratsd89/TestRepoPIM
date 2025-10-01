/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "wf_CCEnrichmentCanada_NewCCEnrichState1",
  "type" : "BusinessAction",
  "setupGroups" : [ "CA_Workflow_Triggers" ],
  "name" : "wf_CCEnrichmentCanada_NewCCEnrichState1",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateTriggerStateFlowEvent",
  "parameters" : [ {
    "id" : "currentStateID",
    "type" : "java.lang.String",
    "value" : "NewCCEnrichState1"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "CCReadyForEnrichment"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_CCEnrichmentCanada"
  } ],
  "pluginType" : "Operation"
}
*/
