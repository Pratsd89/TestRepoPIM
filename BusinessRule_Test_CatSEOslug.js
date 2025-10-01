/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_CatSEOslug",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test_CatSEOslug",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR_FRENCH",
    "libraryAlias" : "frenchSlug"
  }, {
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,divisionSlug,queryHome,stepManager,categorySlug,subCategorySlug,Natural_Language_URL,portal,frenchSlug,slug) {
//global variable to check the Context 
//var currentContext=stepManager.getCurrentContext().getID();
//a_SEO_Page_Title
//a_SEO_Meta_Description
//br_SEO_Save_Slug_Value




//var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
var objectType = node.getObjectType().getID();
var divisionNLUExists = node.getValue("a_Natural_Language_URL").getSimpleValue();
var Context = stepManager.getCurrentContext().getID();
var locale = new java.util.HashMap();
locale.put("EN_US", "en");
locale.put("FR_CA", "fr");
locale.put("EN_CA", "en");

var finallocale = locale.get(Context);
/*var divSlugName = node.getValue('a_Division_Slug').getSimpleValue();
log.info(divSlugName);
var catSlugName = node.getValue('a_Category_Slug').getSimpleValue();
var SubcatSlugName = node.getValue('a_SubCategory_Slug').getSimpleValue();
if (divSlugName == null || catSlugName == null || SubcatSlugName == null){
	//portal.showAlert("ERROR",  "Slug Name should not be Blank. Please provide a new Slug name or refresh the page for old Slug Name");
	throw "<b>Error: Slug Name should not be Blank. Please provide a new Slug name or refresh the page for old Slug Name </b>";*/

if (objectType == "WebDivision") {
	var divSlugName = node.getValue('a_Division_Slug').getSimpleValue();
if (divSlugName == null){
	throw "<b>Error: Slug Name should not be Blank. Please provide a new Slug name or refresh the page for old Slug Name </b>";


    if (divisionNLUExists == null) {
        var divisionSlug = node.getValue('a_Category_Description').getSimpleValue();

        //var divisionSlugValue = slug.slugify(String(divisionSlug), {locale: "en"});
        if (Context == 'EN_US' || Context == 'EN_CA') {
            var divisionSlugValue = slug.slugify(String(divisionSlug), {
                locale: finallocale
            });
        } else if (Context == 'FR_CA') {
            var divisionSlugValue = frenchSlug.slugify(String(divisionSlug), {
                locale: finallocale
            });
        }

        if (divisionSlugValue.length > 60) {
            //throw "Error: Slug length exceeds 60 characters.";
            divisionSlugValue = divisionSlugValue.slice(0, 60);
        }

        //divisionSlugValue = trimValues(divisionSlugValue);
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

    } else if (divisionNLUExists != null && node.getChildren().toArray().length == 0) {
        //	else if (node.getChildren().toArray().length==0){
        //var divisionSlug = node.getValue('a_Category_Description').getSimpleValue();

        var divActiveOldSlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();

        //var divisionSlugValue = slug.slugify(String(divisionSlug), {locale: "en"});
        var divisionSlug = node.getValue('a_Division_Slug').getSimpleValue();

        if (Context == 'EN_US' || Context == 'EN_CA') {
            var divisionSlugValue = slug.slugify(String(divisionSlug), {
                locale: finallocale
            });
        } else if (Context == 'FR_CA') {
            var divisionSlugValue = frenchSlug.slugify(String(divisionSlug), {
                locale: finallocale
            });
        }
        if (divisionSlugValue.length > 60) {
            // throw "Error: Slug length exceeds 60 characters.";
            divisionSlugValue = divisionSlugValue.slice(0, 60);
        }


        //divisionSlugValue = trimValues(divisionSlugValue);

        var nluDivision = "/" + divisionSlugValue;
        var isURLExists = searchExistingNaturalURL(nluDivision, Natural_Language_URL, node.getParent());
        if (isURLExists != 0) {
            node.getValue('a_Division_Slug').setSimpleValue(node.getValue('a_Old_Division_Slug').getSimpleValue());
            // node.getValue('a_Category_Description').deleteCurrent();
            throw "<b>Error: The given Category Name already exists under this brand. Please provide a new name</b>";
        } else {
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);
            node.getValue('a_Division_Slug').setSimpleValue(divisionSlugValue);
            node.getValue('a_Old_Division_Slug').setSimpleValue(divisionSlugValue);
            var updatedSlugVaue = node.getValue("a_Natural_Language_URL").getSimpleValue();
            if (divActiveOldSlugValue != updatedSlugVaue) {
                node.getValue("a_Old_Natural_Langauge_URL").setSimpleValue(divActiveOldSlugValue);
            }


        }

    }
  }
 
} else if (objectType == "WebCategory") {
	var catSlugName = node.getValue('a_Category_Slug').getSimpleValue();
	if (catSlugName == null){
	throw "<b>Error: Slug Name should not be Blank. Please provide a new Slug name or refresh the page for old Slug Name </b>";
    if (divisionNLUExists == null) {
        var categorySlug = node.getValue('a_Category_Description').getSimpleValue();
        // var categorySlugValue = slug.slugify(String(categorySlug), {locale: "en"});
        if (Context == 'EN_US' || Context == 'EN_CA') {
            var categorySlugValue = slug.slugify(String(categorySlug), {
                locale: finallocale
            });
        } else if (Context == 'FR_CA') {
            var categorySlugValue = frenchSlug.slugify(String(categorySlug), {
                locale: finallocale
            });

        }


        if (categorySlugValue.length > 60) {
            // throw "Error: Slug length exceeds 60 characters.";
            categorySlugValue = categorySlugValue.slice(0, 60);
        }
        //categorySlugValue = trimValues(categorySlugValue);
        var modifiedCategorySlugValue = categorySlugValue;

        var nluCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedCategorySlugValue;
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
    } else if (divisionNLUExists != null && node.getChildren().toArray().length == 0) {

        var ctyActiveSlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();
        // var categorySlugValue = slug.slugify(String(categorySlug), {locale: "en"});
        var categorySlug = node.getValue("a_Category_Slug").getSimpleValue();
       log.info(categorySlug);

        if (Context == 'EN_US' || Context == 'EN_CA') {
            var categorySlugValue = slug.slugify(String(categorySlug), {
                locale: finallocale
            });
        } else if (Context == 'FR_CA') {
            var categorySlugValue = frenchSlug.slugify(String(categorySlug), {
                locale: finallocale
            });

        }


        if (categorySlugValue.length > 60) {
            //throw "Error: Slug length exceeds 60 characters.";
            categorySlugValue = categorySlugValue.slice(0, 60);
        }
        log.info(categorySlugValue);
        //categorySlugValue = trimValues(categorySlugValue);
        var modifiedCategorySlugValue = categorySlugValue;

        //categorySlugValue = trimValues(categorySlugValue);
        var nluCategory = node.getParent().getValue("a_Natural_Language_URL").getSimpleValue() + "/" + modifiedCategorySlugValue;
        log.info(nluCategory);
        var isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
        if (isURLExists != 0) {

            //node.getValue('a_Division_Slug').deleteCurrent();
            node.getValue('a_Category_Slug').setSimpleValue(node.getValue('a_Old_Category_Slug').getSimpleValue());
            // node.getValue('a_Category_Description').deleteCurrent();
            throw "<b>Error: The given Category Name already exists under this brand. Please provide a new name</b>";
        } else {
            node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            node.getValue('a_Old_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);
            var updatedCtySlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();
            if (ctyActiveSlugValue != updatedCtySlugValue) {
                node.getValue("a_Old_Natural_Langauge_URL").setSimpleValue(ctyActiveSlugValue);
            }

        }

    }
  }
} else if (objectType == "WebSubCategory") {
	var SubcatSlugName = node.getValue('a_SubCategory_Slug').getSimpleValue();
    if (SubcatSlugName == null){
	throw "<b>Error: Slug Name should not be Blank. Please provide a new Slug name or refresh the page for old Slug Name </b>";

    if (divisionNLUExists == null) {
        var subCategorySlug = node.getValue('a_Category_Description').getSimpleValue();

        //  var subCategorySlugValue = slug.slugify(String(subCategorySlug), {locale: "en"});


        if (Context == 'EN_US' || Context == 'EN_CA') {
            var subCategorySlugValue = slug.slugify(String(subCategorySlug), {
                locale: finallocale
            });
        } else if (Context == 'FR_CA') {
            var subCategorySlugValue = frenchSlug.slugify(String(subCategorySlug), {
                locale: finallocale
            });

        }

        if (subCategorySlugValue.length > 60) {
            //throw "Error: Slug length exceeds 60 characters.";
            subCategorySlugValue = subCategorySlugValue.slice(0, 60);
        }
        //subCategorySlugValue = trimValues(subCategorySlugValue);
        var modifiedSubCategorySlugValue = subCategorySlugValue;
        var modifiedSubCategorySlugValue = node.getValue('a_SubCategory_Slug').getSimpleValue();
        var nluSubCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
        var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
        if (isURLExists != 0) {
            // node.getValue('a_Division_Slug').deleteCurrent();
            //node.getValue('a_Category_Description').deleteCurrent();
            throw "<b>Error: The given slug Name already exists under this brand. Please provide a new slug</b>";
        } else {

            node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
            node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
            node.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
        }
    } else if (divisionNLUExists != null) {
        var subCategorySlug = node.getValue('a_SubCategory_Slug').getSimpleValue();
        var subCtySlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();

        //	var subCategorySlugValue = slug.slugify(String(subCategorySlug), {locale: "en"});

        if (Context == 'EN_US' || Context == 'EN_CA') {
            var subCategorySlugValue = slug.slugify(String(subCategorySlug), {
                locale: finallocale
            });
        } else if (Context == 'FR_CA') {
            var subCategorySlugValue = frenchSlug.slugify(String(subCategorySlug), {
                locale: finallocale
            });

        }
        if (subCategorySlugValue.length > 60) {
            // throw "Error: Slug length exceeds 60 characters.";
            subCategorySlugValue = subCategorySlugValue.slice(0, 60);
        }
        //subCategorySlugValue = trimValues(subCategorySlugValue);
        var modifiedSubCategorySlugValue = subCategorySlugValue;


        var nluSubCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
        var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
        if (isURLExists != 0) {
            // node.getValue('a_Division_Slug').deleteCurrent();
            node.getValue('a_SubCategory_Slug').setSimpleValue(node.getValue('a_Old_SubCategory_Slug').getSimpleValue());
            //  	  node.getValue('a_Category_Description').deleteCurrent();
            throw "<b>Error: The given Category Name already exists under this brand. Please provide a new name</b>";
        } else {
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
            node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
            node.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
            var updatedSubCtySlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();
            if (subCtySlugValue != updatedSubCtySlugValue) {
                node.getValue("a_Old_Natural_Langauge_URL").setSimpleValue(subCtySlugValue);
            }
        }
    }


 }
} 



function trimValues(value) {
    if (value != null) {
        value = value.replaceAll("\\\\t", "");
        value = value.replace("/t", "");
        value = value.replace("/", "");
        value = value.replaceAll("\\\\", "");
        var trimValue = cleanString(value);
    }
    return trimValue;
}


function cleanString(val) {
    if (val != null) {
        // Force convert to a primitive string (whether object or primitive)
        val = String(val);
        if (typeof val === 'string') { // Check if it's now a primitive string

            // Replace all newlines and tab characters with a single space
            val = val.replace(/\s+/g, " ");

            return val.trim(); // Trim leading/trailing spaces
        }
    }

    return val; // Return original value if it's not a string
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

    if (resultsize == 1) {
        var list = result.asList(500).toArray();
        for (var i in list) {
            var ID = list[i].getID();
            log.info(ID);
        }
        if (ID == node.getID()) {
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
    "value" : "br_Web_Hierarchy_Inheritance_Actions"
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
    "value" : "br_SEO_PopulatePageDescription"
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
    "value" : "br_Check_SEO_Page_Tile_Changed"
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
    "value" : "br_SetMainLastUpdateDateAllObj"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (step,frenchSlug,slug) {
var Context = step.getCurrentContext().getID();
if(Context == "EN_US" || Context == "FR_CA" || Context == "EN_CA"){
	return true;
} else false;

}