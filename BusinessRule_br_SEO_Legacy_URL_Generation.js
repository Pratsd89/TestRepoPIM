/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Legacy_URL_Generation",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "SEO Legacy URL Generation",
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
	if(!file.exists())
	{
	file.createNewFile();
	}
	var fw= new java.io.FileWriter(file,false);
	fw.write("ObjectType,ObjectID,ObjectCID,slugValue,englishNLU,englishCanadaNLU,frenchNLU,LegayPreviewURL,NLUPreviewURL,Brand\n");



function getHostByBrand(brandInput){
	
	 if(brandInput=="ON"){
	 	return "https://onol.wip.prod.gaptecholapps.com/browse";
	 }
	  else if (brandInput=="GAP"){
	  	return "https://www.wip.prod.gaptecholapps.com/browse";
	  }
	   else if (brandInput=="GO"){
	   	return "https://www.wip.prod.factory-gaptecholapps.com/browse";
	   }
	    else if (brandInput=="BR"){
	    	return "https://brol.wip.prod.gaptecholapps.com/browse";
	    }
	     else if (brandInput=="BRFS"){
	     return "https://brfol.wip.prod.factory-gaptecholapps.com/browse";
	}
	else if (brandInput=="AT"){
	   return "https://atol.wip.prod.gaptecholapps.com/browse/"
	}
}

function getHostByBrandForLegacyDivision(brandInput){
	
	 if(brandInput=="ON"){
	 	return "https://onol.wip.prod.gaptecholapps.com/browse/division.do";
	 }
	  else if (brandInput=="GAP"){
	  	return "https://www.wip.prod.gaptecholapps.com/browse/division.do";
	  }
	   else if (brandInput=="GO"){
	   	return "https://www.wip.prod.factory-gaptecholapps.com/browse/division.do";
	   }
	    else if (brandInput=="BR"){
	    	return "https://brol.wip.prod.gaptecholapps.com/browse/division.do";
	    }
	     else if (brandInput=="BRFS"){
	     return "https://brfol.wip.prod.factory-gaptecholapps.com/browse/division.do";
	}
	else if (brandInput=="AT"){
	   return "https://atol.wip.prod.gaptecholapps.com/browse/division.do"
	}
}



function getHostByBrandForLegacyCategory(brandInput){
	
	 if(brandInput=="ON"){
	 	return "https://onol.wip.prod.gaptecholapps.com/browse/category.do";
	 }
	  else if (brandInput=="GAP"){
	  	return "https://www.wip.prod.gaptecholapps.com/browse/category.do";
	  }
	   else if (brandInput=="GO"){
	   	return "https://www.wip.prod.factory-gaptecholapps.com/browse/category.do";
	   }
	    else if (brandInput=="BR"){
	    	return "https://brol.wip.prod.gaptecholapps.com/browse/category.do";
	    }
	     else if (brandInput=="BRFS"){
	     return "https://brfol.wip.prod.factory-gaptecholapps.com/browse/category.do";
	}
	else if (brandInput=="AT"){
	   return "https://atol.wip.prod.gaptecholapps.com/browse/category.do"
	}
}

//https://onol.wip.prod.gaptecholapps.com/browse/maternity/bras-underwear/sports-bras?cid=1177845&style=3029585&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT

function generatePreviewNLULegacyURLSubCategory(brandInput,nluInput,cidInput,parentCIDInput,legacy){
	
     if(brandInput=="ON"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
     	var temp4="&style="


           return temp+nluInput+temp2+parentCIDInput+temp4+cidInput+temp3;
     	
     }
     else if (brandInput=="GAP"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
var temp4="&style="

          return temp+nluInput+temp2+parentCIDInput+temp4+cidInput+temp3;
     	
     }
     else if (brandInput=="GO"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
var temp4="&style="

           return temp+nluInput+temp2+parentCIDInput+temp4+cidInput+temp3;
     	
     }
     else if (brandInput=="BR"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
var temp4="&style="

          return temp+nluInput+temp2+parentCIDInput+temp4+cidInput+temp3;
     	
     }
     else if (brandInput=="BRFS"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
var temp4="&style="

             return temp+nluInput+temp2+parentCIDInput+temp4+cidInput+temp3;
     	
     }
     else if (brandInput=="AT"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";
var temp4="&style="

             return temp+nluInput+temp2+parentCIDInput+temp4+cidInput+temp3;
     	
     }
     }



function generatePreviewNLULegacyURLCategory(brandInput,nluInput,cidInput,legacy){
	
     if(brandInput=="ON"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="GAP"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="GO"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="BR"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="BRFS"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="AT"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyCategory(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&inventoryAware=true&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     }






function generatePreviewNLULegacyURLUSDivision(brandInput,nluInput,cidInput,legacy){
	
     if(brandInput=="ON"){
         if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyDivision(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}

     	
     	
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="GAP"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyDivision(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="GO"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyDivision(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="BR"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyDivision(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="BRFS"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyDivision(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="AT"){
     	 if(legacy=='LEGACY'){
         	var temp = getHostByBrandForLegacyDivision(brandInput);
         	}
         	else{
         		var temp = getHostByBrand(brandInput);
         				}
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     }


function generatePreviewNLULegacyURLCanadaDivision(brandInput,nluInput){
	
      if(brandInput=="ON"){
     	var temp = "https://onol.wip.prod.gaptecholapps.com/browse/"
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="GAP"){
     	var temp = "https://onol.wip.prod.gaptecholapps.com/browse/"
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="GO"){
     	var temp = "https://onol.wip.prod.gaptecholapps.com/browse/"
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="BR"){
     	var temp = "https://onol.wip.prod.gaptecholapps.com/browse/"
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="BRFS"){
     	var temp = "https://onol.wip.prod.gaptecholapps.com/browse/"
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     else if (brandInput=="AT"){
     	var temp = "https://onol.wip.prod.gaptecholapps.com/browse/"
     	var temp2="?cid="
     	var temp3 ="&previewDate=2024-08-29%2016%3A14%3A00%20PDT";


           return temp+nluInput+temp2+cidInput+temp3;
     	
     }
     
	
	}	


	

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
			//var en_CA_divslugName= getAttributeValueForOtherContext(divisiondObj, "a_Division_Slug", divContext);
			// Also called slug path 
			var en_CA_divslugNLU= getAttributeValueForOtherContext(divisiondObj, "a_Natural_Language_URL", divContext);
		
			//var fr_CA_divslugName =  getContextSpecificValues(divisiondObj,"a_Division_Slug","FR_CA");
			// Also called slug path 
			var fr_CA_divslugNLU =  getContextSpecificValues(divisiondObj,"a_Natural_Language_URL","FR_CA");
			
			var objectTypeName = divisiondObj.getObjectType().getName();
			
			var brandNo =getAttributeValue(divisiondObj,"a_Brand_Number");
			
		     var nluPreview= generatePreviewNLULegacyURLUSDivision(brandNo,categoryNLU,divisionCID,"PREVIEW");
               var legacyPreview = generatePreviewNLULegacyURLUSDivision(brandNo,categoryNLU,divisionCID,"LEGACY");
		     
			fw.write(objectTypeName+","+divisionId+","+divisionCID+","+divisionSlug+","+categoryNLU+","+en_CA_divslugNLU +","+fr_CA_divslugNLU+","+legacyPreview+","+nluPreview+","+brandNo+"\n");
			//fw.write( divisionId+","+divCtyName+","+en_CA_divCtyName+","+fr_CA_divCtyName +","+divisionCID+","+","+","+","+","+","+","+","+","+divisionSlug+","+categoryNLU+","+","+","+","+","+en_CA_divslugName+","+en_CA_divslugNLU+","+","+","+","+","+fr_CA_divslugName+","+fr_CA_divslugNLU+","+","+","+","+","+objectTypeName+","+brandNo+","+ctyStartDate+","+ctyEndDate+","+categoryHide+","+assortmentType+","+divPageTitle+","+en_CA_divPageTitle+","+fr_CA_divPageTitle+","+divMetaDesc+","+en_CA_divMetaDesc+","+fr_CA_divMetaDesc+","+divPageIndexTag+","+CA_divPageIndexTag+","+French_divPageIndexTag+","+","+","+","+","+","+","+","+","+","+","+","+","+","+","+","+","+","+","+oldDivisionSlug+","+en_CA_OlddivSlug+","+fr_CA_oldDivSlug+","+","+","+","+","+","+","+divRedirectUrl+","+en_CA_divRedirectUrl+","+fr_CA_divRedirectUrl+"\n");
			
}
	//################################################################
			//********** write Category details  ***********
	//################################################################
	function getCategoryDetails (ctyObject,ctyContext)
	{	
			//Category ID 
			var ctyId = ctyObject.getID();
			//get Division details 
			
			//Division Name
			
			// Parent Details End for first 4 columns 
			// Category Name of category 
			
			//Category CID
			var ctyCID =getAttributeValue(ctyObject,"a_WebCategory_CID");
			
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
			var en_CA_ctySlugNLU= getAttributeValueForOtherContext(ctyObject, "a_Natural_Language_URL", ctyContext);
			
			//CA SubCategory Slug Name will be null
			//CA SubCategory Slug Path will be null
			//French Division Slug Name
			
			//French Category Slug Name
			var fr_CA_ctySlugName =  getContextSpecificValues(ctyObject,"a_Category_Slug","FR_CA");
			//French Category Slug Path
			var fr_CA_ctySlugNLU=  getContextSpecificValues(ctyObject,"a_Natural_Language_URL","FR_CA");
			//French SubCategory Slug Name will be null 
			//French SubCategory Slug Path will be null
			var objectTypeCty = ctyObject.getObjectType().getName();
			var ctyBrandNo = getAttributeValue(ctyObject,"a_Brand_Number");
			
			var catBrandNo =getAttributeValue(ctyObject,"a_Brand_Number");
			  var nluPreview=generatePreviewNLULegacyURLCategory(catBrandNo,ctyNLU,ctyCID,"PREVIEW");
			   var legacyPreview = generatePreviewNLULegacyURLCategory(catBrandNo,ctyNLU,ctyCID,"LEGACY");
          
           fw.write(objectTypeCty+","+ctyId+","+ctyCID+","+ctySlug+","+ctyNLU+","+en_CA_ctySlugNLU +","+fr_CA_ctySlugNLU+","+legacyPreview+","+nluPreview+","+catBrandNo+"\n");
        
		//fw.write( ctyId+","+ctyDivName+","+en_CA_ctyDivName+","+fr_CA_ctyDivName +","+ctyDivCID+","+ctyCtyName+","+en_CA_CtyName+","+fr_CA_CtyName+","+ctyCID+","+","+","+","+","+ctyDivisionSlug+","+ctyDivNLU+","+ctySlug+","+ctyNLU+","+","+","+en_CA_divSlug+","+en_CA_divNLU+","+en_CA_ctySlugName+","+en_CA_ctySlugNLU+","+","+","+fr_CA_divSlug+","+fr_CA_divNLU+","+fr_CA_ctySlugName+","+fr_CA_ctySlugNLU+","+","+","+objectTypeCty+","+ctyBrandNo+","+ctyCtyStartDate+","+ctyCtyEndDate+","+ctyCategoryHide+","+ctyAssortmentType+","+ctyDivPageTitle+","+en_CA_ctyDivPageTitle+","+fr_CA_ctyDivPageTitle+","+ctyDivMetaDesc+","+en_CA_ctyDivMetaDesc+","+fr_CA_ctyDivMetaDesc+","+ctyDivPageIndexTag+","+CA_ctyDivPageIndexTag+","+FR_CActyDivPageIndexTag+","+ctyPageTitle+","+en_CA_ctyPageTitle+","+fr_CA_ctyPageTitle+","+ctyMetaDesc+","+en_CA_ctyMetaDesc+","+fr_CA_ctyMetaDesc+","+ctyPageIndexTag+","+CA_ctyPageIndexTag+","+FR_CActyPageIndexTag+","+","+","+","+","+","+","+","+","+","+ctyOldDivisionSlug+","+en_CA_ctyOlddivSlug+","+fr_CA_ctyOldDivSlug+","+ctyOldSlug+","+en_CA_ctyOldSlug+","+fr_CA_ctyOldSlug+","+","+","+","+ctyDivReDUrl+","+en_CA_ctyDivReDUrl+","+fr_CA_ctyDivReDUrl+","+ctyReDUrl+","+en_CA_ctyReDUrl+","+fr_CA_ctyReDUrl+"\n");
			
	}//################################################################
			//********** write Category details  ***********
	//################################################################
	function getSubCategoryDetails (subCtyObject,subCtyContext)
	{			
			//Sub category ID 
			var subCtyid = subCtyObject.getID();
			var subctyCtyObject = subCtyObject.getParent();
		     var subCtyCtyCID =getAttributeValue(subctyCtyObject,"a_WebCategory_CID");
			//get Division Object for SUB Category 
		
			//get Category Object for SUB Category
		
			//Division Name

			//CA Division Name
			
			
			
			// Parent Details End for first 4 columns 
			// Category Name of category 
			//var subCtyCtyName = getAttributeValueAsPerContext(subctyCtyObject, "a_Category_Description", subCtyContext);
			//CA Category Name of sub category's Category 
		//	var en_CA_subCtyCtyName =  getAttributeValueForOtherContext(subctyCtyObject, "a_Category_Description", subCtyContext);
		
			//FR Category Name of sub category's Category 
			//var fr_CA_subCtyCtyName =getContextSpecificValues(subctyCtyObject,"a_Category_Description","FR_CA");
			//Category CID of sub category's Category 
			//var subCtyCtyCID =getAttributeValue(subctyCtyObject,"a_WebCategory_CID");
			// Category Name of sub category
			var subCtyName = getAttributeValueAsPerContext(subCtyObject, "a_Category_Description", subCtyContext);
			//CA Category Name of sub category
			var en_CA_subCtyName =  getAttributeValueForOtherContext(subCtyObject, "a_Category_Description", subCtyContext);
			//FR Category Name of sub category
			var fr_CA_subCtyName = getContextSpecificValues(subCtyObject,"a_Category_Description","FR_CA");
			//Category CID of sub category
			var subCtyCID =getAttributeValue(subCtyObject,"a_WebCategory_CID");
			//Division Slug Name for the sub category 
			
			// Sub Category Slug Name		
			var subCtySlug = getAttributeValueAsPerContext(subCtyObject, "a_SubCategory_Slug", subCtyContext);
			// Sub Category Slug Path
			var subCtyNLU = getAttributeValueAsPerContext(subCtyObject, "a_Natural_Language_URL", subCtyContext);
			
			//CA Division Slug Name
		
			//CA SubCategory Slug Name will be null
			var en_CA_subCtySlugName = getAttributeValueForOtherContext(subCtyObject, "a_SubCategory_Slug", subCtyContext);
			//CA SubCategory Slug Path will be null
			var en_CA_subCtySlugNLU =  getAttributeValueForOtherContext(subCtyObject, "a_Natural_Language_URL", subCtyContext);
			//French Division Slug Name
			
			//French Division Slug Path	
			
			//French Category Slug Path
	
			//CA SubCategory Slug Name will be null
			var fr_CA_subCtySlugName =  getContextSpecificValues(subCtyObject,"a_SubCategory_Slug","FR_CA");
			//CA SubCategory Slug Path will be null
			var fr_CA_subCtySlugNLU =  getContextSpecificValues(subCtyObject,"a_Natural_Language_URL","FR_CA");
			
			var objectTypeSubCty = subCtyObject.getObjectType().getName();
			
			var subCtyBrandNo =getAttributeValue(subCtyObject,"a_Brand_Number");

		  var nluPreview= generatePreviewNLULegacyURLSubCategory(subCtyBrandNo,subCtyNLU,subCtyCID,subCtyCtyCID,"PREVIEW");
		    var legacyPreview = generatePreviewNLULegacyURLSubCategory(subCtyBrandNo,subCtyNLU,subCtyCID,subCtyCtyCID,"LEGACY");
		  

          fw.write(objectTypeSubCty+","+subCtyid+","+subCtyCID+","+subCtySlug+","+subCtyNLU+","+en_CA_subCtySlugNLU +","+fr_CA_subCtySlugNLU+","+legacyPreview+","+nluPreview+","+subCtyBrandNo+"\n");

		  //fw.write( subCtyid+","+subctyDivName+","+en_CA_subCtyDivName+","+fr_CA_subCtyDivName +","+subCtyDivCID+","+subCtyCtyName+","+en_CA_subCtyCtyName+","+fr_CA_subCtyCtyName+","+subCtyCtyCID+","+subCtyName+","+en_CA_subCtyName+","+fr_CA_subCtyName+","+subCtyCID+","+SubctyDivisionSlug+","+subCtyDivNLU+","+subCtyCtySlug+","+subCtyCtyNLU+","+subCtySlug+","+subCtyNLU+","+en_CA_subCtyDivSlug+","+en_CA_subCtyDivNLU+","+en_CA_subCtyCtySlugName+","+en_CA_subCtyCtySlugNLU+","+en_CA_subCtySlugName+","+en_CA_subCtySlugNLU+","+fr_CA_subCtyDivSlug+","+fr_CA_subCtyDivNLU+","+fr_CA_subCtyCtySlugName+","+fr_CA_subCtyCtyNLU+","+fr_CA_subCtySlugName+","+fr_CA_subCtySlugNLU+","+objectTypeSubCty+","+subCtyBrandNo+","+subCtyStartDate+","+subCtyEndDate+","+subCategoryHide+","+subCtyAssortmentType+","+subCtyDivPageTitle+","+en_CA_subCtyDivPageTitle+","+fr_CA_subCtyDivPageTitle+","+subCtyDivMetaDesc+","+en_CA_subCtyDivMetaDesc+","+fr_CA_subCtyDivMetaDesc+","+subCtyDivPageIndexTag+","+CA_subCtyDivPageIndexTag+","+fr_CA_subCtyDivPageIndexTag+","+subCtyCtyPageTitle+","+en_CA_subCtyCtyPageTitle+","+fr_CA_subCtyCtyPageTitle+","+subCtyCtyMetaDesc+","+en_CA_subCtyCtyMetaDesc+","+fr_CA_subCtyCtyMetaDesc+","+subCtyCtyPageIndexTag+","+CA_subCtyCtyPageIndexTag+","+fr_CA_subCtyCtyPageIndexTag+","+subCtyPageTitle+","+en_CA_subCtyPageTitle+","+fr_CA_subCtyPageTitle+","+subCtyMetaDesc+","+en_CA_subCtyMetaDesc+","+fr_CA_subCtyMetaDesc+","+subCtyPageIndexTag+","+CA_subCtyPageIndexTag+","+fr_CA_subCtyPageIndexTag+","+subCtyOldDivisionSlug+","+en_CA_subCtyOldDivisionSlug+","+fr_CA_subCtyOldDivisionSlug+","+subCtyctyOldSlug+","+en_CA_subCtyctyOldSlug+","+fr_CA_subCtyctyOldSlug+","+subCtyOldSlug+","+en_CA_subCtyOldSlug+","+fr_CA_subCtyOldSlug+","+subCtyDivReDURL+","+en_CA_subCtyDivReDURL+","+fr_CA_subCtyDivReDURL+","+subCtyctyDivReDURL+","+en_CA_subCtyctyDivReDURL+","+fr_CA_subCtyctyDivReDURL+","+subCtyReDURL+","+en_CA_subCtyReDURL+","+fr_CA_subCtyReDURL+"\n");

		  
			
	}


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
	mainMethod("EN_US");

	fw.flush();
	fw.close();

	
	var fileInputStream = new java.io.FileInputStream(file);
	var asset = stepManager.getAssetHome().getAssetByID("TF_128602511");
	var uploaded = asset.upload(fileInputStream,filePath);
	// set up Email 
	var mailMethod  = mail.mail();
	//var emailIDTO= mailMethod.addTo("rambhupalreddy_Thatiparthy@gap.com;");
	var emailIDTO  = mailMethod.addTo("jagadish_beejapu@gap.com");
	var emailSubject  = mailMethod.subject("SEO preview NLU's ");
	var emailBody  = mailMethod.plainMessage("Please find NLU Preview URL's ");
	// set attachment 
	var attachment = mailMethod.attachment();
	var fromAsssest = attachment.fromAsset(asset);
	var setAttachMentName  =  attachment.name("SEO-PIM-Report_For_Legacy_NLU.csv");
	attachment.attach();
	//send email 
	var mailSentStatus =  mailMethod.send() ;
}