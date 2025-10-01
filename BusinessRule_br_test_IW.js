/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_test_IW",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "InitiateWorkflowAction_Test",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av1Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV1",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av2Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV2",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av3Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV3",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av4Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV4",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av5Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV5",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av6Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV6",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av7Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV7",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av8Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV8",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av9Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV9",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ppiRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "swatchRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Swatch",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "videoRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Video",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av10Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV10",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av11Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV11",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ccRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_BOM_CC",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "styleRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_BOM_Style",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,shotRef,av1Ref,av2Ref,av3Ref,av4Ref,av5Ref,av6Ref,av7Ref,av8Ref,av9Ref,ppiRef,swatchRef,videoRef,av10Ref,av11Ref,ccRefType,styleRefType) {
function checkStatus(currentNode, context) {
    var result = false;

    step.executeInContext(context, function (contextManager) {
        var ctxNode = contextManager.getProductHome().getProductByID(currentNode.getID());
        var objType = ctxNode.getObjectType().getID();
        if (objType == "Style") {
            var ctxLifeCycleStatus = ctxNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
            var ctxCopyStatus = ctxNode.getValue("a_Copy_Complete_Status").getSimpleValue();
            if (ctxLifeCycleStatus == "Approved" || ctxCopyStatus == "Complete") {
                result = true;
            }
        } else if (objType == "CustomerChoice") {
            var ctxLifeCycleStatus = ctxNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
            var ctxPhotoStatus = ctxNode.getValue("a_CC_Photo_Status").getSimpleValue();
            if (ctxLifeCycleStatus == "Approved" || (ctxPhotoStatus != null && ctxPhotoStatus.contains("Complete"))) {
                result = "Approved";
            } else if (ctxPhotoStatus != null && ctxPhotoStatus != "Missing Shot Requests") {
                result = "Shots";
            }
        }
    });
    return result;
}

function checkBOMRef(product) {
    // Determine which BOM reference to check based on object type
    var result = null;
    var bomRefs = null;
    if (objectType == "Style") {
        bomRefs = product.getReferences(styleRefType);
    } else if (objectType == "CustomerChoice") {
        bomRefs = product.getReferences(ccRefType);
    }
    for (var i = 0; i < bomRefs.size(); i++) {
        var ref_bom = bomRefs.get(i).getTarget();
        if (ref_bom) {
            if (checkStatus(ref_bom, "EN_US")) {
                result = ref_bom;
                break;
            }
        }
    }
    return result;
}

function deleteBOMRefIfExists(currentNode) {
    var BOMCCRefList = currentNode.getReferences(ccRefType).toArray();
    BOMCCRefList.forEach(function (ref) {
        ref.delete();
    });

    var parentStyle = currentNode.getParent();
    var StyleBOMCCRefList = parentStyle.getReferences(styleRefType).toArray();
    StyleBOMCCRefList.forEach(function (ref) {
        ref.delete();
    });
}

function CopyOverviewBullets(source, sourceCtx) {
    // Set or update Inherit Option attribute
    var inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
    if (inheritOption == null) {
        node.getValue("a_Inherit_US_Copy_Option").setSimpleValue(currentMarket);
        inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
    }
    else if (inheritOption.contains(currentMarket) == false) {
        node.getValue("a_Inherit_US_Copy_Option").addValue(currentMarket);
        inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
    }

    // Only copy if both style market designation and inherit option contain current market
    if (inheritOption != null) {
        var styleMkts = node.getValue("a_Style_Market_Designation").getSimpleValue();
        if (styleMkts.contains(currentMarket) && inheritOption.contains(currentMarket)) {
            step.executeInContext(sourceCtx, function (contextManager) {
                var currentProduct = contextManager.getProductHome().getProductByID(source.getID());
                var attributeGroup = contextManager.getAttributeGroupHome().getAttributeGroupByID("ag_English_Replication_Attributes");
                var attributeList = attributeGroup.getAttributes().toArray();

                for (var y = 0; y < attributeList.length; y++) {
                    var enAttributeValue = currentProduct.getValue(attributeList[y].getID()).getSimpleValue();

                    step.executeInContext(currentContext, function (otherContextManager) {
                        var otherCurrentProduct = otherContextManager.getProductHome().getProductByID(node.getID());
                        otherCurrentProduct.getValue(attributeList[y].getID()).setSimpleValue(enAttributeValue);
                    });
                }
            });
        }
    }
}

function CopyShots(source, sourceCtx) {
    var sourceMkt = LKT.getLookupTableValue("LKT_Context_to_Market", sourceCtx);
    step.executeInContext(sourceCtx, function (contextManager) {
        var currentProduct = contextManager.getProductHome().getProductByID(source.getID());

        var refs = new java.util.ArrayList();
        refs.addAll(currentProduct.getReferences(shotRef));
        for (var i = 0; i < refs.size(); i++) {
            var shot = refs.get(i).getTarget();

            if (shot.getValue("a_Shot_Request_Method").getSimpleValue() == "ASLR" && sourceCtx == "EN_US") {
                if (currentProduct.isInWorkflow("wf_CCEnrichment")) {
                    currentProduct.getWorkflowInstanceByID("wf_CCEnrichment").setSimpleVariable("NonUSASLRCodeAlreadyTriggeredFlag", "true");
                }
            }

            var shared = shot.getValue("a_Shared_Markets").getSimpleValue();
            var isSharedWithSource = (shared != null && shared.contains(sourceMkt));
            var isCurrentMarketUnshared = !shared.contains(currentMarket);
            var isSAWithDifferentCC = (currentMarket == "SA" && node.getID() != source.getID()); //BOMCC Case- One US CC can be referenced by multiple SA CCs

            // Only copy if current market not already in shared markets
            if (isSharedWithSource && (isCurrentMarketUnshared || isSAWithDifferentCC)) {
                if (isCurrentMarketUnshared) {
                    shot.getValue("a_Shared_Markets").addValue(currentMarket);
                    shot.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");
                }

                try {
                    node.createReference(shot, shotRef);
                }
                catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
                        log.info("Shot Request Link already exists for " + node.getID());
                    }
                }

                var ccNum = node.getValue("a_CC_Number").getSimpleValue();
                if (ccNum != null) {
                    step.executeInContext(currentContext, function (otherContextManager) {
                        var otherEntity = otherContextManager.getEntityHome().getEntityByID(shot.getID());
                        var shotCCNum = otherEntity.getValue("a_Shot_CC_Number").getSimpleValue();
                        if (shotCCNum == null) {
                            otherEntity.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
                        }
                    });
                }

                // Copy over all image references
                var imgRef = [av1Ref, av2Ref, av3Ref, av4Ref, av5Ref, av6Ref, av7Ref, av8Ref, av9Ref, av10Ref, av11Ref, ppiRef, swatchRef, videoRef];
                for (var j = 0; j < 14; j++) {
                    var refImg = new java.util.ArrayList();
                    refImg.addAll(currentProduct.getReferences(imgRef[j]));
                    for (var k = 0; k < refImg.size(); k++) {
                        var imgAsset = refImg.get(k).getTarget();
                        try {
                            node.createReference(imgAsset, imgRef[j]);
                        }
                        catch (e) {
                            if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
                                log.info("Asset Link already exists for " + node.getID());
                            }
                        }
                    }
                }
            }
        }
    });
}

function AutoTriggerWorkflow(wfID, wfStates, wfNode) {
    var errorMessage = null;

    wfStates.forEach(function (state) {
        // make sure node is in the current state
        var isInState = wfNode.isInState(wfID, state);
        if (isInState) {
            var workflowObject = step.getWorkflowHome().getWorkflowByID(wfID);
            var wfObjectState = workflowObject.getStateByID(state);
            var transition = wfObjectState.getTransitions().toArray()[0];
            var event = transition.getEvents().toArray()[0].getID();

            // trigger node in workflow event
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

function getWorkflowVariables(wfNode) {
    var StyleStates = new Array("NewStyleEnrichState1");
    var CCStates = new Array("NewCCEnrichState1");
    var SKUStates = new Array("NewSKUEnrich1", "NewSKUEnrich2");

    var objectType = wfNode.getObjectType().getID();
    var stepLifeStatus = null;
    var endDate = null;
    var wf = null;

    if (objectType == "Style") {
        stepLifeStatus = wfNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
        endDate = wfNode.getValue("a_Style_End_Date").getSimpleValue();
        wf = LKT.getLookupTableValue("LKT_Context_to_Style_Enrich_Workflows", currentContext);
        var states = StyleStates;
    }
    if (objectType == "CustomerChoice") {
        stepLifeStatus = wfNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
        endDate = wfNode.getValue("a_CC_End_Date").getSimpleValue();
        wf = LKT.getLookupTableValue("LKT_Context_to_CC_Enrich_Workflows", currentContext);
        var states = CCStates;
    }
    if (objectType == "SKU") {
        stepLifeStatus = wfNode.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
        endDate = wfNode.getValue("a_SKU_End_Date").getSimpleValue();
        wf = LKT.getLookupTableValue("LKT_Context_to_SKU_Enrich_Workflows", currentContext);
        var states = SKUStates;
    }

    //get today's date
    var today = new Date().toISOString().split('T')[0];

    if (!endDate) {
        const timestamp = Date.parse("12/31/9999");
        endDate = new Date(timestamp).toISOString().split('T')[0];
    }

    if (stepLifeStatus != "Approved" && stepLifeStatus != "Purged") {
        if (!wfNode.isInWorkflow(wf)) {
            wfNode.startWorkflowByID(wf, objectType + " " + currentMarket + " Workflow Initiation from CC Market Update");
        }
        AutoTriggerWorkflow(wf, states, wfNode);
    }
}



var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);

if (currentContext != "FR_CA" && currentContext != "JA_JP") {
    var objectType = node.getObjectType().getID();
    var parentStyle = null;
    var parentCC = null;

    if (objectType == "Style") {
        //set style market designation
        var styleMktDsg = node.getValue("a_Style_Market_Designation").getSimpleValue();
        if (styleMktDsg == null) {
            node.getValue("a_Style_Market_Designation").setSimpleValue(currentMarket);
            styleMktDsg = node.getValue("a_Style_Market_Designation").getSimpleValue();

            if (currentMarket == "SA") {
                var BOMUSNode = checkBOMRef(node);
                if (BOMUSNode != null && !checkStatus(node, "EN_SA")) {
                    CopyOverviewBullets(BOMUSNode, "EN_US");
                }
            }
        }
        else if (styleMktDsg.contains(currentMarket) == false) {
            node.getValue("a_Style_Market_Designation").addValue(currentMarket);
            styleMktDsg = node.getValue("a_Style_Market_Designation").getSimpleValue();

            if (currentMarket == "SA") {
                var BOMUSNode = checkBOMRef(node);
                if (BOMUSNode != null && !checkStatus(node, "EN_SA")) {
                    CopyOverviewBullets(BOMUSNode, "EN_US");
                }
                else {
                    if (styleMktDsg.contains("US") && !checkStatus(node, "EN_SA") && checkStatus(node, "EN_US")) {
                        CopyOverviewBullets(node, "EN_US");
                    } else if (styleMktDsg.contains("JPN") && !checkStatus(node, "EN_SA") && checkStatus(node, "EN_JP")) {
                        CopyOverviewBullets(node, "EN_JP");
                    }
                }
            }
            else {
                if (currentMarket != "US" && styleMktDsg.contains("US")) {
                    CopyOverviewBullets(node, "EN_US");
                }
                else if (currentMarket == "US") {
                    var inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
                    styleMktDsg = node.getValue("a_Style_Market_Designation").getSimpleValue();
                    var marketsArray = [];
                    marketsArray = styleMktDsg.split("<multisep/>");
                    marketsArray.forEach(function (mkt) {
                        if (mkt != "US") {
                            var otherCtxt = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
                            step.executeInContext(otherCtxt, function (otherManager) {
                                var otherCtxtNode = otherManager.getProductHome().getProductByID(node.getID());
                                var copyStatus = otherCtxtNode.getValue("a_Copy_Complete_Status").getSimpleValue();
                                var lifeCycleStatus = otherCtxtNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                if ((copyStatus == "In Progress" || copyStatus == "Complete") && lifeCycleStatus != "Approved") {
                                    if (inheritOption == null) {
                                        node.getValue("a_Inherit_US_Copy_Option").setSimpleValue(mkt);
                                    }
                                    else if (inheritOption.contains(mkt) == false) {
                                        node.getValue("a_Inherit_US_Copy_Option").addValue(mkt);
                                    }
                                    inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
                                }
                            });
                        }
                    });
                }
            }
        }

        //Get Workflow Variables and Auto-Trigger the Style
        getWorkflowVariables(node);
    }
    if (objectType == "CustomerChoice") {
        var aclMarket = node.getValue("a_ACL_Market_Designation").getSimpleValue();
        var mktDsg = node.getValue("a_Market_Designation").getSimpleValue();
        if (aclMarket == currentMarket) {
            if (currentMarket == "SA") {
                var BOMUSNode = checkBOMRef(node);
                if (BOMUSNode != null && (checkStatus(node, "EN_SA") != "Approved") && (checkStatus(BOMUSNode, "EN_US") == "Approved")) {
                    CopyShots(BOMUSNode, "EN_US");
                }
                else if (mktDsg != null && mktDsg.contains("US") && (checkStatus(node, "EN_SA") != "Approved") && (checkStatus(node, "EN_US") == "Approved")) {
                    CopyShots(node, "EN_US");
                    deleteBOMRefIfExists(node);
                }
                else if (mktDsg != null && mktDsg.contains("JPN") && (checkStatus(node, "EN_SA") != "Approved") && (checkStatus(node, "EN_JP") == "Approved")) {
                    CopyShots(node, "EN_JP");
                    deleteBOMRefIfExists(node);
                }
                else {
                    if (BOMUSNode != null && (checkStatus(node, "EN_SA") != "Approved") && (checkStatus(BOMUSNode, "EN_US") == "Shots")) {
                        CopyShots(BOMUSNode, "EN_US");
                    }
                    else if (mktDsg != null && mktDsg.contains("US") && (checkStatus(node, "EN_SA") != "Approved") && (checkStatus(node, "EN_US") == "Shots")) {
                        CopyShots(node, "EN_US");
                        deleteBOMRefIfExists(node);
                    }
                    else if (mktDsg != null && mktDsg.contains("JPN") && (checkStatus(node, "EN_SA") != "Approved") && (checkStatus(node, "EN_JP") == "Shots")) {
                        CopyShots(node, "EN_JP");
                        deleteBOMRefIfExists(node);
                    }
                }
            } else if (currentMarket != "US") {
                if (mktDsg != null && mktDsg.contains("US")) {
                    CopyShots(node, "EN_US");
                }
            }
        }

        //Get the parent Style for the CC
        parentStyle = node.getParent();
        //Get Workflow Variables and Auto-Trigger the CC
        getWorkflowVariables(node);
        //Get Workflow Variables and Auto-Trigger the parent Style
        getWorkflowVariables(parentStyle);
    }
    if (objectType == "SKU") {
        //Get the parent Style for the SKU
        parentStyle = node.getParent().getParent();
        //Get the parent CC for the SKU
        parentCC = node.getParent();
        //Get Workflow Variables and Auto-Trigger the SKU
        getWorkflowVariables(node);
        //Get Workflow Variables and Auto-Trigger the parent CC
        getWorkflowVariables(parentCC);
        //Get Workflow Variables and Auto-Trigger the parent Style
        getWorkflowVariables(parentStyle);
    }
}
}