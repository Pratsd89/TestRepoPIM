/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_AddToAutopopWorkflowProducts",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Add To Autopop Workflow Products",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style", "WebCategory", "WebSubCategory" ],
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
    "value" : "Autopop_Initial"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "Complete"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : "Autopop Run Request"
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "Autopop_Async_Action"
  } ],
  "pluginType" : "Operation"
}
*/
