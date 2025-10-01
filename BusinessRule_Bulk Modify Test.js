/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Bulk Modify Test",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TEST Bulk Shot Request Import Actions",
  "description" : "Ensure Shot Request has reference to CC in applicable Markets. Ensures Styling Piece reference is established and CC is initiated into Maintenance WF, when applicable",
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  }, {
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
    "contract" : "ImportChangeInfoBind",
    "alias" : "importChanges",
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
    "alias" : "BOMRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_BOM_CC",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,ccAttr,REF_TYPE,LKT,eventType,assethubqueueUS,assethubqueueCA,assethubqueueJP,importChanges,assethubqueueSA,BOMRef,helper,photoLib) {
/*
 *  This rules works as follows:
 *  - Find CC and Styling Piece CCs using last digit of provided CC Numbers
 *  - Adjust Shared Market values and references based on status and markets of the CCs
 *  - Add Styling Piece references for applicable markets
 *  - Populate CC Number and Market Number on the ShotRequest
 *  - Publish or transition the ShotRequest in the Workflow
 */

function checkBomRef(node) {
    var objRefBy = node.getReferencedBy().toArray();
    for (var i = 0; i < objRefBy.length; i++) {
        if (objRefBy[i].getReferenceType().getID() == BOMRef) {
            return true;
        }
    }
    return false;
}

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
            if (res.asList(1).size() > 0) {
                return res.asList(1).get(0);
            }
            else { return null; }
        }
        else { throw "No CC was provided. Please ensure CC is available for all Shot Request and re-import for those." }
    });

    return ccRes;
}

function createShotRequestToStylingPieceCCRef(source, target, instruction) {
    var refExist = false;

    // get CC Number for the target
    var targetCCNum = target.getValue("a_CC_Number").getSimpleValue();
    log.info("\n - targetCCNum is: " + targetCCNum);

    // get references from imported shot request
    var ar_shotToCCReferencesNew = source.getReferences().asList();

    // for each reference
    for (var x = 0; x < ar_shotToCCReferencesNew.size(); x++) {
        // get current ref's type
        var ar_referenceTypeID = ar_shotToCCReferencesNew.get(x).getReferenceType().getID();
        log.info("\n - ar_referenceTypeID is: " + ar_referenceTypeID);

        // if current ref's type is ShotRequestToStylingPieceCCRef
        if (ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef') {
            // get current ref's target
            var targetCC = ar_shotToCCReferencesNew.get(x).getTarget();
            log.info("\n - targetCC is: " + targetCC.getID());

            // if current ref's target matches styling CC's ID
            if (targetCC.getID() == target.getID()) {
                log.info("\n - ref already exists");

                // then ref already exists, so don't make new ref
                refExist = true;

                // get the existing reference and update values
                log.info("\n - Setting a_Styling_Piece_Instructions on " + ar_shotToCCReferencesNew[x] + " to " + instruction);
                ar_shotToCCReferencesNew[x].getValue("a_Styling_Piece_Instructions").setSimpleValue(instruction);
                log.info("\n - Setting a_Styling_Piece_CC_Number on " + ar_shotToCCReferencesNew[x] + " to " + targetCCNum);
                ar_shotToCCReferencesNew[x].getValue("a_Styling_Piece_CC_Number").setSimpleValue(targetCCNum);
            }
        }
    }
    // if reference doesn't already exist try creating the reference
    if (refExist == false) {
        try {
            // try creating the reference
            log.info("\n - Creating Reference from " + source + " to " + target);
            var shotRef = source.createReference(target, "ShotRequestToStylingPieceCCRef");

            // try setting instruction
            log.info("\n --- Setting a_Styling_Piece_Instructions on " + shotRef + " to " + instruction);
            shotRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(instruction);
            log.info("\n --- Setting a_Styling_Piece_CC_Number on " + shotRef + " to " + targetCCNum);
            shotRef.getValue("a_Styling_Piece_CC_Number").setSimpleValue(targetCCNum);
        } catch (e) {
            if (e instanceof com.stibo.core.domain.LinkTypeNotValidException) {
                throw e;
            }
        }
    }
}

// function to remove a reference
function removeContentLink(source, refType, manager, contextID) {
    return manager.executeInContext(contextID, function (otherManager) {
        var sourceNode = otherManager.getObjectFromOtherManager(source);
        // fix refTyp for AV9 Video & Main P1
        if (refType == "AV9 Video") {
            refType = "AV9";
        }
        if (refType == "Main P1") {
            refType = "PrimaryProductImage";
        }
        var refs = sourceNode.getReferences(manager.getReferenceTypeHome().getReferenceTypeByID(refType));
        // if source object has the reference populated and is pointing to different asset, delete it
        for (var i = 0; i < refs.size(); i++) {
            var refToDelete = refs.get(i);

            refToDelete.delete();
        }
    });
}

function AutoTriggerWorkflow(wf, wfStates, CC) {

    var errorMessage = null;

    wfStates.forEach(function (state) {

        var isInState = CC.isInState(wf, state);
        log.info("\n " + CC.getID() + "is in " + state + " state? " + isInState);

        if (isInState) {
            var workflowObject = step.getWorkflowHome().getWorkflowByID(wf);

            var wfObjectState = workflowObject.getStateByID(state);

            var transition = wfObjectState.getTransitions().toArray()[0];

            var event = transition.getEvents().toArray()[0].getID();

            errorMessage = CC.getWorkflowInstanceByID(wf).getTaskByID(state).triggerByID(event, "CC Workflow Trigger from Main P1 Shot Request market update").getScriptMessage();
            log.info("\n triggerByID result: " + errorMessage);
        }
    });

    var currentContext = step.getCurrentContext().getID();

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

    var wf = null;
    var states = null;
    var CCPhotoStatus = CC.getValue('a_CC_Photo_Status').getSimpleValue();

    if (mkt == "US") {
        wf = "wf_CCEnrichment";
    }
    if (mkt == "CAN") {
        wf = "wf_CCEnrichmentCanada";
    }
    if (mkt == "JPN") {
        wf = "wf_CCEnrichmentJapan";
    }

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
    log.info(states + " -- ANSI" + status);
    if (states != null) {
        AutoTriggerWorkflow(wf, states, CC);
    }
}



logArray = [];

// get shared markets from the node
var sharedMarketsString = node.getValue('a_Shared_Markets').getSimpleValue();
log.info("\nshared markets are: " + sharedMarketsString);

// get the current status from the node
var shotStatus = node.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
log.info("\nshotStatus is: " + shotStatus);

// get last character of a_Shot_CC_Number
var shotCCNum = node.getValue("a_Shot_CC_Number").getValue();
log.info("\nshotCCNum is: " + shotCCNum);

// get the Shot Request CC by Market
var cc = null


if (sharedMarketsString.contains('US')) {
    var ccList = helper.getCCsFromShot(node, 'EN_US')
    log.info("IN US " + ccList);
    cc = ccList.get(0)
}
else if (sharedMarketsString.contains('CAN')) {
    var ccList = helper.getCCsFromShot(node, 'EN_CA')
    log.info("IN CA " + ccList);
    cc = ccList.get(0)
}
else if (sharedMarketsString.contains('JPN')) {
    var ccList = helper.getCCsFromShot(node, 'EN_JP')
    log.info("IN JP " + ccList);
    cc = ccList.get(0)
}
else if (sharedMarketsString.contains('SA')) {
    log.info("IN SA " + ccList);
    var ccList = helper.getCCsFromShot(node, 'EN_SA')
    cc = ccList.get(0)
}


if (cc == null) {
    // rollback creation of new shot request since there was an issue
    node.delete();
    throw "Unable to find a valid CC using the CC Number " + shotCCNum + ". Please validate the CC Number and reimport for " + shotCCNum;
}

log.info("\ncc is: " + cc);

log.info("\nsetting a_Shot_CC_Number on node to null");
node.getValue("a_Shot_CC_Number").setSimpleValue(null);

// Get the Styling Piece CCs from the node
var stylingPieceCCs = node.getValue("a_Styling_Piece_CC_Number_Import").getSimpleValue();
log.info("\nstylingPieceCCs are: " + stylingPieceCCs);

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
        log.info("\ncurrStylingPieceCCNumber is: " + currStylingPieceCCNumber);

        // get the last char of styling piece CC number
        var lastChar = currStylingPieceCCNumber.split("")[currStylingPieceCCNumber.length() - 1];
        log.info("\nlastChar is: " + lastChar);

        // get the sCC by market, and put in array
        // 2 == US, 3 == CA, 6 == JP
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
            log.info("\nadding searchCC " + searchCC + " to sCCArray");
            sCCArray.push(searchCC);
        }
    }
}

// get the styling piece instructions from the node
var stylingPieceInstr = node.getValue("a_Styling_Piece_Instructions_Import").getSimpleValue();
log.info("\nInstructions are: " + stylingPieceInstr);

if (stylingPieceInstr != null) {
    var stylingPieceInstrArray = [];

    // split styling instructions into new array (this will be used later)
    stylingPieceInstr.split(",").forEach(function (inst) {
        stylingPieceInstrArray.push(inst.trim());
    });
}

//get the CC Markets to make appropriate adjustments
var ccMarkets = cc.getValue("a_Market_Designation").getValues().toArray();
var changedAttrs = importChanges.getChanges();

// for each change, ensure appropriate lifecycle status
if (changedAttrs) {
    changedAttrs = changedAttrs.getAttributes();
}

if (ccMarkets != null) {
    // for each market check validity of Shared Market values and correct if necessary
    ccMarkets.forEach(function (mkt) {
        // current market's context value
        var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());   //US
        log.info("\nnextContext is: " + nextContext);

        step.executeInContext(nextContext, function (manager) {
            // get context specific shot
            var contextEntity = manager.getEntityHome().getEntityByID(node.getID());
            log.info("\ncontextEntity is: " + contextEntity.getID());
            var contextEntityStatus = contextEntity.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
            var contextEntityPlacement = contextEntity.getValue("a_Site_Placement").getSimpleValue();
            var contextEntityMarkets = contextEntity.getValue("a_Shared_Markets").getSimpleValue();   //US,SA
            log.info("\ncontextEntitystatus is: " + contextEntityStatus);
            // get context specific CC
            var contextCC = manager.getProductHome().getProductByID(cc.getID());   //US CC
            log.info("\ncontextCC is: " + contextCC.getID());

            if (contextCC != null) {
                // get context specific CCs status
                var contextCCStatus = contextCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
                var contextCCPhotoStatus = contextCC.getValue("a_CC_Photo_Status").getSimpleValue();
                log.info("\ncontextCCStatus is: " + contextCCStatus);
                // get context specific CCs market designation
                var contextCCMarkets = contextCC.getValue("a_Market_Designation").getSimpleValue();   //US
                log.info("\ncontextCCMarkets are: " + contextCCMarkets);
                // get current market's ID
                var marketID = mkt.getID();
                log.info("\nmarketID is: " + marketID);
                // get current market's value
                var marketValue = mkt.getValue();
                log.info("\nmarketValue is: " + marketValue);
                var contextEntityMarketsArray = node.getValue("a_Shared_Markets").getValues().toArray();
                // was shared market value removed from the Shot Request
                var marketRemoved = false;

                contextEntityMarketsArray.forEach(function (shotMkt) {

                    if (shotMkt.getValue() == mkt.getValue()) {
                        // delete market from shot if CC is in Draft
                        if (contextCCStatus == "Draft") {
                            log.info("\n -- DELETING " + mkt);
                            shotMkt.deleteCurrent();
                            marketRemoved = true;
                        }
                    }
                    // if CC doesn't contain current market then delete the market from the Shot Request
                    else if (contextCCMarkets.contains(shotMkt.getValue()) == false) {
                        var Brand = contextCC.getValue("a_Brand_Number").getSimpleValue();
                        var isRefByBomCC = checkBomRef(contextCC);
                        if ((Brand == "GO" || Brand == "BRFS") && shotMkt.getValue() == "SA" && isRefByBomCC){
                        	   continue;
                        }
                        else{
                        	   log.info("\n -- DELETING " + mkt);
                            shotMkt.deleteCurrent();
                            marketRemoved = true;
                        }
                    }
                    else if ()
                });
                // if shot doesn't contain current market then market was removed
                if (contextEntityMarkets.contains(mkt.getValue()) == false) {
                    marketRemoved = true;
                }

                // remove CC to Shot Request reference for removed markets
                if (marketRemoved == true) {
                    var contextCCRefs = contextCC.getReferences(REF_TYPE).toArray();

                    //if array isn't null
                    if (contextCCRefs.length > 0) {
                        //loop through array and check if reference already exists
                        contextCCRefs.forEach(function (ref) {
                            if (ref.getTarget().getID() == contextEntity.getID()) {
                                // fix assets
                                removeContentLink(contextCC, contextEntityPlacement, manager, nextContext);
                                log.info("\n -- DELETING reference " + mkt + " on " + contextCC.getID());
                                // delete cc reference
                                ref.delete();
                                // delete shot CC number and market from shot request
                                contextEntity.getValue("a_Shot_CC_Number").setSimpleValue(null);
                                contextEntity.getValue("a_Shot_Market_Number").setSimpleValue(null);
                            }
                        });
                    }
                }
                // if CC isn't Draft status and CC contains the current market
                else {
                    // set shot market number on the context specific shot request
                    contextEntity.getValue("a_Shot_Market_Number").setSimpleValue(marketID + " : " + marketValue);
                    log.info("\n -- Setting a_Shot_Market_Number on " + contextEntity + " to: " + marketID + " : " + marketValue);

                    // get context CC refs
                    var contextCCRefs = contextCC.getReferences(REF_TYPE).toArray();

                    var match = false;

                    //if array isn't null
                    if (contextCCRefs.length > 0) {
                        //loop through array and check if reference already exists
                        contextCCRefs.forEach(function (ref) {
                            if (ref.getTarget().getID() == contextEntity.getID()) {
                                log.info("\nreference found, setting match to TRUE");
                                match = true;
                            }
                        });
                    }

                    //if reference doesn't already exist then make one
                    if (match == false) {
                        // create reference on the CC to the shot request
                        log.info("\n -- Creating reference from " + contextCC.getID() + " to " + contextEntity.getID());
                        contextCC.createReference(contextEntity, REF_TYPE);
                        if (contextEntityPlacement == "Main P1" && contextEntityStatus == "Submitted") {
                            getWorkflowVariables(contextCC, marketValue, contextEntityStatus);
                        }
                        else if (contextEntityStatus == "Submitted") {
                            if (contextCCPhotoStatus == "Complete") {
                                contextCC.getValue('a_CC_Photo_Status').setSimpleValue("Complete: Request Submitted");
                            }
                        }
                        else if (contextEntityStatus == "Ready for Review") {
                            if (contextCCPhotoStatus == "Complete" || contextCCPhotoStatus == "Complete: Request Submitted") {
                                contextCC.getValue('a_CC_Photo_Status').setSimpleValue("Complete: Ready for Review");
                            }
                        }
                    }

                    var ccNum = contextCC.getValue("a_CC_Number").getSimpleValue();
                    log.info("\nccNum is: " + ccNum);

                    contextEntity.getValue("a_Shot_CC_Number").setValue(ccNum);
                    log.info("\n -- Setting a_Shot_CC_Number on " + contextEntity.getID() + " to " + ccNum);

                    /*
 
                        Styling Piece Section
                    
                    */
                    log.info("\n --- BEGINNING STYLING PIECE PORTION ---");
                    if (sCCArray != null && stylingPieceInstrArray != null) {
                        // for each sCC
                        for (x = 0; x < sCCArray.length; x++) {
                            // current shot CC
                            var sCC = sCCArray[x];
                            log.info("\nsCC is: " + sCC);

                            var contextsCC = manager.getProductHome().getProductByID(sCC.getID());
                            log.info("\ncontextsCC is: " + contextsCC);

                            // create reference from contextEntity to contextsCC and set current inscruction
                            log.info("\n -- Running function createShotRequestToStylingPieceCCRef for " + contextEntity.getID() + ", " + contextsCC.getID() + ", " + stylingPieceInstrArray[x]);
                            createShotRequestToStylingPieceCCRef(contextEntity, contextsCC, stylingPieceInstrArray[x]);
                        }
                    }
                }

                if (marketRemoved == false && changedAttrs.contains("a_Site_Placement") == false) {
                    if (contextEntityStatus == "Ready for Review" || contextEntityStatus == "Complete") {
                        log.info("\n -- Running library function updateContentReferencesForShotAndCC for " + contextEntity.getID() + ", " + nextContext);
                        photoLib.updateContentReferencesForShotAndCC(contextEntity, manager, nextContext, true);

                        if (contextEntityPlacement == "Main P1") {
                            getWorkflowVariables(contextCC, marketValue, contextEntityStatus);
                        }
                    }
                }
            }
        });
    });

    if (shotStatus == "Ready for Review" && changedAttrs.contains("a_Site_Placement") == false || shotStatus == "Complete" && changedAttrs.contains("a_Site_Placement") == false) {
        var time = new java.util.Date();
        var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        log.info("\n -- Setting a_main_last_modified_date on " + cc + " to " + iso.format(time));
        cc.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    }
}
//If all Shared Markets were removed, do not continue
sharedMarketsString = node.getValue('a_Shared_Markets').getSimpleValue();
log.info("\nshorMarkets are: " + sharedMarketsString);

if (sharedMarketsString == null) {
    log.info("\n -- DELETING " + node);
    node.delete();
    throw "Unable to create Shot Request as CC " + cc.getValue("a_CC_Number").getSimpleValue() + "is currently in 'Draft' status for all applicable Markets. Please enrich the CC prior to submitting Shot Requests.";
}

log.info("\n -- DELETING a_Styling_Piece_CC_Number_Import on " + node.getID());
node.getValue("a_Styling_Piece_CC_Number_Import").deleteCurrent();
log.info("\n -- DELETING a_Styling_Piece_Instructions_Import on " + node.getID());
node.getValue("a_Styling_Piece_Instructions_Import").deleteCurrent();

// update shot request method to 'Bulk'
log.info("\n -- Setting a_Shot_Request_Method on " + node.getID() + " to 'Bulk'");
node.getValue("a_Shot_Request_Method").setSimpleValue("Bulk");

// trigger shot request workflow transition

if (node.isInState("wf_ShortRequestLifeCycle", "Draft")) {
    log.info("\n -- Moving " + node.getID() + " from Draft state to Submit state in wf_ShortRequestLifeCycle");
    node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Shot Request submitted via Bulk Upload");
}
// publish modifications to existing Shot Requests on import. Only publishes when Shot has already checked for duplicates
else if (shotStatus != 'Draft' && shotStatus != null) {
    var shotPrimaryMarket = node.getValue("a_Shot_Primary_Market").getSimpleValue();
    log.info("\nshotPrimaryMarket is: " + shotPrimaryMarket);

    // if shared market has US, run US context
    if (shotPrimaryMarket == "US") {
        log.info("\n -- Queueing event to assethubqueueUS");
        assethubqueueUS.queueDerivedEvent(eventType, node);
    }
    else if (shotPrimaryMarket == "CAN") {
        log.info("\n -- Queueing event to assethubqueueCA");
        assethubqueueCA.queueDerivedEvent(eventType, node);
    }
    else if (shotPrimaryMarket == "JPN") {
        log.info("\n -- Queueing event to assethubqueueJP");
        assethubqueueJP.queueDerivedEvent(eventType, node);
    }
    else if (shotPrimaryMarket == "SA") {
        log.info("\n -- Queueing event to assethubqueueSA");
        assethubqueueSA.queueDerivedEvent(eventType, node);
    }
}
else if (!(node.isInWorkflow("wf_ShortRequestLifeCycle"))) {
    log.info("\n -- Putting " + node.getID() + " in workflow wf_ShortRequestLifeCycle");
    node.startWorkflowByID("wf_ShortRequestLifeCycle", "Shot Request workflow initiated via Bulk Upload");

    if (node.isInState("wf_ShortRequestLifeCycle", "Draft")) {
        log.info("\n -- Moving " + node.getID() + " from Draft state to Submit state in wf_ShortRequestLifeCycle");
        node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Shot Request submitted via Bulk Upload");
    }
}

// comment out the following line when not in development
//log.info(logArray);
}