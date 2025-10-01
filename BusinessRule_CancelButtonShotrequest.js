/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CancelButtonShotrequest",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CancelButtonShotrequest",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,webUI) {
var result = true;
var stat = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
var site = node.getValue('a_Site_Placement').getID();
log.info('stat' + stat);

if (stat == "Submitted" && site == 5) {
    webUI.showAlert("WARNING",  "we cant Cancel Main P1 Shot");
    //log.info('cant cancel' );
} else {
    if (stat == "Submitted" && node.isInState("wf_ShortRequestLifeCycle", "Submitted") == true) {
        node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Submitted").triggerByID("Cancel", "Web UI Based Shot Request Cancel");
    }
}

}