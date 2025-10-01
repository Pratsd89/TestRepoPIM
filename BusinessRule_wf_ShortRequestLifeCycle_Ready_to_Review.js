/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "wf_ShortRequestLifeCycle_Ready_to_Review",
  "type" : "BusinessAction",
  "setupGroups" : [ "ShotRequest" ],
  "name" : "wf_ShortRequestLifeCycle_Ready_to_Review",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
    "value" : "Ready_to_Review"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "Approve"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : "Approving Shots and CCs from Style Final Validation"
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_ShortRequestLifeCycle"
  } ],
  "pluginType" : "Operation"
}
*/
