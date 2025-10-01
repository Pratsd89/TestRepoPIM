/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Library",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Test_Library",
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
//PPIM-12814
function checkSKUDimensionForCC(cc, step) {
    var logArray = new Array();
    var CCLcs = cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
    var children = cc.getChildren();
    var flag = false;
    var flag1 = false;
    if (children.size() > 0) {
        if (CCLcs == "Waiting for Style Approval") {
            var skuIter = children.iterator();
            while (skuIter.hasNext()) {
                var currSku = skuIter.next();
                var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
                var classificationType = classificationTypeHome.getLinkTypeByID('SKUToSizeCode');
                var refSizeCodeList = currSku.getClassificationProductLinks(classificationType);

                if (refSizeCodeList.size() == 1) {
                    var refSizeCode = step.getClassificationHome().getClassificationByID(refSizeCodeList.get(0).getClassification().getID());
                    var variant = refSizeCode.getValue("a_SizeCodeVariant").getSimpleValue();
                    var dim1DimValue = refSizeCode.getValue("a_Dim1_Dimension_value").getSimpleValue();
                    var dim2 = refSizeCode.getValue("Dim2(child)").getSimpleValue();

                    if (variant != null && dim1DimValue != null) {
                        flag = true;
                        if (dim2 != null && dim2 != "") {
                            var dim2DimValue = refSizeCode.getValue("a_Dim2_Dimension_value").getSimpleValue();
                            if (dim2DimValue != "" && dim2DimValue != null) {
                                flag1 = true;
                            }
                        }
                    }

                    //SKU has both Dim1 and Dim2 info
                    if (flag1) {
                        return true;
                    }
                }
            }

            //SKU has only Dim1 info
            if (flag) {
                return true;
            }
            return "The Size Code Hierarchy needs to be enriched for product approval.";
        }
        return true;
    } else {
        return "CC does not have any SKUs."
    }
}





function getHostByBrand(brandInput) {
    if (brandInput == "ON") {
        return "https://onol.wip.prod.gaptecholapps.com/browse";
    } else if (brandInput == "GAP") {
        return "https://www.wip.prod.gaptecholapps.com/browse";
    } else if (brandInput == "GO") {
        return "https://www.wip.prod.factory-gaptecholapps.com/browse";
    } else if (brandInput == "BR") {
        return "https://brol.wip.prod.gaptecholapps.com/browse";
    } else if (brandInput == "BRFS") {
        return "https://brfol.wip.prod.factory-gaptecholapps.com/browse";
    } else if (brandInput == "AT") {
        return "https://atol.wip.prod.gaptecholapps.com/browse";
    }
}


function getHostByBrandForLegacyDivision(brandInput) {
    if (brandInput == "ON") {
        return "https://onol.wip.prod.gaptecholapps.com/browse/division.do";
    } else if (brandInput == "GAP") {
        return "https://www.wip.prod.gaptecholapps.com/browse/division.do";
    } else if (brandInput == "GO") {
        return "https://www.wip.prod.factory-gaptecholapps.com/browse/division.do";
    } else if (brandInput == "BR") {
        return "https://brol.wip.prod.gaptecholapps.com/browse/division.do";
    } else if (brandInput == "BRFS") {
        return "https://brfol.wip.prod.factory-gaptecholapps.com/browse/division.do";
    } else if (brandInput == "AT") {
        return "https://atol.wip.prod.gaptecholapps.com/browse/division.do";
    }
}


function getHostByBrandForLegacyCategory(brandInput) {

    if (brandInput == "ON") {
        return "https://onol.wip.prod.gaptecholapps.com/browse/category.do";
    } else if (brandInput == "GAP") {
        return "https://www.wip.prod.gaptecholapps.com/browse/category.do";
    } else if (brandInput == "GO") {
        return "https://www.wip.prod.factory-gaptecholapps.com/browse/category.do";
    } else if (brandInput == "BR") {
        return "https://brol.wip.prod.gaptecholapps.com/browse/category.do";
    } else if (brandInput == "BRFS") {
        return "https://brfol.wip.prod.factory-gaptecholapps.com/browse/category.do";
    } else if (brandInput == "AT") {
        return "https://atol.wip.prod.gaptecholapps.com/browse/category.do";
    }
}


function generatePreviewNLULegacyURLSubCategory(brandInput, nluInput, cidInput, parentCIDInput, legacy) {
    if (legacy == 'LEGACY') {
        var temp = getHostByBrandForLegacyCategory(brandInput);
    }
    else {
        var temp = getHostByBrand(brandInput);
    }

    var temp2 = "?cid="
    var temp3 = "&inventoryAware=true&previewDate=2024-09-01%2016%3A14%3A00%20PDT";
    var temp4 = "&style="

    if (legacy == 'LEGACY') {
        return temp + temp2 + parentCIDInput + temp4 + cidInput + temp3;
    }
    else {
        if (nluInput == '' || nluInput == null) {
            return '';
        }
        return temp + nluInput + temp2 + parentCIDInput + temp4 + cidInput + temp3;
    }
}


function generatePreviewNLULegacyURLUSDivision(brandInput, nluInput, cidInput, legacy) {
    if (legacy == 'LEGACY') {
        var temp = getHostByBrandForLegacyDivision(brandInput);
    }
    else {
        var temp = getHostByBrand(brandInput);
    }

    var temp2 = "?cid="
    var temp3 = "&previewDate=2024-09-01%2016%3A14%3A00%20PDT";

    if (legacy == 'LEGACY') {
        return temp + temp2 + cidInput + temp3;
    }
    else {
        if (nluInput == '' || nluInput == null) {
            return '';
        }
        return temp + nluInput + temp2 + cidInput + temp3;
    }
}


function generatePreviewNLULegacyURLCategory(brandInput, nluInput, cidInput, legacy) {
    if (legacy == 'LEGACY') {
        var temp = getHostByBrandForLegacyCategory(brandInput);
    }
    else {
        var temp = getHostByBrand(brandInput);
    }
    var temp2 = "?cid="
    var temp3 = "&inventoryAware=true&previewDate=2024-09-01%2016%3A14%3A00%20PDT";

    if (legacy == 'LEGACY') {
        return temp + temp2 + cidInput + temp3;
    }
    else {
        if (nluInput == '' || nluInput == null) {
            return '';
        }
        return temp + nluInput + temp2 + cidInput + temp3;
    }
}


function getHostByBrandLIVE(brandInput) {
    if (brandInput == "ON") {
        return "https://onol.wip.prod.gaptecholapps.com/browse";
    } else if (brandInput == "GAP") {
        return "https://www.wip.prod.gaptecholapps.com/browse";
    } else if (brandInput == "GO") {
        return "https://www.gapfactory.com/browse";
    } else if (brandInput == "BR") {
        return "https://brol.wip.prod.gaptecholapps.com/browse";
    } else if (brandInput == "BRFS") {
        return "https://bananarepublicfactory.gapfactory.com/browse";
    } else if (brandInput == "AT") {
        return "https://athleta.gap.com/browse";
    }
}


function getHostByBrandForLegacyCategoryLIVE(brandInput) {
    if (brandInput == "ON") {
        return "https://onol.wip.prod.gaptecholapps.com/browse/category.do";
    } else if (brandInput == "GAP") {
        return "https://www.wip.prod.gaptecholapps.com/browse/category.do";
    } else if (brandInput == "GO") {
        return "https://www.gapfactory.com/browse/category.do";
    } else if (brandInput == "BR") {
        return "https://brol.wip.prod.gaptecholapps.com/browse/category.do";
    } else if (brandInput == "BRFS") {
        return "https://bananarepublicfactory.gapfactory.com/browse/category.do";
    } else if (brandInput == "AT") {
        return "https://athleta.gap.com/browse/category.do";
    }
}

function getHostByBrandForLegacyDivisionLIVE(brandInput) {
    if (brandInput == "ON") {
        return "https://onol.wip.prod.gaptecholapps.com/browse/division.do";
    } else if (brandInput == "GAP") {
        return "https://www.wip.prod.gaptecholapps.com/browse/division.do";
    } else if (brandInput == "GO") {
        return "https://www.gapfactory.com/browse/division.do";
    } else if (brandInput == "BR") {
        return "https://brol.wip.prod.gaptecholapps.com/browse/division.do";
    } else if (brandInput == "BRFS") {
        return "https://bananarepublicfactory.gapfactory.com/browse/division.do";
    } else if (brandInput == "AT") {
        return "https://athleta.gap.com/browse/division.do";
    }
}

function generatePreviewNLULegacyURLCategoryLIVE(brandInput, nluInput, cidInput, legacy) {
    if (legacy == 'LEGACY') {
        var temp = getHostByBrandForLegacyCategoryLIVE(brandInput);
    }
    else {
        var temp = getHostByBrandLIVE(brandInput);
    }

    var temp2 = "?cid="

    if (legacy == 'LEGACY') {
        return temp + temp2 + cidInput;
    }
    else {
        if (nluInput == '' || nluInput == null) {
            return '';
        }
        return temp + nluInput + temp2 + cidInput;
    }
}


function generatePreviewNLULegacyURLUSDivisionLIVE(brandInput, nluInput, cidInput, legacy) {
    if (legacy == 'LEGACY') {
        var temp = getHostByBrandForLegacyDivisionLIVE(brandInput);
    }
    else {
        var temp = getHostByBrandLIVE(brandInput);
    }

    var temp2 = "?cid="

    if (legacy == 'LEGACY') {
        return temp + temp2 + cidInput;
    }
    else {
        if (nluInput == '' || nluInput == null) {
            return '';
        }
        return temp + nluInput + temp2 + cidInput;
    }
}


function generatePreviewNLULegacyURLSubCategoryLIVE(brandInput, nluInput, cidInput, parentCIDInput, legacy) {
    if (legacy == 'LEGACY') {
        var temp = getHostByBrandForLegacyCategoryLIVE(brandInput);
    }
    else {
        var temp = getHostByBrandLIVE(brandInput);
    }

    var temp2 = "?cid="
    var temp4 = "&style="

    if (legacy == 'LEGACY') {
        return temp + temp2 + parentCIDInput + temp4 + cidInput;
    }
    else {
        if (nluInput == '' || nluInput == null) {
            return '';
        }
        return temp + nluInput + temp2 + parentCIDInput + temp4 + cidInput;
    }
}


function containsDoubleQuotes(text) {
    return text.includes('"');
}


function getContextSpecificValues(object, sAttribute, context, stepManager) {
    var contextSpecificAttrValue = "";
    contextSpecificAttrValue = stepManager.executeInContext(context, function (specificManager) {
        var ObjectinContext = specificManager.getObjectFromOtherManager(object);
        if (isCategoryActiveOrFuture(ObjectinContext) == true) {
            return ObjectinContext.getValue(sAttribute).getSimpleValue();
        }
    });
    if (contextSpecificAttrValue == null || contextSpecificAttrValue == "undefined") {
        contextSpecificAttrValue = " ";
    } else if (containsDoubleQuotes(contextSpecificAttrValue) == true) {
        contextSpecificAttrValue = "\"" + contextSpecificAttrValue + "\"" + '"';
    } else if (contextSpecificAttrValue.contains(",")) {
        contextSpecificAttrValue = "\"" + contextSpecificAttrValue + "\"";
    } else {
        contextSpecificAttrValue = contextSpecificAttrValue;
    }
    return contextSpecificAttrValue.trim();
}


function getDivisionDetails(divisiondObj, divContext, fw) {
    var divisionId = divisiondObj.getID();
    var divCtyName = getAttributeValueAsPerContext(divisiondObj, "a_Category_Description", divContext);
    var divisionCID = getAttributeValue(divisiondObj, "a_WebCategory_CID");
    var divisionSlug = getAttributeValueAsPerContext(divisiondObj, "a_Division_Slug", divContext);
    var categoryNLU = getAttributeValueAsPerContext(divisiondObj, "a_Natural_Language_URL", divContext);
    var objectTypeName = divisiondObj.getObjectType().getName();
    var brandNo = getAttributeValue(divisiondObj, "a_Brand_Number");
    var nluPreview = generatePreviewNLULegacyURLUSDivision(brandNo, categoryNLU, divisionCID, "PREVIEW");
    var legacyPreview = generatePreviewNLULegacyURLUSDivision(brandNo, categoryNLU, divisionCID, "LEGACY");
    var nluLive = generatePreviewNLULegacyURLUSDivisionLIVE(brandNo, categoryNLU, divisionCID, "PREVIEW");
    var legacyLive = generatePreviewNLULegacyURLUSDivisionLIVE(brandNo, categoryNLU, divisionCID, "LEGACY");
    var market = "US";
    var Name = divisiondObj.getName();
    Name = stringOperations(Name);
    var ctyStartDate = getAttributeValue(divisiondObj, "a_WebCategory_Start_Date");
    var ctyEndDate = getAttributeValue(divisiondObj, "a_WebCategory_End_Date");
    var categoryHide = getAttributeValue(divisiondObj, "a_WebCategory_Hide_Category");
    var parentName = divisiondObj.getParent().getName();
    parentName = stringOperations(parentName);

    fw.write(brandNo + "," + market + "," + objectTypeName + "," + divisionId + "," + divisionCID + "," + Name + "," + parentName + "," + divCtyName + "," + ctyStartDate + "," + ctyEndDate + "," + categoryHide + "," + categoryNLU + "," + legacyPreview + "," + nluPreview + "," + legacyLive + "," + nluLive + "\n");
}


function getCategoryDetails(ctyObject, ctyContext, fw) {
    var ctyId = ctyObject.getID();
    var ctyCtyName = getAttributeValueAsPerContext(ctyObject, "a_Category_Description", ctyContext);
    var ctyCID = getAttributeValue(ctyObject, "a_WebCategory_CID");
    var ctySlug = getAttributeValueAsPerContext(ctyObject, "a_Category_Slug", ctyContext);
    var ctyNLU = getAttributeValueAsPerContext(ctyObject, "a_Natural_Language_URL", ctyContext);
    //var fr_CA_ctySlugNLU = getContextSpecificValues(ctyObject, "a_Natural_Language_URL", "FR_CA", stepManager);
    var objectTypeCty = ctyObject.getObjectType().getName();
    var catBrandNo = getAttributeValue(ctyObject, "a_Brand_Number");
    var nluPreview = generatePreviewNLULegacyURLCategory(catBrandNo, ctyNLU, ctyCID, "PREVIEW");
    var legacyPreview = generatePreviewNLULegacyURLCategory(catBrandNo, ctyNLU, ctyCID, "LEGACY");
    var nluLive = generatePreviewNLULegacyURLCategoryLIVE(catBrandNo, ctyNLU, ctyCID, "PREVIEW");
    var legacyLive = generatePreviewNLULegacyURLCategoryLIVE(catBrandNo, ctyNLU, ctyCID, "LEGACY");
    var market = "US";
    var Name = ctyObject.getName();
    Name = stringOperations(Name);
    var ctyStartDate = getAttributeValue(ctyObject, "a_WebCategory_Start_Date");
    var ctyEndDate = getAttributeValue(ctyObject, "a_WebCategory_End_Date");
    var categoryHide = getAttributeValue(ctyObject, "a_WebCategory_Hide_Category");
    var parentName = ctyObject.getParent().getName();
    parentName = stringOperations(parentName);

    fw.write(catBrandNo + "," + market + "," + objectTypeCty + "," + ctyId + "," + ctyCID + "," + Name + "," + parentName + "," + ctyCtyName + "," + ctyStartDate + "," + ctyEndDate + "," + categoryHide + "," + ctyNLU + "," + legacyPreview + "," + nluPreview + "," + legacyLive + "," + nluLive + "\n");
}


function getSubCategoryDetails(subCtyObject, subCtyContext, fw) {
    var subCtyid = subCtyObject.getID();
    var subctyCtyObject = subCtyObject.getParent();
    var subCtyCtyCID = getAttributeValue(subctyCtyObject, "a_WebCategory_CID");
    var subCtyName = getAttributeValueAsPerContext(subCtyObject, "a_Category_Description", subCtyContext);
    var subCtyCID = getAttributeValue(subCtyObject, "a_WebCategory_CID");
    var subCtySlug = getAttributeValueAsPerContext(subCtyObject, "a_SubCategory_Slug", subCtyContext);
    var subCtyNLU = getAttributeValueAsPerContext(subCtyObject, "a_Natural_Language_URL", subCtyContext);
    var objectTypeSubCty = subCtyObject.getObjectType().getName();
    var subCtyBrandNo = getAttributeValue(subCtyObject, "a_Brand_Number");
    var nluPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, subCtyNLU, subCtyCID, subCtyCtyCID, "PREVIEW");
    var legacyPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, subCtyNLU, subCtyCID, subCtyCtyCID, "LEGACY");
    var nluLive = generatePreviewNLULegacyURLSubCategoryLIVE(subCtyBrandNo, subCtyNLU, subCtyCID, subCtyCtyCID, "PREVIEW");
    var legacyLive = generatePreviewNLULegacyURLSubCategoryLIVE(subCtyBrandNo, subCtyNLU, subCtyCID, subCtyCtyCID, "LEGACY");
    var market = "US";
    var Name = subCtyObject.getName();
    Name = stringOperations(Name);
    var ctyStartDate = getAttributeValue(subCtyObject, "a_WebCategory_Start_Date");
    var ctyEndDate = getAttributeValue(subCtyObject, "a_WebCategory_End_Date");
    var categoryHide = getAttributeValue(subCtyObject, "a_WebCategory_Hide_Category");
    var parentName = subCtyObject.getParent().getName();
    parentName = stringOperations(parentName);

    fw.write(subCtyBrandNo + "," + market + "," + objectTypeSubCty + "," + subCtyid + "," + subCtyCID + "," + Name + "," + parentName + "," + subCtyName + "," + ctyStartDate + "," + ctyEndDate + "," + categoryHide + "," + subCtyNLU + "," + legacyPreview + "," + nluPreview + "," + legacyLive + "," + nluLive + "\n");
}


function getAttributeValueAsPerContext(objectNode, attribute, context) {
    var asignValue = "";
    if (context == "EN_US") {
        asignValue = getAttributeValue(objectNode, attribute);
    } else {
        asignValue = "";
    }
    return asignValue;
}


function isCategoryActiveOrFuture(categoryOBj) {
    if (categoryOBj != "undefined") {
        var description = categoryOBj.getValue("a_Category_Description").getSimpleValue();
        if (description != null) {
            var today = new Date();
            var startDate = categoryOBj.getValue("a_WebCategory_Start_Date").getSimpleValue();
            var endDate = categoryOBj.getValue("a_WebCategory_End_Date").getSimpleValue();
            if (endDate != null) {
                var formattedEndDate = new Date(endDate);
                formattedEndDate.setHours(23);
                formattedEndDate.setMinutes(59);
                formattedEndDate.setSeconds(59);
            }
            if (startDate != null) {
                var formattedStartDate = new Date(startDate);
                formattedStartDate.setHours(23);
                formattedStartDate.setMinutes(59);
                formattedStartDate.setSeconds(59);
            }

            if (endDate == null && (formattedStartDate >= today || formattedStartDate <= today)) {
                // if there is no end date means it will never expire and currently active or future active based on the start date
                return true;
            } else if (formattedEndDate >= today && (formattedStartDate >= today || formattedStartDate <= today)) {
                // End date is greater than today then It is not expired irrespective of start date 
                return true;
            } else if (endDate == null && startDate == null) {
                return false;
            } else {
                return false;
            }
        }
    }
}


function getAttributeValue(currentNode, attribute) {
    var attributeValue = "";
    attributeValue = currentNode.getValue(attribute).getSimpleValue();
    if (attributeValue == null) {
        attributeValue = " ";
    } else if (containsDoubleQuotes(attributeValue) == true) {
        attributeValue = "\"" + attributeValue + "\"" + '"';
    } else if (attributeValue.contains(",")) {
        attributeValue = "\"" + attributeValue + "\"";
    } else {
        attributeValue = attributeValue;
    }
    return attributeValue.trim();
}


function stringOperations(value) {
    var attributeValue = "";
    attributeValue = value;
    if (attributeValue == null) {
        attributeValue = " ";
    } else if (containsDoubleQuotes(attributeValue) == true) {
        attributeValue = "\"" + attributeValue + "\"" + '"';
    } else if (attributeValue.contains(",")) {
        attributeValue = "\"" + attributeValue + "\"";
    } else { attributeValue = attributeValue; }
    return attributeValue.trim();


}


function mainMethod(context, brandClassification, stepManager, mail, brandID) {
	
    var filePath = "/opt/stibo/SEO-PIM-Report_For_Legacy_NLU.csv";
    var file = new java.io.File(filePath);
    if (!file.exists()) {
        file.createNewFile();
    }
    var fw = new java.io.FileWriter(file, false);
    fw.write("Brand,Market,ObjectType,ID,CID,Name,ParentName,CategoryName,CategoryStartDate,CategoryEndDate,WebCategoryHide,EN_US_NLU,EN_US_LegayPreviewURL,EN_US_NLU_PreviewURL,EN_US_Legay_LIVEURL,EN_US_NLU_LIVEURL\n");

    var divisionList = brandClassification.getChildren();
    var catsList = new java.util.ArrayList();
    var subCatsList = new java.util.ArrayList();

    for (var i = 0; i < divisionList.size(); i++) {
        var divObj = divisionList.get(i);
        if (divObj != null) {
            var objectType = divObj.getObjectType().getID();
            if (objectType == "WebDivision") {
                catsList.addAll(divObj.getChildren());
                var isActiveDiv = isCategoryActiveOrFuture(divObj);
                if (isActiveDiv == true) {
                    getDivisionDetails(divObj, context, fw);
                }
            }
        }
    }

    for (var i = 0; i < catsList.size(); i++) {
        var catObj = catsList.get(i);
        if (catObj != null) {
            var objectType = catObj.getObjectType().getID();
            if (objectType == "WebCategory") {
                subCatsList.addAll(catObj.getChildren());
                var isActiveCat = isCategoryActiveOrFuture(catObj);
                if (isActiveCat == true) {
                    getCategoryDetails(catObj, context, fw);
                }

            }
        }
    }

    for (var i = 0; i < subCatsList.size(); i++) {
        var subCatObj = subCatsList.get(i);
        if (subCatObj != null) {
            var objectType = subCatObj.getObjectType().getID();
            if (objectType == "WebSubCategory") {
                var isActiveSubCat = isCategoryActiveOrFuture(subCatObj);
                if (isActiveSubCat == true) {
                    getSubCategoryDetails(subCatObj, context, fw);
                }
            }
        }
    }

    fw.flush();
    fw.close();
    
    var fileInputStream = new java.io.FileInputStream(file);
    var asset = stepManager.getAssetHome().getAssetByID("TF_128577680");
    var uploaded = asset.upload(fileInputStream, filePath);
    var mailMethod = mail.mail();
    var emailIDTO = mailMethod.addTo("sri_indu_dekkapati@gap.com;");
    var emailSubject = mailMethod.subject("SEO preview NLU's");
    var emailBody = mailMethod.plainMessage("Please find " + brandID + " NLU Preview URL's for US.");
    var attachment = mailMethod.attachment();
    var fromAsssest = attachment.fromAsset(asset);
    var setAttachMentName = attachment.name("SEO-PIM-Report_For_Legacy_NLU_US.csv");
    attachment.attach();
    var mailSentStatus = mailMethod.send();
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.checkSKUDimensionForCC = checkSKUDimensionForCC
exports.getHostByBrand = getHostByBrand
exports.getHostByBrandForLegacyDivision = getHostByBrandForLegacyDivision
exports.getHostByBrandForLegacyCategory = getHostByBrandForLegacyCategory
exports.generatePreviewNLULegacyURLSubCategory = generatePreviewNLULegacyURLSubCategory
exports.generatePreviewNLULegacyURLUSDivision = generatePreviewNLULegacyURLUSDivision
exports.generatePreviewNLULegacyURLCategory = generatePreviewNLULegacyURLCategory
exports.getHostByBrandLIVE = getHostByBrandLIVE
exports.getHostByBrandForLegacyCategoryLIVE = getHostByBrandForLegacyCategoryLIVE
exports.getHostByBrandForLegacyDivisionLIVE = getHostByBrandForLegacyDivisionLIVE
exports.generatePreviewNLULegacyURLCategoryLIVE = generatePreviewNLULegacyURLCategoryLIVE
exports.generatePreviewNLULegacyURLUSDivisionLIVE = generatePreviewNLULegacyURLUSDivisionLIVE
exports.generatePreviewNLULegacyURLSubCategoryLIVE = generatePreviewNLULegacyURLSubCategoryLIVE
exports.containsDoubleQuotes = containsDoubleQuotes
exports.getContextSpecificValues = getContextSpecificValues
exports.getDivisionDetails = getDivisionDetails
exports.getCategoryDetails = getCategoryDetails
exports.getSubCategoryDetails = getSubCategoryDetails
exports.getAttributeValueAsPerContext = getAttributeValueAsPerContext
exports.isCategoryActiveOrFuture = isCategoryActiveOrFuture
exports.getAttributeValue = getAttributeValue
exports.stringOperations = stringOperations
exports.mainMethod = mainMethod