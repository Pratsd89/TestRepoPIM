/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "wf_NewStyleCan_NewStyleEnrich_Final",
  "type" : "BusinessAction",
  "setupGroups" : [ "CA_Workflow_Triggers" ],
  "name" : "wf_NewStyleEnrichmentCan_NewStyleEnrich_Final",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
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
    "value" : "NewStyleEnrich_Final"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "FinalValidation"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : "Style Trigger from NewStyleEnrich_Final through CC"
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_NewStyleEnrichmentCanada"
  } ],
  "pluginType" : "Operation"
}
*/
