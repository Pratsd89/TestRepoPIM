/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_shotRequestDuplicateHandling",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request Duplicate Handling (v2)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
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
    "contract" : "DerivedEventTypeBinding",
    "alias" : "eventType",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "ShotRequestSubmit",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "oldStylingPieceRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "OldShotRequestToStylingPieceCCRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "StylingPieceRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToStylingPieceCCRef",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueSA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_SA",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,step,eventType,assethubqueueUS,assethubqueueCA,assethubqueueJP,LKT,CCToPhotoShotRef,oldStylingPieceRefType,StylingPieceRefType,assethubqueueSA) {
const table = [
    ["merge", null, null, null, "merge", "merge", "merge", null, null, null, "merge", "merge", "merge", null, "merge"],
    [null, "merge", null, null, "ogMktFix", null, null, "merge", "merge", null, "ogMktFix", "ogMktFix", null, "merge", "ogMktFix"],
    [null, null, "merge", null, null, "ogMktFix", null, "ogMktFix", null, "merge", "ogMktFix", null, "ogMktFix", "ogMktFix", "ogMktFix"],
    [null, null, null, "merge", null, null, "ogMktFix", null, "ogMktFix", "ogMktFix", null, "ogMktFix", "ogMktFix", "ogMktFix", "ogMktFix"],
    ["merge", "newMktFix", null, null, "merge", "merge", "merge", "newMktFix", "newMktFix", null, "merge", "merge", "merge", "newMktFix", "merge"],
    ["merge", null, "newMktFix", null, "merge", "merge", "merge", "ogMktFix", null, "newMktFix", "merge", "merge", "merge", "ogMktFix", "merge"],
    ["merge", null, null, "newMktFix", "merge", "merge", "merge", null, "ogMktFix", "ogMktFix", "merge", "merge", "merge", "ogMktFix", "merge"],
    [null, "merge", "newMktFix", null, "ogMktFix", "newMktFix", null, "merge", "merge", "newMktFix", "ogMktFix", "ogMktFix", "newMktFix", "merge", "ogMktFix"],
    [null, "merge", null, "newMktFix", "ogMktFix", null, "newMktFix", "merge", "merge", "ogMktFix", "ogMktFix", "ogMktFix", "newMktFix", "merge", "ogMktFix"],
    [null, null, "merge", "newMktFix", null, "ogMktFix", "newMktFix", "ogMktFix", "newMktFix", "merge", "ogMktFix", "newMktFix", "ogMktFix", "ogMktFix", "ogMktFix"],
    ["merge", "newMktFix", "newMktFix", null, "merge", "merge", "merge", "newMktFix", "newMktFix", "newMktFix", "merge", "merge", "merge", "newMktFix", "merge"],
    ["merge", "newMktFix", null, "newMktFix", "merge", "merge", "merge", "newMktFix", "newMktFix", "ogMktFix", "merge", "merge", "merge", "newMktFix", "merge"],
    ["merge", null, "newMktFix", "newMktFix", "merge", "merge", "merge", "ogMktFix", "ogMktFix", "newMktFix", "merge", "merge", "merge", "ogMktFix", "merge"],
    [null, "merge", "newMktFix", "newMktFix", "ogMktFix", "newMktFix", "newMktFix", "merge", "merge", "newMktFix", "ogMktFix", "ogMktFix", "newMktFix", "merge", "ogMktFix"],
    ["merge", "newMktFix", "newMktFix", "newMktFix", "merge", "merge", "merge", "newMktFix", "newMktFix", "newMktFix", "merge", "merge", "merge", "newMktFix", "merge"]
];

function getMarketValue(markets) {
    var value = null;

    if (markets.contains(";") == false || markets.contains("</multisep>") == false) {
        if (markets == "US") {
            value = 0;
        }
        else if (markets == "CAN") {
            value = 1;
        }
        else if (markets == "JPN") {
            value = 2;
        }
        else if (markets == "SA") {
            value = 3;
        }
        else if (markets.contains("US") && markets.contains("CAN") && markets.contains("JPN") && markets.contains("SA")) {
            value = 14;
        }
        else if (markets.contains("US") && markets.contains("CAN") && markets.contains("JPN")) {
            value = 10;
        }
        else if (markets.contains("US") && markets.contains("CAN") && markets.contains("SA")) {
            value = 11;
        }
        else if (markets.contains("US") && markets.contains("JPN") && markets.contains("SA")) {
            value = 12;
        }
        else if (markets.contains("CAN") && markets.contains("JPN") && markets.contains("SA")) {
            value = 13;
        }
        else if (markets.contains("US") && markets.contains("CAN")) {
            value = 4;
        }
        else if (markets.contains("US") && markets.contains("JPN")) {
            value = 5;
        }
        else if (markets.contains("US") && markets.contains("SA")) {
            value = 6;
        }
        else if (markets.contains("CAN") && markets.contains("JPN")) {
            value = 7;
        }
        else if (markets.contains("CAN") && markets.contains("SA")) {
            value = 8;
        }
        else if (markets.contains("JPN") && markets.contains("SA")) {
            value = 9;
        }
        return value;
    }
}

function createShotRequestToStylingPieceCCRef(source, target, instruction, refType) {
    var refExist = false;
    var targetCCNum = target.getValue("a_CC_Number").getSimpleValue();
    // get references from imported shot request
    var ar_shotToCCReferencesNew = source.getReferences().asList();

    // for each reference
    for (var x = 0; x <= (ar_shotToCCReferencesNew.size() - 1); x++) {
        // get current ref's type
        var ar_referenceTypeID = ar_shotToCCReferencesNew.get(x).getReferenceType().getID();

        // if current ref's type is ShotRequestToStylingPieceCCRef
        if (ar_referenceTypeID == refType) {
            // get current ref's target
            var targetCC = ar_shotToCCReferencesNew.get(x).getTarget();

            // if current ref's target matches styling CC's ID
            if (targetCC.getID() == target.getID()) {
                // then ref already exists, so don't make new ref
                refExist = true;
                // get the current reference and update values
                ar_shotToCCReferencesNew[x].getValue("a_Styling_Piece_Instructions").setSimpleValue(instruction);;
                ar_shotToCCReferencesNew[x].getValue("a_Styling_Piece_CC_Number").setSimpleValue(targetCCNum);
            }
        }
    }
    // if reference doesn't already exist try creating the reference
    if (refExist == false) {
        try {
            // try creating the reference
            var shotRef = source.createReference(target, refType);
            // try setting instruction
            shotRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(instruction);
            shotRef.getValue("a_Styling_Piece_CC_Number").setSimpleValue(targetCCNum);
        } catch (e) {
            if (e instanceof com.stibo.core.domain.LinkTypeNotValidException) {
                throw e;
            }
        }
    }
}

function duplicateHandling(fixShot, duplicateShot, cntxtCC, merge, removeRef) {
    // get the original shots markets to compare against new shot request
    var fixShotMkts = fixShot.getValue("a_Shared_Markets").getSimpleValue();
    logArray.push("\n - fixShotMkts is: " + fixShotMkts);
    var fixShotPrimaryMkt = fixShot.getValue("a_Shot_Primary_Market").getSimpleValue();
    logArray.push("\n - fixShotPrimaryMkt is: " + fixShotPrimaryMkt);

    // get the ID for the cntxtCC
    var ccID = cntxtCC.getID();
    logArray.push("\n - ccID is: " + ccID);

    var fixMarketsIter = fixShot.getValue("a_Shared_Markets").getValues().iterator();

    // for each market on the fixShot
    logArray.push("\n - merge is: " + merge);
    if (merge == false) {
        while (fixMarketsIter.hasNext()) {
            var fixMarket = fixMarketsIter.next();
            logArray.push("\n - fixMarket is: " + fixMarket);
            var fixMarketName = fixMarket.getValue();
            logArray.push("\n - fixMarketName is: " + fixMarketName);

            //remove selected market from Shot Request
            var removeMktsIter = duplicateShot.getValue("a_Shared_Markets").getValues().iterator();

            while (removeMktsIter.hasNext()) {
                var removeShotMkt = removeMktsIter.next();
                logArray.push("\n - removeShotMkt is: " + removeShotMkt);
                var removeShotMktName = removeShotMkt.getValue();
                logArray.push("\n - removeShotMktName is: " + removeShotMktName);

                if (fixMarketName == removeShotMktName) {
                    var contextID = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", fixMarketName);
                    logArray.push("\n - contextID is: " + contextID);

                    //delete selected market designation value
                    logArray.push("\n --- DELETING " + fixMarket);
                    fixMarket.deleteCurrent();

                    // only remove references from original shot. handle reference removal on new shot later
                    logArray.push("\n - removeRef is: " + removeRef);
                    if (removeRef == true) {
                        step.executeInContext(contextID, function (manager) {
                            var cntxtFixShot = manager.getEntityHome().getEntityByID(fixShot.getID());
                            logArray.push("\n - cntxtFixShot is: " + cntxtFixShot);
                            var cntxtFixShotRefsIter = cntxtFixShot.getReferencedBy().iterator();
                            logArray.push("\n - cntxtFixShotRefsIter is: " + cntxtFixShotRefsIter);

                            //for each reference by ref
                            while (cntxtFixShotRefsIter.hasNext()) {
                                //current ref
                                var nextCntxtShotRefBy = cntxtFixShotRefsIter.next();
                                logArray.push("\n - nextCntxtShotRefBy is: " + nextCntxtShotRefBy);

                                //current ref's source
                                var nextRefBySource = nextCntxtShotRefBy.getSource().getID();
                                logArray.push("\n - nextRefBySource is: " + nextRefBySource);

                                //current ref's type
                                var nextRefByType = nextCntxtShotRefBy.getReferenceType();
                                logArray.push("\n - nextRefByType is: " + nextRefByType);

                                //if ref's source is the CC and type is CCToPhotoShotRef...
                                if ((nextRefBySource == ccID) && (nextRefByType == "CCToPhotoShotRef")) {
                                    var setOfDimensionPoints = nextCntxtShotRefBy.getDimensionPoints();
                                    var dimensionIter = setOfDimensionPoints.iterator();
                                    var dimensionPoint = null;

                                    while (dimensionIter.hasNext()) {
                                        dimensionPoint = dimensionIter.next();

                                        // when ref is established on MarketRoot
                                        if (dimensionPoint.getID() == "MarketRoot") {
                                            // disassociate ref from MarketRoot
                                            logArray.push("\n --- DELETING " + dimensionPoint);
                                            dimensionPoint.clear();
                                        }

                                        break;
                                    }

                                    // then delete
                                    logArray.push("\n --- DELETING " + nextCntxtShotRefBy);
                                    nextCntxtShotRefBy.delete();
                                }
                            }
                            // remove Shot Customer Choice Number and Shot Market Number from the Shot Request
                            cntxtFixShot.getValue("a_Shot_CC_Number").setSimpleValue(null);
                            logArray.push("\n - setting a_Shot_CC_Number to NULL");
                            cntxtFixShot.getValue("a_Shot_Market_Number").setSimpleValue(null);
                            logArray.push("\n - setting a_Shot_Market_Number to NULL");
                        });
                    }
                }
            }
        }
    }
    if (merge == true) {
        // get new shot request attribute values to set on the original shot request
        var newShotPlacement = duplicateShot.getValue("a_Site_Placement").getSimpleValue();
        logArray.push("\n - newShotPlacement is: " + newShotPlacement);
        var newShotType = duplicateShot.getValue("a_Shot_Type").getSimpleValue();
        logArray.push("\n - newShotType is: " + newShotType);
        var newShotMethod = duplicateShot.getValue("a_Shot_Request_Method").getSimpleValue();
        logArray.push("\n - newShotMethod is: " + newShotMethod);
        var newShotInstructions = duplicateShot.getValue("a_Shot_Instructions").getSimpleValue();
        logArray.push("\n - newShotInstructions is: " + newShotInstructions);
        var CancelshotRequest = duplicateShot.getValue("a_CancelShotRequest").getSimpleValue();

        //update original shot request from new
        fixShot.getValue("a_Site_Placement").setValue(newShotPlacement);
        logArray.push("\n - setting a_Site_Placement on fixShot to " + newShotPlacement);
        fixShot.getValue("a_Shot_Type").setValue(newShotType);
        logArray.push("\n - setting s_Shot_Type on fixShot to " + newShotType);
        fixShot.getValue("a_Shot_Request_Method").setSimpleValue(newShotMethod);
        logArray.push("\n - setting a_Shot_Request_Method on fixShot to " + newShotMethod);
        fixShot.getValue("a_Shot_Instructions").setSimpleValue(newShotInstructions);
        logArray.push("\n - setting a_Shot_Instructions on fixShot to " + newShotInstructions);
        fixShot.getValue("a_CancelShotRequest").setSimpleValue(CancelshotRequest);

        // for each shared market on the new shot request, modify original accordingly
        var addMktsIter = duplicateShot.getValue("a_Shared_Markets").getValues().iterator();

        while (addMktsIter.hasNext()) {
            var addShotMkt = addMktsIter.next();
            logArray.push("\n - addShotMkt is: " + addShotMkt);
            var addShotMktName = addShotMkt.getValue();
            logArray.push("\n - addShotMktName is: " + addShotMktName);

            logArray.push("\n - fixShotMkts.contains(addShotMktName) is: " + fixShotMkts.contains(addShotMktName));
            if (fixShotMkts.contains(addShotMktName) == false) {
                var contextID = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", addShotMktName);
                logArray.push("\n - contextID is: " + contextID);

                //add selected market designation value
                fixShot.getValue("a_Shared_Markets").addValue(addShotMktName);
                logArray.push("\n - adding value " + addShotMktName + " to a_Shared_Markets on fixShot");

                step.executeInContext(contextID, function (step) {
                    var cntxtFixShot = step.getEntityHome().getEntityByID(fixShot.getID());
                    var cntxtCC = step.getProductHome().getProductByID(ccID);
                    var cntxtCCNum = cntxtCC.getValue("a_CC_Number").getSimpleValue();
                    var cntxtCCRefs = cntxtCC.getReferences(CCToPhotoShotRef).iterator();
                    var match = false;

                    //for each reference by ref
                    while (cntxtCCRefs.hasNext()) {
                        var cntxtCCRef = cntxtCCRefs.next();

                        if (cntxtCCRef.getTarget().getID() == cntxtFixShot.getID()) {
                            match = true;
                        }
                    }
                    if (match == false) {
                        //add reference in context
                        logArray.push("\n - creating reference from " + cntxtCC + " to " + cntxtFixShot);
                        cntxtCC.createReference(cntxtFixShot, CCToPhotoShotRef);
                    }

                    // set shot market number on the context specific shot request
                    cntxtMarketQuery = step.getAttributeHome().getAttributeByID("a_Shared_Markets").getListOfValues().queryValidValues();

                    cntxtMarketQuery.forEach(function (val) {
                        if (val.getValue() == addShotMktName) {
                            logArray.push("\n - setting a_Shot_Market_Number on " + cntxtFixShot + " to: " + val.getID() + " : " + val.getValue());
                            cntxtFixShot.getValue("a_Shot_Market_Number").setSimpleValue(val.getID() + " : " + val.getValue());
                        }
                        return true;
                    });

                    // add Shot Customer Choice Number and Shot Market Number from the Shot Request
                    logArray.push("\n - setting a_Shot_CC_Number on " + cntxtFixShot + " to " + cntxtCCNum);
                    cntxtFixShot.getValue("a_Shot_CC_Number").setSimpleValue(cntxtCCNum);
                });
            }

            /*      

            Styling Piece Section

            */
            // current market's context value
            if (addShotMktName != null) {
                var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", addShotMktName);

                step.executeInContext(nextContext, function (manager) {
                    var cntxtFixShot = manager.getEntityHome().getEntityByID(fixShot.getID());
                    var cntxtDuplicateShot = manager.getEntityHome().getEntityByID(duplicateShot.getID());
                    // Get the ShotRequestToStylingPieceRef from fixShot
                    var cntxtFixShotStylingPieceRefs = cntxtFixShot.getReferences().asList().toArray();

                    // clear OldShotRequestToStylingPieceRefs on fixShot
                    var cntxtFixShotOldStylingPieceRefs = cntxtFixShot.getReferences().asList().toArray();

                    cntxtFixShotOldStylingPieceRefs.forEach(function (ref) {
                        var type = ref.getReferenceTypeString();

                        if (type == oldStylingPieceRefType) {
                            ref.delete();
                        }
                    });

                    // Add the ShotRequestToStylingPieceRef to OldShotRequestToStylingPieceRef on fixShot
                    cntxtFixShotStylingPieceRefs.forEach(function (ref) {
                        var type = ref.getReferenceTypeString();

                        if (type == "ShotRequestToStylingPieceCCRef") {
                            var refTarget = ref.getTarget();

                            var refInstruction = ref.getValue("a_Styling_Piece_Instructions").getSimpleValue();

                            createShotRequestToStylingPieceCCRef(cntxtFixShot, refTarget, refInstruction, oldStylingPieceRefType);
                        }
                    });

                    // Remove the ShotRequestToStylingPieceCCRef from fixShot
                    cntxtFixShotStylingPieceRefs.forEach(function (ref) {
                        var type = ref.getReferenceTypeString();

                        if (type == "ShotRequestToStylingPieceCCRef") {
                            ref.delete();
                        }
                    });

                    // Get ShotRequestToStylingPieceCCRef from duplicateShot
                    var cntxtDuplicateShotStylingPieceRefs = cntxtDuplicateShot.getReferences().asList().toArray();

                    cntxtDuplicateShotStylingPieceRefs.forEach(function (ref) {
                        var type = ref.getReferenceTypeString();

                        if (type == "ShotRequestToStylingPieceCCRef") {
                            var refTarget = ref.getTarget();

                            var refInstruction = ref.getValue("a_Styling_Piece_Instructions").getSimpleValue();

                            //  Add the ShotRequestToStylingPieceCCRef to fixShot
                            createShotRequestToStylingPieceCCRef(cntxtFixShot, refTarget, refInstruction, StylingPieceRefType);
                        }
                    });
                });
            }
        }        
    }

    if (fixShotPrimaryMkt == "US") {
        logArray.push("\n - publishing event to assethubqueueUS");
        assethubqueueUS.queueDerivedEvent(eventType, fixShot);
    }
    else if (fixShotPrimaryMkt == "CAN") {
        logArray.push("\n - publishing event to assethubqueueCA");
        assethubqueueCA.queueDerivedEvent(eventType, fixShot);
    }
    else if (fixShotPrimaryMkt == "JPN") {
        logArray.push("\n - publishing event to assethubqueueJP");
        assethubqueueJP.queueDerivedEvent(eventType, fixShot);
    }
    else if (fixShotPrimaryMkt == "SA") {
        logArray.push("\n - publishing event to assethubqueueSA");
        assethubqueueSA.queueDerivedEvent(eventType, fixShot);
    }

    if (fixShot.getValue("a_CancelShotRequest").getSimpleValue()!=null){
        	  var BusinessRuleHome = step.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
        	  BusinessRuleHome.getBusinessActionByID("br_shotRequestCancelLogic_DuplicateCheck").execute(fixShot);
         }
}

logArray = [];

var shotID = node.getID();
var shotCode = node.getValue("a_Shot_Code").getSimpleValue();
var shotType = node.getValue("a_Shot_Type").getSimpleValue();
var shotPlacement = node.getValue("a_Site_Placement").getSimpleValue();
var shotMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
var shotMarketsArray = node.getValue("a_Shared_Markets").getValues().toArray();
var shotStatus = node.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
var shotMethod = node.getValue("a_Shot_Request_Method").getSimpleValue();
var shotPrimaryMkt = node.getValue("a_Shot_Primary_Market").getSimpleValue();
var shotInstructions = node.getValue("a_Shot_Instructions").getSimpleValue();

// set old shot request attributes, method & primary market
node.getValue('a_Old_Shot_Code').setSimpleValue(shotCode);
node.getValue('a_Old_Shot_Type').setSimpleValue(shotType);
node.getValue('a_Old_Site_Placement').setSimpleValue(shotPlacement);
node.getValue('a_Old_Shared_Markets').setSimpleValue(shotMarkets);
node.getValue('a_Old_Shot_Instructions').setSimpleValue(shotInstructions);

// ensure the primary market is set for the shot request
if (shotPrimaryMkt == null || shotPrimaryMkt == "") {
    if (shotMarkets.contains("US")) {
        node.getValue("a_Shot_Primary_Market").setSimpleValue("US");
        logArray.push("\nsetting a_Shot_Primary_Market to 'US'");
    }
    else if (shotMarkets.contains("CAN")) {
        node.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
        logArray.push("\nsetting a_Shot_Primary_Market to 'CAN'");
    }
    else if (shotMarkets.contains("JPN")) {
        node.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
        logArray.push("\nsetting a_Shot_Primary_Market to 'JPN'");
    }
    else if (shotMarkets.contains("SA")) {
        node.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
        logArray.push("\nsetting a_Shot_Primary_Market to 'SA'");
    }
    
    shotPrimaryMkt = node.getValue("a_Shot_Primary_Market").getSimpleValue();
}

// set the shot request method to manual if not ASLR or Bulk
if (shotMethod == null) {
    node.getValue('a_Shot_Request_Method').setSimpleValue("Manual");
    logArray.push("\nsetting a_Shot_Request_Method to 'Manual'");
}

const marketsArray = ["US", "CAN", "JPN", "SA"];

// find duplicate shots and perform appropriate actions based on table
logArray.push("\nshotMarkets is: " + shotMarkets);
logArray.push("\nshotStatus is: " + shotStatus);
if (shotMarkets != null && shotStatus == 'Submitted') {
    // set variable to determine if duplicate shot was found
    var publishNew = true;
    var isDeleted = false;

    // for each market check validity of Shared Market values and correct if necessary
    marketsArray.forEach(function (mkt) {
        // stop forEach when node is deleted through merge action
        logArray.push("\nisDeleted is: " + isDeleted);
        if (isDeleted == false) {
            // current market's context value
            var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
            logArray.push("\nnextContext is: " + nextContext);

            step.executeInContext(nextContext, function (manager) {
                var cntxtShot = manager.getEntityHome().getEntityByID(node.getID());
                var cntxtShotMarkets = cntxtShot.getValue("a_Shared_Markets").getSimpleValue();
                var cntxtShotCode = cntxtShot.getValue("a_Shot_Code").getSimpleValue();
                // get table value for new shots markets
                var newShotMarkets = getMarketValue(cntxtShotMarkets);

                //get CCs referencing the modified Shot
                var referencingCCs = new java.util.ArrayList();

                referencingCCs.addAll(cntxtShot.getReferencedByProducts());

                if (referencingCCs.isEmpty() == false) {
                    logArray.push("\nreferencingCCs.size() is: " + referencingCCs.size());
                    for (var num = 0; num <= (referencingCCs.size() - 1); num++) {
                        var cntxtCC = referencingCCs.get(num).getSource();
                        var cntxtCCShots = cntxtCC.getReferences(CCToPhotoShotRef).toArray();

                        // validate against all shot requests for that CC
                        cntxtCCShots.forEach(function (cntxtCCShot) {
                            var currentShotRequest = cntxtCCShot.getTarget();
                            logArray.push("\ncurrentShotRequest is: " + currentShotRequest);
                            var currentShotCode = currentShotRequest.getValue("a_Shot_Code").getSimpleValue();
                            logArray.push("\ncurrentShotCode is: " + currentShotCode);
                            var currentShotMarkets = currentShotRequest.getValue("a_Shared_Markets").getSimpleValue();
                            logArray.push("\ncurrentShotMarkets is: " + currentShotMarkets);
                            var currentShotStatus = currentShotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
                            logArray.push("\ncurrentShotStatus is: " + currentShotStatus);

                            if (currentShotRequest.getID() != shotID && currentShotMarkets != null && currentShotMarkets.contains(mkt)) {
                                // determine if duplicate
                                if (currentShotCode == cntxtShotCode && currentShotStatus == 'Submitted') {
                                    // get table value for duplicates original shots markets
                                    var ogShotMarkets = getMarketValue(currentShotMarkets);
                                    // determine if actions are needed to handle duplicate shot
                                    var action = table[newShotMarkets][ogShotMarkets];
                                    logArray.push("\naction is: " + action);

                                    if (action != null) {
                                        // ensure primary market is set on the duplicate shot
                                        var currentShotPrimaryMkt = currentShotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();
                                        logArray.push("\ncurrentShotPrimaryMkt is: " + currentShotPrimaryMkt);

                                        if (currentShotPrimaryMkt == null || currentShotPrimaryMkt == "") {
                                            if (currentShotMarkets.contains("US")) {
                                                currentShotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("US");
                                                logArray.push("\nsetting a_Shot_Primary_Market to 'US'");
                                            }
                                            else if (currentShotMarkets.contains("CAN")) {
                                                currentShotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
                                                logArray.push("\nsetting a_Shot_Primary_Market to 'CAN'");
                                            }
                                            else if (currentShotMarkets.contains("JPN")) {
                                                currentShotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
                                                logArray.push("\nsetting a_Shot_Primary_Market to 'JPN'");
                                            }
                                            else if (currentShotMarkets.contains("SA")) {
                                                currentShotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
                                                logArray.push("\nsetting a_Shot_Primary_Market to 'SA'");
                                            }

                                            // refetch the primary market after setting
                                            currentShotPrimaryMkt = currentShotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();
                                            logArray.push("\ncurrentShotPrimaryMkt is: " + currentShotPrimaryMkt);
                                        }

                                        // merge the new shot with the original shot (fixShot, duplicateShot, cc, merge, removeRef)
                                        if (action == "merge") {
                                            logArray.push("\nRunning duplicateHandling...");
                                            duplicateHandling(currentShotRequest, cntxtShot, cntxtCC, true, false);
                                            isDeleted = true;
                                            // set publishNew to false
                                            publishNew = false;
                                        }
                                        // correct markets and references on the original shot (fixShot, duplicateShot, cc, merge, removeRef)
                                        else if (action == "ogMktFix") {
                                            logArray.push("\nRunning duplicateHandling...");
                                            duplicateHandling(currentShotRequest, cntxtShot, cntxtCC, false, true);

                                            // set publishNew to true
                                            publishNew = true;
                                        }
                                        // correct markets and references on new shot (fixShot, duplicateShot, cc, merge, removeRef)
                                        else if (action == "newMktFix") {
                                            logArray.push("\nRunning duplicateHandling...");
                                            duplicateHandling(cntxtShot, currentShotRequest, cntxtCC, false, false);

                                            // set publishNew to false
                                            publishNew = false;
                                        }
                                    }
                                }
                            }
                        });
                        // re-fetch markets value after update
                        cntxtShotMarkets = cntxtShot.getValue("a_Shared_Markets").getSimpleValue();
                        logArray.push("\ncntxtShotMarkets is: " + cntxtShotMarkets);
                        logArray.push("\nisDeleted is: " + isDeleted);

                        // correct references
                        if (cntxtShotMarkets.contains(mkt) == false && isDeleted == false) {
                            var cntxtShotRefsIter = cntxtShot.getReferencedBy().iterator();

                            //for each reference by ref
                            while (cntxtShotRefsIter.hasNext()) {
                                //current ref
                                var nextCntxtShotRefBy = cntxtShotRefsIter.next();
                                logArray.push("\nnextCntxtShotRefBy is: " + nextCntxtShotRefBy);

                                //current ref's source
                                var nextRefBySource = nextCntxtShotRefBy.getSource().getID();
                                logArray.push("\nnextRefBySource is: " + nextRefBySource);

                                //current ref's type
                                var nextRefByType = nextCntxtShotRefBy.getReferenceType();
                                logArray.push("\nnextRefByType is: " + nextRefByType);

                                //if ref's source is the CC and type is CCToPhotoShotRef...
                                if ((nextRefBySource == cntxtCC.getID()) && (nextRefByType == "CCToPhotoShotRef")) {
                                    var setOfDimensionPoints = nextCntxtShotRefBy.getDimensionPoints();
                                    var dimensionIter = setOfDimensionPoints.iterator();
                                    var dimensionPoint = null;

                                    while (dimensionIter.hasNext()) {
                                        dimensionPoint = dimensionIter.next();

                                        // when ref is established on MarketRoot
                                        if (dimensionPoint.getID() == "MarketRoot") {
                                            // disassociate ref from MarketRoot
                                            logArray.push("\n -- Deleting dimension point: " + dimensionPoint);
                                            dimensionPoint.clear();
                                        }

                                        break;
                                    }

                                    // then delete
                                    logArray.push("\n -- Deleting " + nextCntxtShotRefBy);
                                    nextCntxtShotRefBy.delete();
                                }
                            }
                            // remove Shot Customer Choice Number and Shot Market Number from the Shot Request
                            cntxtShot.getValue("a_Shot_CC_Number").setSimpleValue(null);
                            logArray.push("\nsetting a_Shot_CC_Number to NULL");
                            cntxtShot.getValue("a_Shot_Market_Number").setSimpleValue(null);
                            logArray.push("\nsetting a_Shot_Market_Number to NULL");
                        }
                    }
                }
            });
        }
    });

    if (isDeleted == true) {
        logArray.push("\nisDeleted is: " + isDeleted);
        marketsArray.forEach(function (mkt) {
            // current market's context value
            var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
            logArray.push("\nnextContext is: " + nextContext);

            // Remove all refs from duplicateShot
            step.executeInContext(nextContext, function (manager) {
                var cntxtShot = manager.getEntityHome().getEntityByID(node.getID());
                logArray.push("\ncntxtShot is: " + cntxtShot);
                // get all refBy's
                var cntxtShotRefsIter = cntxtShot.getReferencedBy().iterator();

                // remove all refBy's
                while (cntxtShotRefsIter.hasNext()) {
                    var nextCntxtShotRefBy = cntxtShotRefsIter.next();

                    logArray.push("\n -- Deleting " + nextCntxtShotRefBy);
                    nextCntxtShotRefBy.delete();
                }

                // get all refs
                var cntxtShotRefs = cntxtShot.getReferences().asList().toArray();

                // remove all refs
                cntxtShotRefs.forEach(function (cntxtShotRef) {
                    logArray.push("\n -- Deleting " + cntxtShotRef);
                    cntxtShotRef.delete();
                });

                // remove duplicate shot from workflow
                if (cntxtShot.getWorkflowInstanceByID("wf_ShortRequestLifeCycle") != null) {
                    logArray.push("\n -- Deleting cntxtShot from wf_ShortRequestLifeCycle");
                    cntxtShot.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").delete("");
                }
            });
        });
        // delete the node
        logArray.push("\n -- Deleting " + node);
        node.delete();
    }

    logArray.push("\npublishNew is: " + publishNew);
    if (publishNew == true && isDeleted == false) {
        
        if (shotPrimaryMkt == "US") {
            logArray.push("\nPublishing to assethubqueueUS");
            assethubqueueUS.queueDerivedEvent(eventType, node);
        }
        else if (shotPrimaryMkt == "CAN") {
            logArray.push("\nPublishing to assethubqueueCA");
            assethubqueueCA.queueDerivedEvent(eventType, node);
        }
        else if (shotPrimaryMkt == "JPN") {
            logArray.push("\nPublishing to assethubqueueJP");
            assethubqueueJP.queueDerivedEvent(eventType, node);
        }
        else if (shotPrimaryMkt == "SA") {
            logArray.push("\nPublishing to assethubqueueSA");
            assethubqueueSA.queueDerivedEvent(eventType, node);
        }
    }
}

// comment out the following line when not in development
//log.info(logArray);
}