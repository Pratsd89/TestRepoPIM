/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Legacy_URL_Generation_CA",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "SEO Legacy URL Generation CA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
exports.operation0 = function (node,stepManager,mail) {
var filePath = "/opt/stibo/SEO-PIM-Report_For_Legacy_NLU.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
	file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("Brand,Market,ObjectType,ID,CID,EN_CA_NLU,EN_CA_LegayPreviewURL,EN_CA_NLUPreviewURL,FR_CA_NLU,FR_CA_LegacyPreviewURL,FR_CA_NLUPreviewURL\n");



function getHostByBrand(brandInput) {

	if (brandInput == "ON") {
		return "https://onol.wip.prod.gaptecholapps.ca/browse";
	}
	else if (brandInput == "GAP") {
		return "https://www.wip.prod.gaptecholapps.ca/browse";
	}
	else if (brandInput == "GO") {
		return "https://www.wip.prod.factory-gaptecholapps.ca/browse";
	}
	else if (brandInput == "BR") {
		return "https://brol.wip.prod.gaptecholapps.ca/browse";
	}
	else if (brandInput == "BRFS") {
		return "https://brfol.wip.prod.factory-gaptecholapps.ca/browse";
	}
	else if (brandInput == "AT") {
		return "https://atol.wip.prod.gaptecholapps.ca/browse/"
	}
}

function getHostByBrandForLegacyDivision(brandInput) {

	if (brandInput == "ON") {
		return "https://onol.wip.prod.gaptecholapps.ca/browse/division.do";
	}
	else if (brandInput == "GAP") {
		return "https://www.wip.prod.gaptecholapps.ca/browse/division.do";
	}
	else if (brandInput == "GO") {
		return "https://www.wip.prod.factory-gaptecholapps.ca/browse/division.do";
	}
	else if (brandInput == "BR") {
		return "https://brol.wip.prod.gaptecholapps.ca/browse/division.do";
	}
	else if (brandInput == "BRFS") {
		return "https://brfol.wip.prod.factory-gaptecholapps.ca/browse/division.do";
	}
	else if (brandInput == "AT") {
		return "https://atol.wip.prod.gaptecholapps.ca/browse/division.do"
	}
}



function getHostByBrandForLegacyCategory(brandInput) {

	if (brandInput == "ON") {
		return "https://onol.wip.prod.gaptecholapps.ca/browse/category.do";
	}
	else if (brandInput == "GAP") {
		return "https://www.wip.prod.gaptecholapps.ca/browse/category.do";
	}
	else if (brandInput == "GO") {
		return "https://www.wip.prod.factory-gaptecholapps.ca/browse/category.do";
	}
	else if (brandInput == "BR") {
		return "https://brol.wip.prod.gaptecholapps.ca/browse/category.do";
	}
	else if (brandInput == "BRFS") {
		return "https://brfol.wip.prod.factory-gaptecholapps.ca/browse/category.do";
	}
	else if (brandInput == "AT") {
		return "https://atol.wip.prod.gaptecholapps.ca/browse/category.do"
	}
}

//https://onol.wip.prod.gaptecholapps.ca/browse/maternity/bras-underwear/sports-bras?cid=1177845&style=3029585&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT

function generatePreviewNLULegacyURLSubCategory(brandInput, nluInput, cidInput, parentCIDInput, legacy, context) {

	if (legacy == 'LEGACY') {
		var temp = getHostByBrandForLegacyCategory(brandInput);
	}
	else {
		var temp = getHostByBrand(brandInput);
	}
	var temp2 = "?cid="
	if (context == "EN_CA") {
		var temp3 = "&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
	}
	else if (context == "FR_CA") {
		var temp3 = "&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
	}
	var temp4 = "&style="

	if (legacy == 'LEGACY') {
		return temp + temp2 + parentCIDInput + temp4 + cidInput + temp3;
	}
	else{
		if(nluInput=='' || nluInput==null){
		return '';
		}
		return temp + nluInput + temp2 + parentCIDInput + temp4 + cidInput + temp3;
		
		}
	//return temp + nluInput + temp2 + parentCIDInput + temp4 + cidInput + temp3;
}



function generatePreviewNLULegacyURLCategory(brandInput, nluInput, cidInput, legacy, context) {
	if (legacy == 'LEGACY') {
		var temp = getHostByBrandForLegacyCategory(brandInput);
	}
	else {
		var temp = getHostByBrand(brandInput);
	}
	var temp2 = "?cid="

	if (context == "EN_CA") {
		var temp3 = "&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
	}
	else if (context == "FR_CA") {
		var temp3 = "&locale=fr_CA&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
	}
	if (legacy == 'LEGACY') {
		return temp + temp2 + cidInput + temp3;
	}
	else{
		if(nluInput=='' || nluInput==null){
		return '';
		}
		return temp + nluInput + temp2 + cidInput + temp3;
		}
	//return temp + nluInput + temp2 + cidInput + temp3;
}




function generatePreviewNLULegacyURLDivision(brandInput, nluInput, cidInput, legacy, context) {

	if (legacy == 'LEGACY') {
		var temp = getHostByBrandForLegacyDivision(brandInput);
	}
	else {
		var temp = getHostByBrand(brandInput);
	}

	var temp2 = "?cid="

	if (context == "EN_CA") {
		var temp3 = "&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
	}
	else if (context == "FR_CA") {
		var temp3 = "&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
	}
	if (legacy == 'LEGACY') {
		return temp + temp2 + cidInput + temp3;
	}
	else {
		if(nluInput=='' || nluInput==null){
		return '';
		}
		return temp + nluInput + temp2 + cidInput + temp3;
	}
	//return temp + nluInput + temp2 + cidInput + temp3;
}


function mainMethod(context) {
	// get the web Hierarchy classification root 
	var webHierarchyRoot = stepManager.getClassificationHome().getClassificationByID("101130");
	//get the childern in the web Hierarchy this will return only Band level, then iterate in each brand separately
	var brandList = webHierarchyRoot.getChildren();
	//log.info("brandLevel " +brandLevel);
	for (var brandId = 0; brandId < brandList.size(); brandId++) {
		var brandObj = brandList.get(brandId);
		var rootBrand = getAttributeValue(brandObj, "a_Brand_Number");
		if (rootBrand != 'GPS') {
			var divisionList = brandObj.getChildren();
			for (var divId = 0; divId < divisionList.size(); divId++) {

				var divisiondObj = divisionList.get(divId);
				var cxtSpeciDivObj = getContextSpecificObject(divisiondObj, context);
				var isActiveDivision = "";
				//var hasDivName = "NULL";
				// this block works for the EN_US straight 
				// lets assume a division is available for both the markets 
				if (cxtSpeciDivObj != "undefined") {
					isActiveDivision = isCategoryActiveOrFuture(cxtSpeciDivObj);
					//hasDivName = getAttributeValueAsPerContext(cxtSpeciDivObj, "a_Category_Description", context);
				}
				// when the CA context If the division is in active Not required to be worried about any thing else 
				//this block is exclusive for the EN_CA this gets executed when the  is active division should be true with the context , when executing for the EN_CA market isActiveDivision will be fetched as per the market i.e en_CA also , now check if the division is active for US market (this is required to chekc only if CA market and Its active in CA market ) 

				//log.info("hasDivName  " +hasDivName);
				if (isActiveDivision == true) {
					//Export division details as per the requested format 		
					getDivisionDetails(cxtSpeciDivObj, context);
					//returns the category under the division Unblock this after testing divisions 
					var ctyList = cxtSpeciDivObj.getChildren();
					for (var ctyListId = 0; ctyListId < ctyList.size(); ctyListId++) {
						var ctyObject = ctyList.get(ctyListId);
						//if(ctyObject.getID()=="WC-1090481"){
						var cxtSpeciCtyObj = getContextSpecificObject(ctyObject, context);
						var isActiveCty = "";
						if (cxtSpeciCtyObj != "undefined") {
							isActiveCty = isCategoryActiveOrFuture(cxtSpeciCtyObj);
						}

						if (isActiveCty == true) {
							getCategoryDetails(cxtSpeciCtyObj, context);
							//returns sub categories under the category 
							var subCtyList = cxtSpeciCtyObj.getChildren();
							for (var subCtyListId = 0; subCtyListId < subCtyList.size(); subCtyListId++) {
								var subCtyObject = subCtyList.get(subCtyListId);
								//if(subCtyObject.getID()=="WSC-85365"){
								//log.info ("started here for the seclected sub category ");
								var cxtSpeciSubCtyObj = getContextSpecificObject(subCtyObject, context);
								var isActiveSubCty = "";
								if (cxtSpeciSubCtyObj != "undefined") {

									isActiveSubCty = isCategoryActiveOrFuture(cxtSpeciSubCtyObj);
								}
								if (context == "EN_CA" && isActiveSubCty == true) {
									var defaultCtxSubCtyObj = getContextSpecificObject(subCtyObject, "EN_US");
									var defualtCtxSubCtyActive = isCategoryActiveOrFuture(defaultCtxSubCtyObj);
									if (defualtCtxSubCtyActive != "undefined" && defualtCtxSubCtyActive == true) {
										isActiveSubCty = false;
									} else {
										isActiveSubCty = true;
									}
								}
								if (isActiveSubCty == true) {
									getSubCategoryDetails(subCtyObject, context);
								}
							}
						}
					}
				}
			}
		}
	}
}



function getContextSpecificObject(object, context) {
	var contextSpecificObject = "";
	contextSpecificObject = stepManager.executeInContext(context, function (specificManager) {
		//get the object of the required context
		var ObjectinContext = specificManager.getObjectFromOtherManager(object);
		// checks if the Object in Other Context is Active ? 
		//var isActive= isCategoryActiveOrFuture(ObjectinContext) ;
		if (ObjectinContext != "undefined" && ObjectinContext != null) {
			return ObjectinContext;
		}
	});
	return contextSpecificObject;
}

function containsDoubleQuotes(text) {
	return text.includes('"');
}
//################################################################
//**********get attribute value from a different context ***********
//################################################################
function getContextSpecificValues(object, sAttribute, context) {
	var contextSpecificAttrValue = "";
	contextSpecificAttrValue = stepManager.executeInContext(context, function (specificManager) {
		//get the object of the required context
		var ObjectinContext = specificManager.getObjectFromOtherManager(object);
		// checks if the Object in Other Context is Active ? 

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
	} else { contextSpecificAttrValue = contextSpecificAttrValue; }
	return contextSpecificAttrValue.trim();
}

function getDivisionDetails(divisiondObj, divContext) {		//Division ID


	var divisionId = divisiondObj.getID();
	var divCtyName = getAttributeValueAsPerContext(divisiondObj, "a_Category_Description", divContext);

	var en_CA_divCtyName = getAttributeValueForOtherContext(divisiondObj, "a_Category_Description", divContext);

	var fr_CA_divCtyName = getContextSpecificValues(divisiondObj, "a_Category_Description", "FR_CA");

	var divisionCID = getAttributeValue(divisiondObj, "a_WebCategory_CID");
	var en_CA_divisionSlug = getAttributeValueAsPerContext(divisiondObj, "a_Division_Slug", divContext);
	var fr_CA_divisionSlug = getAttributeValueAsPerContext(divisiondObj, "a_Division_Slug", "FR_CA");

	// Also called slug path 
	//var en_CA_divslugName= getAttributeValueForOtherContext(divisiondObj, "a_Division_Slug", divContext);
	// Also called slug path 
	var en_CA_divslugNLU = getAttributeValueForOtherContext(divisiondObj, "a_Natural_Language_URL", divContext);

	//var fr_CA_divslugName =  getContextSpecificValues(divisiondObj,"a_Division_Slug","FR_CA");
	// Also called slug path 
	var fr_CA_divslugNLU = getContextSpecificValues(divisiondObj, "a_Natural_Language_URL", "FR_CA");

	var objectTypeName = divisiondObj.getObjectType().getName();

	var brandNo = getAttributeValue(divisiondObj, "a_Brand_Number");

	var en_CA_nluPreview = generatePreviewNLULegacyURLDivision(brandNo, en_CA_divslugNLU, divisionCID, "PREVIEW", "EN_CA");
	var fr_CA_nluPreview = generatePreviewNLULegacyURLDivision(brandNo, fr_CA_divslugNLU, divisionCID, "PREVIEW", "FR_CA");
	var en_CA_legacyPreview = generatePreviewNLULegacyURLDivision(brandNo, en_CA_divslugNLU, divisionCID, "LEGACY", "EN_CA");
	var fr_CA_legacyPreview = generatePreviewNLULegacyURLDivision(brandNo, fr_CA_divslugNLU, divisionCID, "LEGACY", "FR_CA");
	var market = "CA";

	fw.write(brandNo + "," + market + "," + objectTypeName + "," + divisionId + "," + divisionCID + "," + en_CA_divslugNLU + "," + en_CA_legacyPreview + "," + en_CA_nluPreview + "," + fr_CA_divslugNLU + "," + fr_CA_legacyPreview + "," + fr_CA_nluPreview + "\n");

}
//################################################################
//********** write Category details  ***********
//################################################################
function getCategoryDetails(ctyObject, ctyContext) {
	//Category ID 
	var ctyId = ctyObject.getID();
	//get Division details 

	//Division Name

	// Parent Details End for first 4 columns 
	// Category Name of category 

	//Category CID
	var ctyCID = getAttributeValue(ctyObject, "a_WebCategory_CID");

	// Category Slug Name		
	var ctySlug = getAttributeValueAsPerContext(ctyObject, "a_Category_Slug", ctyContext);
	// Category Slug Path
	var ctyNLU = getAttributeValueAsPerContext(ctyObject, "a_Natural_Language_URL", ctyContext);
	//SubCategory Slug Name	will be null 
	//SubCategory Slug Path will be null 
	//CA Division Slug Name

	//CA Division Slug Path

	//CA Category Slug Name
	//var en_CA_ctySlugName =  getAttributeValueForOtherContext(ctyObject, "a_Category_Slug", ctyContext);
	// Also called slug path 
	var en_CA_ctySlugNLU = getAttributeValueForOtherContext(ctyObject, "a_Natural_Language_URL", ctyContext);

	//CA SubCategory Slug Name will be null
	//CA SubCategory Slug Path will be null
	//French Division Slug Name

	//French Category Slug Name
	var fr_CA_ctySlugName = getContextSpecificValues(ctyObject, "a_Category_Slug", "FR_CA");
	//French Category Slug Path
	var fr_CA_ctySlugNLU = getContextSpecificValues(ctyObject, "a_Natural_Language_URL", "FR_CA");
	//French SubCategory Slug Name will be null 
	//French SubCategory Slug Path will be null
	var objectTypeCty = ctyObject.getObjectType().getName();
	var ctyBrandNo = getAttributeValue(ctyObject, "a_Brand_Number");

	var catBrandNo = getAttributeValue(ctyObject, "a_Brand_Number");
	var en_CA_nluPreview = generatePreviewNLULegacyURLCategory(catBrandNo, en_CA_ctySlugNLU, ctyCID, "PREVIEW", "EN_CA");
	var fr_CA_nluPreview = generatePreviewNLULegacyURLCategory(catBrandNo, fr_CA_ctySlugNLU, ctyCID, "PREVIEW", "FR_CA");
	var en_CA_legacyPreview = generatePreviewNLULegacyURLCategory(catBrandNo, en_CA_ctySlugNLU, ctyCID, "LEGACY", "EN_CA");
	var fr_CA_legacyPreview = generatePreviewNLULegacyURLCategory(catBrandNo, fr_CA_ctySlugNLU, ctyCID, "LEGACY", "FR_CA");
	var market = "CA";

	fw.write(catBrandNo + "," + market + "," + objectTypeCty + "," + ctyId + "," + ctyCID + "," + en_CA_ctySlugNLU + "," + en_CA_legacyPreview + "," + en_CA_nluPreview + "," + fr_CA_ctySlugNLU + "," + fr_CA_legacyPreview + "," + fr_CA_nluPreview + "\n");

}//################################################################
//********** write Category details  ***********
//################################################################
function getSubCategoryDetails(subCtyObject, subCtyContext) {
	//Sub category ID 
	var subCtyid = subCtyObject.getID();
	var subctyCtyObject = subCtyObject.getParent();
	var subCtyCtyCID = getAttributeValue(subctyCtyObject, "a_WebCategory_CID");

	// Category Name of sub category
	var subCtyName = getAttributeValueAsPerContext(subCtyObject, "a_Category_Description", subCtyContext);
	//CA Category Name of sub category
	var en_CA_subCtyName = getAttributeValueForOtherContext(subCtyObject, "a_Category_Description", subCtyContext);
	//FR Category Name of sub category
	var fr_CA_subCtyName = getContextSpecificValues(subCtyObject, "a_Category_Description", "FR_CA");
	//Category CID of sub category
	var subCtyCID = getAttributeValue(subCtyObject, "a_WebCategory_CID");
	//Division Slug Name for the sub category 

	// Sub Category Slug Name		
	var subCtySlug = getAttributeValueAsPerContext(subCtyObject, "a_SubCategory_Slug", subCtyContext);
	// Sub Category Slug Path
	var subCtyNLU = getAttributeValueAsPerContext(subCtyObject, "a_Natural_Language_URL", subCtyContext);

	//CA Division Slug Name

	//CA SubCategory Slug Name will be null
	var en_CA_subCtySlugName = getAttributeValueForOtherContext(subCtyObject, "a_SubCategory_Slug", subCtyContext);
	//CA SubCategory Slug Path will be null
	var en_CA_subCtySlugNLU = getAttributeValueForOtherContext(subCtyObject, "a_Natural_Language_URL", subCtyContext);
	//French Division Slug Name

	//French Division Slug Path	

	//French Category Slug Path

	//CA SubCategory Slug Name will be null
	var fr_CA_subCtySlugName = getContextSpecificValues(subCtyObject, "a_SubCategory_Slug", "FR_CA");
	//CA SubCategory Slug Path will be null
	var fr_CA_subCtySlugNLU = getContextSpecificValues(subCtyObject, "a_Natural_Language_URL", "FR_CA");

	var objectTypeSubCty = subCtyObject.getObjectType().getName();

	var subCtyBrandNo = getAttributeValue(subCtyObject, "a_Brand_Number");

	var en_CA_nluPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, en_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "PREVIEW", "EN_CA");
	var fr_CA_nluPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, fr_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "PREVIEW", "FR_CA");
	var en_CA_legacyPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, en_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "LEGACY", "EN_CA");
	var fr_CA_legacyPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, fr_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "LEGACY", "FR_CA");

	var market = "CA";
	fw.write(subCtyBrandNo + "," + market + "," + objectTypeSubCty + "," + subCtyid + "," + subCtyCID + "," + en_CA_subCtySlugNLU + "," + en_CA_legacyPreview + "," + en_CA_nluPreview + "," + fr_CA_subCtySlugNLU + "," + fr_CA_legacyPreview + "," + fr_CA_nluPreview + "\n");
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

//################################################################
//********** get the Exact attribute value based on the context for Context Specific ***********
//################################################################	
function getAttributeValueForOtherContext(objectNode, attribute, context) {
	var attrValue = "";
	if (context == "EN_US") {
		attrValue = getContextSpecificValues(objectNode, attribute, "EN_CA");
	} else {
		attrValue = getAttributeValue(objectNode, attribute);
	}
	return attrValue;
}

function isCategoryActiveOrFuture(categoryOBj) {
	//log.info("startDate before this  Started ");

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
			} else if (endDate == null && startDate == null) { return false; }
			else { return false; }
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
	} else { attributeValue = attributeValue; }
	return attributeValue.trim();
}
mainMethod("EN_CA");

fw.flush();
fw.close();


var fileInputStream = new java.io.FileInputStream(file);
var asset = stepManager.getAssetHome().getAssetByID("TF_128577680");
var uploaded = asset.upload(fileInputStream, filePath);
// set up Email 
var mailMethod = mail.mail();
//var emailIDTO= mailMethod.addTo("rambhupalreddy_Thatiparthy@gap.com;");
var emailIDTO = mailMethod.addTo("jagadish_beejapu@gap.com;sri_indu_dekkapati@gap.com;");
var emailSubject = mailMethod.subject("SEO preview NLU's ");
var emailBody = mailMethod.plainMessage("Please find NLU Preview URL's for CANADA");
// set attachment 
var attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
var setAttachMentName = attachment.name("SEO-PIM-Report_For_Legacy_NLU_CANADA.csv");
attachment.attach();
//send email 
var mailSentStatus = mailMethod.send();
}