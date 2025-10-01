/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CC_Approve_Shot_Request_WebUI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CC Approve Shot Request(s) WebUI",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
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
exports.operation0 = function (node,step,webUI) {
//get selected shot request from screen
var ShotRequestIter = webUI.getSelection().iterator();

var ccPhotoStatus = node.getValue("a_CC_Photo_Status").getSimpleValue();
var ccStatus = node.getValue("a_CC_Life_Cycle_Status").getSimpleValue();

if (ccStatus == "Approved" || ccStatus == "Waiting for Style Approval") {
    if (ccPhotoStatus == "Complete: Ready for Review" || ccPhotoStatus== "Complete") {
        while (ShotRequestIter.hasNext()) {
            var shotRequest = ShotRequestIter.next();
            //If shot request is in the Shot Request Life Cycle workflow state "Ready_to_Review"
            if (shotRequest.isInState("wf_ShortRequestLifeCycle", "Ready_to_Review")) {
                var wf = shotRequest.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");

                try {
                    wf.getTaskByID("Ready_to_Review").triggerByID("Approve", "Approving Shot Request");
                }
                catch (e) {
                    webUI.showAlert("WARNING",  e.message);
                }
            }
        }
    }
    else {
        webUI.showAlert("WARNING",  "Unable to Approve Shot Request, as the CC Photo Status is " + ccPhotoStatus + ". Please open an incident ticket for support if there is an issue with this Status");
    }
}
else {
    webUI.showAlert("WARNING",  "Unable to Approve Shot Request, as the CC Status is " + ccStatus + ". Please open and incident ticket support if there is an issue with this Status");
}
}