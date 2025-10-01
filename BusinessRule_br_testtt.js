/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_testtt",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Shot Request Import Actions(2)",
  "description" : "Ensure Shot Request has reference to CC in applicable Markets. Ensures Styling Piece reference is established and CC is initiated into Maintenance WF, when applicable",
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "ccAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Number",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "REF_TYPE",
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
exports.operation0 = function (step,node,ccAttr,REF_TYPE,LKT,eventType,assethubqueueUS,assethubqueueCA,assethubqueueJP,assethubqueueSA,photoLib) {
/*
 *  This rules works as follows:
 *  - Find CC and Styling Piece CCs using last digit of provided CC Numbers
 *  - Adjust Shared Market values and references based on status and markets of the CCs
 *  - Add Styling Piece references for applicable markets
 *  - Populate CC Number and Market Number on the ShotRequest
 *  - Publish or transition the ShotRequest in the Workflow
 */

var primaryCCStatus = null;
function getCCByShotCCNumber(ccNum, ctxt) {
    var ccRes = step.executeInContext(ctxt, function (manager) {
        if (ccNum != null) {
            var c = com.stibo.query.condition.Conditions;
            var qh = manager.getHome(com.stibo.query.home.QueryHome);
            var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
                c.valueOf(ccAttr).eq(ccNum)
                    .and(c.objectType(manager.getObjectTypeHome().getObjectTypeByID("CustomerChoice")))
            );

            var res = querySpecification.execute();
            // if search returns something, just get the first CC. a_CC_Number is a unique value so should only get one record in result.
            var cc = null;
            res.forEach(function (node) {
                cc = node;
                return false;
            });
            return cc;
        }
        else { throw "No CC was provided. Please ensure CC is available for all Shot Request and re-import for those." }
    });

    return ccRes;
}

function createShotRequestToStylingPieceCCRef(source, target, instruction) {
    var refExist = false;

    // get CC Number for the target
    var targetCCNum = target.getValue("a_CC_Number").getSimpleValue();
    logArray.push("\n - targetCCNum is: " + targetCCNum);

    // get references from imported shot request
    var ar_shotToCCReferencesNew = source.getReferences().asList();

    // for each reference
    for (var x = 0; x < ar_shotToCCReferencesNew.size(); x++) {
        // get current ref's type
        var ar_referenceTypeID = ar_shotToCCReferencesNew.get(x).getReferenceType().getID();
        logArray.push("\n - ar_referenceTypeID is: " + ar_referenceTypeID);

        // if current ref's type is ShotRequestToStylingPieceCCRef
        if (ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef') {
            // get current ref's target
            var targetCC = ar_shotToCCReferencesNew.get(x).getTarget();
            logArray.push("\n - targetCC is: " + targetCC.getID());

            // if current ref's target matches styling CC's ID
            if (targetCC.getID() == target.getID()) {
                logArray.push("\n - ref already exists");

                // then ref already exists, so don't make new ref
                refExist = true;

                // get the existing reference and update values
                logArray.push("\n - Setting a_Styling_Piece_Instructions on " + ar_shotToCCReferencesNew[x] + " to " + instruction);
                ar_shotToCCReferencesNew[x].getValue("a_Styling_Piece_Instructions").setSimpleValue(instruction);
                logArray.push("\n - Setting a_Styling_Piece_CC_Number on " + ar_shotToCCReferencesNew[x] + " to " + targetCCNum);
                ar_shotToCCReferencesNew[x].getValue("a_Styling_Piece_CC_Number").setSimpleValue(targetCCNum);
            }
        }
    }
    // if reference doesn't already exist try creating the reference
    if (refExist == false) {
        try {
            // try creating the reference
            logArray.push("\n - Creating Reference from " + source + " to " + target);
            var shotRef = source.createReference(target, "ShotRequestToStylingPieceCCRef");

            // try setting instruction
            logArray.push("\n --- Setting a_Styling_Piece_Instructions on " + shotRef + " to " + instruction);
            shotRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(instruction);
            logArray.push("\n --- Setting a_Styling_Piece_CC_Number on " + shotRef + " to " + targetCCNum);
            shotRef.getValue("a_Styling_Piece_CC_Number").setSimpleValue(targetCCNum);
        } catch (e) {
            if (e instanceof com.stibo.core.domain.LinkTypeNotValidException) {
                throw e;
            }
        }
    }
}

function findPrimaryCCStatus() {
    var primaryCCStatus = null;
    var currentMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
    if (currentMarkets.contains("US")) {
        node.getValue("a_Shot_Primary_Market").setSimpleValue("US");
    }
    else if (currentMarkets.contains("CAN")) {
        node.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
    }
    else if (currentMarkets.contains("JPN")) {
        node.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
    }
    else if (currentMarkets.contains("SA")) {
        node.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
    }
    var shotPrimaryMarket = node.getValue("a_Shot_Primary_Market").getSimpleValue();

    var otherContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", shotPrimaryMarket);
    step.executeInContext(otherContext, function (manager) {
        var otherCC = manager.getObjectFromOtherManager(cc);
        var otherCCStatus = otherCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
        if (otherCCStatus != null && otherCCStatus != "Draft" && otherCCStatus != "Purged") {
            primaryCCStatus = otherCCStatus;
        }
    });
    return primaryCCStatus;
}

logArray = [];

// get shared markets from the node
var sharedMarketsString = node.getValue('a_Shared_Markets').getSimpleValue();
logArray.push("\nshared markets are: " + sharedMarketsString);

// get last character of a_Shot_CC_Number
var shotCCNum = node.getValue("a_Shot_CC_Number").getValue();
logArray.push("\nshotCCNum is: " + shotCCNum);
var lastChar = shotCCNum.split("")[shotCCNum.length() - 1];
logArray.push("\nlastChar is: " + lastChar);

// get the Shot Request CC by Market
var cc = null

// 2 == US, 3 == CA, 6 == JP, 0 == SA
if (lastChar == '2') {
    cc = getCCByShotCCNumber(shotCCNum, 'EN_US');
}
else if (lastChar == '3') {
    cc = getCCByShotCCNumber(shotCCNum, 'EN_CA');
}
else if (lastChar == '6') {
    cc = getCCByShotCCNumber(shotCCNum, 'EN_JP');
}
else if (lastChar == '9') {
    cc = getCCByShotCCNumber(shotCCNum, 'EN_SA');
}
// try using shared markets as a last resort
else {
    if (sharedMarketsString.contains('US')) {
        cc = getCCByShotCCNumber(shotCCNum, 'EN_US');
    }
    else if (sharedMarketsString.contains('CAN')) {
        cc = getCCByShotCCNumber(shotCCNum, 'EN_CA');
    }
    else if (sharedMarketsString.contains('JPN')) {
        cc = getCCByShotCCNumber(shotCCNum, 'EN_JP');
    }
    else if (sharedMarketsString.contains('SA')) {
        cc = getCCByShotCCNumber(shotCCNum, 'EN_SA');
    }
}

if (cc == null) {
    // rollback creation of new shot request since there was an issue
    node.delete();
    throw "Unable to find a valid CC using the CC Number " + shotCCNum + ". Please validate the CC Number and reimport for " + shotCCNum;
}

logArray.push("\ncc is: " + cc);

logArray.push("\nsetting a_Shot_CC_Number on node to null");
node.getValue("a_Shot_CC_Number").setSimpleValue(null);

// Get the Styling Piece CCs from the node
var stylingPieceCCs = node.getValue("a_Styling_Piece_CC_Number_Import").getSimpleValue();
logArray.push("\nstylingPieceCCs are: " + stylingPieceCCs);

// split styling piece CCs into array
if (stylingPieceCCs != null) {
    var stylingPieceCCArray = [];
    stylingPieceCCs.split(",").forEach(function (p) {
        stylingPieceCCArray.push(p.trim());
    });
}

// get the context specific sCC's
if (stylingPieceCCArray != null) {
    var sCCArray = [];

    // for each styling piece CC
    for (var x = 0; x < stylingPieceCCArray.length; x++) {
        // current item
        var currStylingPieceCCNumber = stylingPieceCCArray[x];
        logArray.push("\ncurrStylingPieceCCNumber is: " + currStylingPieceCCNumber);

        // get the last char of styling piece CC number
        var lastChar = currStylingPieceCCNumber.split("")[currStylingPieceCCNumber.length() - 1];
        logArray.push("\nlastChar is: " + lastChar);

        // get the sCC by market, and put in array
        // 2 == US, 3 == CA, 6 == JP, 5 == SA
        var searchCC = null;

        if (lastChar == '2') {
            searchCC = getCCByShotCCNumber(currStylingPieceCCNumber, 'EN_US');
        }
        else if (lastChar == '3') {
            searchCC = getCCByShotCCNumber(currStylingPieceCCNumber, 'EN_CA');
        }
        else if (lastChar == '6') {
            searchCC = getCCByShotCCNumber(currStylingPieceCCNumber, 'EN_JP');
        }
        else if (lastChar == '9') {
            searchCC = getCCByShotCCNumber(currStylingPieceCCNumber, 'EN_SA');
        }
        // try using shared markets as a last resort
        else {
            if (sharedMarketsString.contains('US')) {
                searchCC = getCCByShotCCNumber(currStylingPieceCCNumber, 'EN_US');
            }
            else if (sharedMarketsString.contains('CAN')) {
                searchCC = getCCByShotCCNumber(currStylingPieceCCNumber, 'EN_CA');
            }
            else if (sharedMarketsString.contains('JPN')) {
                searchCC = getCCByShotCCNumber(currStylingPieceCCNumber, 'EN_JP');
            }
            else if (sharedMarketsString.contains('SA')) {
                searchCC = getCCByShotCCNumber(currStylingPieceCCNumber, 'EN_SA');
            }
        }

        if (searchCC == null) {
            log.info("Shot request was created. Styling Piece was not added because CC with following CC Number was not found: " + currStylingPieceCCNumber);
        }
        else {
            logArray.push("\nadding searchCC " + searchCC + " to sCCArray");
            sCCArray.push(searchCC);
        }
    }
}

// get the styling piece instructions from the node
var stylingPieceInstr = node.getValue("a_Styling_Piece_Instructions_Import").getSimpleValue();
logArray.push("\nInstructions are: " + stylingPieceInstr);

if (stylingPieceInstr != null) {
    var stylingPieceInstrArray = [];

    // split styling instructions into new array (this will be used later)
    stylingPieceInstr.split(",").forEach(function (inst) {
        stylingPieceInstrArray.push(inst.trim());
    });
}

//drop invalid shared market values from the shot request
var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();

if (sharedMarkets != null) {
    // for each market check validity of Shared Market values and correct if necessary
    sharedMarkets.forEach(function (mkt) {
        // current market's context value
        var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());
        logArray.push("\nnextContext is: " + nextContext);

        step.executeInContext(nextContext, function (manager) {
            // get context specific shot
            var contextEntity = manager.getEntityHome().getEntityByID(node.getID());
            logArray.push("\ncontextEntity is: " + contextEntity.getID());
            // get context specific CC
            var contextCC = manager.getProductHome().getProductByID(cc.getID());
            logArray.push("\ncontextCC is: " + contextCC.getID());

            if (contextCC != null) {
                // get context specific CCs status
                var contextCCStatus = contextCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
                logArray.push("\ncontextCCStatus is: " + contextCCStatus);
                // get context specific CCs market designation
                var contextCCMarkets = contextCC.getValue("a_Market_Designation").getSimpleValue();
                logArray.push("\ncontextCCMarkets are: " + contextCCMarkets);

                // delete market from shot if CC is in Draft
                if (contextCCStatus == "Draft") {
                    /*if (primaryMkt != null && primaryMkt == mkt.getValue()) {
                        primaryCCStatus = contextCCStatus;
                    }*/
                    //                    logArray.push("\n -- DELETING " + mkt);
                    //                    mkt.deleteCurrent();
                    //                    contextEntity.getValue("a_Shot_CC_Number").setSimpleValue(null);
                    // DraftCcFlag=true;
                }
                // if CC doesn't contain current market then delete the market from the Shot Request
                else if (contextCCMarkets.contains(mkt.getValue()) == false) {
                    logArray.push("\n -- DELETING " + mkt);
                    mkt.deleteCurrent();
                    contextEntity.getValue("a_Shot_CC_Number").setSimpleValue(null);
                }
            }
        });
    });
}
// If all Shared Markets were removed, do not continue
sharedMarketsString = node.getValue('a_Shared_Markets').getSimpleValue();
logArray.push("\nshorMarkets are: " + sharedMarketsString);

if (sharedMarketsString == null) {
    logArray.push("\n -- DELETING " + node);
    node.delete();
    throw "Unable to create Shot Request as CC " + cc.getValue("a_CC_Number").getSimpleValue() + " is currently in 'BLANK' status for all applicable Markets. Please enrich the CC prior to submitting Shot Requests.";
}
else {
    var shotCode = node.getValue("a_Shot_Code").getSimpleValue();
    var shotPlacement = node.getValue("a_Site_Placement").getSimpleValue();
    var shotType = node.getValue("a_Shot_Type").getSimpleValue();
    var shotInstructions = node.getValue("a_Shot_Instructions").getSimpleValue();
    // ensure user is not creating a duplicate shot request
    var duplicateShot = null;
    var newStylingPiece = false;

    sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();

    sharedMarkets.forEach(function (mkt) {
        var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());

        step.executeInContext(nextContext, function (manager) {
            var contextEntity = manager.getEntityHome().getEntityByID(node.getID());
            var contextCC = manager.getProductHome().getProductByID(cc.getID());
            var contextCCRefs = contextCC.getReferences(REF_TYPE).toArray();

            // if array isn't null
            if (contextCCRefs.length > 0) {
                // loop through array and check if reference already exists
                contextCCRefs.forEach(function (ref) {
                    var currentEntity = ref.getTarget();

                    if (duplicateShot == null) {

                        if (currentEntity.getID() != contextEntity.getID()) {
                            var currentShotCode = currentEntity.getValue("a_Shot_Code").getSimpleValue();
                            var currentShotStatus = currentEntity.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();

                            if ((currentShotStatus == "Submitted") && currentShotCode == shotCode) { // \\currentShotStatus == "Drafted"
                                var currentSharedMarkets = currentEntity.getValue("a_Shared_Markets").getValues().toArray();
                                var currentSharedMarketsString = currentEntity.getValue("a_Shared_Markets").getSimpleValue();
                                var contextEntitySharedMarkets = contextEntity.getValue("a_Shared_Markets").getValues().toArray();

                                // determine if the current shot has identical shared markets
                                var marketsMatch = true;
                                if (currentSharedMarkets.length !== contextEntitySharedMarkets.length) {
                                    marketsMatch = false;
                                }
                                else {
                                    currentSharedMarkets.sort();
                                    contextEntitySharedMarkets.sort();
                                    for (var i = 0; i < currentSharedMarkets.length; i++) {
                                        if (currentSharedMarkets[i] !== contextEntitySharedMarkets[i]) {
                                            marketsMatch = false;
                                        }
                                    }
                                }

                                // if current mkt is not a valid mkt for the current referenced shot
                                if (currentSharedMarketsString.contains(mkt.getValue()) == false) {
                                    // remove invalid reference to current shot
                                    ref.delete();
                                    // delete shot CC number and market from current shot request
                                    currentEntity.getValue("a_Shot_CC_Number").setSimpleValue(null);
                                    currentEntity.getValue("a_Shot_Market_Number").setSimpleValue(null);
                                    marketsMatch = false;
                                }
                                // if new shot markets match the current shot markets, then the new shot is a duplicate
                                if (marketsMatch == true) {

                                    duplicateShot = currentEntity.getID();

                                    /*
                                    Styling Piece Section
                                    */
                                    logArray.push("\n --- BEGINNING STYLING PIECE PORTION ---");
                                    if (sCCArray != null && stylingPieceInstrArray != null) {
                                        // for each sCC
                                        for (x = 0; x < sCCArray.length; x++) {
                                            // current shot CC
                                            var sCC = sCCArray[x];
                                            logArray.push("\nsCC is: " + sCC);

                                            var contextsCC = manager.getProductHome().getProductByID(sCC.getID());
                                            logArray.push("\ncontextsCC is: " + contextsCC);

                                            // create reference from currentEntity to contextsCC and set current inscruction
                                            logArray.push("\n -- Running function createShotRequestToStylingPieceCCRef for " + currentEntity.getID() + ", " + contextsCC.getID() + ", " + stylingPieceInstrArray[x]);
                                            createShotRequestToStylingPieceCCRef(currentEntity, contextsCC, stylingPieceInstrArray[x]);
                                            newStylingPiece = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
            // establish references and set values on new Shot Request
            if (duplicateShot == null) {
                // get current market's ID
                var marketID = mkt.getID();
                logArray.push("\nmarketID is: " + marketID);
                // get current market's value
                var marketValue = mkt.getValue();
                logArray.push("\nmarketValue is: " + marketValue);
                // get the context CC number
                var ccNum = contextCC.getValue("a_CC_Number").getSimpleValue();
                logArray.push("\nccNum is: " + ccNum);

                contextCC.createReference(contextEntity, REF_TYPE);
                contextEntity.getValue("a_Shot_CC_Number").setValue(ccNum);
                contextEntity.getValue("a_Shot_Market_Number").setSimpleValue(marketID + " : " + marketValue);

                /*
                    Styling Piece Section
                */
                logArray.push("\n --- BEGINNING STYLING PIECE PORTION ---");
                if (sCCArray != null && stylingPieceInstrArray != null) {
                    // for each sCC
                    for (x = 0; x < sCCArray.length; x++) {
                        // current shot CC
                        var sCC = sCCArray[x];
                        logArray.push("\nsCC is: " + sCC);

                        var contextsCC = manager.getProductHome().getProductByID(sCC.getID());
                        logArray.push("\ncontextsCC is: " + contextsCC);

                        // create reference from contextEntity to contextsCC and set current inscruction
                        logArray.push("\n -- Running function createShotRequestToStylingPieceCCRef for " + contextEntity.getID() + ", " + contextsCC.getID() + ", " + stylingPieceInstrArray[x]);
                        createShotRequestToStylingPieceCCRef(contextEntity, contextsCC, stylingPieceInstrArray[x]);
                    }
                }
            }
        });
    });

    if (duplicateShot == null) {
        logArray.push("\n -- DELETING a_Styling_Piece_CC_Number_Import on " + node.getID());
        node.getValue("a_Styling_Piece_CC_Number_Import").deleteCurrent();
        logArray.push("\n -- DELETING a_Styling_Piece_Instructions_Import on " + node.getID());
        node.getValue("a_Styling_Piece_Instructions_Import").deleteCurrent();

        // update shot request method to 'Bulk'
        logArray.push("\n -- Setting a_Shot_Request_Method on " + node.getID() + " to 'Bulk'");
        node.getValue("a_Shot_Request_Method").setSimpleValue("Bulk");

        var primaryCCStatus = findPrimaryCCStatus();
        log.info("PRIMARY" + primaryCCStatus);

        // trigger shot request workflow transition
        if (node.isInState("wf_ShortRequestLifeCycle", "Draft") && primaryCCStatus != null && primaryCCStatus != "Draft") {
            logArray.push("\n -- Moving " + node.getID() + " from Draft state to Submit state in wf_ShortRequestLifeCycle");
            node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Shot Request submitted via Bulk Upload");
        }
        else if (!(node.isInWorkflow("wf_ShortRequestLifeCycle"))) {
            logArray.push("\n -- Putting " + node.getID() + " in workflow wf_ShortRequestLifeCycle");
            node.startWorkflowByID("wf_ShortRequestLifeCycle", "Shot Request workflow initiated via Bulk Upload");

            if (node.isInState("wf_ShortRequestLifeCycle", "Draft") && primaryCCStatus != null && primaryCCStatus != "Draft") {
                logArray.push("\n -- Moving " + node.getID() + " from Draft state to Submit state in wf_ShortRequestLifeCycle");
                node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Shot Request submitted via Bulk Upload");
            }
        }
    }
    // do not allow user to create a duplicate shot request
    else {
        var ogShot = step.getEntityHome().getEntityByID(duplicateShot);
        var ogShotPlacement = ogShot.getValue("a_Site_Placement").getSimpleValue();
        var ogShotType = ogShot.getValue("a_Shot_Type").getSimpleValue();
        var ogShotInstructions = ogShot.getValue("a_Shot_Instructions").getSimpleValue();
        var ogPrimaryMarket = ogShot.getValue("a_Shot_Primary_Market").getSimpleValue();

        if (shotPlacement != ogShotPlacement || shotType != ogShotType || shotInstructions != ogShotInstructions || newStylingPiece == true) {
            // update original SR
            ogShot.getValue("a_Old_Site_Placement").setSimpleValue(ogShotPlacement);
            ogShot.getValue("a_Old_Shot_Type").setSimpleValue(ogShotType);
            ogShot.getValue("a_Old_Shot_Instructions").setSimpleValue(ogShotInstructions);
            ogShot.getValue("a_Site_Placement").setSimpleValue(shotPlacement);
            ogShot.getValue("a_Shot_Type").setSimpleValue(shotType);
            ogShot.getValue("a_Shot_Instructions").setSimpleValue(shotInstructions);

            //publish original with updates
            if (ogPrimaryMarket == "US") {
                logArray.push("\nPublishing to assethubqueueUS");
                assethubqueueUS.queueDerivedEvent(eventType, ogShot);
            }
            else if (ogPrimaryMarket == "CAN") {
                logArray.push("\nPublishing to assethubqueueCA");
                assethubqueueCA.queueDerivedEvent(eventType, ogShot);
            }
            else if (ogPrimaryMarket == "JPN") {
                logArray.push("\nPublishing to assethubqueueJP");
                assethubqueueJP.queueDerivedEvent(eventType, ogShot);
            }
            else if (ogPrimaryMarket == "SA") {
                logArray.push("\nPublishing to assethubqueueSA");
                assethubqueueSA.queueDerivedEvent(eventType, ogShot);
            }
        }
        // delete the duplicate Shot Request
        node.delete();
    }
}
// comment out the following line when not in development
log.info(logArray);

}