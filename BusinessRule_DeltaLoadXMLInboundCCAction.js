/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DeltaLoadXMLInboundCCAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeltaLoadXMLInboundCCAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotReqRef",
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
exports.operation0 = function (node,log,step,shotRequestRef,shotReqRef,LKT) {
function AutoTriggerWorkflow(wfID, wfStates, wfNode, sourceStatus) {
    // placeholder for the triggerByID return message
    var errorMessage = null;
    var objectType = wfNode.getObjectType().getID();

    wfStates.forEach(function (state) {
        // make sure node is in the current state
        var isInState = wfNode.isInState(wfID, state);
        //log.info(wfNode.getID() + " is in " + state + " state? " + isInState);

        if (isInState) {
            // get a workflow object by ID
            var workflowObject = step.getWorkflowHome().getWorkflowByID(wfID);

            // get state object from workflow object
            var wfObjectState = workflowObject.getStateByID(state);

            // get wf transition for given state
            var transition = wfObjectState.getTransitions().toArray()[0];

            // get wf event for given state
            var event = transition.getEvents().toArray()[0].getID();
            //log.info("Event: " + event);

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
                if (sourceStatus == "Approved") {
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

    var objectType = wfNode.getObjectType().getID();
    var stepLifeStatus = null;
    var sourceLifeStatus = null;
    var endDate = null;
    var wf = null;

    if (objectType == "Style") {
        stepLifeStatus = wfNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
        sourceLifeStatus = wfNode.getValue("a_Source_Style_Life_Cycle_Status").getSimpleValue();
        endDate = wfNode.getValue("a_Style_End_Date").getSimpleValue();

        if (currentMarket == "US") {
            wf = "wf_NewStyleEnrichment";
        }
        if (currentMarket == "CAN") {
            wf = "wf_NewStyleEnrichmentCanada";
        }
        if (currentMarket == "JPN") {
            wf = "wf_NewStyleEnrichmentJapan";
        }

        var states = StyleStates;
    }
    if (objectType == "CustomerChoice") {
        stepLifeStatus = wfNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
        sourceLifeStatus = wfNode.getValue("a_Source_CC_Life_Cycle_Status").getSimpleValue();
        endDate = wfNode.getValue("a_CC_End_Date").getSimpleValue();

        if (currentMarket == "US") {
            wf = "wf_CCEnrichment";
        }
        if (currentMarket == "CAN") {
            wf = "wf_CCEnrichmentCanada";
        }
        if (currentMarket == "JPN") {
            wf = "wf_CCEnrichmentJapan";
        }

        var states = CCStates;
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
                wfNode.startWorkflowByID(wf, objectType + " " + currentMarket + " Workflow Initiation from CC Market Update");
            }
            //log.info("Current Workflow is: " + wf);
            AutoTriggerWorkflow(wf, states, wfNode, sourceLifeStatus);
        }
    }
}

//////////////////////////////////////////Block to populate pre-Default attributes/////////////////////////////////////////////////////
function updateMarketDesigShotReq(node) {
    var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
    var ccNum = node.getValue("a_CC_Number").getSimpleValue();

    if (marketDesignation != null) {
        var shotReq = null;
        var refsc = new java.util.ArrayList();

        refsc.addAll(node.getReferences(shotReqRef));

        for (var k = 0; k < refsc.size(); k++) {
            shotReq = refsc.get(k).getTarget();
            //shotReq.getValue("a_Market_Designation_Shot_Request").setSimpleValue(desigValue); //Commented as part of - Changes for PPIM-7549 
            if (ccNum != null) {
                shotReq.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
            }
        }
    }
}

function marketUpdatesForCC(node) {
    var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
    var now = java.time.ZonedDateTime.now().minusDays(30);
    var final_date = now.format(formatter);
    var CC_Start_Date = node.getValue("a_CC_Start_Date").getSimpleValue();

    //log.info(CC_Start_Date);
    if (CC_Start_Date != null) {

        if (CC_Start_Date > final_date || CC_Start_Date == final_date) {
            node.getValue("a_New_Color").setSimpleValue("Yes");
            //log.info(node.getValue("a_New_Color").getSimpleValue());

        } else {
            node.getValue("a_New_Color").setSimpleValue("No");
            //log.info(node.getValue("a_New_Color").getSimpleValue());
        }
    }
    //=============DONOTAllow catalog sync user to trigger functions // PPIM-3799===========
    var lastModifiedUser = node.getRevision().getUserID();
    ///CC Planned in DC Date
    var CC_Source_Date = node.getValue("a_CC_Source_in_DC_Date").getSimpleValue();
    var CC_Planned_Date = node.getValue("a_CC_Planned_in_DC_Date").getSimpleValue();
    //log.info("plan" +CC_Planned_Date);
    //log.info("source" +CC_Source_Date);

    if (lastModifiedUser.toUpperCase() != "STIBOCATALOGSYNCUSER") {
        if (CC_Planned_Date == null && CC_Source_Date != null) {

            node.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
            //log.info(node.getValue("a_CC_Planned_in_DC_Date").getSimpleValue())
        }
        else if (CC_Source_Date != null && CC_Planned_Date != null) {

            if (CC_Source_Date < CC_Planned_Date) {

                node.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
                //log.info("a_CC_Source_in_DC_Date " +node.getValue("a_CC_Planned_in_DC_Date").getSimpleValue());
            }
        }
    }

    ///Style IN DC Date
    var parent_style = node.getParent();
    var style_DC_Date = parent_style.getValue("a_Style_IN_DC_Date").getSimpleValue();
    //log.info("date" +  style_DC_Date);
    if (style_DC_Date == null && CC_Source_Date != null) {

        parent_style.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
    }
    else if (CC_Source_Date != null && style_DC_Date != null) {

        if (CC_Source_Date < style_DC_Date) {

            parent_style.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
            //log.info("Style overlap" + parent_style.getValue("a_Style_IN_DC_Date").getSimpleValue());
        }
    }
    /////a_Override_CC_Name
    var Override_CC_Name = node.getValue("a_Override_CC_Name").getSimpleValue();

    if (Override_CC_Name == null) {

        node.getValue("a_Override_CC_Name").setSimpleValue("No");
        //log.info("a_Override_CC_Name  " + node.getValue("a_Override_CC_Name").getSimpleValue());
    }
}

//start code
var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);

if (currentContext.contains("EN_") == true) {
    //Set Market Designation from ACL
    var marketDesignation = node.getValue('a_Market_Designation').getSimpleValue();
    var aclMarket = node.getValue("a_ACL_Market_Designation").getSimpleValue();

    if (aclMarket != null) {
        var parentStyle = node.getParent();
        var styleMarketDsg = parentStyle.getValue("a_Style_Market_Designation").getSimpleValue();

        if (marketDesignation == null) {
            node.getValue('a_Market_Designation').setSimpleValue(aclMarket);
            marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
        }
        else if (marketDesignation.contains(aclMarket) == false) {
            node.getValue("a_Market_Designation").addValue(aclMarket);
            marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
        }

        //set the style market designation
        if (styleMarketDsg == null) {
            parentStyle.getValue("a_Style_Market_Designation").setSimpleValue(aclMarket);
        }
        else if (styleMarketDsg.contains(aclMarket) == false) {
            parentStyle.getValue("a_Style_Market_Designation").addValue(aclMarket);
        }
    }

    if (marketDesignation != null) {
        if (marketDesignation.contains(currentMarket)) {
            var countryOfOrigin = node.getValue("a_CC_Country_of_Origin").getSimpleValue();
            var parentStyle = node.getParent();
            var styleImported = parentStyle.getValue("a_Style_Imported").getSimpleValue();
            var originCountry = LKT.getLookupTableValue("LKT_MktDsg_to_Country_of_Origin", currentMarket);

            if (countryOfOrigin == "USA") {
                countryOfOrigin = "UNITED STATES OF AMERICA";
            }

            if (countryOfOrigin != null) {
                if (countryOfOrigin != originCountry) {
                    if (styleImported != "Yes") {
                        parentStyle.getValue("a_Style_Imported").setSimpleValue("Yes");
                    }
                }
                else if (styleImported == null) {
                    parentStyle.getValue("a_Style_Imported").setSimpleValue("No");
                }
            }

            //perform market updates for CC
            marketUpdatesForCC(node);
            //perform market updates for Shot Requests
            updateMarketDesigShotReq(node);
            //Get Workflow Variables and Auto-Trigger the CC
            getWorkflowVariables(node);
            //Get Workflow Variables and Auto-Trigger the parent Style
            getWorkflowVariables(parentStyle);
        }
        else {
            node.getValue("a_error_message").setSimpleValue(currentMarket + " : a_Market_Designation is not valid for executing context");
        }
    }
    else {
        node.getValue("a_error_message").setSimpleValue(currentMarket + " : a_Market_Designation is missing");
    }
}
}