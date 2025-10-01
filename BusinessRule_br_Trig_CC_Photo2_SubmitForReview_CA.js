/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Trig_CC_Photo2_SubmitForReview_CA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Trig_CC_Photo2_SubmitForReview_CA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "value" : "wf_CCEnrichmentCanada"
  } ],
  "pluginType" : "Operation"
}
*/
