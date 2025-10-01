/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "lib_autoClassification",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Auto Classification Library",
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
function createClassificationLinkFromProduct(prod, classification, classificationType, mapID) {
    try {
        var link = prod.createClassificationProductLink(classification, classificationType);
        link.getValue("a_autoClassificationMapID").setSimpleValue(mapID);
    } catch (e) {
        if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
            log.warning("Link between product with ID '" + prod.getID() + "' and classification with ID '" + classification.getID() + "' already exists.");
        } else {
            throw e;
        }
    }
}

function autoClassifyFromClassificationSource(source, target, prdType, classificationType, mapID) {
    if (prdType == "CC") {
        prdType = "CustomerChoice";
    }
    var catProd = source.getClassificationProductLinks();
    if (catProd) {
        var chIter = catProd.iterator();
        while (chIter.hasNext()) {
            var chprod = chIter.next();
            //log.info(chprod.getProduct());
            var objTypeS = chprod.getProduct().getObjectType().getID();
            if (objTypeS == prdType)
                createClassificationLinkFromProduct(chprod.getProduct(), target, classificationType, mapID);
        }
    }
}

function autoClassifyFromProductSource(parent, target, prdType, classificationType, mapID) {
    if (prdType == "CC") {
        prdType = "CustomerChoice";
    }
    var children = parent.getChildren();
    if (children) {
        var childIter = children.iterator();
        while (childIter.hasNext()) {
            var child = childIter.next();
            var sObj = child.getObjectType().getID();
            if (sObj == prdType)
                createClassificationLinkFromProduct(child, target, classificationType, mapID);
        }
    }
}

function getAutoMapObjectsForProduct(prod, step) {
    var mapArray = new java.util.ArrayList();
    var subClassMapArray = new java.util.ArrayList();
    var catMapArray = new java.util.ArrayList();
    var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
    var classificationType = classificationTypeHome.getLinkTypeByID("StyleToWebSubCategoryRef");
    if (prod.getObjectType().getID() == "Style" || prod.getObjectType().getID() == "CustomerChoice") {
        var subClass;
        if (prod.getObjectType().getID() == "Style")
            subClass = prod.getParent();
        else
            subClass = prod.getParent().getParent();

        var subClassReferences = subClass.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("SourcePath")).toArray();
        for (var i = 0; i < subClassReferences.length; i++) {
            mapArray.add(subClassReferences[i].getTarget().getID());
        }

        // get Web Category or Sub Category for Style and check if it has any auto classification mappings
        var styleTargets = prod.getClassificationProductLinks(classificationType).toArray();
        for (var i = 0; i < styleTargets.length; i++) {
            var category = styleTargets[i].getClassification();
            var autoMapReferencesFromClassification = category.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("SourcePath")).toArray();
            for (var j = 0; j < autoMapReferencesFromClassification.length; j++) {
                mapArray.add(autoMapReferencesFromClassification[j].getTarget().getID());
            }
        }
    }
    return mapArray;
}

function autoClassify(map, step) {
    var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
    var classificationType = classificationTypeHome.getLinkTypeByID("StyleToWebSubCategoryRef");
    var targets = map.getClassificationProductLinks(classificationType).toArray();
    var targetLen = targets.length; //Target length

    var sources = map.getReferencedBy().toArray();
    var sourceLen = sources.length; //Source Length

    if (!(targetLen == 1)) {
        throw "Please add only one Target to Auto Classification Map object " + map.getID();
    }

    if (!(sourceLen == 1)) {
        throw "Please add only one Source to Auto Classification Map object " + map.getID();
    }

    // if we are here, targets has only one object so get its parameters
    var target = targets[0].getClassification();
    var prdType = target.getValue("a_WebCategory_Product_Type").getSimpleValue();

    if (prdType == null || prdType == '') {
        throw "Please add value of attribute Web Category Product Type for Web Hierarchy object " + target.getID();
    }

    // all  validation passed so let's build references
    var source = sources[0].getSource();
    var sourceType = source.getObjectType().getID();

    if (sourceType == "WebCategory" || sourceType == "WebSubCategory") {
        autoClassifyFromClassificationSource(source, target, prdType, classificationType, map.getID());
    } else if (sourceType == "SubClass") {
        if (prdType == "Style") {
            autoClassifyFromProductSource(source, target, prdType, classificationType, map.getID());
        } else if (prdType == "CC") {
            // need to build links for children CCs of all Styles
            var children = source.getChildren();
            if (children) {
                var childIter = children.iterator();
                while (childIter.hasNext()) {
                    var style = childIter.next();
                    autoClassifyFromProductSource(style, target, prdType, classificationType, map.getID());
                }
            }
        }
    }
}

function linkProductToMapTarget(prod, map, step) {
    var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
    var classificationType = classificationTypeHome.getLinkTypeByID("StyleToWebSubCategoryRef");
    var mapTargets = map.getClassificationProductLinks(classificationType).toArray();
    if (mapTargets.length == 1) {
        // if we are here, targets has only one object so get its parameters
        var target = mapTargets[0].getClassification();
        var prdType = target.getValue("a_WebCategory_Product_Type").getSimpleValue();
        if ((prdType == "CC" && prod.getObjectType().getID() == "CustomerChoice") ||
            (prdType == "Style" && prod.getObjectType().getID() == "Style")) {
            // link product to the web category/subcategory
            createClassificationLinkFromProduct(prod, target, classificationType, map.getID());
        }
    }
}


function removeInvalidAutoClassificationMaps(prod, step) {
    // get valid auto classification mappings
    var mapArray = getAutoMapObjectsForProduct(prod, step); // this contains all automap objects the Style/CC should be associated with.
    var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
    var classificationType = classificationTypeHome.getLinkTypeByID("StyleToWebSubCategoryRef");

    // go thru all classification links and remove any links that were mapped using autoclassification but are no longer valid
    var classificationLinks = prod.getClassificationProductLinks(classificationType).toArray();
    for (var i = 0; i < classificationLinks.length; i++) {
        var mapID = classificationLinks[i].getValue("a_autoClassificationMapID").getSimpleValue();
        if (mapID != "" && mapID != null) {
            //logger.info("mapID=" + mapID);
            if (!mapArray.contains(mapID)) {
                // found a reference where auto map object is no longer valid for the Style so remove the link
                classificationLinks[i].delete();
            }
        }
    }
}

function autoClassifyProduct(prod, step) {
    // first remove any invalid classification links 
    removeInvalidAutoClassificationMaps(prod, step);
    // now rebuild the links so any new ones can get added.

    if (prod.getObjectType().getID() == "Style" || prod.getObjectType().getID() == "CustomerChoice") {
        var subClass;
        if (prod.getObjectType().getID() == "Style")
            subClass = prod.getParent();
        else
            subClass = prod.getParent().getParent();

        var autoMapReferencesFromSubClass = subClass.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("SourcePath")).toArray();
        for (var i = 0; i < autoMapReferencesFromSubClass.length; i++) {
            linkProductToMapTarget(prod, autoMapReferencesFromSubClass[i].getTarget(), step);
        }

        // get Web Category or Sub Category for Product and check if it has any auto classification mappings
        var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
        var classificationType = classificationTypeHome.getLinkTypeByID("StyleToWebSubCategoryRef");
        var prodTargets = prod.getClassificationProductLinks(classificationType).toArray();
        for (var i = 0; i < prodTargets.length; i++) {
            var category = prodTargets[i].getClassification();
            // check if the classification has a map object
            var autoMapReferencesFromClassification = category.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("SourcePath")).toArray();
            for (var j = 0; j < autoMapReferencesFromClassification.length; j++) {
                // for each map object, get target web category or sub category
                linkProductToMapTarget(prod, autoMapReferencesFromClassification[j].getTarget(), step);
            }
        }
    }
}

function syncProductsWithCategoryProductType(category, step) {
    var prdType = category.getValue("a_WebCategory_Product_Type").getSimpleValue();
    var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
    var classificationType = classificationTypeHome.getLinkTypeByID("StyleToWebSubCategoryRef");

    if (prdType == "CC") {
        prdType = "CustomerChoice";
    }
    var catProd = category.getClassificationProductLinks();
    if (catProd) {
        var refIter = catProd.iterator();
        while (refIter.hasNext()) {
            var ref = refIter.next();
            //log.info(chprod.getProduct());
            var prd = ref.getProduct();
            var objType = prd.getObjectType().getID();
            if (objType != prdType) {
                // object type doesn't match the product type so delete the link and rebuild a new one
                var mapID = ref.getValue("a_autoClassificationMapID").getSimpleValue();
                ref.delete();
                if (objType == "Style" && prdType == "CustomerChoice") {
                    // link all children CC to category
                    autoClassifyFromProductSource(prd, category, prdType, classificationType, mapID);
                } else if (objType == "CustomerChoice" && prdType == "Style") {
                    createClassificationLinkFromProduct(prd.getParent(), category, classificationType, mapID);
                }
            }
        }
    }
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.createClassificationLinkFromProduct = createClassificationLinkFromProduct
exports.autoClassifyFromClassificationSource = autoClassifyFromClassificationSource
exports.autoClassifyFromProductSource = autoClassifyFromProductSource
exports.getAutoMapObjectsForProduct = getAutoMapObjectsForProduct
exports.autoClassify = autoClassify
exports.linkProductToMapTarget = linkProductToMapTarget
exports.removeInvalidAutoClassificationMaps = removeInvalidAutoClassificationMaps
exports.autoClassifyProduct = autoClassifyProduct
exports.syncProductsWithCategoryProductType = syncProductsWithCategoryProductType