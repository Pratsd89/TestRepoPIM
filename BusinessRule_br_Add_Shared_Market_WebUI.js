/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Add_Shared_Market_WebUI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request - Add Shared Market WebUI",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_PhotoShot",
    "libraryAlias" : "photoLib"
  } ]
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
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueUS",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_US",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueCA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_CA",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueJP",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_JP",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "eventType",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "ShotRequestSubmit",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueSA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_SA",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "sharedMarkets",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Shared_Markets</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">sharedMarketsVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,webUI,manager,LKT,CCShotRef,assethubqueueUS,assethubqueueCA,assethubqueueJP,eventType,assethubqueueSA,sharedMarkets,photoLib) {
function addSharedMarkets(shotRequest) {
    //get ID of Shot Request
    var shotRequestID = shotRequest.getID();
    logArray.push("\nShot Request ID is: " + shotRequest.getID());
    //get the site placement from the Shot Request
    var shotMarket = shotRequest.getValue("a_Shared_Markets").getSimpleValue();

    //get photo shot lifecycle status from Shot Request
    var shotRequestStatus = shotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
    logArray.push(" Shot Request Status is: " + shotRequestStatus);

    var shotPrimaryMarket = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();

    if (shotPrimaryMarket == null) {
        if (shotMarket.contains("US")) {
            shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("US");
        }
        else if (shotMarket.contains("CAN")) {
            shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
        }
        else if (shotMarket.contains("JPN")) {
            shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
        }
        else if (shotMarket.contains("SA")) {
            shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
        }
        shotPrimaryMarket = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();
    }

    //If Photo Shot Lifecycle Status = Ready for Review || Complete
    if (shotRequestStatus != null) {
        //get market designation from CC
        logArray.push("\n -- continuing rule");

        var CCMktArray = java.util.ArrayList();

        CC.getValue("a_Market_Designation").getSimpleValue().split("<multisep/>").forEach(function (m) {
            CCMktArray.add(m);
        });
        logArray.push("\n -- CC Market Designation is: " + CCMktArray);

        //get market drsignation from Shot Request
        var ShotMktArray = java.util.ArrayList();

        shotRequest.getValue("a_Shared_Markets").getSimpleValue().split("<multisep/>").forEach(function (m) {
            ShotMktArray.add(m);
        });
        logArray.push("\n -- Shot Market Designation is: " + ShotMktArray);

        //loop through the selected markets
        var addMarketIter = addMarket.iterator();

        while (addMarketIter.hasNext()) {
            var nextAddMarket = addMarketIter.next();

            //CC should have the selected market
            if (CCMktArray.indexOf(nextAddMarket) > -1) {
                logArray.push("\n -- CC Market Desgnation has " + nextAddMarket + "? True");
            }
            else {
                throw "<b>The CC does not have the selected market.</b>";
            }

            //Shot Request should not have the selected market
            if (ShotMktArray.indexOf(nextAddMarket) == -1) {
                logArray.push("\n -- Shot Market Desgnation has " + nextAddMarket + "? False");
            }
            else {
                throw "<b>Shot Request " + shotRequestID + " already has the selected market.</b>";
            }
        }

        //add provided value to the Shared Market for the Shot Request
        logArray.push("\n -- adding provided value to the Shared Market for the Shot Request");
        sharedMarkets.split("<multisep/>").forEach(function (m) {
            shotRequest.getValue("a_Shared_Markets").addLOVValueByID(m);
        });

        //run "photoLib.updateContentReferencesForShotAndCC(shotRequest, manager, shotMkt, approval);" 
        // for the added market (use LKT_MarketDesignationToMarket to determine context)
        var addMarketIter = addMarket.iterator();

        logArray.push("\n -- running photoLib.updateContentReferencesForShotAndCC");
        //loop through the selected markets
        while (addMarketIter.hasNext()) {
            var ctxtVal = addMarketIter.next();
            var ctxtID = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", ctxtVal);
            logArray.push("\n -- ctxtID is: " + ctxtID);

            //add ref from CC to Shot Request in context
            manager.executeInContext(ctxtID, function (step) {
                //get context specific CC from manager
                var ctxtCC = step.getProductHome().getProductByID(CCID);
                var ctxtCCStatus = ctxtCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
                var ctxtCCPhotoStatus = ctxtCC.getValue("a_CC_Photo_Status").getSimpleValue();
                //
                //				if (ctxtCCStatus == "Draft") {
                //					throw "<b>The CC is in 'Draft' status for the selected market. Please enrich CC in market " + ctxtVal + " prior to adding this market</b>";
                //				}

                //get context specific Shot Request from manager
                var ctxtShot = step.getEntityHome().getEntityByID(shotRequestID);
                var ctxtShotStatus = ctxtShot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();

                // set shot market number on the context specific shot request
                ctxtMarketQuery = step.getAttributeHome().getAttributeByID("a_Shared_Markets").getListOfValues().queryValidValues();

                ctxtMarketQuery.forEach(function (val) {
                    logArray.push("\n -- val.getID() is: " + val.getID());
                    logArray.push("\n -- val.getValue() is: " + val.getValue());

                    if (val.getValue() == ctxtVal) {
                        ctxtShot.getValue("a_Shot_Market_Number").setSimpleValue(val.getID() + " : " + val.getValue());
                    }
                    return true;
                });

                // set shot CC number on the context specific shot request
                var ccNum = ctxtCC.getValue("a_CC_Number").getSimpleValue();
                ctxtShot.getValue("a_Shot_CC_Number").setValue(ccNum);

                //make sure CC doesn't already have a reference to this target
                var ctxtCCRefs = ctxtCC.getReferences(CCShotRef).iterator();

                var match = false;

                while (ctxtCCRefs.hasNext()) {
                    var ctxtCCRef = ctxtCCRefs.next();

                    if (ctxtCCRef.getTarget().getID() == ctxtShot.getID()) {
                        match = true;
                    }
                }

                if (match == false) {
                    //add reference in context
                    ctxtCC.createReference(ctxtShot, CCShotRef);

                    if (ctxtShot.getValue("a_Site_Placement").getSimpleValue() == "Main P1" && ctxtShotStatus == "Submitted") {
                        getWorkflowVariables(ctxtCC, ctxtVal, ctxtShotStatus);
                    }
                    else if (ctxtShotStatus == "Submitted") {
                        if (ctxtCCPhotoStatus == "Complete") {
                            ctxtCC.getValue('a_CC_Photo_Status').setSimpleValue("Complete: Request Submitted");
                        }
                    }
                    else if (ctxtShotStatus == "Ready for Review") {
                        if (ctxtCCPhotoStatus == "Complete" || ctxtCCPhotoStatus == "Complete: Request Submitted") {
                            ctxtCC.getValue('a_CC_Photo_Status').setSimpleValue("Complete: Ready for Review");
                        }
                    }
                }

                if (ctxtShotStatus == "Ready for Review" || ctxtShotStatus == "Complete") {

                    photoLib.updateContentReferencesForShotAndCC(ctxtShot, step, ctxtID, true);
                    if (ctxtShot.getValue("a_Site_Placement").getSimpleValue() == "Main P1") {
                        getWorkflowVariables(ctxtCC, ctxtVal, ctxtShotStatus);
                    }
                }
            });
        }

        //set CC a_main_last_modified_date
        var time = new java.util.Date();
        var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        CC.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    }

    if (shotRequestStatus == "Draft") {
        var currentMarkets = shotRequest.getValue("a_Shared_Markets").getSimpleValue();
        if (currentMarkets.contains("US")) {
            shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("US");
        }
        else if (currentMarkets.contains("CAN")) {
            shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
        }
        else if (currentMarkets.contains("JPN")) {
            shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
        }
        else if (currentMarkets.contains("SA")) {
            shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
        }
        shotPrimaryMarket = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();

        var otherContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", shotPrimaryMarket);
        manager.executeInContext(ctxtID, function (step) {
            var otherCC = step.getObjectFromOtherManager(CC);
            var otherCCStatus = otherCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
            if (otherCCStatus != null && otherCCStatus != "Draft" && otherCCStatus != "Purged") {
                if (shotRequest.isInState("wf_ShortRequestLifeCycle", "Draft")) {
                    shotRequest.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Shot Request submitted via Add Market(s) button");
                }
            }
        });
    }

    //Resubmit Shot Request to Asset Hub, unless in Draft status
    if (shotRequestStatus == "Submitted" || shotRequestStatus == "Ready for Review" || shotRequestStatus == "Complete") {
        if (shotPrimaryMarket == "US") {
            assethubqueueUS.queueDerivedEvent(eventType, shotRequest);
        }
        else if (shotPrimaryMarket == "CAN") {
            assethubqueueCA.queueDerivedEvent(eventType, shotRequest);
        }
        else if (shotPrimaryMarket == "JPN") {
            assethubqueueJP.queueDerivedEvent(eventType, shotRequest);
        }
        else if (shotPrimaryMarket == "SA") {
            assethubqueueSA.queueDerivedEvent(eventType, shotRequest);
        }
    }
}

function AutoTriggerWorkflow(wf, wfStates, CC) {

    var errorMessage = null;

    wfStates.forEach(function (state) {

        var isInState = CC.isInState(wf, state);

        if (isInState) {
            var workflowObject = manager.getWorkflowHome().getWorkflowByID(wf);

            var wfObjectState = workflowObject.getStateByID(state);

            var transition = wfObjectState.getTransitions().toArray()[0];

            var event = transition.getEvents().toArray()[0].getID();

            errorMessage = CC.getWorkflowInstanceByID(wf).getTaskByID(state).triggerByID(event, "CC Workflow Trigger from Main P1 Shot Request market update").getScriptMessage();
            log.info("triggerByID result: " + errorMessage);
        }
    });

    var currentContext = manager.getCurrentContext().getID();

    if (errorMessage != null) {
        CC.getValue("a_error_message").setSimpleValue(currentContext + " : " + errorMessage);
    }
    else {
        if (CC.getValue("a_error_message").getSimpleValue() != null) {
            CC.getValue("a_error_message").deleteCurrent();
        }
    }
}

function getWorkflowVariables(CC, mkt, status) {
    var CCStates1 = new Array("NewCCEnrich_Photo1");

    var CCStates2 = new Array("NewCCEnrich_Photo1", "NewCCEnrich_Photo2");

    var CCStates3 = new Array("NewCCEnrich_Photo1", "NewCCEnrich_Photo2", "NewCCEnrich_Photo3");

    var states = null;
    var CCPhotoStatus = CC.getValue('a_CC_Photo_Status').getSimpleValue();

    //Added LKTs to fetch CC workflow based on markets - This includes SA changes as well as part of PPIM_10540
    var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
    var wf = LKT.getLookupTableValue("LKT_Context_to_CC_Enrich_Workflows", context);

    if (status == "Submitted") {
        if (CCPhotoStatus == "Complete") {
            CC.getValue('a_CC_Photo_Status').setSimpleValue("Complete: Request Submitted");
        }
        else {
            states = CCStates1;
        }
    }
    else if (status == "Ready for Review") {
        if (CCPhotoStatus == "Complete" || CCPhotoStatus == "Complete: Request Submitted") {
            CC.getValue('a_CC_Photo_Status').setSimpleValue("Complete: Ready for Review");
        }
        else {
            states = CCStates2;
        }
    }
    else if (status == "Complete") {
        states = CCStates3;
    }

    if (states != null) {
        AutoTriggerWorkflow(wf, states, CC);
    }
}


if (sharedMarkets == null) {
    throw "Please select a market to add. Value cannot be Null";
}
else {
    var logArray = new Array();

    //get current CC from webUI
    var CC = node;
    var CCID = CC.getID();
    logArray.push("\nCC is: " + CCID);

    //get selected markets from picker
    var addMarket = java.util.ArrayList();
    sharedMarkets.split("<multisep/>").forEach(function (m) {
        //Attribute Validated Parameter selection returns the LoV ID so we have to convert that ID into the name value
        addMarket.add(manager.getAttributeHome().getAttributeByID("a_Shared_Markets").getListOfValues().getListOfValuesValueByID(m).getValue());
    });
    logArray.push("\nadded market is: " + addMarket);

    //get selected shot request from screen
    var selectedIter = webUI.getSelection().iterator();

    while (selectedIter.hasNext()) {
        var currSelected = selectedIter.next();
        var currObjectType = currSelected.getObjectType().getID();

        if (currObjectType == "ExternalStoredDAMAsset") {
            //get referencing shot request
            var referencedBy = currSelected.getReferencedBy().toArray();
            for (var m = 0; m < referencedBy.length; m++) {
                var referenceTypeId = referencedBy[m].getReferenceType().getID();

                if (referenceTypeId == 'ShotRequestToExternalAsset') {
                    addSharedMarkets(referencedBy[m].getSource())
                }
            }
        }
        else {
            addSharedMarkets(currSelected)
        }
    }
    // webUI.showAlert("warning","Log",logArray);
}
}