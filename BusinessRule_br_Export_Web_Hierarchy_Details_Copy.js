/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Export_Web_Hierarchy_Details_Copy",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "br_Export_Web_Hierarchy_Details_Copy",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
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
exports.operation0 = function (stepManager,node,mail) {
	// Global variables 
	var filePath = "/opt/stibo/SEO-PIM-Report_For_Active_And_Upcomming_Categories.csv";
	var file = new java.io.File(filePath);
	if(!file.exists())
	{
	file.createNewFile();
	}
	var fw= new java.io.FileWriter(file,false);
	fw.write("ID,Division Name,CA Division Name,French Division Name,Division CID,Category Name,CA Category Name,French Category Name,Category CID,SubCategory Name,CA SubCategory Name,French SubCategory Name,SubCategory CID,Division Slug Name,Division Slug Path,Category Slug Name,Category Slug Path,SubCategory Slug Name,SubCategory Slug Path,CA Division Slug Name,CA Division Slug Path,CA Category Slug Name,CA Category Slug Path,CA SubCategory Slug Name,CA SubCategory Slug Path,French Division Slug Name,French Division Slug Path,French Category Slug Name,French Category Slug Path,French SubCategory Slug Name,French SubCategory Slug Path,Object Type,Brand,Start Date,End Date,Hidden,Assortment Type,Page Title,Meta Description,Indexable,Old Division Slug Path,CA Old Division Slug Path,French Old Division Slug Path,Old Category Slug Path,CA Old Category Slug Path,French Old Category Slug Path,Old SubCategory Slug Path,CA Old SubCategory Slug Path,French Old SubCategory Slug Path,Division Redirect URL,CA Division Redirect URL,French Division Redirect URL,Category Redirect URL,CA Category Redirect URL,French Category Redirect URL,SubCategory Redirect URL,CA SubCategory Redirect URL,French SubCategory Redirect URL\n");
	
function containsDoubleQuotes(text) {
    return text.includes('"');
}
	//################################################################
	//**********get attribute value from a different context ***********
	//################################################################
function getContextSpecificValues(object, sAttribute, context)
	{
		var contextSpecificAttrValue = "";
		contextSpecificAttrValue = stepManager.executeInContext(context, function(specificManager) {
				//get the object of the required context
				var ObjectinContext =  specificManager.getObjectFromOtherManager(object);
				// checks if the Object in Other Context is Active ? 
				
				if (isCategoryActiveOrFuture(ObjectinContext) ==  true ){
				 return  ObjectinContext.getValue(sAttribute).getSimpleValue(); }
			});		
			if(contextSpecificAttrValue == null || contextSpecificAttrValue == "undefined")
			{
			// to replace null with ""
			contextSpecificAttrValue = " "; 
			}else if (containsDoubleQuotes(contextSpecificAttrValue) == true ){
			contextSpecificAttrValue = "\""+contextSpecificAttrValue+"\""+'"';
			}else if(contextSpecificAttrValue.contains(",")){
			// SKIP " and warp text that contains ","
			contextSpecificAttrValue = "\""+contextSpecificAttrValue+"\"";
			}else{contextSpecificAttrValue = contextSpecificAttrValue;}
			return contextSpecificAttrValue.trim();
	}
		//################################################################
	//**********get Object off a different Context value from a different context ***********
	//################################################################
function getContextSpecificObject(object, context)
	{
		var contextSpecificObject = "";
		contextSpecificObject = stepManager.executeInContext(context, function(specificManager) {
				//get the object of the required context
				var ObjectinContext =  specificManager.getObjectFromOtherManager(object);
				// checks if the Object in Other Context is Active ? 
				//var isActive= isCategoryActiveOrFuture(ObjectinContext) ;
				if (ObjectinContext != "undefined" && ObjectinContext !=  null  ){
				 return ObjectinContext; }
			});		
			return contextSpecificObject ;
	}
//################################################################
//**********get attribute value of a attribute and Skip if there are any special characters such as " and , **********
//################################################################
	function getAttributeValue(currentNode,attribute){
			
			var attributeValue ="";
			attributeValue = currentNode.getValue(attribute).getSimpleValue(); 
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
	//################################################################
	//********** logic to check if the Object is eligible for report ***********
	//################################################################
function isCategoryActiveOrFuture(categoryOBj){
	//log.info("startDate before this  Started ");
	
	if(categoryOBj != "undefined" ){
	var description = categoryOBj.getValue("a_Category_Description").getSimpleValue();	
	if(description != null ){
	var today = new Date();
	var startDate = categoryOBj.getValue("a_WebCategory_Start_Date").getSimpleValue();
	var endDate  =   categoryOBj.getValue("a_WebCategory_End_Date").getSimpleValue();
		if(endDate != null){
		var formattedEndDate =  new Date(endDate) ;
		formattedEndDate.setHours(23);
		formattedEndDate.setMinutes(59);
		formattedEndDate.setSeconds(59);
		}
		if(startDate != null ){
		var formattedStartDate =  new Date(startDate) 	;
		formattedStartDate.setHours(23);
		formattedStartDate.setMinutes(59);
		formattedStartDate.setSeconds(59);
		}
				
				if(endDate == null && (formattedStartDate >= today || formattedStartDate <= today) )
				{
					// if there is no end date means it will never expire and currently active or future active based on the start date
					 return true ;	
				}else if( formattedEndDate >= today && (formattedStartDate >= today || formattedStartDate<= today) )  
				{
				// End date is greater than today then It is not expired irrespective of start date 
				return true ;
				}else if (endDate == null  && startDate == null ){return false ;}
				else {return false ;}
		}
		}
}
//################################################################
//********** get the Exact attribute value based on the context   ***********
//################################################################
function getAttributeValueAsPerContext(objectNode, attribute, context){
			
			var asignValue= "";
			if(context == "EN_US"){
			asignValue =getAttributeValue(objectNode,attribute);
			}else{
			asignValue = "";
			}
			return asignValue;
}
	
//################################################################
//********** get the Exact attribute value based on the context for Context Specific ***********
//################################################################	
function getAttributeValueForOtherContext(objectNode, attribute, context){	
			var attrValue =  "";			
			if(context == "EN_US"){
			attrValue =getContextSpecificValues(objectNode,attribute,"EN_CA");
			}else{
			attrValue = getAttributeValue(objectNode,attribute);
			}
		return attrValue;
}
	//################################################################
			//********** write division details to file  ***********
	//################################################################
function getDivisionDetails (divisiondObj,divContext)
{		//Division ID
		
	
			var divisionId = divisiondObj.getID();
			var divCtyName = getAttributeValueAsPerContext(divisiondObj, "a_Category_Description", divContext);
			
			var en_CA_divCtyName =  getAttributeValueForOtherContext(divisiondObj, "a_Category_Description", divContext);	
			
			var fr_CA_divCtyName =  getContextSpecificValues(divisiondObj,"a_Category_Description","FR_CA");
		 
			var divisionCID =getAttributeValue(divisiondObj,"a_WebCategory_CID");
			var divisionSlug = getAttributeValueAsPerContext(divisiondObj, "a_Division_Slug", divContext);			
		
			// Also called slug path 
			var categoryNLU = getAttributeValueAsPerContext(divisiondObj, "a_Natural_Language_URL", divContext);	
			var en_CA_divslugName= getAttributeValueForOtherContext(divisiondObj, "a_Division_Slug", divContext);
			// Also called slug path 
			var en_CA_divslugNLU= getAttributeValueForOtherContext(divisiondObj, "a_Natural_Language_URL", divContext);
		
			var fr_CA_divslugName =  getContextSpecificValues(divisiondObj,"a_Division_Slug","FR_CA");
			// Also called slug path 
			var fr_CA_divslugNLU =  getContextSpecificValues(divisiondObj,"a_Natural_Language_URL","FR_CA");
			
			var objectTypeName = divisiondObj.getObjectType().getName();
			
			var brandNo =getAttributeValue(divisiondObj,"a_Brand_Number");
			var ctyStartDate =getAttributeValue(divisiondObj,"a_WebCategory_Start_Date");
			
			var ctyEndDate =getAttributeValue(divisiondObj,"a_WebCategory_End_Date");
			
			var categoryHide = getAttributeValue(divisiondObj,"a_WebCategory_Hide_Category");
			var assortmentType = getAttributeValue(divisiondObj,"a_WebCategory_Assortment_Type");
		
			var pageTitle =getAttributeValue(divisiondObj,"a_SEO_Page_Title");
				
			var metaDesc = getAttributeValue(divisiondObj,"a_SEO_Meta_Description");
			
			var Index = getAttributeValue(divisiondObj,"a_SEO_Non_Indexable");
			var oldDivisionSlug = getAttributeValueAsPerContext(divisiondObj, "a_Old_Natural_Langauge_URL", divContext);
			var en_CA_OlddivSlug= getAttributeValueForOtherContext(divisiondObj, "a_Old_Natural_Langauge_URL", divContext);
			
			var fr_CA_oldDivSlug =  getContextSpecificValues(divisiondObj,"a_Old_Natural_Langauge_URL","FR_CA");
			//redirect URL
			var divRedirectUrl = getAttributeValueAsPerContext(divisiondObj, "a_Redirect_URL", divContext);
			var en_CA_divRedirectUrl= getAttributeValueForOtherContext(divisiondObj, "a_Redirect_URL", divContext);
			var fr_CA_divRedirectUrl =  getContextSpecificValues(divisiondObj,"a_Redirect_URL","FR_CA");
			//Redirect URL 
			fw.write( divisionId+","+divCtyName+","+en_CA_divCtyName+","+fr_CA_divCtyName +","+divisionCID+","+","+","+","+","+","+","+","+","+divisionSlug+","+categoryNLU+","+","+","+","+","+en_CA_divslugName+","+en_CA_divslugNLU+","+","+","+","+","+fr_CA_divslugName+","+fr_CA_divslugNLU+","+","+","+","+","+objectTypeName+","+brandNo+","+ctyStartDate+","+ctyEndDate+","+categoryHide+","+assortmentType+","+pageTitle+","+metaDesc+","+Index+oldDivisionSlug+","+en_CA_OlddivSlug+","+fr_CA_oldDivSlug+","+","+","+","+","+","+","+divRedirectUrl+","+en_CA_divRedirectUrl+","+fr_CA_divRedirectUrl+"\n");
			
}
	//################################################################
			//********** write Category details  ***********
	//################################################################
	function getCategoryDetails (ctyObject,ctyContext)
	{	
			//Category ID 
			var ctyId = ctyObject.getID();
			//get Division details 
			var divObject = ctyObject.getParent();
			//Division Name
			var ctyDivName = getAttributeValueAsPerContext(divObject, "a_Category_Description", ctyContext);
			//CA Division Name
			var en_CA_ctyDivName =  getAttributeValueForOtherContext(divObject, "a_Category_Description", ctyContext);	
			//French Division Name
			var fr_CA_ctyDivName =  getContextSpecificValues(divObject,"a_Category_Description","FR_CA");
			//Division CID
			var ctyDivCID =getAttributeValue(divObject,"a_WebCategory_CID");
	
			// Parent Details End for first 4 columns 
			// Category Name of category 
			var ctyCtyName = getAttributeValueAsPerContext(ctyObject, "a_Category_Description", ctyContext);
			//CA Category Name
			var en_CA_CtyName =  getAttributeValueForOtherContext(ctyObject, "a_Category_Description", ctyContext);
			//FR Category Name
			var fr_CA_CtyName =getContextSpecificValues(ctyObject,"a_Category_Description","FR_CA");
			//Category CID
			var ctyCID =getAttributeValue(ctyObject,"a_WebCategory_CID");
			//SubCategory Name will be null 
			//CA SubCategory Name will be null 
			//French SubCategory Name will be null 
			//SubCategory CID will be null 
			//Division Slug Name
			var ctyDivisionSlug = getAttributeValueAsPerContext(divObject, "a_Division_Slug", ctyContext);
			// Also called slug path Division Slug Path
			var ctyDivNLU = getAttributeValueAsPerContext(divObject, "a_Natural_Language_URL", ctyContext);
			
			// Category Slug Name		
			var ctySlug = getAttributeValueAsPerContext(ctyObject, "a_Category_Slug", ctyContext);
			// Category Slug Path
			var ctyNLU = getAttributeValueAsPerContext(ctyObject, "a_Natural_Language_URL", ctyContext);
			//SubCategory Slug Name	will be null 
			//SubCategory Slug Path will be null 
			//CA Division Slug Name
			var en_CA_divSlug = getAttributeValueForOtherContext(divObject, "a_Division_Slug", ctyContext);
			//CA Division Slug Path
			var en_CA_divNLU = getAttributeValueForOtherContext(divObject, "a_Natural_Language_URL", ctyContext);
			//CA Category Slug Name
			var en_CA_ctySlugName =  getAttributeValueForOtherContext(ctyObject, "a_Category_Slug", ctyContext);
			// Also called slug path 
			var en_CA_ctySlugNLU= getAttributeValueForOtherContext(ctyObject, "a_Natural_Language_URL", ctyContext);
			
			//CA SubCategory Slug Name will be null
			//CA SubCategory Slug Path will be null
			//French Division Slug Name
			var fr_CA_divSlug=  getContextSpecificValues(divObject,"a_Division_Slug","FR_CA");
			//French Division Slug Path	
			var fr_CA_divNLU =  getContextSpecificValues(divObject,"a_Natural_Language_URL","FR_CA");
			//French Category Slug Name
			var fr_CA_ctySlugName =  getContextSpecificValues(ctyObject,"a_Category_Slug","FR_CA");
			//French Category Slug Path
			var fr_CA_ctySlugNLU=  getContextSpecificValues(ctyObject,"a_Natural_Language_URL","FR_CA");
			//French SubCategory Slug Name will be null 
			//French SubCategory Slug Path will be null
			var objectTypeCty = ctyObject.getObjectType().getName();
			var ctyBrandNo = getAttributeValue(ctyObject,"a_Brand_Number");
			var ctyCtyStartDate =getAttributeValue(ctyObject,"a_WebCategory_Start_Date");
			var ctyCtyEndDate =getAttributeValue(ctyObject,"a_WebCategory_End_Date");
			var ctyCategoryHide =getAttributeValue(ctyObject,"a_WebCategory_Hide_Category");
			var ctyAssortmentType = getAttributeValue(ctyObject,"a_WebCategory_Assortment_Type");
			var ctyPageTitle =getAttributeValue(ctyObject,"a_SEO_Page_Title");
		
			var ctyMetaDesc = getAttributeValue(ctyObject,"a_SEO_Meta_Description");
		
			var ctyIndex =getAttributeValue(ctyObject,"a_SEO_Non_Indexable");
					
			var ctyOldDivisionSlug = getAttributeValueAsPerContext(divObject, "a_Old_Natural_Langauge_URL", ctyContext);
			
			var en_CA_ctyOlddivSlug =  getAttributeValueForOtherContext(divObject, "a_Old_Natural_Langauge_URL", ctyContext);
		
			var fr_CA_ctyOldDivSlug =  getContextSpecificValues(divObject,"a_Old_Natural_Langauge_URL","FR_CA");
						
			var ctyOldSlug = getAttributeValueAsPerContext(ctyObject, "a_Old_Natural_Langauge_URL", ctyContext);
			
			var en_CA_ctyOldSlug =  getAttributeValueForOtherContext(ctyObject, "a_Old_Natural_Langauge_URL", ctyContext);
			
			var fr_CA_ctyOldSlug =  getContextSpecificValues(ctyObject,"a_Old_Natural_Langauge_URL","FR_CA");
			//Redirect URL 
			var ctyDivReDUrl = getAttributeValueAsPerContext(divObject, "a_Redirect_URL", ctyContext);
			var en_CA_ctyDivReDUrl =  getAttributeValueForOtherContext(divObject, "a_Redirect_URL", ctyContext);
			var fr_CA_ctyDivReDUrl =  getContextSpecificValues(divObject,"a_Redirect_URL","FR_CA");	
			var ctyReDUrl = getAttributeValueAsPerContext(ctyObject, "a_Redirect_URL", ctyContext);
			var en_CA_ctyReDUrl =  getAttributeValueForOtherContext(ctyObject, "a_Redirect_URL", ctyContext);
			var fr_CA_ctyReDUrl =  getContextSpecificValues(ctyObject,"a_Redirect_URL","FR_CA");
			
			//Redirect URL 
		fw.write( ctyId+","+ctyDivName+","+en_CA_ctyDivName+","+fr_CA_ctyDivName +","+ctyDivCID+","+ctyCtyName+","+en_CA_CtyName+","+fr_CA_CtyName+","+ctyCID+","+","+","+","+","+ctyDivisionSlug+","+ctyDivNLU+","+ctySlug+","+ctyNLU+","+","+","+en_CA_divSlug+","+en_CA_divNLU+","+en_CA_ctySlugName+","+en_CA_ctySlugNLU+","+","+","+fr_CA_divSlug+","+fr_CA_divNLU+","+fr_CA_ctySlugName+","+fr_CA_ctySlugNLU+","+","+","+objectTypeCty+","+ctyBrandNo+","+ctyCtyStartDate+","+ctyCtyEndDate+","+ctyCategoryHide+","+ctyAssortmentType+","+ctyPageTitle+","+ctyMetaDesc+","+ctyIndex+","+ctyOldDivisionSlug+","+en_CA_ctyOlddivSlug+","+fr_CA_ctyOldDivSlug+","+ctyOldSlug+","+en_CA_ctyOldSlug+","+fr_CA_ctyOldSlug+","+","+","+","+ctyDivReDUrl+","+en_CA_ctyDivReDUrl+","+fr_CA_ctyDivReDUrl+","+ctyReDUrl+","+en_CA_ctyReDUrl+","+fr_CA_ctyReDUrl+"\n");
			
	}//################################################################
			//********** write Category details  ***********
	//################################################################
	function getSubCategoryDetails (subCtyObject,subCtyContext)
	{			
			//Sub category ID 
			var subCtyid = subCtyObject.getID();
			//get Division Object for SUB Category 
			var subctyDivObject = subCtyObject.getParent().getParent();
			//get Category Object for SUB Category
			var subctyCtyObject = subCtyObject.getParent();
			//Division Name
			var subctyDivName = getAttributeValueAsPerContext(subctyDivObject, "a_Category_Description", subCtyContext);
			
			//CA Division Name
			var en_CA_subCtyDivName = getAttributeValueForOtherContext(subctyDivObject, "a_Category_Description", subCtyContext);
			//French Division Name
			var fr_CA_subCtyDivName = getContextSpecificValues(subctyDivObject,"a_Category_Description","FR_CA");
			//Division CID
			var subCtyDivCID =getAttributeValue(subctyDivObject,"a_WebCategory_CID");
			
			// Parent Details End for first 4 columns 
			// Category Name of category 
			var subCtyCtyName = getAttributeValueAsPerContext(subctyCtyObject, "a_Category_Description", subCtyContext);
			//CA Category Name of sub category's Category 
			var en_CA_subCtyCtyName =  getAttributeValueForOtherContext(subctyCtyObject, "a_Category_Description", subCtyContext);
		
			//FR Category Name of sub category's Category 
			var fr_CA_subCtyCtyName =getContextSpecificValues(subctyCtyObject,"a_Category_Description","FR_CA");
			//Category CID of sub category's Category 
			var subCtyCtyCID =getAttributeValue(subctyCtyObject,"a_WebCategory_CID");
			// Category Name of sub category
			var subCtyName = getAttributeValueAsPerContext(subCtyObject, "a_Category_Description", subCtyContext);
			//CA Category Name of sub category
			var en_CA_subCtyName =  getAttributeValueForOtherContext(subCtyObject, "a_Category_Description", subCtyContext);
			//FR Category Name of sub category
			var fr_CA_subCtyName = getContextSpecificValues(subCtyObject,"a_Category_Description","FR_CA");
			//Category CID of sub category
			var subCtyCID =getAttributeValue(subCtyObject,"a_WebCategory_CID");
			//Division Slug Name for the sub category 
			var SubctyDivisionSlug = getAttributeValueAsPerContext(subctyDivObject, "a_Division_Slug", subCtyContext);
			// Also called slug path Division Slug Path for the sub category 
			var subCtyDivNLU = getAttributeValueAsPerContext(subctyDivObject, "a_Natural_Language_URL", subCtyContext);
			// Category Slug Name		
			var subCtyCtySlug = getAttributeValueAsPerContext(subctyCtyObject, "a_Category_Slug", subCtyContext);
			// Category Slug Path
			var subCtyCtyNLU = getAttributeValueAsPerContext(subctyCtyObject, "a_Natural_Language_URL", subCtyContext);
			// Sub Category Slug Name		
			var subCtySlug = getAttributeValueAsPerContext(subCtyObject, "a_SubCategory_Slug", subCtyContext);
			// Sub Category Slug Path
			var subCtyNLU = getAttributeValueAsPerContext(subCtyObject, "a_Natural_Language_URL", subCtyContext);
			
			//CA Division Slug Name
			var en_CA_subCtyDivSlug= getAttributeValueForOtherContext(subctyDivObject, "a_Division_Slug", subCtyContext);
			//CA Division Slug Path
			var en_CA_subCtyDivNLU = getAttributeValueForOtherContext(subctyDivObject, "a_Natural_Language_URL", subCtyContext);
			//CA Category Slug Name
			var en_CA_subCtyCtySlugName = getAttributeValueForOtherContext(subctyCtyObject, "a_Category_Slug", subCtyContext);
			// Also called slug path 
			var en_CA_subCtyCtySlugNLU=getAttributeValueForOtherContext(subctyCtyObject, "a_Natural_Language_URL", subCtyContext);
			//CA SubCategory Slug Name will be null
			var en_CA_subCtySlugName = getAttributeValueForOtherContext(subCtyObject, "a_SubCategory_Slug", subCtyContext);
			//CA SubCategory Slug Path will be null
			var en_CA_subCtySlugNLU =  getAttributeValueForOtherContext(subCtyObject, "a_Natural_Language_URL", subCtyContext);
			//French Division Slug Name
			var fr_CA_subCtyDivSlug=  getContextSpecificValues(subctyDivObject,"a_Division_Slug","FR_CA");
			//French Division Slug Path	
			var fr_CA_subCtyDivNLU =  getContextSpecificValues(subctyDivObject,"a_Natural_Language_URL","FR_CA");
			//French Category Slug Name
			var fr_CA_subCtyCtySlugName =  getContextSpecificValues(subctyCtyObject,"a_Category_Slug","FR_CA");
			//French Category Slug Path
			var fr_CA_subCtyCtyNLU=  getContextSpecificValues(subctyCtyObject,"a_Natural_Language_URL","FR_CA");
			//CA SubCategory Slug Name will be null
			var fr_CA_subCtySlugName =  getContextSpecificValues(subCtyObject,"a_SubCategory_Slug","FR_CA");
			//CA SubCategory Slug Path will be null
			var fr_CA_subCtySlugNLU =  getContextSpecificValues(subCtyObject,"a_Natural_Language_URL","FR_CA");
			
			var objectTypeSubCty = subCtyObject.getObjectType().getName();
			
			var subCtyBrandNo =getAttributeValue(subCtyObject,"a_Brand_Number");
			var subCtyStartDate =getAttributeValue(subCtyObject,"a_WebCategory_Start_Date");
			var subCtyEndDate =getAttributeValue(subCtyObject,"a_WebCategory_End_Date");
			var subCategoryHide = getAttributeValue(subCtyObject,"a_WebCategory_Hide_Category");
			var subCtyAssortmentType = getAttributeValue(subCtyObject,"a_WebCategory_Assortment_Type");
			
			var pageTitle = getAttributeValue(subCtyObject,"a_SEO_Page_Title");
			var metaDesc =  getAttributeValue(subCtyObject,"a_SEO_Meta_Description");
			var Index =getAttributeValue(subCtyObject,"a_SEO_Non_Indexable");

			var subCtyOldDivisionSlug= getAttributeValueAsPerContext(subctyDivObject, "a_Old_Natural_Langauge_URL", subCtyContext);
			var en_CA_subCtyOldDivisionSlug=getAttributeValueForOtherContext(subctyDivObject, "a_Old_Natural_Langauge_URL", subCtyContext);
		
			var fr_CA_subCtyOldDivisionSlug =  getContextSpecificValues(subctyDivObject,"a_Old_Natural_Langauge_URL","FR_CA");
			
			var subCtyctyOldSlug= getAttributeValueAsPerContext(subctyCtyObject, "a_Old_Natural_Langauge_URL", subCtyContext);
			var en_CA_subCtyctyOldSlug= getAttributeValueForOtherContext(subctyCtyObject, "a_Old_Natural_Langauge_URL", subCtyContext);
		
			var fr_CA_subCtyctyOldSlug =  getContextSpecificValues(subctyCtyObject,"a_Old_Natural_Langauge_URL","FR_CA");
			
			var subCtyOldSlug=  getAttributeValueAsPerContext(subCtyObject, "a_Old_Natural_Langauge_URL", subCtyContext);
			
			var en_CA_subCtyOldSlug = getAttributeValueForOtherContext(subCtyObject, "a_Old_Natural_Langauge_URL", subCtyContext);
		
			var fr_CA_subCtyOldSlug =  getContextSpecificValues(subCtyObject,"a_Old_Natural_Langauge_URL","FR_CA");
			// Redirect URL 
			var subCtyDivReDURL= getAttributeValueAsPerContext(subctyDivObject, "a_Redirect_URL", subCtyContext);
			var en_CA_subCtyDivReDURL=getAttributeValueForOtherContext(subctyDivObject, "a_Redirect_URL", subCtyContext);
			var fr_CA_subCtyDivReDURL =  getContextSpecificValues(subctyDivObject,"a_Redirect_URL","FR_CA");
			
			var subCtyctyDivReDURL= getAttributeValueAsPerContext(subctyCtyObject, "a_Redirect_URL", subCtyContext);
			var en_CA_subCtyctyDivReDURL= getAttributeValueForOtherContext(subctyCtyObject, "a_Redirect_URL", subCtyContext);
			var fr_CA_subCtyctyDivReDURL =  getContextSpecificValues(subctyCtyObject,"a_Redirect_URL","FR_CA");
			
			var subCtyReDURL=  getAttributeValueAsPerContext(subCtyObject, "a_Redirect_URL", subCtyContext);
			var en_CA_subCtyReDURL = getAttributeValueForOtherContext(subCtyObject, "a_Redirect_URL", subCtyContext);
			var fr_CA_subCtyReDURL =  getContextSpecificValues(subCtyObject,"a_Redirect_URL","FR_CA");		
			//Redirect URL

		fw.write( subCtyid+","+subctyDivName+","+en_CA_subCtyDivName+","+fr_CA_subCtyDivName +","+subCtyDivCID+","+subCtyCtyName+","+en_CA_subCtyCtyName+","+fr_CA_subCtyCtyName+","+subCtyCtyCID+","+subCtyName+","+en_CA_subCtyName+","+fr_CA_subCtyName+","+subCtyCID+","+SubctyDivisionSlug+","+subCtyDivNLU+","+subCtyCtySlug+","+subCtyCtyNLU+","+subCtySlug+","+subCtyNLU+","+en_CA_subCtyDivSlug+","+en_CA_subCtyDivNLU+","+en_CA_subCtyCtySlugName+","+en_CA_subCtyCtySlugNLU+","+en_CA_subCtySlugName+","+en_CA_subCtySlugNLU+","+fr_CA_subCtyDivSlug+","+fr_CA_subCtyDivNLU+","+fr_CA_subCtyCtySlugName+","+fr_CA_subCtyCtyNLU+","+fr_CA_subCtySlugName+","+fr_CA_subCtySlugNLU+","+objectTypeSubCty+","+subCtyBrandNo+","+subCtyStartDate+","+subCtyEndDate+","+subCategoryHide+","+subCtyAssortmentType+","+pageTitle+","+metaDesc+","+Index+","+subCtyOldDivisionSlug+","+en_CA_subCtyOldDivisionSlug+","+fr_CA_subCtyOldDivisionSlug+","+subCtyctyOldSlug+","+en_CA_subCtyctyOldSlug+","+fr_CA_subCtyctyOldSlug+","+subCtyOldSlug+","+en_CA_subCtyOldSlug+","+fr_CA_subCtyOldSlug+","+subCtyDivReDURL+","+en_CA_subCtyDivReDURL+","+fr_CA_subCtyDivReDURL+","+subCtyctyDivReDURL+","+en_CA_subCtyctyDivReDURL+","+fr_CA_subCtyctyDivReDURL+","+subCtyReDURL+","+en_CA_subCtyReDURL+","+fr_CA_subCtyReDURL+"\n");
			
	}
	//################################################################
			//********** Main block ************
	//################################################################
	
function mainMethod(context)
{
	// get the web Hierarchy classification root 
	var webHierarchyRoot  = stepManager.getClassificationHome().getClassificationByID("101130");
	//get the childern in the web Hierarchy this will return only Band level, then iterate in each brand separately
	var brandList = webHierarchyRoot.getChildren();
	//log.info("brandLevel " +brandLevel);
		for(var brandId = 0 ; brandId<brandList.size();brandId ++)
		{
			var brandObj = brandList.get(brandId);
			var divisionList  =  brandObj.getChildren();
			for(var divId = 0 ; divId<divisionList.size();divId ++)
			{
				var divisiondObj= divisionList.get(divId); 
				var cxtSpeciDivObj = getContextSpecificObject(divisiondObj, context);
				var isActiveDivision= "" ;
				//var hasDivName = "NULL";
				// this block works for the EN_US straight 
				// lets assume a division is available for both the markets 
				if(cxtSpeciDivObj != "undefined" ){
					isActiveDivision = isCategoryActiveOrFuture(cxtSpeciDivObj) ;
					//hasDivName = getAttributeValueAsPerContext(cxtSpeciDivObj, "a_Category_Description", context);
				}
				// when the CA context If the division is in active Not required to be worried about any thing else 
				//this block is exclusive for the EN_CA this gets executed when the  is active division should be true with the context , when executing for the EN_CA market isActiveDivision will be fetched as per the market i.e en_CA also , now check if the division is active for US market (this is required to chekc only if CA market and Its active in CA market ) 
					if(context == "EN_CA" && isActiveDivision == true ){
						// this will get the divsion object in the US context when getting executed in CA context 
						var defaultCtxObj = getContextSpecificObject(divisiondObj, "EN_US");
						// will check if the division is active or not in the default context which is EN_US 
						var defualtCtxObjActive = isCategoryActiveOrFuture(defaultCtxObj) ;
						//hasDivName = getAttributeValueAsPerContext(cxtSpeciDivObj, "a_Category_Description", context);
						// this is checked if the division is already active in US_CA then not required to be exported as its laredy exported in the EN_US contect 
						if(defualtCtxObjActive != "undefined" && defualtCtxObjActive == true ){
						isActiveDivision = false ;
						}else{
						// if its active only in EN_CA and not in EN_US market 
						isActiveDivision = true ;
						}
					}
					//log.info("hasDivName  " +hasDivName);
					if(isActiveDivision == true  )
					{
						//Export division details as per the requested format 		
						getDivisionDetails(cxtSpeciDivObj,context);
						//returns the category under the division Unblock this after testing divisions 
						 var ctyList  =  cxtSpeciDivObj.getChildren();
						 for(var ctyListId = 0 ; ctyListId<ctyList.size();ctyListId ++)
						 {
								var ctyObject= ctyList.get(ctyListId);
								//if(ctyObject.getID()=="WC-1090481"){
								var cxtSpeciCtyObj = getContextSpecificObject(ctyObject, context);
								var isActiveCty = "";
								if(cxtSpeciCtyObj != "undefined" ){
								isActiveCty = isCategoryActiveOrFuture(cxtSpeciCtyObj);
								}
								if(context == "EN_CA" && isActiveCty == true ){
								var defaultCtxCtyObj = getContextSpecificObject(ctyObject, "EN_US");
								var defualtCtxCtyActive = isCategoryActiveOrFuture(defaultCtxCtyObj) ;
									if(defualtCtxCtyActive != "undefined" && defualtCtxCtyActive== true ){
										isActiveCty = false ;
									}else{
									isActiveCty = true ;
									}
								}
								if(isActiveCty == true  )
								{
								getCategoryDetails(cxtSpeciCtyObj,context);
								//returns sub categories under the category 
								  var subCtyList  =  cxtSpeciCtyObj.getChildren();
								 for(var subCtyListId = 0 ; subCtyListId<subCtyList.size();subCtyListId ++)
								 {
										var subCtyObject= subCtyList.get(subCtyListId);
									   //if(subCtyObject.getID()=="WSC-85365"){
									   //log.info ("started here for the seclected sub category ");
										var cxtSpeciSubCtyObj = getContextSpecificObject(subCtyObject, context);
										var isActiveSubCty = "";
										if(cxtSpeciSubCtyObj != "undefined" )
										{

										isActiveSubCty = isCategoryActiveOrFuture(cxtSpeciSubCtyObj);
										}
										if(context == "EN_CA"  && isActiveSubCty == true ){
										var defaultCtxSubCtyObj = getContextSpecificObject(subCtyObject, "EN_US");
										var defualtCtxSubCtyActive = isCategoryActiveOrFuture(defaultCtxSubCtyObj) ;
											if(defualtCtxSubCtyActive != "undefined" && defualtCtxSubCtyActive == true ){
												isActiveSubCty = false ;
											}else{
											isActiveSubCty = true ;
											}
										}
										 if(isActiveSubCty == true  ){
											 getSubCategoryDetails(subCtyObject,context);}
										 }
								 }
						 }
					}
			}
		}
}
	
	mainMethod("EN_US");
	mainMethod("EN_CA");
	
	fw.flush();
	fw.close();
	//################################################################
			//********** Main block is completed ***********
	//################################################################
	//################################################################
			//********** Send Email notification  ************
	//################################################################
	// adding to the Asset 
	var fileInputStream = new java.io.FileInputStream(file);
	var asset = stepManager.getAssetHome().getAssetByID("TF_128425972");
	var uploaded = asset.upload(fileInputStream,filePath);
	// set up Email 
	var mailMethod  = mail.mail();
	//var emailIDTO= mailMethod.addTo("rambhupalreddy_Thatiparthy@gap.com;");
	var emailIDTO  = mailMethod.addTo("jagadish_beejapu@gap.com; sri_indu_dekkapati@gap.com;");
	var emailSubject  = mailMethod.subject("SEO Active and Upcoming Divisions,Categories and Subcategories report ");
	var emailBody  = mailMethod.plainMessage("Please find SEO Active and Upcoming Divisions,Categories and Subcategories report across all the contexts i.e EN_US , EN_CA, FR_CA \n if you have any questions please reach out to support team thanks ");
	// set attachment 
	var attachment = mailMethod.attachment();
	var fromAsssest = attachment.fromAsset(asset);
	var setAttachMentName  =  attachment.name("SEO-PIM-Report_For_Active_And_Upcomming_Categories.csv");
	attachment.attach();
	//send email 
	var mailSentStatus =  mailMethod.send() ;
	//################################################################
	   //**********  Email notification sent  ************
	//########################################################
}