/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Slug_Generation_",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DELETE)SEO Slug Generation",
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

var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
var objectType = node.getObjectType().getID();
var divisionNLUExists = node.getValue("a_Natural_Language_URL").getSimpleValue();
if (stiboValue != null) {

if (objectType == "WebDivision") {

        if (divisionNLUExists == null) {
            var divisionSlugValue = slug.slugify(String(stiboValue), {locale: "en"});
            if (divisionSlugValue.length > 60) {
                throw "Error: Slug length exceeds 60 characters.";
            }
            node.getValue('a_Division_Slug').setSimpleValue(divisionSlugValue);
            var nluDivision = "/" + divisionSlugValue;
            var isURLExists = searchExistingNaturalURL(nluDivision, Natural_Language_URL, node.getParent());
            if (isURLExists != 0) {
            	  node.getValue('a_Division_Slug').deleteCurrent();
            	  node.getValue('a_Category_Description').deleteCurrent();
                throw "<b>Error: The given Category Name already exists under this brand. Please provide a new name</b>";
            }
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);

        }
  } 
    
else if (objectType == "WebCategory") {
        if (divisionNLUExists == null) {
            var categorySlugValue = slug.slugify(String(stiboValue), {locale: "en"});
            if (categorySlugValue.length > 60) {
                throw "Error: Slug length exceeds 60 characters.";
            }

            var modifiedCategorySlugValue = categorySlugValue;
            node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            var nluCategory = "/" + node.getParent().getValue('a_Division_Slug').getSimpleValue() + "/" + node.getValue('a_Category_Slug').getSimpleValue();
            var isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
            if (isURLExists != 0) {
			  node.getValue('a_Division_Slug').deleteCurrent();
            	  node.getValue('a_Category_Description').deleteCurrent();
                throw "<b>Error: The given Category Name already exists under this brand. Please provide a new name</b>";
            }

            node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);
        }
    } else if (objectType == "WebSubCategory") {
        if (divisionNLUExists == null) {
            var subCategorySlugValue = slug.slugify(String(stiboValue), {locale: "en"});
            if (subCategorySlugValue.length > 60) {
                throw "Error: Slug length exceeds 60 characters.";
            }

            var modifiedSubCategorySlugValue = subCategorySlugValue;
            node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
            var nluSubCategory = "/" + node.getParent().getParent().getValue('a_Division_Slug').getSimpleValue() + "/" + node.getParent().getValue('a_Category_Slug').getSimpleValue() + "/" + node.getValue('a_SubCategory_Slug').getSimpleValue();
            var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
            if (isURLExists != 0) {
            	  node.getValue('a_Division_Slug').deleteCurrent();
            	  node.getValue('a_Category_Description').deleteCurrent();
                throw "<b>Error: The given Category Name already exists under this brand. Please provide a new name</b>";
            }

            node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
        }
    }
}




function searchExistingNaturalURL(nluValue, Attribute, Parent) {
    var condition = com.stibo.query.condition.Conditions;
    var isBelowCondition = condition.hierarchy().simpleBelow(Parent);
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
        .and(condition.valueOf(Attribute).eq(nluValue))
    );
    var result = querySpecification.execute();
    return result.asList(500).size();
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