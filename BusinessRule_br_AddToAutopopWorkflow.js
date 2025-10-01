/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_AddToAutopopWorkflow",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Add To Autopop Workflow WebCategory",
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
    "value" : "Web Category Autopop Start"
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "Autopop_Async_Action_WebCategory"
  } ],
  "pluginType" : "Operation"
}
*/
