/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "wf_CCEnrichmentSA_NewCCEnrich_Photo2",
  "type" : "BusinessAction",
  "setupGroups" : [ "SA_Workflow_Triggers" ],
  "name" : "wf_CCEnrichmentSA_NewCCEnrich_Photo2",
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
    "value" : "NewCCEnrich_Photo2"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "SubmitForReview"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_CCEnrichmentSA"
  } ],
  "pluginType" : "Operation"
}
*/
