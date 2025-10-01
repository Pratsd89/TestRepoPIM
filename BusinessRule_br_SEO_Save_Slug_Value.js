/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Save_Slug_Value",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "Save Slug Value",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "slug"
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
    "contract" : "AttributeBindContract",
    "alias" : "divisionSlug",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Division_Slug",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
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
    "contract" : "AttributeBindContract",
    "alias" : "categorySlug",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Category_Slug",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "subCategorySlug",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_SubCategory_Slug",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "Natural_Language_URL",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Natural_Language_URL",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,divisionSlug,queryHome,stepManager,categorySlug,subCategorySlug,Natural_Language_URL,slug) {
//global variable to check the Context 
//var currentContext=stepManager.getCurrentContext().getID();
//a_SEO_Page_Title
//a_SEO_Meta_Description
//br_SEO_Save_Slug_Value




//var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
var objectType = node.getObjectType().getID();
var divisionNLUExists = node.getValue("a_Natural_Language_URL").getSimpleValue();


if (objectType == "WebDivision") {

        if (divisionNLUExists == null ) {
        	var divisionSlug = node.getValue('a_Category_Description').getSimpleValue();
            var divisionSlugValue = slug.slugify(String(divisionSlug), {locale: "en"});
            if (divisionSlugValue.length > 60) {
                //throw "Error: Slug length exceeds 60 characters.";
                divisionSlugValue= divisionSlugValue.slice(0,60);
            }
           
            var nluDivision = "/" + divisionSlugValue;
            var isURLExists = searchExistingNaturalURL(nluDivision, Natural_Language_URL, node.getParent());
            if (isURLExists != 0) {
            	  //node.getValue('a_Division_Slug').deleteCurrent();
            	 // node.getValue('a_Category_Description').deleteCurrent();
                throw "<b>Error: The given slug value already exists under this brand. Please provide a new Slug</b>";
            }
            log.info(nluDivision);
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);
            node.getValue('a_Division_Slug').setSimpleValue(divisionSlugValue);
            node.getValue('a_Old_Division_Slug').setSimpleValue(divisionSlugValue);

        }
        else if (divisionNLUExists!=null && node.getChildren().toArray().length==0){
        //	else if (node.getChildren().toArray().length==0){
        	var divisionSlug = node.getValue('a_Division_Slug').getSimpleValue();
			
			var divActiveOldSlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();

			var divisionSlugValue = slug.slugify(String(divisionSlug), {locale: "en"});
            if (divisionSlugValue.length > 60) {
               // throw "Error: Slug length exceeds 60 characters.";
                divisionSlugValue= divisionSlugValue.slice(0,60);
            }

            var nluDivision = "/" + divisionSlugValue;
            var isURLExists = searchExistingNaturalURL(nluDivision, Natural_Language_URL, node.getParent());
            if (isURLExists != 0) {
            	  node.getValue('a_Division_Slug').setSimpleValue(node.getValue('a_Old_Division_Slug').getSimpleValue());
            	 // node.getValue('a_Category_Description').deleteCurrent();
                throw "<b>Error: The given Category Name already exists under this brand. Please provide a new name</b>";
            }else{
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);
            node.getValue('a_Division_Slug').setSimpleValue(divisionSlugValue);
            node.getValue('a_Old_Division_Slug').setSimpleValue(divisionSlugValue);
			var updatedSlugVaue = node.getValue("a_Natural_Language_URL").getSimpleValue();
			if(divActiveOldSlugValue != updatedSlugVaue){node.getValue("a_Old_Natural_Langauge_URL").setSimpleValue(divActiveOldSlugValue);}
        	

        	}
			
        	}

  } 
    
else if (objectType == "WebCategory") {
        if (divisionNLUExists == null) {
        	   var categorySlug = node.getValue('a_Category_Description').getSimpleValue();
            var categorySlugValue = slug.slugify(String(categorySlug), {locale: "en"});
            if (categorySlugValue.length > 60) {
               // throw "Error: Slug length exceeds 60 characters.";
                categorySlugValue= categorySlugValue.slice(0,60);
            }

            var modifiedCategorySlugValue = categorySlugValue;
            
            var nluCategory =   node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedCategorySlugValue;
            var isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
            log.info(isURLExists);
            if (isURLExists != 0) {
			 // node.getValue('a_Division_Slug').deleteCurrent();
            	 // node.getValue('a_Category_Description').deleteCurrent();
                throw "<b>Error: The given slug Name already exists under this brand. Please provide a new slug</b>";
            }
		  node.getValue('a_Old_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
		  node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);
        }
        else if (divisionNLUExists != null && node.getChildren().toArray().length==0){
        	var categorySlug = node.getValue('a_Category_Slug').getSimpleValue();
			var ctyActiveSlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();
        	 var categorySlugValue = slug.slugify(String(categorySlug), {locale: "en"});
            if (categorySlugValue.length > 60) {
                //throw "Error: Slug length exceeds 60 characters.";
                 categorySlugValue= categorySlugValue.slice(0,60);
            }
            log.info(categorySlug);
            var modifiedCategorySlugValue = categorySlugValue;
            //var modifiedCategorySlugValue = node.getValue('a_Category_Slug').getSimpleValue();
            log.info(modifiedCategorySlugValue);
            var nluCategory =  node.getParent().getValue("a_Natural_Language_URL").getSimpleValue()+ "/" + modifiedCategorySlugValue;
              log.info(nluCategory);
            var isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
            if (isURLExists != 0) {
            	
			  //node.getValue('a_Division_Slug').deleteCurrent();
			    node.getValue('a_Category_Slug').setSimpleValue(node.getValue('a_Old_Category_Slug').getSimpleValue());
            	 // node.getValue('a_Category_Description').deleteCurrent();
                throw "<b>Error: The given Category Name already exists under this brand. Please provide a new name</b>";
            }else{
            node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            node.getValue('a_Old_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);
			var updatedCtySlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();
			if(ctyActiveSlugValue != updatedCtySlugValue){node.getValue("a_Old_Natural_Langauge_URL").setSimpleValue(ctyActiveSlugValue);}
        	
			}
        	
        	}
			
    } else if (objectType == "WebSubCategory") {
        if (divisionNLUExists == null) {
        	   var subCategorySlug = node.getValue('a_SubCategory_Slug').getSimpleValue();
            var subCategorySlugValue = slug.slugify(String(subCategorySlug), {locale: "en"});
            if (subCategorySlugValue.length > 60) {
                //throw "Error: Slug length exceeds 60 characters.";
                 subCategorySlugValue= subCategorySlugValue.slice(0,60);
            }

            var modifiedSubCategorySlugValue = subCategorySlugValue;
           var modifiedSubCategorySlugValue = node.getValue('a_SubCategory_Slug').getSimpleValue();
            var nluSubCategory =  node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
            var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
            if (isURLExists != 0) {
            	 // node.getValue('a_Division_Slug').deleteCurrent();
            	  //node.getValue('a_Category_Description').deleteCurrent();
                throw "<b>Error: The given slug Name already exists under this brand. Please provide a new slug</b>";
            }else{

            node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
            node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
            node.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
			}
        }
        else if (divisionNLUExists!= null){
		var subCategorySlug = node.getValue('a_SubCategory_Slug').getSimpleValue();
		var subCtySlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();

        	var subCategorySlugValue = slug.slugify(String(subCategorySlug), {locale: "en"});
            if (subCategorySlugValue.length > 60) {
               // throw "Error: Slug length exceeds 60 characters.";
                subCategorySlugValue= subCategorySlugValue.slice(0,60);
            }

            var modifiedSubCategorySlugValue = subCategorySlugValue;
            //var modifiedSubCategorySlugValue = node.getValue('a_SubCategory_Slug').getSimpleValue();
           
            var nluSubCategory =  node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
            var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
            if (isURLExists != 0) {
            	 // node.getValue('a_Division_Slug').deleteCurrent();
            	 node.getValue('a_SubCategory_Slug').setSimpleValue(node.getValue('a_Old_SubCategory_Slug').getSimpleValue());
          //  	  node.getValue('a_Category_Description').deleteCurrent();
                throw "<b>Error: The given Category Name already exists under this brand. Please provide a new name</b>";
            }
			else{
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
            node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
            node.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
			var updatedSubCtySlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();
			if(subCtySlugValue != updatedSubCtySlugValue){node.getValue("a_Old_Natural_Langauge_URL").setSimpleValue(subCtySlugValue);}
        	}
        	}
		
        
    }





/*function searchExistingNaturalURL(nluValue, Attribute, Parent) {
    var condition = com.stibo.query.condition.Conditions;
    var isBelowCondition = condition.hierarchy().simpleBelow(Parent);
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
        .and(condition.valueOf(Attribute).eq(nluValue))
    );
    var result = querySpecification.execute();

    
    return result.asList(500).size();
}*/


function searchExistingNaturalURL(nluValue, Attribute, Parent) {
    var condition = com.stibo.query.condition.Conditions;
    var isBelowCondition = condition.hierarchy().simpleBelow(Parent);
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
        .and(condition.valueOf(Attribute).eq(nluValue))
    );
    var result = querySpecification.execute();
    var resultsize = result.asList(500).size();
    
    if(resultsize ==1){
    var list = result.asList(500).toArray();
    for (var i in list){
    	 var ID = list[i].getID();
    	 log.info(ID);    	
    }
    if(ID == node.getID()){
    	 resultsize = 0;
    }
    }
    return resultsize;
    
}

function searchExistingSlugValue(slugValue, objectType, slugType) {
    var condition = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(
        condition.valueOf(slugType).eq(slugValue)
        .and(condition.objectType(stepManager.getObjectTypeHome().getObjectTypeByID(objectType)))
    );
    var result = querySpecification.execute();
    return result.asList(500).size();
}

function generateSequenceNumber() {
    const timestamp = new Date().getTime();
    const sequenceNumber = timestamp.toString().slice(-6);
    return sequenceNumber;
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_SEOPageTitleGeneration"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_PopulatePageDescriptionSEOTab"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_checkSeoIndexable_Automation"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_setMaintLastUpdateDate"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Publish_Child_Cats_to_DGL"
  } ],
  "pluginType" : "Operation"
}
*/
