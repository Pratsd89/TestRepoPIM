/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_test_slug_character_limit",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test SLUG_character limit",
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
    log.info("Checking existing slug value: " + slugValue + " for object type: " + objectType);
    var condition = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(
        condition.valueOf(slugType).eq(slugValue)
        .and(condition.objectType(stepManager.getObjectTypeHome().getObjectTypeByID(objectType)))
    );
    var result = querySpecification.execute();
    log.info("Found " + result.asList(500).size() + " existing slug(s) for " + slugType);
    return result.asList(500).size();
}

function generateSequenceNumber() {
    const timestamp = new Date().getTime();
    const sequenceNumber = timestamp.toString().slice(-6);
    log.info("Generated sequence number: " + sequenceNumber);
    return sequenceNumber;
}

var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
var objectType = node.getObjectType().getID();
var logArray = [];

if (objectType == "WebDivision") {
    log.info("Processing WebDivision: " + node);
    var divisionSlugValue = slug.slugify(String(stiboValue), {locale: "en"});
    var divisionSlugExists = searchExistingSlugValue(divisionSlugValue, "WebDivision", "divisionSlug");
    if (divisionSlugExists !== 0) {
        var modifiedDivisionSlugValue = divisionSlugValue + '-' + generateSequenceNumber();
        node.getValue('a_Division_Slug').setSimpleValue(modifiedDivisionSlugValue);
    } else {
        node.getValue('a_Division_Slug').setSimpleValue(divisionSlugValue);
    }
    var nluDivision = "/" + node.getValue('a_Division_Slug').getSimpleValue();
    node.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);
} else if (objectType == "WebCategory") {
    log.info("Processing WebCategory: " + stiboValue);
    var categorySlugValue = slug.slugify(String(stiboValue), {locale: "en"});
    if (categorySlugValue.length > 60) {
        logArray.push("Slug length exceeds 60 characters for category: " + stiboValue);
    } else {
        var categorySlugExists = searchExistingSlugValue(categorySlugValue, "WebCategory", "categorySlug");
        if (categorySlugExists !== 0) {
            var modifiedCategorySlugValue = categorySlugValue + '-' + generateSequenceNumber();
            node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
        } else {
            node.getValue('a_Category_Slug').setSimpleValue(categorySlugValue);
        }
        var nluCategory = "/" + node.getParent().getValue('a_Division_Slug').getSimpleValue() + "/" + node.getValue('a_Category_Slug').getSimpleValue();
        node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);
    }
} else if (objectType == "WebSubCategory") {
    log.info("Processing WebSubCategory: " + stiboValue);
    var subCategorySlugValue = slug.slugify(String(stiboValue), {locale: "en"});
    if (subCategorySlugValue.length > 60) {
        logArray.push("Slug length exceeds 60 characters for sub-category: " + stiboValue);
    } else {
        var subCategorySlugExists = searchExistingSlugValue(subCategorySlugValue, "WebSubCategory", "subCategorySlug");
        if (subCategorySlugExists !== 0) {
            var modifiedSubCategorySlugValue = subCategorySlugValue + '-' + generateSequenceNumber();
            node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
        } else {
            node.getValue('a_SubCategory_Slug').setSimpleValue(subCategorySlugValue);
        }
        var nluSubCategory = "/" + node.getParent().getParent().getValue('a_Division_Slug').getSimpleValue() + "/" + node.getParent().getValue('a_Category_Slug').getSimpleValue() + "/" + node.getValue('a_SubCategory_Slug').getSimpleValue();
        node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
    }
}

if (logArray.length > 0) {
    log.error("Errors: " + logArray.join(", "));
    throw "\n<b>Error: " + logArray.join(", ") + "\n</b>";
}

}