/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "wf_NewStyleEnrichSA_NewStyleEnrich_Final",
  "type" : "BusinessAction",
  "setupGroups" : [ "SA_Workflow_Triggers" ],
  "name" : "wf_NewStyleEnrichmentSA_NewStyleEnrich_Final",
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
    "value" : ""
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_NewStyleEnrichmentSA"
  } ],
  "pluginType" : "Operation"
}
*/
