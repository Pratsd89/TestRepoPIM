/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_TriggerCCWorkflow_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger CC Workflow - SA",
  "description" : "Scheduler",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,CCToPhotoShotRef) {
//PPIM-14203
var currentContext = step.getCurrentContext().getID();
var refs = node.getReferences(CCToPhotoShotRef).toArray();
for (var i in refs) {
    var shot = refs[i].getTarget();
    var shotPlacement = shot.getValue("a_Site_Placement").getSimpleValue();
    var shotStatus = shot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
    if (shotPlacement == "Main P1") {
        if (shotStatus != "Draft") {
            getWorkflowVariables(node);
        }
    }
}


function getWorkflowVariables(wfNode) {
    var CCStates = ["NewCCEnrich_Photo1", "NewCCEnrich_Photo2", "NewCCEnrich_Photo3"];
    var stepLifeStatus = wfNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
    var parentLcs = wfNode.getParent().getValue("a_Style_Life_Cycle_Status").getSimpleValue();
    if (stepLifeStatus == "Waiting for Style Approval" && parentLcs == "Approved") {
        var searchColor = wfNode.getValue("a_Search_Color_Calc").getSimpleValue();
        if (searchColor != null) {
            CCStates.push("NewCCEnrich_Final");
        }
    }
    AutoTriggerWorkflow("wf_CCEnrichmentSA", CCStates, wfNode);
}


function AutoTriggerWorkflow(wfID, wfStates, wfNode) {
    var errorMessage = null;
    wfStates.forEach(function (state) {
        var isInState = wfNode.isInState(wfID, state);

        if (isInState) {
            var workflowObject = step.getWorkflowHome().getWorkflowByID(wfID);
            var wfObjectState = workflowObject.getStateByID(state);
            var transition = wfObjectState.getTransitions().toArray()[0];
            var event = transition.getEvents().toArray()[0].getID();
            errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
        }
    });

    if (errorMessage != null) {
        wfNode.getValue("a_error_message").setSimpleValue(currentContext + " : " + errorMessage);
    }
    else {
        if (wfNode.getValue("a_error_message").getSimpleValue() != null) {
            wfNode.getValue("a_error_message").deleteCurrent();
        }
    }
}
}