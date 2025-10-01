/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEOLegacyURLGenerationFrench_Input",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "SEO Legacy URL Generation French Input",
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
exports.operation0 = function (node,stepManager,mail,LIB_AT,LIB_BRFS,LIB_BRFS_FULL,SEOInputLibrary) {
var filePath = "/opt/stibo/SEO-PIM-Report_For_Legacy_NLU.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
	file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
//w.write("Brand,Market,ObjectType,ID,CID,Name,ParentName,CategoryName,CategoryStartDate,CategoryEndDate,WebCategoryHide,EN_US_NLU,EN_US_LegayPreviewURL,EN_US_NLUPreviewURL\n");
//fw.write("Brand,Market,ObjectType,ID,CID,EN_CA_Name,EN_CA_ParentName,EN_CA_CategoryName,CategoryStartDate,CategoryEndDate,WebCategoryHide,EN_CA_NLU,EN_CA_LegayPreviewURL,EN_CA_NLUPreviewURL,FR_CA_Name,FR_CA_ParentName,FR_CA_CategoryName,FR_CA_NLU,FR_CA_LegacyPreviewURL,FR_CA_NLUPreviewURL\n");
fw.write("Brand,Market,Context,ObjectType,ID,CID,FR_CA_Name,FR_CA_ParentName,FR_CA_CategoryName,CategoryStartDate,CategoryEndDate,WebCategoryHide,FR_CA_NLU,FR_CA_Legay_PreviewURL,FR_CA_NLU_PreviewURL,FR_CA_Legay_LIVEURL,FR_CA_NLU_LIVEURL\n");



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
		return "https://atol.wip.prod.gaptecholapps.ca/browse";
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
		return "https://atol.wip.prod.gaptecholapps.ca/browse/division.do";
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
		return "https://atol.wip.prod.gaptecholapps.ca/browse/category.do";
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
	var temp2 = "?cid=";
	if (context == "EN_CA") {
		var temp3 = "&inventoryAware=true&previewDate=2024-10-08%2016%3A14%3A00%20PDT";
	}
	else if (context == "FR_CA") {
		var temp3 = "&locale=fr_CA&inventoryAware=true&previewDate=2024-10-08%2016%3A14%3A00%20PDT";
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
	var temp2 = "?cid=";

	if (context == "EN_CA") {
		var temp3 = "&inventoryAware=true&previewDate=2024-10-08%2016%3A14%3A00%20PDT";
	}
	else if (context == "FR_CA") {
		var temp3 = "&locale=fr_CA&inventoryAware=true&previewDate=2024-10-08%2016%3A14%3A00%20PDT";
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

	var temp2 = "?cid=";

	if (context == "EN_CA") {
		var temp3 = "&previewDate=2024-10-08%2016%3A14%3A00%20PDT";
	}
	else if (context == "FR_CA") {
		var temp3 = "&locale=fr_CA&previewDate=2024-10-08%2016%3A14%3A00%20PDT";
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

///-----
function getHostByBrandLIVE(brandInput) {

	if (brandInput == "ON") {
		return "https://oldnavy.gapcanada.ca/browse";
	}
	else if (brandInput == "GAP") {
		return "https://www.gapcanada.ca/browse";
	}
	else if (brandInput == "GO") {
		return "https://www.wip.prod.factory-gaptecholapps.ca/browse";
	}
	else if (brandInput == "BR") {
		return "https://bananarepublic.gapcanada.ca/browse";
	}
	else if (brandInput == "BRFS") {
		return "https://bananarepublicfactory.gapfactory.ca/browse";
	}
	else if (brandInput == "AT") {
		return "https://athleta.gapcanada.ca/browse";
	}
}

function getHostByBrandForLegacyDivisionLIVE(brandInput) {

	if (brandInput == "ON") {
		return "https://oldnavy.gapcanada.ca/browse/division.do";
	}
	else if (brandInput == "GAP") {
		return "https://www.gapcanada.ca/browse/division.do";
	}
	else if (brandInput == "GO") {
		return "https://www.wip.prod.factory-gaptecholapps.ca/browse/division.do";
	}
	else if (brandInput == "BR") {
		return "https://bananarepublic.gapcanada.ca/browse/division.do";
	}
	else if (brandInput == "BRFS") {
		return "https://bananarepublicfactory.gapfactory.ca/browse/division.do";
	}
	else if (brandInput == "AT") {
		return "https://athleta.gapcanada.ca/browse/division.do";
	}
}



function getHostByBrandForLegacyCategoryLIVE(brandInput) {

	if (brandInput == "ON") {
		return "https://oldnavy.gapcanada.ca/browse/category.do";
	}
	else if (brandInput == "GAP") {
		return "https://www.gapcanada.ca/browse/category.do";
	}
	else if (brandInput == "GO") {
		return "https://www.wip.prod.factory-gaptecholapps.ca/browse/category.do";
	}
	else if (brandInput == "BR") {
		return "https://bananarepublic.gapcanada.ca/browse/category.do";
	}
	else if (brandInput == "BRFS") {
		return "https://bananarepublicfactory.gapfactory.ca/browse/category.do";
	}
	else if (brandInput == "AT") {
		return "https://athleta.gapcanada.ca/browse/category.do";
	}
}
//https://onol.wip.prod.gaptecholapps.ca/browse/maternity/bras-underwear/sports-bras?cid=1177845&style=3029585&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT

function generatePreviewNLULegacyURLSubCategoryLIVE(brandInput, nluInput, cidInput, parentCIDInput, legacy, context) {

	if (legacy == 'LEGACY') {
		var temp = getHostByBrandForLegacyCategoryLIVE(brandInput);
	}
	else {
		var temp = getHostByBrandLIVE(brandInput);
	}
	var temp2 = "?cid=";
	var temp3 = "&locale=fr_CA";;

	var temp4 = "&style=";

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



function generatePreviewNLULegacyURLCategoryLIVE(brandInput, nluInput, cidInput, legacy, context) {
	if (legacy == 'LEGACY') {
		var temp = getHostByBrandForLegacyCategoryLIVE(brandInput);
	}
	else {
		var temp = getHostByBrandLIVE(brandInput);
	}
	var temp2 = "?cid=";

	var temp3 = "&locale=fr_CA";
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




function generatePreviewNLULegacyURLDivisionLIVE(brandInput, nluInput, cidInput, legacy, context) {

	if (legacy == 'LEGACY') {
		var temp = getHostByBrandForLegacyDivisionLIVE(brandInput);
	}
	else {
		var temp = getHostByBrandLIVE(brandInput);
	}

	var temp2 = "?cid=";
	var temp3 = "&locale=fr_CA";

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

///------


/*function mainMethod(context) {
//var catsList = SEOInputLibrary.getNodeListCAN();
//var catsList = LIB_BRFS.getNodeListCAN();
var catsList = LIB_BRFS_FULL.getNodeListCAN();
//var catsList = LIB_AT.getNodeListCAN();
	for (var i = 0; i < catsList.size(); i++) {
		var catObj = stepManager.getClassificationHome().getClassificationByID(catsList.get(i));
		if(catObj!=null){
		var rootBrand = catObj.getValue("a_Brand_Number").getSimpleValue();
		var objectType = catObj.getObjectType().getID();
		log.info(rootBrand + "," + objectType +"\n");
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

function getDivisionDetails(divisiondObj, divContext,contextID) {		//Division ID


	var divisionId = divisiondObj.getID();
	var divCtyName = getAttributeValueAsPerContext(divisiondObj, "a_Category_Description", divContext);
	

	var en_CA_divCtyName = getAttributeValueForOtherContext(divisiondObj, "a_Category_Description", divContext);

	//var fr_CA_divCtyName = getContextSpecificValues(divisiondObj, "a_Category_Description", "FR_CA");

	var divisionCID = getAttributeValue(divisiondObj, "a_WebCategory_CID");
	var en_CA_divisionSlug = getAttributeValueAsPerContext(divisiondObj, "a_Division_Slug", divContext);
	//var fr_CA_divisionSlug = getAttributeValueAsPerContext(divisiondObj, "a_Division_Slug", "FR_CA");

	// Also called slug path 
	//var en_CA_divslugName= getAttributeValueForOtherContext(divisiondObj, "a_Division_Slug", divContext);
	// Also called slug path 
	var en_CA_divslugNLU = getAttributeValueForOtherContext(divisiondObj, "a_Natural_Language_URL", divContext);

	//var fr_CA_divslugName =  getContextSpecificValues(divisiondObj,"a_Division_Slug","FR_CA");
	// Also called slug path 
	//var fr_CA_divslugNLU = getContextSpecificValues(divisiondObj, "a_Natural_Language_URL", "FR_CA");

	var objectTypeName = divisiondObj.getObjectType().getName();

	var brandNo = getAttributeValue(divisiondObj, "a_Brand_Number");

	var en_CA_nluPreview = generatePreviewNLULegacyURLDivision(brandNo, en_CA_divslugNLU, divisionCID, "PREVIEW", "FR_CA");
	//var fr_CA_nluPreview = generatePreviewNLULegacyURLDivision(brandNo, fr_CA_divslugNLU, divisionCID, "PREVIEW", "FR_CA");
	var en_CA_legacyPreview = generatePreviewNLULegacyURLDivision(brandNo, en_CA_divslugNLU, divisionCID, "LEGACY", "FR_CA");
	//var fr_CA_legacyPreview = generatePreviewNLULegacyURLDivision(brandNo, fr_CA_divslugNLU, divisionCID, "LEGACY", "FR_CA");
	
	var en_CA_nluLive = generatePreviewNLULegacyURLDivisionLIVE(brandNo, en_CA_divslugNLU, divisionCID, "PREVIEW", "FR_CA");
	//var fr_CA_nluPreview = generatePreviewNLULegacyURLDivision(brandNo, fr_CA_divslugNLU, divisionCID, "PREVIEW", "FR_CA");
	var en_CA_legacyLive = generatePreviewNLULegacyURLDivisionLIVE(brandNo, en_CA_divslugNLU, divisionCID, "LEGACY", "FR_CA");
	
	
	var market = "CA";
    
	var Name = divisiondObj.getName();
	Name = stringOperations(Name);
	var ctyStartDate =getAttributeValue(divisiondObj,"a_WebCategory_Start_Date");
	var ctyEndDate =getAttributeValue(divisiondObj,"a_WebCategory_End_Date");
     var categoryHide = getAttributeValue(divisiondObj,"a_WebCategory_Hide_Category");
     var parentName = divisiondObj.getParent().getName();
      parentName = stringOperations(parentName);



     //FRCA DATA
     var frenchObject =getContextSpecificObject(divisiondObj,"FR_CA");
     var frenchName = frenchObject.getName();
     frenchName = stringOperations(frenchName);
     var frenchParentName = frenchObject.getParent().getName();
       frenchParentName = stringOperations(frenchParentName);
     

      

	fw.write(brandNo + "," + market + "," +contextID+","+ objectTypeName + "," + divisionId + "," + divisionCID + ","+Name+","+parentName+","+divCtyName+","+ctyStartDate+","+ctyEndDate+","+categoryHide+","+en_CA_divslugNLU + "," + en_CA_legacyPreview + "," + en_CA_nluPreview +","+ en_CA_legacyLive + "," + en_CA_nluLive + "\n");

}
//################################################################
//********** write Category details  ***********
//################################################################
function getCategoryDetails(ctyObject, ctyContext,contextID) {
	//Category ID 
	var ctyId = ctyObject.getID();
	//get Division details 
     var ctyCtyName = getAttributeValueAsPerContext(ctyObject, "a_Category_Description", ctyContext);
     //var frenchCtyCtyName = getContextSpecificValues(ctyObject, "a_Category_Description", "FR_CA");
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
	//var fr_CA_ctySlugName = getContextSpecificValues(ctyObject, "a_Category_Slug", "FR_CA");
	//French Category Slug Path
	//var fr_CA_ctySlugNLU = getContextSpecificValues(ctyObject, "a_Natural_Language_URL", "FR_CA");
	//French SubCategory Slug Name will be null 
	//French SubCategory Slug Path will be null
	var objectTypeCty = ctyObject.getObjectType().getName();
	var ctyBrandNo = getAttributeValue(ctyObject, "a_Brand_Number");

	var catBrandNo = getAttributeValue(ctyObject, "a_Brand_Number");
	var en_CA_nluPreview = generatePreviewNLULegacyURLCategory(catBrandNo, en_CA_ctySlugNLU, ctyCID, "PREVIEW", "FR_CA");
	//var fr_CA_nluPreview = generatePreviewNLULegacyURLCategory(catBrandNo, fr_CA_ctySlugNLU, ctyCID, "PREVIEW", "FR_CA");
	var en_CA_legacyPreview = generatePreviewNLULegacyURLCategory(catBrandNo, en_CA_ctySlugNLU, ctyCID, "LEGACY", "FR_CA");
	//var fr_CA_legacyPreview = generatePreviewNLULegacyURLCategory(catBrandNo, fr_CA_ctySlugNLU, ctyCID, "LEGACY", "FR_CA");


	var en_CA_nluLive = generatePreviewNLULegacyURLCategoryLIVE(catBrandNo, en_CA_ctySlugNLU, ctyCID, "PREVIEW", "FR_CA");
	//var fr_CA_nluPreview = generatePreviewNLULegacyURLCategory(catBrandNo, fr_CA_ctySlugNLU, ctyCID, "PREVIEW", "FR_CA");
	var en_CA_legacyLive = generatePreviewNLULegacyURLCategoryLIVE(catBrandNo, en_CA_ctySlugNLU, ctyCID, "LEGACY", "FR_CA");
	
	var market = "CA";
	
	var Name = ctyObject.getName();
	Name = stringOperations(Name);
	var ctyStartDate =getAttributeValue(ctyObject,"a_WebCategory_Start_Date");
	var ctyEndDate =getAttributeValue(ctyObject,"a_WebCategory_End_Date");
     var categoryHide = getAttributeValue(ctyObject,"a_WebCategory_Hide_Category");
     var parentName = ctyObject.getParent().getName();
     parentName = stringOperations(parentName);


          //FRCA DATA
     var frenchObject =getContextSpecificObject(ctyObject,"FR_CA");
     var frenchName = frenchObject.getName();
     frenchName = stringOperations(frenchName);
     var frenchParentName = frenchObject.getParent().getName();
     frenchParentName = stringOperations(frenchParentName);

	fw.write(catBrandNo + "," + market + "," +contextID+","+ objectTypeCty + "," + ctyId + "," + ctyCID + ","+Name+","+parentName+","+ctyCtyName+","+ctyStartDate+","+ctyEndDate+","+categoryHide+","+ en_CA_ctySlugNLU + "," + en_CA_legacyPreview + "," + en_CA_nluPreview+ ","+  en_CA_legacyLive + "," + en_CA_nluLive +  "\n");

}//################################################################
//********** write Category details  ***********
//################################################################
function getSubCategoryDetails(subCtyObject, subCtyContext,contextID) {
	//Sub category ID 
	var subCtyid = subCtyObject.getID();
	var subctyCtyObject = subCtyObject.getParent();
	var subCtyCtyCID = getAttributeValue(subctyCtyObject, "a_WebCategory_CID");

	// Category Name of sub category
	var subCtyName = getAttributeValueAsPerContext(subCtyObject, "a_Category_Description", subCtyContext);
	//CA Category Name of sub category
	var en_CA_subCtyName = getAttributeValueForOtherContext(subCtyObject, "a_Category_Description", subCtyContext);
	//FR Category Name of sub category
	//var fr_CA_subCtyName = getContextSpecificValues(subCtyObject, "a_Category_Description", "FR_CA");
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
	//var fr_CA_subCtySlugName = getContextSpecificValues(subCtyObject, "a_SubCategory_Slug", "FR_CA");
	//CA SubCategory Slug Path will be null
	//var fr_CA_subCtySlugNLU = getContextSpecificValues(subCtyObject, "a_Natural_Language_URL", "FR_CA");

	var objectTypeSubCty = subCtyObject.getObjectType().getName();

	var subCtyBrandNo = getAttributeValue(subCtyObject, "a_Brand_Number");

	var en_CA_nluPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, en_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "PREVIEW", "FR_CA");
	//var fr_CA_nluPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, fr_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "PREVIEW", "FR_CA");
	var en_CA_legacyPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, en_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "LEGACY", "FR_CA");
	//var fr_CA_legacyPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, fr_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "LEGACY", "FR_CA");

	var en_CA_nluLive = generatePreviewNLULegacyURLSubCategoryLIVE(subCtyBrandNo, en_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "PREVIEW", "FR_CA");
	//var fr_CA_nluPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo, fr_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "PREVIEW", "FR_CA");
	var en_CA_legacyLive = generatePreviewNLULegacyURLSubCategoryLIVE(subCtyBrandNo, en_CA_subCtySlugNLU, subCtyCID, subCtyCtyCID, "LEGACY", "FR_CA");


	var market = "CA";

	var Name = subCtyObject.getName();
	Name = stringOperations(Name);
	var ctyStartDate =getAttributeValue(subCtyObject,"a_WebCategory_Start_Date");
	var ctyEndDate =getAttributeValue(subCtyObject,"a_WebCategory_End_Date");
     var categoryHide = getAttributeValue(subCtyObject,"a_WebCategory_Hide_Category");
     var parentName = subCtyObject.getParent().getName();
     parentName = stringOperations(parentName);


     //FRCA DATA
     var frenchObject =getContextSpecificObject(subCtyObject,"FR_CA");
     var frenchName = frenchObject.getName();
     frenchName = stringOperations(frenchName);
     var frenchParentName = frenchObject.getParent().getName();
     frenchParentName = stringOperations(frenchParentName);
     
	fw.write(subCtyBrandNo + "," + market + "," +contextID+","+ objectTypeSubCty + "," + subCtyid + "," + subCtyCID + ","+Name+","+parentName+","+subCtyName+","+ctyStartDate+","+ctyEndDate+","+categoryHide+","+en_CA_subCtySlugNLU + "," + en_CA_legacyPreview + "," + en_CA_nluPreview +","+ en_CA_legacyLive + "," + en_CA_nluLive + "\n");
}


function getAttributeValueAsPerContext(objectNode, attribute, context) {

	var asignValue = "";
	if (context == "FR_CA") {
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
	if (context == "FR_CA") {
		attrValue = getContextSpecificValues(objectNode, attribute, "FR_CA");
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
			}else{attributeValue = attributeValue ; }
			return attributeValue.trim();
		
		
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

var brandMailInput =null;
var contextID = stepManager.getCurrentContext().getID();
mainMethod("FR_CA",contextID);

fw.flush();
fw.close();


var fileInputStream = new java.io.FileInputStream(file);
var asset = stepManager.getAssetHome().getAssetByID("TF_128577680");
var uploaded = asset.upload(fileInputStream, filePath);
// set up Email 
var mailMethod = mail.mail();
//var emailIDTO= mailMethod.addTo("rambhupalreddy_Thatiparthy@gap.com;");
var emailIDTO = mailMethod.addTo("jagadish_beejapu@gap.com;sri_indu_dekkapati@gap.com;venugopal_nandimandalam@gap.com;venkatesh_bhimavaram@gap.com;devojoyti_pal@gap.com;priyadarshini_sahoo@gap.com;");
var emailSubject = mailMethod.subject(brandMailInput + "-" + contextID );
var emailBody = mailMethod.plainMessage("Please find "+ brandMailInput+ " NLU URL's for "+ contextID);
// set attachment 
var attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
var setAttachMentName = attachment.name("SEO-PIM-Report_For_Legacy_NLU_French.csv");
attachment.attach();
//send email 
var mailSentStatus = mailMethod.send();



function mainMethod(context) {
	//var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-1038093");  //BRFS
	//var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-5001"); //BR
 //    var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-5058"); //GAP
   //  var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-46650");  //AT
	var brand_ALL = stepManager.getClassificationHome().getClassificationByID("WBU-5151");  //ON
      brandMailInput= brand_ALL.getValue('a_Brand_Number').getValue();
	
 

	
	var divisionList = brand_ALL.getChildren();
	var catsList = new java.util.ArrayList();
	var subCatsList = new java.util.ArrayList();
 
	for (var i = 0; i < divisionList.size(); i++) {
		var divObj = divisionList.get(i);
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
 
	for (var i = 0; i < catsList.size(); i++) {
		var catObj = catsList.get(i);
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
 
	for (var i = 0; i < subCatsList.size(); i++) {
		var subCatObj = subCatsList.get(i);
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