/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "lib_PhotoShot",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Photo Shot Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
// check approval status of Main P1 in specific context
function checkApprovedMainP1InContext(cc, step, contextID) {
    return step.executeInContext(contextID, function (otherContextManager) {
        var CCToPhotoShotRef = step.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef");
        var otherCC = otherContextManager.getProductHome().getProductByID(cc.getID());
        var allPhotoShotReferences = otherCC.getReferences(CCToPhotoShotRef).toArray();
        for (var k = 0; k < allPhotoShotReferences.length; k++) {
            var shotReq = allPhotoShotReferences[k].getTarget();
            if (shotReq.getValue('a_Site_Placement').getLOVValue() != null) {
                var placementValue = shotReq.getValue('a_Site_Placement').getLOVValue().getID();
                // check if shot placement is 5
                if (placementValue == "5") {
                    var shotRequestApprovalStatus = shotReq.getApprovalStatus().name();
                    if (shotRequestApprovalStatus != "NotInApproved") {
                        return true;
                    }
                }
            }
        }
        // Approved Main P1 not found so return false
        return false;
    });

}

//check if CC has approved Main P1
function checkApprovedMainP1ForCC(cc, step, lookupTable) {
    var markets = cc.getValue("a_Market_Designation").getSimpleValue();

    var condition = false;

    var marketsArray = [];

    if (markets.contains(";")) {
        markets.split(";").forEach(function (mkt) {
            marketsArray.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", mkt));
        });
    }
    else if (markets.contains("<multisep/>")) {
        markets.split("<multisep/>").forEach(function (mkt) {
            marketsArray.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", mkt));
        });
    }

    marketsArray.forEach(function (mkt) {
        if (condition == false) {
            condition = checkApprovedMainP1InContext(cc, step, mkt);  
        }
    });

    return condition;
}

//function to trigger ASLR
function createUSShotRequestForASLR(cc, step, shotCode, shotType, sitePlacement) {
    //Change for delta load

    var PhotoShotObject = step.getObjectTypeHome().getObjectTypeByID("ProductShotRequest");
    var PhotoShotRoot = step.getEntityHome().getEntityByID("126402");
    var marketCode = cc.getValue('a_Market_Designation').getSimpleValue();
    var photoShot = PhotoShotRoot.createEntity("", PhotoShotObject);
    var CCToPhotoShotRef = step.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef");

    var lastModifiedUser = photoShot.getRevision().getUserID();
    if (lastModifiedUser.toUpperCase() != "STIBOCATALOGSYNCUSER") {
        photoShot.getValue("a_Shot_Code").setSimpleValue(shotCode);
        photoShot.getValue("a_Shot_Type").setSimpleValue(shotType);
        photoShot.getValue("a_Site_Placement").setSimpleValue(sitePlacement);
        photoShot.getValue("a_Shared_Markets").setSimpleValue(marketCode);
        photoShot.getValue("a_Old_Shot_Code").setSimpleValue(shotCode);
        photoShot.getValue("a_Old_Shot_Type").setSimpleValue(shotType);
        photoShot.getValue("a_Old_Site_Placement").setSimpleValue(sitePlacement);
        photoShot.getValue("a_Old_Shared_Markets").setSimpleValue(marketCode);
        photoShot.getValue("a_Shot_Request_Method").setSimpleValue("ASLR");
        step.executeInContext("EN_US", function (enContextManager) {
            var otherCC = enContextManager.getProductHome().getProductByID(cc.getID());
            var ccNum = otherCC.getValue("a_CC_Number").getSimpleValue();
            var otherShot = enContextManager.getEntityHome().getEntityByID(photoShot.getID());
            addReference(otherCC, otherShot, CCToPhotoShotRef);
            otherShot.getValue('a_Shot_CC_Number').setSimpleValue(ccNum);
        });

        if (photoShot.isInState("wf_ShortRequestLifeCycle", "Draft")) {
            var task = photoShot.getTaskByID("wf_ShortRequestLifeCycle", "Draft");
            task.triggerByID("Submit", "Auto-submit from ASLR business rule");
        }
    }
}
//trigger ASLR for US market
function triggerASLRUSMarket(cc, step) {
    var marketCode = cc.getValue('a_Market_Designation').getSimpleValue();
    var sortOrder = cc.getValue('a_CC_Sort_Order').getSimpleValue();
    var ASLRDataContainers;
    var subClass = cc.getParent().getParent();

    ASLRDataContainers = subClass.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
    if (marketCode != null) {
        if (marketCode.indexOf("US") > 0) {

            //if the CC is the first CC of the style
            if (sortOrder == "999") {
                if (ASLRDataContainers != null) {
                    for (var n = 0; n < ASLRDataContainers.length; n++) {
                        var dataContainerObject = ASLRDataContainers[n].getDataContainerObject();
                        var shotCode = dataContainerObject.getValue("a_Shot_Code").getSimpleValue();
                        var shotType = dataContainerObject.getValue("a_Shot_Type").getSimpleValue();
                        var sitePlacement = dataContainerObject.getValue("a_ASLR_Site_Placement").getSimpleValue();
                        createUSShotRequestForASLR(cc, step, shotCode, shotType, sitePlacement);
                    }
                }

            }
            //if not then create it only for siteplacement value 5
            else {
                if (ASLRDataContainers != null) {
                    for (var n = 0; n < ASLRDataContainers.length; n++) {
                        var dataContainerObject = ASLRDataContainers[n].getDataContainerObject();
                        var shotCode = dataContainerObject.getValue("a_Shot_Code").getSimpleValue();
                        var shotType = dataContainerObject.getValue("a_Shot_Type").getSimpleValue();
                        var sitePlacement = dataContainerObject.getValue("a_ASLR_Site_Placement").getSimpleValue();
                        if (sitePlacement == "Main P1") {
                            createUSShotRequestForASLR(cc, step, shotCode, shotType, sitePlacement);
                        }

                    }
                }
            }
        }
    }

}
//trigger ASLR for Non US market
/* PPIM-9164 Deprecated Function
function triggerASLRNonUSMarket(cc, step) {
    var CCToPhotoShotRef = step.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef");
    var shotRequestToExternalAsset = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToExternalAsset");

    var marketCode = cc.getValue("a_Market_Designation").getSimpleValue();
    var shotRequestReferences;
    step.executeInContext("EN_US", function (enContextManager) {
        var enNode = enContextManager.getProductHome().getProductByID(cc.getID());
        shotRequestReferences = enNode.getReferences(CCToPhotoShotRef).toArray();
        for (var i = 0; i < shotRequestReferences.length; i++) {
            var shotRequest = shotRequestReferences[i].getTarget();
            var shotRequestMethod = shotRequest.getValue("a_Shot_Request_Method").getSimpleValue();
            var shotRequestLifeCycleStatus = shotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
            if (shotRequestMethod == "ASLR" && shotRequestLifeCycleStatus == "Submitted") {
                step.executeInContext("EN_CA", function (caContextManager) {
                    var caShotRequest = caContextManager.getEntityHome().getEntityByID(shotRequest.getID());
                    var caNode = caContextManager.getProductHome().getProductByID(cc.getID());
                    addReference(caNode, caShotRequest, CCToPhotoShotRef);
                    caShotRequest.getValue('a_Shot_CC_Number').setSimpleValue(caNode.getValue("a_CC_Number").getSimpleValue());
                    caShotRequest.getValue('a_Shared_Markets').setSimpleValue(marketCode);
                });
            } else if (shotRequestMethod == 'ASLR' && (shotRequestLifeCycleStatus == 'Ready for Review' || shotRequestLifeCycleStatus == 'Complete' || shotRequestLifeCycleStatus == 'Approved')) {
                step.executeInContext('EN_CA', function (caContextManager) {
                    var caShotRequest = caContextManager.getEntityHome().getEntityByID(shotRequest.getID());
                    var caNode = caContextManager.getProductHome().getProductByID(cc.getID());
                    addReference(caNode, caShotRequest, CCToPhotoShotRef);
                    caShotRequest.getValue('a_Shot_CC_Number').setSimpleValue(caNode.getValue("a_CC_Number").getSimpleValue());
                    caShotRequest.getValue('a_Shared_Markets').setSimpleValue(marketCode);
                });
                var externalAssetRef = shotRequest.getReferences(shotRequestToExternalAsset).toArray();
                if (externalAssetRef.length != 0) {
                    for (var k = 0; k < externalAssetRef.length; k++) {
                        var externalAsset = externalAssetRef[k].getTarget();
                        externalAssetToCCRef = externalAsset.getReferencedBy().toArray();
                        if (externalAssetToCCRef.length != 0) {
                            for (var n = 0; n < externalAssetToCCRef.length; n++) {
                                var CC = externalAssetToCCRef[n].getSource();
                                var sourceId = externalAssetToCCRef[n].getSource().getID();
                                var referenceType = externalAssetToCCRef[n].getReferenceType();
                                //for cc
                                if (sourceId == enNode.getID()) {
                                    step.executeInContext('EN_CA', function (caContextManager) {
                                        var caExternalAsset = caContextManager.getAssetHome().getAssetByID(externalAsset.getID());
                                        var caNode = caContextManager.getProductHome().getProductByID(cc.getID());
                                        addReference(caNode, caExternalAsset, referenceType);
                                    });
                                }

                                //for style
                                if (sourceId == enNode.getParent().getID()) {
                                    step.executeInContext('EN_CA', function (caContextManager) {
                                        var caExternalAsset = caContextManager.getAssetHome().getAssetByID(externalAsset.getID());
                                        var caNode = caContextManager.getProductHome().getProductByID(cc.getParent().getID());
                                        addReference(caNode, caExternalAsset, referenceType);
                                    });
                                }
                            }
                        }
                    }
                }

            }
        }
    });

    if (cc.isInWorkflow("wf_CCEnrichment")) {
        cc.getWorkflowInstanceByID("wf_CCEnrichment").setSimpleVariable('NonUSASLRCodeAlreadyTriggeredFlag', 'true');
    }
} */

// create cc to shot link 
function addReference(fromNode, toNode, referenceTypeID) {
    try {
        fromNode.createReference(toNode, referenceTypeID);
    } catch (e) {
        if (e instanceof com.stibo.core.domain.LinkTypeNotValidException)
            throw e;
    }
}

// function to add a reference
function removeContentLink(source, target, refType, manager, contextID) {
    var RefTypeStringArray = new Array("AV1", "AV2", "AV3", "AV4", "AV5", "AV6", "AV7", "AV8", "AV9", "AV10", "AV11");
    // fix refTyp for AV9 Video & Main P1
    if (refType == "AV9 Video") {
        refType = "AV9";
    }

    RefTypeStringArray.forEach(function (arrayType) {
        var currentType = arrayType;

        if (currentType != refType) {
            manager.executeInContext(contextID, function (otherManager) {
                var targetNode = otherManager.getObjectFromOtherManager(target);
                var sourceNode = otherManager.getObjectFromOtherManager(source);
                var refs = sourceNode.getReferences(manager.getReferenceTypeHome().getReferenceTypeByID(currentType));
                // if source object has the reference populated and is pointing to different asset, delete it
                for (var i = 0; i < refs.size(); i++) {
                    var refToDelete = refs.get(i);
                    if (refToDelete.getTarget().getID() == targetNode.getID()) {
                        refToDelete.delete();
                    }
                }
            });
        }
    });
}

// function to add a reference
function createContentLink(source, target, refType, manager, contextID) {
    return manager.executeInContext(contextID, function (otherManager) {
        // fix refTyp for AV9 Video & Main P1
        if (refType == "AV9 Video") {
            refType = "AV9";
        }
        var createLink = true;
        var targetNode = otherManager.getObjectFromOtherManager(target);
        var sourceNode = otherManager.getObjectFromOtherManager(source);
        var refs = sourceNode.getReferences(manager.getReferenceTypeHome().getReferenceTypeByID(refType));
        // if source object has the reference populated and is pointing to different asset, delete it
        for (var i = 0; i < refs.size(); i++) {
            var refToDelete = refs.get(i);
            if (refToDelete.getTarget().getID() == targetNode.getID()) {
                // link exists already so no need to rebuild
                createLink = false;
            } else {
                refToDelete.delete();
            }
        }
        // at this point both source and target should not have a reference for the given ref type so build the link if needed
        if (createLink)
            sourceNode.createReference(targetNode, refType);

        return createLink;
    });
}

function getVirtualMerchImageContent(contentList) {

    for (i = 0; i < contentList.size(); i++) {
        var content = contentList.get(i);
        var contentType = content.getValue("a_Content_Type_ID").getSimpleValue();
        if (contentType == "275") {
            return content;
        }
    }
    return "";
}

// function that executes in given context and builds the references
function updateContentReferencesForShotAndCC(shot, manager, contextID, shotApproved) {
    // if shotApproved is true, we need to apporve the shot request and CC and Style if they were previously approved.
    manager.executeInContext(contextID, function (otherManager) {
        var otherNode = otherManager.getObjectFromOtherManager(shot);
        //get Content reference
        var contentList = new java.util.ArrayList();
        // get CC
        var ccList = new java.util.ArrayList();
        var refByList = otherNode.getReferencedByProducts();
        if (refByList != null) {
            var refByListIterator = refByList.iterator();
            while (refByListIterator.hasNext()) {
                var ref = refByListIterator.next();
                if (ref.getReferenceTypeString() == "CCToPhotoShotRef") {
                    ccList.add(ref.getSource());
                }

            }

            var references = shot.getReferences().asList().toArray();
            for (var j = 0; j < references.length; j++) {
                var referenceTypeID = references[j].getReferenceType().getID();
                if (referenceTypeID == 'ShotRequestToExternalAsset') {
                    contentList.add(references[j].getTarget());
                }
            }
        }



        for (i = 0; i < ccList.size(); i++) {
            var cc = ccList.get(i);

            var ccApproved = false;
            var ccChanged = false;
            var styleApproved = false;
            var styleChanged = false;

            if (cc.getApprovalStatus().name() == "ContextApproved" || cc.getApprovalStatus().name() == "CompletelyApproved") {
                ccApproved = true;
            }

            if (cc.getParent().getApprovalStatus().name() == "ContextApproved" || cc.getParent().getApprovalStatus().name() == "CompletelyApproved") {
                styleApproved = true;
            }

            // now loop through all Content objects and build reference to CC
            for (j = 0; j < contentList.size(); j++) {
                var content = contentList.get(j);
                var contentType = content.getValue("a_Content_Type_ID").getSimpleValue();
                if (contentType == "216") {
                    //Create a reference of the Primary Image to the Shot Request object - 
                    // need to discuss because ref type PrimaryImage 
                    // if used to link to CC then it can't be used for Shot request because Shot request is entity and CC is product
                    // created new ref type - ContentToPhotoShotPrimaryImageRef
                    // check if shot request has primary image and remove it if it does
                    createContentLink(otherNode, content, "ShotRequestPrimaryImageRef", manager, contextID);
                    var placementValue = otherNode.getValue('a_Site_Placement').getLOVValue().getValue();
                    var placementValueID = otherNode.getValue('a_Site_Placement').getLOVValue().getID();

                    // check if shot placement is 5
                    if (placementValueID == '5') {
                        // build link between content and CC
                        if (createContentLink(cc, content, "PrimaryProductImage", manager, contextID)) {
                            ccChanged = true;
                        }
                        var virtualMerchCtnt = getVirtualMerchImageContent(contentList);

                        // If this Customer Choice has value = 1 for the attribute a_CC_Sort_Order, 
                        // then set the primary image reference to the parent style object

                        /* 2.2.2: If the style has no primary image reference set, create reference of Primary Image to Style

                           2.2.3 If this Customer Choice does not have value = 1 for the attribute a_CC_Sort_Order AND Style 
                           has Primary Image, evaluate whether CC has a_CC_Sort_Order value higher than the CC that had 
                           it's Primary Image set to the style. (higher means closer to 1) If the value is higher, 
                           set the reference of Primary Image to the style.
                        */

                        var styleRefBy = cc.getParent().getReferences().asList();
                        var styleHasPrimary = false;
                        var primaryImageContent;
                        if (styleRefBy != null) {
                            var itr = styleRefBy.iterator();
                            while (itr.hasNext()) {
                                var ref = itr.next();
                                if (ref.getReferenceTypeString() == "PrimaryProductImage" && ref.getTarget() != null) {
                                    styleHasPrimary = true;
                                    primaryImageContent = ref.getTarget();
                                }
                            }
                            if (styleHasPrimary) {
                                // evaluate and compare sort order
                                var reference = primaryImageContent.getReferencedBy().toArray();
                                var otherCC;
                                for (var m = 0; m < reference.length; m++) {
                                    referenceTypeId = reference[m].getReferenceType().getID();
                                    var tempCC = reference[m].getSource();
                                    referenceTypeObject = tempCC.getObjectType().getID();
                                    if (referenceTypeId == 'PrimaryProductImage' && referenceTypeObject == 'CustomerChoice') {
                                        otherCC = reference[m].getSource();
                                    }
                                }
                                if (otherCC != null) {

                                    var otherSortOrder = parseInt(otherCC.getValue("a_CC_Sort_Order").getSimpleValue());
                                    var currSortOrder = parseInt(cc.getValue("a_CC_Sort_Order").getSimpleValue());
                                    if (currSortOrder < otherSortOrder) {
                                        if (createContentLink(cc.getParent(), content, "PrimaryProductImage", manager, contextID)) {
                                            styleChanged = true;
                                        }
                                        if (createContentLink(cc.getParent(), virtualMerchCtnt, "VirtualMerchImage", manager, contextID)) {
                                            styleChanged = true;
                                        }
                                    }
                                }
                            } else {
                                if (createContentLink(cc.getParent(), content, "PrimaryProductImage", manager, contextID)) {
                                    styleChanged = true;
                                }
                                if (createContentLink(cc.getParent(), virtualMerchCtnt, "VirtualMerchImage", manager, contextID)) {
                                    styleChanged = true;
                                }
                            }
                        }

                    }
                    //if the site Placement is different
                    if (placementValue) {
                        if (placementValue == "Main P1") {
                            placementValue = "PrimaryProductImage";
                        }
                        if (createContentLink(cc, content, placementValue, manager, contextID)) {
                            removeContentLink(cc, content, placementValue, manager, contextID);
                            ccChanged = true;
                        }
                    }
                }
                //if content type is 12 
                else if (contentType == "12") {
                    // Create a "Swatch" reference to the Shot Request object
                    // Create  a "Swatch" reference to the Customer Choice object (that the Shot Request was on)
                    createContentLink(otherNode, content, "ShotRequestSwatchRef", manager, contextID);
                    if (createContentLink(cc, content, "Swatch", manager, contextID))
                        ccChanged = true;

                }
                //if content type is 277
                else if (contentType == "277") {
                    // Create a "Video" reference to the  Shot Request Object
                    // Create a "Video" reference to  the Customer Choice object (that the Shot Request was on)
                    createContentLink(otherNode, content, "ShotRequestVideoRef", manager, contextID);
                    if (createContentLink(cc, content, "Video", manager, contextID))
                        ccChanged = true;
                }
                else if (contentType == "275") {

                    if (createContentLink(cc, content, "VirtualMerchImage", manager, contextID)) {
                        ccChanged = true;
                    }
                }

                if (shotApproved) {
                    content.approve();
                }
            }


            // if shot and CC were approved before, need to reapprove after reference building
            if (shotApproved)
                otherNode.approve();

            if (shotApproved && ccApproved && ccChanged)
                cc.approve();

            if (shotApproved && styleApproved && styleChanged)
                cc.getParent().approve();
        }
    });
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.checkApprovedMainP1InContext = checkApprovedMainP1InContext
exports.checkApprovedMainP1ForCC = checkApprovedMainP1ForCC
exports.createUSShotRequestForASLR = createUSShotRequestForASLR
exports.triggerASLRUSMarket = triggerASLRUSMarket
exports.addReference = addReference
exports.removeContentLink = removeContentLink
exports.createContentLink = createContentLink
exports.getVirtualMerchImageContent = getVirtualMerchImageContent
exports.updateContentReferencesForShotAndCC = updateContentReferencesForShotAndCC