/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_InitiateBadgesWorkflow",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_InitiateBadgesWorkflow",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,web) {
if(!(node.isInWorkflow("WF_Badges_Update"))){
node.startWorkflowByID("WF_Badges_Update", "Initiate in Badges Workflow");
if(node.isInState("WF_Badges_Update", "BadgingUpdate_Enrichment")){
	web.navigate("BadgingEnrichment", node);
}
} else {
	webUI.showAlert("Error", null, "Item already present in Badging Workflow");
}

}