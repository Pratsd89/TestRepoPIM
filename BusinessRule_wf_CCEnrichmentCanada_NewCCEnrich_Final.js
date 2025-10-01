/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "wf_CCEnrichmentCanada_NewCCEnrich_Final",
  "type" : "BusinessAction",
  "setupGroups" : [ "CA_Workflow_Triggers" ],
  "name" : "wf_CCEnrichmentCanada_NewCCEnrich_Final",
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
  "pluginId" : "BulkUpdateTriggerStateFlowEvent",
  "parameters" : [ {
    "id" : "currentStateID",
    "type" : "java.lang.String",
    "value" : "NewCCEnrich_Final"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "Submit"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : "Auto Trigger from US context"
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_CCEnrichmentCanada"
  } ],
  "pluginType" : "Operation"
}
*/
