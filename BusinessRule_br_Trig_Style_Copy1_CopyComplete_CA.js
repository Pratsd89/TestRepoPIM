/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Trig_Style_Copy1_CopyComplete_CA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Trig_Style_Copy1_CopyComplete_CA",
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
    "value" : "NewStyleEnrich_Copy1"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "Copy_Complete"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_NewStyleEnrichmentCanada"
  } ],
  "pluginType" : "Operation"
}
*/
