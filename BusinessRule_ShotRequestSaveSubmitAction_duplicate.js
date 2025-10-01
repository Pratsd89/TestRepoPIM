/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestSaveSubmitAction_duplicate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ShotRequestSaveSubmitAction duplicate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ShotRequestLibrary",
    "libraryAlias" : "shotLibrary"
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
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "eventType",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "ShotRequestSubmit",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueUS",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.FrontEventQueueImpl",
    "value" : "step://eventqueue?id=PublishShotRequestToAssethub_EN_US",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueCA",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.FrontEventQueueImpl",
    "value" : "step://eventqueue?id=PublishShotRequestToAssethub_EN_CA",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueJP",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.FrontEventQueueImpl",
    "value" : "step://eventqueue?id=PublishShotRequestToAssethub_EN_JP",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueSA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_SA",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "BOM_CC_REF",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_BOM_CC",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,CCToPhotoShotRef,LKT,eventType,assethubqueueUS,assethubqueueCA,assethubqueueJP,webUI,assethubqueueSA,BOM_CC_REF,shotLibrary) {
var primaryCCStatus = null;
function createShotRequestToStylingPieceCCRef(source, target, instruction) {
    var refExist = false;

    // get references from imported shot request
    var ar_shotToCCReferencesNew = source.getReferences().asList();
    var targetCCNum = target.getValue("a_CC_Number").getSimpleValue();

    // for each reference
    for (var x = 0; x <= (ar_shotToCCReferencesNew.size() - 1); x++) {
        // get current ref's type
        var ar_referenceTypeID = ar_shotToCCReferencesNew.get(x).getReferenceType().getID();

        // if current ref's type is ShotRequestToStylingPieceCCRef
        if (ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef') {
            // get current ref's target
            var targetCC = ar_shotToCCReferencesNew.get(x).getTarget();

            // if current ref's target matches styling CC's ID
            if (targetCC.getID() == target.getID()) {
                // then ref already exists, so don't make new ref
                refExist = true;
                // get the existing reference and update values
                ar_shotToCCReferencesNew.get(x).getValue("a_Styling_Piece_Instructions").setSimpleValue(instruction);;
                ar_shotToCCReferencesNew.get(x).getValue("a_Styling_Piece_CC_Number").setSimpleValue(targetCCNum);
            }
        }
    }
    // if reference doesn't already exist try creating the reference
    if (refExist == false) {
        try {
            // creating the reference
            var shotRef = source.createReference(target, "ShotRequestToStylingPieceCCRef");
            // update styling ref values
            shotRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(instruction);
            shotRef.getValue("a_Styling_Piece_CC_Number").setSimpleValue(targetCCNum);
        }
        catch (e) {
            if (e instanceof com.stibo.core.domain.LinkTypeNotValidException) {
                throw e;
            }
        }
    }
}

var logArray = new Array();

// get shared markets from the node
var shotMarketsArray = node.getValue('a_Shared_Markets').getValues().toArray();
var shotID = node.getID();
var shotCode = node.getValue("a_Shot_Code").getSimpleValue();
var shotType = node.getValue("a_Shot_Type").getSimpleValue();
var shotPlacement = node.getValue("a_Site_Placement").getSimpleValue();
var shotMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
var shotStatus = node.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
var shotPrimaryMarket = node.getValue("a_Shot_Primary_Market").getSimpleValue();
var shotInstructions = node.getValue('a_Shot_Instructions').getSimpleValue();

// Shot requests should not be created OR modified if any one of required fields are missing: Shot Code, Shot Type, Site Placement, CC Number, Shared Markets
if (shotCode == null) {
    throw "\n<b>Shot Request was not submitted/modified due to required data missing for " + step.getAttributeHome().getAttributeByID("a_Shot_Code").getName() + "</b>";
}

if (shotType == null) {
    throw "\n<b>Shot Request was not submitted/modified due to required data missing for " + step.getAttributeHome().getAttributeByID("a_Shot_Type").getName() + "</b>";
}

if (shotPlacement == null) {
    throw "\n<b>Shot Request was not submitted/modified due to required data missing for " + step.getAttributeHome().getAttributeByID("a_Site_Placement").getName() + "</b>";
}

if (shotMarkets == null) {
    throw "\n<b>Shot Request was not submitted/modified due to required data missing for " + step.getAttributeHome().getAttributeByID("a_Shared_Markets").getName() + "</b>";
}

if (logArray.length > 0) {
    throw "<b>Updates to Shot Request with ID " + shotID + " for CC " + shotCC + " were rejected for the following reasons:</b>" + logArray;
}

if (shotPrimaryMarket == null) {
    if (shotMarkets.contains("US")) {
        node.getValue("a_Shot_Primary_Market").setValue("US");
    }
    else if (shotMarkets.contains("CAN")) {
        node.getValue("a_Shot_Primary_Market").setValue("CAN");
    }
    else if (shotMarkets.contains("JPN")) {
        node.getValue("a_Shot_Primary_Market").setValue("JPN");
    }
    else if (shotMarkets.contains("SA")) {
        node.getValue("a_Shot_Primary_Market").setValue("SA");
    }
    shotPrimaryMarket = node.getValue("a_Shot_Primary_Market").getSimpleValue();
}

if (shotStatus == "Submitted") {
    if (!shotMarkets.contains(shotPrimaryMarket)) {
        throw "<b>You cannot remove market " + shotPrimaryMarket + " from this shot request, as this shot is already in-progress with Photo Studio for this market. Please contact PhotoStudio to cancel this Shot Request if it was accidently created against this market.</b>";
    }
}

logArray.push("\nshotStatus is :" + shotStatus);

if (shotStatus == "Draft") {
    var referencingCCs = new java.util.ArrayList();

    referencingCCs.addAll(node.getReferencedByProducts());

    logArray.push("\nreferencingCCs is :" + referencingCCs.isEmpty());

    // Main P1 validations in when modified shot is referenced by the CC
    if (referencingCCs.isEmpty() == false) {

        for (var num = 0; num <= (referencingCCs.size() - 1); num++) {
            var cc = referencingCCs.get(num).getSource();
            logArray.push("\ncc is: " + cc);

            // for each market check validity of Shared Market values and correct if necessary
            shotMarketsArray.forEach(function (mkt) {
                logArray.push("\nmkt is: " + mkt.getValue());
                // current market's context value
                var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());
                logArray.push("\nnextContext is: " + nextContext);

                step.executeInContext(nextContext, function (manager) {
                    // get context specific shot
                    var contextEntity = manager.getEntityHome().getEntityByID(node.getID());
                    // get context specific CC
                    var contextCC = manager.getProductHome().getProductByID(cc.getID());
                    logArray.push("\ncontextCC is: " + contextCC);

                    if (contextCC != null) {
                        // get context specific CCs status
                        var contextCCStatus = contextCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
                        if (mkt.getValue() == shotPrimaryMarket) {
                            primaryCCStatus = contextCCStatus;
                        }

                        // get context specific CCs market designation
                        var contextCCMarkets = contextCC.getValue("a_Market_Designation").getSimpleValue();
                        // get current market's ID
                        var marketID = mkt.getID();
                        // get current market's value
                        var marketValue = mkt.getValue();

                        // delete market from shot if CC is in Draft
                        if (contextCCStatus == "") { // contextCCStatus == "Draft" ||

                            mkt.deleteCurrent();
                        }
                        // if CC doesn't contain current market then delete the market from the Shot Request
                        else if (contextCCMarkets.contains(mkt.getValue()) == false) {

                            mkt.deleteCurrent();
                        }
                        // if CC isn't Draft status and CC contains the current market
                        else {

                            var cntxtReferencingCCs = new java.util.ArrayList();

                            cntxtReferencingCCs.addAll(contextEntity.getReferencedByProducts());

                            if (cntxtReferencingCCs.isEmpty() == true) {

                                // create reference on the CC to the shot request
                                contextCC.createReference(contextEntity, CCToPhotoShotRef);
                                logArray.push("\ncc ref in context : " + nextContext + "," + contextCC.getID());

                                // set shot market number on the context specific shot request
                                contextEntity.getValue("a_Shot_Market_Number").setSimpleValue(marketID + " : " + marketValue);

                                var ccNum = contextCC.getValue("a_CC_Number").getSimpleValue();
                                logArray.push("\nccNum is: " + ccNum);

                                contextEntity.getValue("a_Shot_CC_Number").setValue(ccNum);
                            }
                            else {


                                contextEntity.getValue("a_Shot_Market_Number").setSimpleValue(marketID + " : " + marketValue);

                                var ccNum = contextCC.getValue("a_CC_Number").getSimpleValue();
                                logArray.push("\nccNum is: " + ccNum);

                                contextEntity.getValue("a_Shot_CC_Number").setValue(ccNum);
                            }
                        }
                    }
                });
            });
        }
    }
    // refetch shot markets value array, as value could have changed
    shotMarketsArray = node.getValue('a_Shared_Markets').getValues().toArray();
    // refetch shot markets value, as value could have changed
    shotMarkets = node.getValue('a_Shared_Markets').getSimpleValue();

    if (shotMarkets != null) {

        // get the current market to determine if invalid reference was created
        var currentContext = step.getCurrentContext().getID();

        var contextMarketsArray = new java.util.ArrayList();

        shotMarkets.split("<multisep/>").forEach(function (m) {
            contextMarketsArray.add(LKT.getLookupTableValue("LKT_MarketDesignationToMarket", m));
        });
        logArray.push("\ncontextMarketsArray is :" + contextMarketsArray);
        logArray.push("\ncurrentContext is: " + currentContext);

        if (contextMarketsArray.contains(currentContext) == false) {
            // delete reference to CC in current context
            var shotRefsIter = node.getReferencedBy().iterator();

            if (referencingCCs.isEmpty() == false) {
                for (var num = 0; num <= (referencingCCs.size() - 1); num++) {
                    var cc = referencingCCs.get(num).getSource();
                    var ccNum = cc.getValue("a_CC_Number").getSimpleValue();

                    //for each reference by ref
                    while (shotRefsIter.hasNext()) {
                        //current ref
                        var shotRefBy = shotRefsIter.next();

                        //current ref's source
                        var nextRefBySource = shotRefBy.getSource().getID();

                        //current ref's type
                        var nextRefByType = shotRefBy.getReferenceType();

                        //if ref's source is the CC and type is CCToPhotoShotRef...
                        if ((nextRefBySource == cc.getID()) && (nextRefByType == "CCToPhotoShotRef")) {
                            // then delete
                            shotRefBy.delete();
                        }
                    }
                }
            }
        }

        // set the method to manual
        node.getValue("a_Shot_Request_Method").setSimpleValue("Manual");
    }
}

if (shotMarkets == null) {
    throw "<b>Shot Request will be deleted in 60 mins, as CC " + ccNum + " is currently in 'Blank' status for all applicable Markets. Please enrich the CC prior to submitting this Shot Request.</b>";
} // 'Draft'

if (shotMarkets != null) {
    // Add the ShotRequestToStylingPieceRef in applicable markets
    var shotStylingPieceRefs = node.getReferences().asList().toArray();

    if (shotStylingPieceRefs != null) {

        shotStylingPieceRefs.forEach(function (ref) {
            var type = ref.getReferenceTypeString();

            if (type == "ShotRequestToStylingPieceCCRef") {
                var refTarget = ref.getTarget();

                var refInstruction = ref.getValue("a_Styling_Piece_Instructions").getSimpleValue();
                // for each market check validity of Shared Market values and correct if necessary
                shotMarketsArray.forEach(function (mkt) {
                    // current market's context value
                    var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());

                    step.executeInContext(nextContext, function (manager) {
                        // get context specific shot
                        var contextEntity = manager.getEntityHome().getEntityByID(node.getID());
                        // get context specific CC
                        var contextScc = manager.getProductHome().getProductByID(refTarget.getID());
                        // indicate if stylingPieceCC is referenced to the shot in current market
                        createShotRequestToStylingPieceCCRef(contextEntity, contextScc, refInstruction);
                    });
                });
            }
        });
    }
    // set old shot request attributes, method & primary market
    node.getValue('a_Old_Shot_Code').setSimpleValue(shotCode);
    node.getValue('a_Old_Shot_Type').setSimpleValue(shotType);
    node.getValue('a_Old_Site_Placement').setSimpleValue(shotPlacement);
    node.getValue('a_Old_Shared_Markets').setSimpleValue(shotMarkets);
    node.getValue('a_Old_Shot_Instructions').setSimpleValue(shotInstructions);
}

// PPIM-13065
var cc = node.queryReferencedBy(CCToPhotoShotRef).asList(100).get(0).getSource();
brandNumber = cc.getValue("a_Brand_Number").getSimpleValue();
if (brandNumber == "GO" || brandNumber == "BRFS") {
    var BOM_CC_list = cc.queryReferencedBy(BOM_CC_REF).asList(100);
    //log.info(BOM_CC_list.size())
    if (BOM_CC_list.size() > 0) {
        BOM_CC = BOM_CC_list.get(0).getSource();
        step.executeInContext("EN_SA", function (otherStepManager) {
            otherNode = otherStepManager.getObjectFromOtherManager(BOM_CC);
            SAShotCode = otherStepManager.getObjectFromOtherManager(node);
            try {
                otherNode.createReference(node, "CCToPhotoShotRef");
                logArray.push("\n creating bomcc ref  :" + otherNode.getID() + "," + SAShotCode.getID());
            } catch (e) {

            }
            newsharedMarket = SAShotCode.getValue("a_Shared_Markets").getSimpleValue();
            if (newsharedMarket != null && !newsharedMarket.contains("SA")) {
                SAShotCode.getValue("a_Shared_Markets").addValue("SA");
            }
            var ccNum = otherNode.getValue("a_CC_Number").getSimpleValue();
            SAShotCode.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
            SAShotCode.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");
        });

    }
}

//PPIM-14914
marketDesignation = cc.getValue("a_Market_Designation").getSimpleValue();
shared_markets = node.getValue("a_Shared_Markets").getSimpleValue();
if(marketDesignation.contains("SA") && !shared_markets.contains("SA")) {
	        step.executeInContext("EN_SA", function (otherStepManager) {
            otherNode = otherStepManager.getObjectFromOtherManager(cc);
            SAShotCode = otherStepManager.getObjectFromOtherManager(node);
            try {
                otherNode.createReference(SAShotCode, "CCToPhotoShotRef");
            } catch (e) {

            }
            newsharedMarket = SAShotCode.getValue("a_Shared_Markets").getSimpleValue();
            if (newsharedMarket != null && !newsharedMarket.contains("SA")) {
                SAShotCode.getValue("a_Shared_Markets").addValue("SA");
            }
            var ccNum = otherNode.getValue("a_CC_Number").getSimpleValue();
            SAShotCode.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
            SAShotCode.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");
        });
	
}

// trigger workflow or publish depending on status of shotRequest
if (node.isInState("wf_ShortRequestLifeCycle", "Draft") && primaryCCStatus != null && primaryCCStatus != "Draft") {
    node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Shot Request submitted via Shot Request Details Screen");
}
else if (shotStatus != 'Draft' && shotStatus != null) {
    // if shared market has US, run US context
    if (shotPrimaryMarket == "US") {
        assethubqueueUS.queueDerivedEvent(eventType, node);
    }
    else if (shotPrimaryMarket == "CAN") {
        assethubqueueCA.queueDerivedEvent(eventType, node);
    }
    else if (shotPrimaryMarket == "JPN") {
        assethubqueueJP.queueDerivedEvent(eventType, node);
    }
    //PPIM-10545 Sending to OIEP when Primary Market is SA
    else if (shotPrimaryMarket == "SA") {
        assethubqueueSA.queueDerivedEvent(eventType, node);
    }
}
else if (!(node.isInWorkflow("wf_ShortRequestLifeCycle"))) {
    node.startWorkflowByID("wf_ShortRequestLifeCycle", "Shot Request workflow initiated via Bulk Upload");
    if (node.isInState("wf_ShortRequestLifeCycle", "Draft") && primaryCCStatus != null && primaryCCStatus != "Draft") {
        node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Shot Request submitted via Shot Request Details Screen");
    }
}

// added portal redirect logic, as this was a feature in legacy BR
if (shotStatus == "Draft" || shotStatus == "Submitted") {

    var referencingCCs = new java.util.ArrayList();

    referencingCCs.addAll(node.getReferencedByProducts());

    logArray.push("\nreferencingCCs is :" + referencingCCs.isEmpty());

    if (referencingCCs.isEmpty() == false) {

        for (var num = 0; num <= (referencingCCs.size() - 1); num++) {
            var cc = referencingCCs.get(num).getSource();
        }
        var redirectCC = step.getProductHome().getProductByID(cc.getID());
        var nonMerchType = cc.getParent().getValue("a_product_merch_type").getSimpleValue();

        if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")) {
            webUI.navigate("CC_Details_Screen", redirectCC);
        }
        else {
            webUI.navigate("GAPNonMerchCCDetailsList", redirectCC);
        }
    }

}


// comment out following line when not in developent
//webUI.showAlert("warning", "LOG OUTPUT:" + logArray);
}