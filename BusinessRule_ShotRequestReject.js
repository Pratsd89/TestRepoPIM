/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestReject",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ShotRequestReject",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
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
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "rejReason",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Shot_Request_Rejection_Reason</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">Rejection Reason</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "rejComment",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Shot_Request_Rejection_Comments</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">Rejection Comments</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "PrimaryProductImage",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestPrimaryImageRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestPrimaryImageRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestToExternalAsset",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToExternalAsset",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,webUI,rejReason,rejComment,node,shotRef,LKT,PrimaryProductImage,ShotRequestPrimaryImageRef,ShotRequestToExternalAsset,photoLib) {
function arraysEqual(shot1, shot2) {
    const regex = /(CAN|US|SA|JPN)/g;

    const getSortedMarkets = str =>
        (str.match(regex) || []).sort().join(',');

    return getSortedMarkets(shot1) === getSortedMarkets(shot2);
}


function checkCCPrimaryAsset(context) {
    var flag = false;
    step.executeInContext(context, function (otherContextManager) {
        var otherCC = otherContextManager.getObjectFromOtherManager(node);
        var ccPrimaryImages = otherCC.getReferences(PrimaryProductImage).toArray();
        if (ccPrimaryImages.length > 0) {
            var ccPrimaryImage = ccPrimaryImages[0].getTarget();

            // Check against external assets
            var currentShotExternalImages = currSelected.getReferences(ShotRequestToExternalAsset).toArray();
            if (currentShotExternalImages.length > 0) {
                for (var i = 0; i < currentShotExternalImages.length; i++) {
                    var currentShotExternalImage = currentShotExternalImages[i].getTarget();
                    if (currentShotExternalImage && currentShotExternalImage.getValue("a_Content_Type_ID").getSimpleValue() == "216") {
                        if (ccPrimaryImage && (ccPrimaryImage.getID() == currentShotExternalImage.getID())) {
                            flag = true;
                        }
                    }
                }
            }
        }
    });
    return flag;
}

function assign(content, Markets) {
    var contentType = content.getValue("a_Content_Type_ID").getSimpleValue();
    Markets.forEach(function (mkt) {
        var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());
        if (checkCCPrimaryAsset(context)) {
            if (contentType == "216") {
                photoLib.createContentLink(node, content, "PrimaryProductImage", step, context);
            } else if (contentType == "12") {
                photoLib.createContentLink(node, content, "Swatch", step, context);
            } else if (contentType == "275") {
                photoLib.createContentLink(node, content, "VirtualMerchImage", step, context);
            }
        }
    });
}

function checkCCDeactivation(sourceCC, markets, ccDeactivationDateFlag, brand) {
    markets.forEach(function (mkt) {
        var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());
        step.executeInContext(context, function (otherContextManager) {
            var otherCC = otherContextManager.getObjectFromOtherManager(sourceCC);
            var ccDeactivationDate = otherCC.getValue('a_CC_End_Date').getSimpleValue();
            var ccLcs = otherCC.getValue('a_CC_Life_Cycle_Status').getSimpleValue();

            if (ccLcs != "Draft" && ccLcs != "Purged" && ccDeactivationDateFlag) {
                if (ccDeactivationDate != null) {
                    var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    var simpleDateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");
                    var now = java.time.ZonedDateTime.now();
                    var current = now.format(formatter);
                    ccDeactivationDate = simpleDateFormat.parse(ccDeactivationDate);
                    current = simpleDateFormat.parse(current);
                    ccDeactivationDateFlag = current.after(ccDeactivationDate) || current.compareTo(ccDeactivationDate) == 0;
                } else {
                    if ((brand == "BRFS") || checkCCPrimaryAsset(context)) {
                        ccDeactivationDateFlag = false;
                    }
                }
            }
        });
    });
    return ccDeactivationDateFlag;
}

function showError(message, currSelected) {
    if (rejReason != null) {
        currSelected.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
    }
    if (rejComment != null) {
        currSelected.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
    }
    webUI.showAlert("ERROR", message);
}

function calcMainP1s(Markets, currSelected, brand) {
    var completedMainP1s = [];
    var objectType = node.getObjectType().getID();

    if (objectType == "CustomerChoice") {
        var currShotStatus = currSelected.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
        var refs = new java.util.ArrayList();
        refs.addAll(node.getReferences(shotRef));

        var currSelectedID = currSelected.getID();
        var currShotStatusComplete = (currShotStatus == "Complete");
        var currShotStatusReadyForReview = (currShotStatus == "Ready for Review");

        for (var i = 0; i < refs.size(); i++) {
            var shot = refs.get(i).getTarget();
            var shotID = shot.getID();
            var shotStat = shot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
            var shotSite = shot.getValue("a_Site_Placement").getSimpleValue();
            var shotMarket = shot.getValue("a_Shared_Markets").getSimpleValue();



            if ((brand != "BRFS") && ((currShotStatusComplete && shotStat == "Complete") || (currShotStatusReadyForReview && (shotStat == "Complete" || shotStat == "Ready for Review")))) {
                if (currSelectedID != shotID && shotSite == "Main P1" && arraysEqual(shotMarket, Markets)) {
                    completedMainP1s.push(parseInt(shot.getID().slice(3), 10));
                }
            }
            if ((brand == "BRFS") && (currShotStatusComplete && shotStat == "Complete")) {
                if (currSelectedID != shotID && shotSite == "Main P1" && arraysEqual(shotMarket, Markets)) {
                    completedMainP1s.push(parseInt(shot.getID().slice(3), 10));
                }
            }
        }

        if (completedMainP1s.length == 0) {
            return false;
        }

        // Sort and pick the last shot to get next recent shot
        completedMainP1s.sort((a, b) => a - b);
        var finalShot = step.getEntityHome().getEntityByID("SR-" + completedMainP1s[completedMainP1s.length - 1]);
        var marketsArray = finalShot.getValue("a_Shared_Markets").getValues().toArray();
        var references = finalShot.getReferences().asList();

        //Reassign assets based on new MainP1
        for (var j = 0; j < references.size(); j++) {
            var referenceTypeID = references.get(j).getReferenceType().getID();
            if (referenceTypeID == 'ShotRequestToExternalAsset') {
                var content = references.get(j).getTarget();
                assign(content, marketsArray);
            }
        }

        // Update photo status if necessary
        if (currShotStatusReadyForReview) {
            marketsArray.forEach(function (mkt) {
                var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());
                step.executeInContext(context, function (otherContextManager) {
                    var otherCC = otherContextManager.getObjectFromOtherManager(node);
                    var ccPhotoStatus = otherCC.getValue("a_CC_Photo_Status").getSimpleValue();
                    if (ccPhotoStatus == "Complete: Ready for Review") {
                        otherCC.getValue('a_CC_Photo_Status').setSimpleValue("Complete");
                    }
                });
            });
        }
    }
    return true;
}

function rejectionValidation(currSelected, stat, rejReason, rejComment) {
    if (currSelected.getWorkflowInstanceByID("wf_ShortRequestLifeCycle") == null && stat == "Complete") {
        currSelected.startWorkflowByID("wf_ShortRequestLifeCycle", 'Initiating Shot Request Workflow Based on Rejection');
    } else if (currSelected.isInState("wf_ShortRequestLifeCycle", "Approved") && stat == "Complete") {
        step.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome).getBusinessActionByID("br_ShotRequestWorkflowCorrection").execute(currSelected);
        currSelected.startWorkflowByID("wf_ShortRequestLifeCycle", 'Initiating Shot Request Workflow Based on Rejection');
    } else if (!currSelected.isInState("wf_ShortRequestLifeCycle", "Ready_to_Review") && !stat == "Ready for Review") {
        showError("WF state error. Please contact the dev team.", currSelected);
    }
    reject(stat, rejReason, rejComment);
}

function reject(stat, rejReason, rejComment) {
    var setValue = true;
    var tagArray = [];

    tagArray.forEach(function (ValID) {
        var lov = step.getAttributeHome().getAttributeByID("a_Shot_Request_Rejection_Reason").getListOfValues();
        var valueToSet = lov.getListOfValuesValueByID(ValID).getValue();
        if (setValue) {
            setValue = false;
            currSelected.getValue("a_Shot_Request_Rejection_Reason").setSimpleValue(valueToSet);
        } else {
            currSelected.getValue("a_Shot_Request_Rejection_Reason").addLOVValueByID(ValID);
        }
    });

    currSelected.getValue("a_Shot_Request_Rejection_Comments").setSimpleValue(rejComment);

    var workflow = currSelected.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
    if (stat == "Ready for Review") {
        workflow.getTaskByID("Ready_to_Review").triggerByID("Reject", "Web UI Based Shot Request Rejection");
    } else if (stat == "Complete") {
        workflow.getTaskByID("Draft").triggerByID("Auto_Submit_Rejection", "Web UI Based Shot Request Rejection");
    }
    webUI.showAlert("SUCCESS", "Shot request successfully rejected.");
}



var selectedIter = webUI.getSelection().iterator();
while (selectedIter.hasNext()) {
    var currSelected = selectedIter.next();
    var stat = currSelected.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
    var site = currSelected.getValue("a_Site_Placement").getID();
    var markets = currSelected.getValue("a_Shared_Markets").getValues().toArray();
    var brand = node.getValue("a_Brand_Number").getSimpleValue();

    if (!rejReason || !rejComment) {
        showError("Rejection reason and comments are mandatory for rejection.", currSelected);
    }
    else if (stat != "Ready for Review" && stat != "Complete") {
        showError("Rejection is only allowed if the shot status is 'Ready for Review' or 'Complete'.", currSelected);
    }
    else if (site != 5) {
        rejectionValidation(currSelected, stat, rejReason, rejComment);
    }
    else if (site == 5 && stat == "Ready for Review" && brand == "BRFS") {
        showError("Rejecting a Ready for Review shot is not allowed in BRFS", currSelected);
    } else {
        var completedMainP1s = calcMainP1s(currSelected.getValue("a_Shared_Markets").getSimpleValue(), currSelected, brand);
        var ccDeactivationDateFlag = true;
        var referencedBy = currSelected.getReferencedBy().toArray();
        for (var j = 0; j < referencedBy.length; j++) {
            var referenceTypeID = referencedBy[j].getReferenceType().getID();
            if (referenceTypeID == 'CCToPhotoShotRef') {
                var sourceCC = referencedBy[j].getSource();
                ccDeactivationDateFlag = checkCCDeactivation(sourceCC, markets, true, brand);
            }
        }

        if (ccDeactivationDateFlag || completedMainP1s) {
            rejectionValidation(currSelected, stat, rejReason, rejComment);
        } else {
            showError("This is the only Main P1 of this CC for its markets as of now. Either approve another Main P1 with the same markets or Deactivate the CC in all applicable markets.", currSelected);
        }
    }
}

}