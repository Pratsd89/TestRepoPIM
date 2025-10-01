/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Auto_Submit_SKU_From_In_Progress_JPN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Auto Submit SKU From In-Progress JPN",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
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
    "value" : "NewSKUEnrich2"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "Submit"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : "Auto Submit From SKU Workflow JPN"
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_NewSKUEnrichmentJapan"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,step) {
var lastModifiedUser = node.getRevision().getUserID();
if (lastModifiedUser.toUpperCase() == "STIBOCATALOGSYNCUSER"){
	return false;
}
else{
	return true;
}

}