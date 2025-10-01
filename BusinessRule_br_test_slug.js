/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_test_slug",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test SLUG",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,divisionSlug,queryHome,stepManager,categorySlug,subCategorySlug,slug) {
function searchExistingSlugValue(slugValue, objectType, slugType) {
    log.info("Searching for existing slug with value: " + slugValue + " for object type: " + objectType);
    var condition = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(
        condition.valueOf(slugType).eq(slugValue)
        .and(condition.objectType(stepManager.getObjectTypeHome().getObjectTypeByID(objectType)))
    );
    var result = querySpecification.execute();
    log.info("Number of existing slugs found: " + result.asList(500).size());
    return result.asList(500).size();
}

function generateSequenceNumber() {
    const timestamp = new Date().getTime(); 
    const sequenceNumber = timestamp.toString().slice(-6); 
    log.info("Generated sequence number: " + sequenceNumber);
    return sequenceNumber; 
}

var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
log.info("Stibo value for processing: " + stiboValue);
var objectType = node.getObjectType().getID();
log.info("Object type being processed: " + objectType);
var logArray = [];

if (objectType == "WebDivision") {
    log.info("Processing division with value: " + stiboValue);
    var divisionSlugValue = slug.slugify(String(stiboValue), {locale: "en"});
    log.info("Generated slug for division: " + divisionSlugValue);
    if (divisionSlugValue.length > 60) {
        log.error("Slug length exceeds 60 characters for division: " + stiboValue);
        throw "Error: Slug length exceeds 60 characters.";
    }
    var divisionSlugExists = searchExistingSlugValue(divisionSlugValue, "WebDivision", divisionSlug);
    log.info("Division slug existence: " + divisionSlugExists);
    if (!divisionSlugExists) {
        var modifiedDivisionSlugValue = divisionSlugValue + '-' + generateSequenceNumber();
        node.getValue('a_Division_Slug').setSimpleValue(modifiedDivisionSlugValue);
        log.info("Set new division slug: " + modifiedDivisionSlugValue);
    } // Do not overwrite existing slug
    var nluDivision = "/" + node.getValue('a_Division_Slug').getSimpleValue();
    node.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);
    log.info("Set division NLU: " + nluDivision);
} else if (objectType == "WebCategory") {
    log.info("Processing category with value: " + stiboValue);
    var categorySlugValue = slug.slugify(String(stiboValue), {locale: "en"});
    log.info("Generated slug for category: " + categorySlugValue);
    if (categorySlugValue.length > 60) {
        log.error("Slug length exceeds 60 characters for category: " + stiboValue);
        throw "Error: Slug length exceeds 60 characters.";
    }
    var categorySlugExists = searchExistingSlugValue(categorySlugValue, "WebCategory", categorySlug);
    log.info("Category slug existence: " + categorySlugExists);
    if (!categorySlugExists) {
        var modifiedCategorySlugValue = categorySlugValue + '-' + generateSequenceNumber();
        node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
        log.info("Set new category slug: " + modifiedCategorySlugValue);
    } // Do not overwrite existing slug
    var nluCategory = "/" + node.getParent().getValue('a_Division_Slug').getSimpleValue() + "/" + node.getValue('a_Category_Slug').getSimpleValue();
    node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);
    log.info("Set category NLU: " + nluCategory);
} else if (objectType == "WebSubCategory") {
    log.info("Processing sub-category with value: " + stiboValue);
    var subCategorySlugValue = slug.slugify(String(stiboValue), {locale: "en"});
    log.info("Generated slug for sub-category: " + subCategorySlugValue);
    if (subCategorySlugValue.length > 60) {
        log.error("Slug length exceeds 60 characters for sub-category: " + stiboValue);
        throw "Error: Slug length exceeds 60 characters.";
    }
    var subCategorySlugExists = searchExistingSlugValue(subCategorySlugValue, "WebSubCategory", subCategorySlug);
    log.info("Sub-category slug existence: " + subCategorySlugExists);
    if (!subCategorySlugExists) {
        var modifiedSubCategorySlugValue = subCategorySlugValue + '-' + generateSequenceNumber();
        node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
        log.info("Set new sub-category slug: " + modifiedSubCategorySlugValue);
    } // Do not overwrite existing slug
    var nluSubCategory = "/" + node.getParent().getParent().getValue('a_Division_Slug').getSimpleValue() + "/" + node.getParent().getValue('a_Category_Slug').getSimpleValue() + "/" + node.getValue('a_SubCategory_Slug').getSimpleValue();
    node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
    log.info("Set sub-category NLU: " + nluSubCategory);
}

if (logArray.length > 0) {
    log.error("Accumulated errors: " + logArray.join(", "));
    throw "\n<b>Error: " + logArray.join(", ") + "\n</b>";
}

}