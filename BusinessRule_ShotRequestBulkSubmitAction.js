/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestBulkSubmitAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ShotRequestBulkSubmitAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ShotRequestLibrary",
    "libraryAlias" : "lib"
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "shotEvent",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "BOM_CC_REF",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_BOM_CC",
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
exports.operation0 = function (node,logger,shotEvent,assethubqueueUS,assethubqueueCA,LKT,stepManager,BOM_CC_REF,CCToPhotoShotRef,lib) {
// ShotRequestBulkSubmitAction
// node: Current Object
// logger: Logger
// lib: ShotRequestLibrary
// Validity: Style, Archived_Style(?)
var step = node.getManager();
var refType = node.getManager().getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef");
var ShotRequestToStylingPieceCCRefType = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");

for (child in Iterator(node.getChildren())) {
    if (child.getObjectType().getID().equals("CustomerChoice")) {
        // aka CC
        for (ref in Iterator(child.getReferences(refType))) {
            if (ref.getTarget().getApprovalStatus().toString() == "Not in Approved workspace") {
                // add stuff here
                var entity = ref.getTarget();
                var sharedMarkets = entity.getValue('a_Shared_Markets').getValues().toArray();

                // fix shared market values based on CC
                if (sharedMarkets != null) {
                    // for each market check validity of Shared Market values and correct if necessary
                    sharedMarkets.forEach(function (mkt) {
                        // current market's context value
                        var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());

                        step.executeInContext(nextContext, function (manager) {
                            // get context specific shot
                            var contextEntity = manager.getEntityHome().getEntityByID(entity.getID());
                            // get context specific CC
                            var contextCC = manager.getProductHome().getProductByID(child.getID());

                            if (contextCC != null) {
                                // get context specific CCs status
                                var contextCCStatus = contextCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
                                // get context specific CCs market designation
                                var contextCCMarkets = contextCC.getValue("a_Market_Designation").getSimpleValue();
                                // get current market's ID
                                var marketID = mkt.getID();
                                // get current market's value
                                var marketValue = mkt.getValue();
                                // set match fale
                                var match = false;

                                // delete market from shot if CC is in Draft
                                if (contextCCStatus == "Draft" || contextCCStatus == null) {
                                    mkt.deleteCurrent();
                                }
                                // if CC doesn't contain current market then delete the market from the Shot Request
                                else if (contextCCMarkets.contains(mkt.getValue()) == false) {
                                    mkt.deleteCurrent();
                                }
                                // if CC isn't Draft status and CC contains the current market
                                else {
                                    // set shot market number on the context specific shot request
                                    contextEntity.getValue("a_Shot_Market_Number").setSimpleValue(marketID + " : " + marketValue);

                                    // get context CC refs
                                    var contextCCRefs = contextCC.getReferences(refType).toArray();

                                    //if array isn't null
                                    if (contextCCRefs.length > 0) {
                                        //loop through array and check if reference already exists
                                        contextCCRefs.forEach(function (ref) {
                                            if (ref.getTarget().getID() == contextEntity.getID()) {
                                                match = true;
                                            }
                                        });
                                    }

                                    //if reference doesn't already exist then make one
                                    if (match == false) {
                                        // create reference on the CC to the shot request
                                        contextCC.createReference(contextEntity, refType);
                                    }

                                    var ccNum = contextCC.getValue("a_CC_Number").getSimpleValue();

                                    contextEntity.getValue("a_Shot_CC_Number").setValue(ccNum);
                                }
                            }
                        });
                    });
                }

                // fetch shared markets again
                sharedMarkets = entity.getValue("a_Shared_Markets").getSimpleValue();

                if (sharedMarkets != null) {
                    // get primary market and set if null
                    var primaryMarket = entity.getValue('a_Shot_Primary_Market').getSimpleValue();

                    if (primaryMarket == null) {

                        if (sharedMarkets.contains("US")) {
                            entity.getValue("a_Shot_Primary_Market").setSimpleValue("US");
                        }
                        else if (sharedMarkets.contains("CAN")) {
                            entity.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
                        }
                        else if (sharedMarkets.contains("JPN")) {
                            entity.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
                        }
                        // changes are made as a part of PPIM-10544
                        else if (sharedMarkets.contains("SA")) {
                            entity.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
                        }
                    }
                }
                if (sharedMarkets == null) {
                    break;
                }
            }

            // portal is null here because you cannot bind a portal on this custom screen
            lib.shotRequestSubmitActionPart2(ref.getTarget(), logger, null, shotEvent, assethubqueueUS, assethubqueueCA);

            // The original BA (copied to lib now) is not valid for any object type thus is disabled here.
            //lib.br_Copy_ASLR_Shot_Request_Attrs_Action(ref.getTarget());

            var step = stepManager;
            var sReferencingCCs = new java.util.ArrayList();
            var ccID;
            var refTarget = ref.getTarget();
            var ent_ID = refTarget.getID();
            sReferencingCCs.addAll(refTarget.getReferencedByProducts());
            if (!sReferencingCCs.isEmpty()) {
                for (var num = 0; num < sReferencingCCs.size(); num++) {
                    ccID = sReferencingCCs.get(num).getSource().getID();
                }
            }
            var CC = step.getProductHome().getProductByID(ccID);
            if (CC) {
                var marketDesignationArray = CC.getValue('a_Market_Designation').getValues().toArray();
                marketDesignationArray.forEach(function (marketDesignation) {
                    var marketNumber = refTarget.getValue("a_Market_Number").getSimpleValue();
                    var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", marketDesignation.getValue());
                    stepManager.executeInContext(context, function (step) {
                        var enCurrentEntity = step.getEntityHome().getEntityByID(ent_ID);
                        var marketCode = LKT.getLookupTableValue("LKT_Context_to_MarketCode", context);
                        var value = marketCode + " : " + marketDesignation.getValue();
                        logger.info(value);
                        enCurrentEntity.getValue("a_Shot_Market_Number").setSimpleValue(value);
                    })
                })

                // PPIM-13065
                brandNumber = CC.getValue("a_Brand_Number").getSimpleValue();
                if (brandNumber == "GO" || brandNumber == "BRFS") {
                    var BOM_CC_list = CC.queryReferencedBy(BOM_CC_REF).asList(100);
                    //log.info(contextCC.getID()+" ,"+BOM_CC_list.size())
                    if (BOM_CC_list.size() > 0) {
                        BOM_CC = BOM_CC_list.get(0).getSource();
                        step.executeInContext("EN_SA", function (otherStepManager) {
                            otherNode = otherStepManager.getObjectFromOtherManager(BOM_CC);
                            SAShotCode = otherStepManager.getObjectFromOtherManager(refTarget);
                            if (checkIfShotHasToBeCopied(otherNode, SAShotCode, false)) {
                                try {
                                    otherNode.createReference(SAShotCode, "CCToPhotoShotRef");
                                    //log.info("otherNode "+otherNode.getID())
                                } catch (e) {
                                }
                                var newsharedMarket = SAShotCode.getValue("a_Shared_Markets").getSimpleValue();
                                if (newsharedMarket != null && !newsharedMarket.contains("SA")) {
                                    SAShotCode.getValue("a_Shared_Markets").addValue("SA");
                                    //log.info("heree "+otherNode.getID()+" , "+contextCC.getID())
                                }
                                var ccNum = otherNode.getValue("a_CC_Number").getSimpleValue();
                                SAShotCode.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
                                SAShotCode.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");
                            }
                        });
                    }

                }
                //PPIM-14914
                if (brandNumber == "GAP" || brandNumber == "BR") {
                    marketDesignation = CC.getValue("a_Market_Designation").getSimpleValue();
                    shared_markets = refTarget.getValue("a_Shared_Markets").getSimpleValue();
                    var currentContext1 = step.getCurrentContext().getID();
                    if (marketDesignation.contains("SA") && !shared_markets.contains("SA") && checkIfShotHasToBeCopied(CC, refTarget, true)) {
                        step.executeInContext("EN_SA", function (otherStepManager) {
                            otherNode = otherStepManager.getObjectFromOtherManager(CC);
                            SAShotCode = otherStepManager.getObjectFromOtherManager(refTarget);
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
                    if (marketDesignation.contains("SA") && shared_markets.contains("SA") && currentContext1 != "EN_SA") {
                        BOM_CC_list = CC.queryReferences(BOM_CC_REF).asList(100);
                        if (BOM_CC_list.size() > 0) {
                            checkAndremoveSAMarket(CC, refTarget);
                            //removeSAMarket();
                            // log.info(node.getValue("a_Shared_Markets").getSimpleValue())
                        }
                    }
                }
            }
        }
    }
}

function checkAndremoveSAMarket(cc, node1) {
    delete_flag = false;
    step.executeInContext("EN_US", function (otherStepManager) {
        USShotCode = otherStepManager.getObjectFromOtherManager(node1);
        USShotCode.queryReferencedBy(CCToPhotoShotRef).forEach(function (referenceInstance) {

            ref_cc_id = referenceInstance.getSource().getID();
            log.info(ref_cc_id + "," + cc.getID())
            if (ref_cc_id == cc.getID()) {
                delete_flag = true;
            }
            return true;
        });
    });
    if (!delete_flag) {
        step.executeInContext("EN_JP", function (otherStepManager) {
            JPShotCode = otherStepManager.getObjectFromOtherManager(node1);
            JPShotCode.queryReferencedBy(CCToPhotoShotRef).forEach(function (referenceInstance) {

                ref_cc_id = referenceInstance.getSource().getID();
                if (ref_cc_id == cc.getID()) {
                    delete_flag = true;
                }
                return true;
            });
        });
    }
    //  log.info("heree " + delete_flag)
    if (delete_flag) {
        stepManager.executeInContext("EN_SA", function (otherStepManager) {
            otherNode = otherStepManager.getObjectFromOtherManager(cc);
            SAShotCode = otherStepManager.getObjectFromOtherManager(node1);
            SAShotCode.queryReferencedBy(CCToPhotoShotRef).forEach(function (referenceInstance) {

                referenceInstance.delete();
            });
        });
        shared_markets = node1.getValue("a_Shared_Markets").getSimpleValue();
        split_shared_markets = shared_markets.split("<multisep/>")
        new_value = ""
        for (j = 0; j < split_shared_markets.length; j++) {
            if (split_shared_markets[j] != "SA") {
                new_value += split_shared_markets[j];
                new_value += "<multisep/>";
            }
        }
        if (new_value) {
            new_value = new_value.substring(0, new_value.length - 11)
            node1.getValue("a_Shared_Markets").setSimpleValue(new_value);
        }
    }
}

function checkIfShotHasToBeCopied(cc, shotRequest, flag) {
    var BOM_CC_list = cc.queryReferences(BOM_CC_REF).asList(100);
    if (flag) {
        if (BOM_CC_list.size() > 0) {
            return false;
        }
    }
    marketDesignation = cc.getValue("a_Market_Designation").getSimpleValue();
    shared_markets = shotRequest.getValue("a_Shared_Markets").getSimpleValue();
    if (marketDesignation.contains("US") && shared_markets.contains("US")) {
        return true;
    }
    else if (marketDesignation.contains("US") && shared_markets.contains("JPN")) {
        return false;
    }
    else if (!marketDesignation.contains("US") && !marketDesignation.contains("JPN") && marketDesignation.contains("CAN")) {
        return false;
    }
    else if (!shared_markets.contains("US") && !shared_markets.contains("JPN") && shared_markets.contains("CAN")) {
        return false;
    }
    return true;;

}

}