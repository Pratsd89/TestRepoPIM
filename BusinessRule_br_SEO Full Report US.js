/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO Full Report US",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "br_SEO Full Report US",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIB_AT",
    "libraryAlias" : "LIB_AT"
  }, {
    "libraryId" : "LIB_BRFS",
    "libraryAlias" : "LIB_BRFS"
  }, {
    "libraryId" : "LIB_BRFS_FULL",
    "libraryAlias" : "LIB_BRFS_FULL"
  }, {
    "libraryId" : "LIB_GO",
    "libraryAlias" : "LIB_GO"
  }, {
    "libraryId" : "SEO_Input_Library",
    "libraryAlias" : "SEOInputLibrary"
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,mail,LIB_AT,LIB_BRFS,LIB_BRFS_FULL,LIB_GO,SEOInputLibrary) {
var filePath = "/opt/stibo/SEO-PIM-Report_For_Legacy_NLU.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
	file.createNewFile();
} 
var fw = new java.io.FileWriter(file, false);
fw.write("ID,CID,Brand,CategoryStartDate,CategoryEndDate,WebCategoryHide,ObjecType,EN_US_NLU,EN_US_Legay_LIVEURL,EN_US_NLU_LIVEURL\n");



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

	var temp3 = "&inventoryAware=true&previewDate=2024-09-19%2016%3A14%3A00%20PDT";

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

	var temp3 = "&previewDate=2024-09-19%2016%3A14%3A00%20PDT";

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


	var temp3 = "&inventoryAware=true&previewDate=2024-09-19%2016%3A14%3A00%20PDT";


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
		return "https://oldnavy.gap.com/browse";
	} else if (brandInput == "GAP") {
		return "https://www.gap.com/browse";
	} else if (brandInput == "GO") {
		return "https://www.gapfactory.com/browse";
	} else if (brandInput == "BR") {
		return "https://bananarepublic.gap.com/browse";
	} else if (brandInput == "BRFS") {
		return "https://bananarepublicfactory.gapfactory.com/browse";
	} else if (brandInput == "AT") {
		return "https://athleta.gap.com/browse";
	}
}


function getHostByBrandForLegacyCategoryLIVE(brandInput) {

	if (brandInput == "ON") {
		return "https://oldnavy.gap.com/browse/category.do";
	} else if (brandInput == "GAP") {
		return "https://www.gap.com/browse/category.do";
	} else if (brandInput == "GO") {
		return "https://www.gapfactory.com/browse/category.do";
	} else if (brandInput == "BR") {
		return "https://bananarepublic.gap.com/browse/category.do";
	} else if (brandInput == "BRFS") {
		return "https://bananarepublicfactory.gapfactory.com/browse/category.do";
	} else if (brandInput == "AT") {
		return "https://athleta.gap.com/browse/category.do";
	}
}

function getHostByBrandForLegacyDivisionLIVE(brandInput) {

	if (brandInput == "ON") {
		return "https://oldnavy.gap.com/browse/division.do";
	} else if (brandInput == "GAP") {
		return "https://www.gap.com/browse/division.do";
	} else if (brandInput == "GO") {
		return "https://www.gapfactory.com/browse/division.do";
	} else if (brandInput == "BR") {
		return "https://bananarepublic.gap.com/browse/division.do";
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


	//var temp3 = "&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


	if (legacy == 'LEGACY') {
		return temp + temp2 + cidInput ;
	}
	else {
		if (nluInput == '' || nluInput == null) {
			return '';
		}
		return temp + nluInput + temp2 + cidInput ;
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

	//var temp3 = "&previewDate=2024-08-29%2016%3A14%3A00%20PDT";

	if (legacy == 'LEGACY') {
		return temp + temp2 + cidInput ;
	}
	else {
		if (nluInput == '' || nluInput == null) {
			return '';
		}
		return temp + nluInput + temp2 + cidInput ;
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

//	var temp3 = "&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";

	var temp4 = "&style="

	if (legacy == 'LEGACY') {
		return temp + temp2 + parentCIDInput + temp4 + cidInput ;
	}
	else {
		if (nluInput == '' || nluInput == null) {
			return '';
		}
		return temp + nluInput + temp2 + parentCIDInput + temp4 + cidInput ;
	}


}





/*function mainMethod(context) {
	//var catsList = SEOInputLibrary.getNodeList();
	//var catsList =LIB_GO.getNodeList();
    //var catsList =LIB_AT.getNodeList();
	var catsList = LIB_BRFS_FULL.getNodeList();
	for (var i = 0; i < catsList.size(); i++) {
		var catObj = stepManager.getClassificationHome().getClassificationByID(catsList.get(i));
		if(catObj!=null){
		var rootBrand = catObj.getValue("a_Brand_Number").getSimpleValue();
		var objectType = catObj.getObjectType().getID();
		if (rootBrand != 'GPS') {
			var isActive = isCategoryActiveOrFuture(catObj);
			if (isActive == true) {
				if (objectType == "WebDivision") {
					getDivisionDetails(catObj, context);
				}
				else if (objectType == "WebCategory") {
					getCategoryDetails(catObj, context);
				}
				else if (objectType == "WebSubCategory") {
					getSubCategoryDetails(catObj, context);
				}
			}
		}
		}
		
	}
}*/


function getContextSpecificObject(object, context) {
	var contextSpecificObject = "";
	contextSpecificObject = stepManager.executeInContext(context, function (specificManager) {
		var ObjectinContext = specificManager.getObjectFromOtherManager(object);
		if (ObjectinContext != "undefined" && ObjectinContext != null) {
			return ObjectinContext;
		}
	});
	return contextSpecificObject;
}

function containsDoubleQuotes(text) {
	return text.includes('"');
}


function getContextSpecificValues(object, sAttribute, context) {
	var contextSpecificAttrValue = "";
	contextSpecificAttrValue = stepManager.executeInContext(context, function (specificManager) {
		var ObjectinContext = specificManager.getObjectFromOtherManager(object);
		if (isCategoryActiveOrFuture(ObjectinContext) == true) {
			return ObjectinContext.getValue(sAttribute).getSimpleValue();
		}
	});
	if (contextSpecificAttrValue == null || contextSpecificAttrValue == "undefined") {
		// to replace null with ""
		contextSpecificAttrValue = " ";
	} else if (containsDoubleQuotes(contextSpecificAttrValue) == true) {
		contextSpecificAttrValue = "\"" + contextSpecificAttrValue + "\"" + '"';
	} else if (contextSpecificAttrValue.contains(",")) {
		// SKIP " and warp text that contains ","
		contextSpecificAttrValue = "\"" + contextSpecificAttrValue + "\"";
	} else {
		contextSpecificAttrValue = contextSpecificAttrValue;
	}
	return contextSpecificAttrValue.trim();
}


function getDivisionDetails(divisiondObj, divContext,contextID) {
	var divisionId = divisiondObj.getID();
	//log.info(divisionId);
	var divCtyName = getAttributeValueAsPerContext(divisiondObj, "a_Category_Description", divContext);
	var categoryRedirectURL = getAttributeValueAsPerContext(divisiondObj, "a_Redirect_URL", divContext);
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
	var ctyStartDate =getAttributeValue(divisiondObj,"a_WebCategory_Start_Date");
	var ctyEndDate =getAttributeValue(divisiondObj,"a_WebCategory_End_Date");
     var categoryHide = getAttributeValue(divisiondObj,"a_WebCategory_Hide_Category");
     var parentName = divisiondObj.getParent().getName();
      parentName = stringOperations(parentName);
      parentName = cleanString(parentName);
      Name = cleanString(Name);
	//fw.write(brandNo + "," + market + "," +contextID+","+ objectTypeName + "," + divisionId + "," + divisionCID + ","+Name+","+parentName+","+divCtyName+","+ctyStartDate+","+ctyEndDate+","+categoryHide + "," + categoryRedirectURL + ","+categoryNLU + "," + legacyPreview +","+nluPreview +","+legacyLive+"," +nluLive+ "\n");
     fw.write(divisionId + "," +divisionCID+ "," +brandNo+ "," +ctyStartDate+ "," +ctyEndDate+ "," +categoryHide+ ","+objectTypeName+ ","+categoryNLU + "," +legacyLive+"," +nluLive+ "\n");
}


function getCategoryDetails(ctyObject, ctyContext,contextID) {
	var ctyId = ctyObject.getID();
	var ctyCtyName = getAttributeValueAsPerContext(ctyObject, "a_Category_Description", ctyContext);
	var categoryRedirectURL = getAttributeValueAsPerContext(ctyObject, "a_Redirect_URL", ctyContext);
	var ctyCID = getAttributeValue(ctyObject, "a_WebCategory_CID");
	var ctySlug = getAttributeValueAsPerContext(ctyObject, "a_Category_Slug", ctyContext);
	var ctyNLU = getAttributeValueAsPerContext(ctyObject, "a_Natural_Language_URL", ctyContext);
	var fr_CA_ctySlugNLU = getContextSpecificValues(ctyObject, "a_Natural_Language_URL", "FR_CA");
	var objectTypeCty = ctyObject.getObjectType().getName();
	var catBrandNo = getAttributeValue(ctyObject, "a_Brand_Number");
	var nluPreview = generatePreviewNLULegacyURLCategory(catBrandNo, ctyNLU, ctyCID, "PREVIEW");
	var legacyPreview = generatePreviewNLULegacyURLCategory(catBrandNo, ctyNLU, ctyCID, "LEGACY");
	var nluLive = generatePreviewNLULegacyURLCategoryLIVE(catBrandNo, ctyNLU, ctyCID, "PREVIEW");
	var legacyLive = generatePreviewNLULegacyURLCategoryLIVE(catBrandNo, ctyNLU, ctyCID, "LEGACY");
	var market = "US";
	var Name = ctyObject.getName();
	Name = stringOperations(Name);
	var ctyStartDate =getAttributeValue(ctyObject,"a_WebCategory_Start_Date");
	var ctyEndDate =getAttributeValue(ctyObject,"a_WebCategory_End_Date");
     var categoryHide = getAttributeValue(ctyObject,"a_WebCategory_Hide_Category");
     var parentName = ctyObject.getParent().getName();
     parentName = stringOperations(parentName);
     parentName = cleanString(parentName);
    Name = cleanString(Name);
   


	//fw.write(catBrandNo + "," + market + "," +contextID+","+ objectTypeCty + "," + ctyId + "," + ctyCID + ","+Name+","+parentName+","+ctyCtyName+","+ctyStartDate+","+ctyEndDate+","+categoryHide+","+ categoryRedirectURL + "," + ctyNLU + "," + legacyPreview + "," + nluPreview +","+legacyLive+"," +nluLive + "\n");
     fw.write(ctyId+ "," +ctyCID + "," +catBrandNo+","+ctyStartDate+","+ctyEndDate+","+categoryHide+ "," +objectTypeCty+ ","+ctyNLU + "," +legacyLive+"," +nluLive + "\n");
}


function getSubCategoryDetails(subCtyObject, subCtyContext,contextID) {
	var subCtyid = subCtyObject.getID();
	var subctyCtyObject = subCtyObject.getParent();
	var subCtyCtyCID = getAttributeValue(subctyCtyObject, "a_WebCategory_CID");
	var subCtyName = getAttributeValueAsPerContext(subCtyObject, "a_Category_Description", subCtyContext);
	var categoryRedirectURL = getAttributeValueAsPerContext(subCtyObject, "a_Redirect_URL", subCtyContext);
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
	
	var ctyStartDate =getAttributeValue(subCtyObject,"a_WebCategory_Start_Date");
	var ctyEndDate =getAttributeValue(subCtyObject,"a_WebCategory_End_Date");
     var categoryHide = getAttributeValue(subCtyObject,"a_WebCategory_Hide_Category");
     var parentName = subCtyObject.getParent().getName();
     parentName = stringOperations(parentName);
     parentName = cleanString(parentName);
     Name = cleanString(Name);


	//fw.write(subCtyBrandNo + "," + market + "," +contextID+ ","+ objectTypeSubCty + "," + subCtyid + "," + subCtyCID + ","+Name+","+parentName+","+subCtyName+","+ctyStartDate+","+ctyEndDate+","+categoryHide+","+categoryRedirectURL+","+subCtyNLU + "," + legacyPreview + "," + nluPreview +","+legacyLive+"," +nluLive+ "\n");
     fw.write(subCtyid + "," + subCtyCID + "," +subCtyBrandNo+ "," +ctyStartDate+","+ctyEndDate+","+categoryHide+ "," +objectTypeSubCty+ "," +subCtyNLU+ "," + legacyLive+"," +nluLive+ "\n");
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
		attributeValue = " "; // to replace null with ""
	} else if (containsDoubleQuotes(attributeValue) == true) {
		attributeValue = "\"" + attributeValue + "\"" + '"';
	} else if (attributeValue.contains(",")) {
		// SKIP " and warp text that contains ","
		attributeValue = "\"" + attributeValue + "\"";
	} else {
		attributeValue = attributeValue;
	}
	return attributeValue.trim();
}

function cleanString(val) {
   
    if (val != null) {
        // Force convert to a primitive string (whether object or primitive)
        val = String(val);        
        if (typeof val === 'string') {  // Check if it's now a primitive string
           
            // Replace all newlines and tab characters with a single space
            val = val.replace(/\s+/g, " ");
           
            return val.trim(); // Trim leading/trailing spaces
        }
    }
    
    return val; // Return original value if it's not a string
}

function stringOperations(value){
		var attributeValue ="";
			attributeValue = value;
			if(attributeValue == null){
				attributeValue = " "; // to replace null with ""
			}else if (containsDoubleQuotes(attributeValue) == true ){
			attributeValue = "\""+attributeValue+"\""+'"';
			
			}else if(attributeValue.contains(",")){
			// SKIP " and warp text that contains ","
				attributeValue = "\""+attributeValue+"\"";
				
			}else{
				attributeValue = attributeValue ;
				
				}
			return attributeValue.trim();
		
		
		}

var brandMailInput =null;
var contextID = stepManager.getCurrentContext().getID();
mainMethod("EN_US",contextID);


fw.flush();
fw.close();


var fileInputStream = new java.io.FileInputStream(file);
var asset = stepManager.getAssetHome().getAssetByID("TF_128602511");
var uploaded = asset.upload(fileInputStream, filePath);
var mailMethod = mail.mail();
var emailIDTO = mailMethod.addTo("sri_indu_dekkapati@gap.com;jagadish_beejapu@gap.com");
var emailSubject = mailMethod.subject("Full Report - "+ contextID);
var emailBody = mailMethod.plainMessage("Please find NLU Preview URL's for "+ contextID);
var attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
var setAttachMentName = attachment.name("SEO-PIM-Report_For_Legacy_NLU_US.csv");
attachment.attach();
var mailSentStatus = mailMethod.send();







function mainMethod(context,contextID) {

	var WBU_ID = ["WBU-46650","WBU-5001","WBU-1038093","WBU-5058","WBU-1038092","WBU-5151"];
	for (var i in WBU_ID){
	//var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-1038093");  //BRFS
	//var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-5001");  //BR
	var brand_ALL = stepManager.getClassificationHome().getClassificationByID(WBU_ID[i]);  //GAP
    
   // var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-1038092"); //GO
	//var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-46650");  //AT
	//var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-5151");  //ON

	
	var divisionList = brand_ALL.getChildren();
	var catsList = new java.util.ArrayList();
	var subCatsList = new java.util.ArrayList();
	brandMailInput= brand_ALL.getValue('a_Brand_Number').getValue();
	log.info(brandMailInput);
 
	for (var j = 0; j < divisionList.size(); j++) {
		var divObj = divisionList.get(j);
		if (divObj != null) {
			var objectType = divObj.getObjectType().getID();
			if (objectType.equals("WebDivision") && divObj.getValue('a_Division_Display_Type').getValue() != null && !divObj.getValue('a_Division_Display_Type').getValue().equalsIgnoreCase("Division: Sister Site")){
				catsList.addAll(divObj.getChildren());
				var isActiveDiv = isCategoryActiveOrFuture(divObj);
				if (isActiveDiv == true) {
					getDivisionDetails(divObj, context,contextID);
				}
			}
		}
	}
 
	for (var k = 0; k < catsList.size(); k++) {
		var catObj = catsList.get(k);
		if (catObj != null) {
			var objectType = catObj.getObjectType().getID();
			if (objectType == "WebCategory") {
				subCatsList.addAll(catObj.getChildren());
				var isActiveCat = isCategoryActiveOrFuture(catObj);
				if (isActiveCat == true) {
					getCategoryDetails(catObj, context,contextID);
				}
 
			}
		}
	}
 
	for (var l = 0; l < subCatsList.size(); l++) {
		var subCatObj = subCatsList.get(l);
		if (subCatObj != null) {
			var objectType = subCatObj.getObjectType().getID();
			if (objectType == "WebSubCategory") {
				var isActiveSubCat = isCategoryActiveOrFuture(subCatObj);
				if (isActiveSubCat == true) {
					getSubCategoryDetails(subCatObj, context,contextID);
				}
			}
		}
	}
}
}


}