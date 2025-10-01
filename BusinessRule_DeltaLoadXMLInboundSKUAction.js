/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DeltaLoadXMLInboundSKUAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeltaLoadXMLInboundSKUAction",
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
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "setACLMarketDesid_DeltaLoad"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "SetSKUDIMValuesOnSKU_DeltaLoad"
  } ],
  "pluginType" : "Operation"
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRequestRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (node,log,step,shotRequestRef,LKT) {
function AutoTriggerWorkflow(wfID, wfStates, wfNode, wfSourceStatus) {
    // placeholder for the triggerByID return message
    var errorMessage = null;

    var objectType = wfNode.getObjectType().getID();

    wfStates.forEach(function (state) {
        // make sure node is in the current state
        var isInState = wfNode.isInState(wfID, state);
        log.info(wfNode.getID() + " is in " + state + " state? " + isInState);

        if (isInState) {
            // get a workflow object by ID
            var workflowObject = step.getWorkflowHome().getWorkflowByID(wfID);

            // get state object from workflow object
            var wfObjectState = workflowObject.getStateByID(state);

            // get wf transition for given state
            var transition = wfObjectState.getTransitions().toArray()[0];

            // get wf event for given state
            var event = transition.getEvents().toArray()[0].getID();
            log.info("Event: " + event);

            if (state == "NewStyleEnrich_Copy1") {
                var sourceCopyStatus = node.getValue("a_Source_Copy_Complete_Status").getSimpleValue();

                if (sourceCopyStatus == "Complete") {
                    errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
                }
                else {
                    wfNode.getValue("a_error_message").setSimpleValue("Skipped Copy Complete as Copy is not Complete in PacMan");
                }
            }
            else if (state == "NewStyleEnrich_Final" || state == "NewCCEnrich_Final") {
                if (wfSourceStatus == "Approved") {
                    // trigger node in workflow event
                    errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
                }
                else {
                    wfNode.getValue("a_error_message").setSimpleValue("Skipped Approval as " + objectType + " is not Approved in PacMan");
                }
            }
            else {
                // trigger node in workflow event
                errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
                //log.info("triggerByID result: " + errorMessage);
            }
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

function getWorkflowVariables(wfNode) {
    var StyleStates = new Array("NewStyleEnrichState1", "NewStyleEnrich_Copy1", "NewStyleEntrich_WebMerch1", "WaitingForFirst_CC", "NewStyleEnrich_Final");

    var CCStates = new Array("NewCCEnrichState1", "NewCCEnrich_Copy1", "NewCCEnrich_Photo1", "NewCCEnrich_Photo2", "NewCCEnrich_Photo3", "NewCCEnrich_Final");

    var SKUStates = new Array("NewSKUEnrich1", "NewSKUEnrich2");

    var objectType = wfNode.getObjectType().getID();
    var stepLifeStatus = null;
    var sourceLifeStatus = null;
    var endDate = null;
    var wf = null;

    if (objectType == "Style") {
        stepLifeStatus = wfNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
        sourceLifeStatus = wfNode.getValue("a_Source_Style_Life_Cycle_Status").getSimpleValue();
        endDate = wfNode.getValue("a_Style_End_Date").getSimpleValue();

        if (currentContext == "EN_US") {
            wf = "wf_NewStyleEnrichment";
        }
        if (currentContext == "EN_CA") {
            wf = "wf_NewStyleEnrichmentCanada";
        }
        if (currentContext == "EN_JP") {
            wf = "wf_NewStyleEnrichmentJapan";
        }

        var states = StyleStates;
    }
    if (objectType == "CustomerChoice") {
        stepLifeStatus = wfNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
        sourceLifeStatus = wfNode.getValue("a_Source_CC_Life_Cycle_Status").getSimpleValue();
        endDate = wfNode.getValue("a_CC_End_Date").getSimpleValue();

        if (currentContext == "EN_US") {
            wf = "wf_CCEnrichment";
        }
        if (currentContext == "EN_CA") {
            wf = "wf_CCEnrichmentCanada";
        }
        if (currentContext == "EN_JP") {
            wf = "wf_CCEnrichmentJapan";
        }

        var states = CCStates;
    }
    if (objectType == "SKU") {
        stepLifeStatus = wfNode.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
        sourceLifeStatus = wfNode.getValue("a_Source_SKU_Life_Cycle_Status").getSimpleValue();
        endDate = wfNode.getValue("a_SKU_End_Date").getSimpleValue();

        if (currentContext == "EN_US") {
            wf = "wf_NewSKUEnrichment";
        }
        if (currentContext == "EN_CA") {
            wf = "wf_NewSKUEnrichmentCanada";
        }
        if (currentContext == "EN_JP") {
            wf = "wf_NewSKUEnrichmentJapan";
        }

        var states = SKUStates;
    }

    //get today's date
    var today = new Date().toISOString().split('T')[0];
    //log.info("today is " + today);

    if (!endDate) {
        const timestamp = Date.parse("12/31/9999");
        endDate = new Date(timestamp).toISOString().split('T')[0];
        //log.info("endDate was null");
    }

    if (sourceLifeStatus != "Purged" && sourceLifeStatus != null) {
        //log.info("end date is " + endDate);
        if (endDate >= today && stepLifeStatus != "Approved") {
            if (!wfNode.isInWorkflow(wf)) {
                wfNode.startWorkflowByID(wf, "Delta Load based initiation");
            }
            log.info("Current Workflow is: " + wf);
            AutoTriggerWorkflow(wf, states, wfNode, sourceLifeStatus);
        }
    }
}

var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);

if (currentContext.contains("EN_") == true) {
    var parentStyle = node.getParent().getParent();
    var parentCC = node.getParent();
    var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();

    if (marketDesignation != null) {
        if (marketDesignation.contains(currentMarket) == true) {
            //Get Workflow Variables and Auto-Trigger the SKU
            getWorkflowVariables(node);
            //Get Workflow Variables and Auto-Trigger the parent CC
            getWorkflowVariables(parentCC);
            //Get Workflow Variables and Auto-Trigger the parent Style
            getWorkflowVariables(parentStyle);
        }
        else {
            node.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Market_Designation is not valid for executing context");
        }
    }
    else {
        node.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Market_Designation is missing");
    }
}
}