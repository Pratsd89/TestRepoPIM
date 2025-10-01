/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Slug_French_Langauge_Generator",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "SEO Slug and French Language Generator",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR_FRENCH",
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
try {
    var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
    var divisionNLUExists = node.getValue("a_Natural_Language_URL").getSimpleValue();
    var objectType = node.getObjectType().getID();
    var logArray = [];
    if (stiboValue != null && divisionNLUExists == null) {
        if (objectType == "WebDivision") {
            var divisionSlugValue = getSlugValue(stiboValue);
            var nluDivision = "/" + divisionSlugValue;
            var isURLExists = searchExistingNaturalURL(nluDivision, Natural_Language_URL, node.getParent());
            var counter = 1;
            while (isURLExists != 0) {
                divisionSlugValue = getSlugValue(stiboValue);
                divisionSlugValue = divisionSlugValue + "-" + counter;
                nluDivision = "/" + divisionSlugValue;
                isURLExists = searchExistingNaturalURL(nluDivision, Natural_Language_URL, node.getParent());
                counter++;
            }
            node.getValue('a_Division_Slug').setSimpleValue(divisionSlugValue);
            node.getValue('a_Old_Division_Slug').setSimpleValue(divisionSlugValue);
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);

            var categoryList = node.getChildren().toArray();
            for (var i = 0; i < categoryList.length; i++) {
                stepManager.executeInContext("FR_CA", function (frCaContextManager) {
                    var category = frCaContextManager.getClassificationHome().getClassificationByID(categoryList[i].getID());
                    if (category.getValue('a_Category_Description').getSimpleValue() != null && category.getValue('a_Category_Slug').getSimpleValue() != null && category.getValue('a_Natural_Language_URL').getSimpleValue() == null) {
                        setCategoryNLU(category);
                    }
                });
            }
        }
        else if (objectType == "WebCategory") {
            var modifiedCategorySlugValue = getSlugValue(stiboValue);
            node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            node.getValue('a_Old_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            var nluDivisionVal = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue();
            
            if (nluDivisionVal != null) {
                var nluCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedCategorySlugValue;
                var isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
                var counter = 1;
                while (isURLExists != 0) {
                    modifiedCategorySlugValue = getSlugValue(stiboValue);
                    modifiedCategorySlugValue = modifiedCategorySlugValue + "-" + counter;
                    nluCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedCategorySlugValue;
                    isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
                    counter++;
                }
                node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
                node.getValue('a_Old_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
                node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);

                var subCategoryList = node.getChildren().toArray();
                for (var i = 0; i < subCategoryList.length; i++) {
                    stepManager.executeInContext("FR_CA", function (frCaContextManager) {
                        var subCat = frCaContextManager.getClassificationHome().getClassificationByID(subCategoryList[i].getID());
                        if (subCat.getValue('a_Category_Description').getSimpleValue() != null && subCat.getValue('a_SubCategory_Slug').getSimpleValue() != null && subCat.getValue('a_Natural_Language_URL').getSimpleValue() == null) {
                            setSubCategoryNLU(subCat);
                        }
                    });
                }
            }
        } else if (objectType == "WebSubCategory") {
            var modifiedSubCategorySlugValue = getSlugValue(stiboValue);
            node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
            node.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
            var nluCategoryValue = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue();
            
            if (nluCategoryValue != null) {
                var nluSubCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
                var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
                var counter = 1;
                while (isURLExists != 0) {
                    modifiedSubCategorySlugValue = getSlugValue(stiboValue);
                    modifiedSubCategorySlugValue = modifiedSubCategorySlugValue + "-" + counter;
                    nluCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
                    isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
                    counter++;
                }
                node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
                node.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
                node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
            }
        }
    }

    if (logArray.length > 0) {
        log.error("Accumulated errors: " + logArray.join(", "));
        throw "\n<b>Error: " + logArray.join(", ") + "\n</b>";
    }
}
catch (err) {
    logger.info("Error in processing \"br_SEO_Slug_French_Langauge_Generator\" Business Action." + err);
}

function getSlugValue(valueToBeConverted) {
    var slugifiedValue = slug.slugify(String(valueToBeConverted), { locale: "fr" });
    if (slugifiedValue.length > 60) {
        slugifiedValue = slugifiedValue.slice(0, 60);
    }
    return slugifiedValue;
}

function setSubCategoryNLU(subCatObject) {
    var value = subCatObject.getValue('a_Category_Description').getSimpleValue();
    var modifiedSubCategorySlugValue = getSlugValue(value);
    subCatObject.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
    subCatObject.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
    var nluCategoryValue = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue();

    if (nluCategoryValue != null) {
        var nluSubCategory = subCatObject.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
        var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, subCatObject.getParent().getParent().getParent());
        var counter = 1;
        while (isURLExists != 0) {
            modifiedSubCategorySlugValue = getSlugValue(value);
            modifiedSubCategorySlugValue = modifiedSubCategorySlugValue + "-" + counter;
            nluSubCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
            isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent());
            counter++;
        }
        subCatObject.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
        subCatObject.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
        subCatObject.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
    }
}

function setCategoryNLU(categoryObject) {
    var value = categoryObject.getValue('a_Category_Description').getSimpleValue();
    var modifiedCategorySlugValue = getSlugValue(value);
    categoryObject.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
    categoryObject.getValue('a_Old_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
    var nluDivisionVal = categoryObject.getParent().getValue('a_Natural_Language_URL').getSimpleValue();
    
    if (nluDivisionVal != null) {
        var nluCategory = categoryObject.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedCategorySlugValue;
        var isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, categoryObject.getParent().getParent());
        var counter = 1;
        while (isURLExists != 0) {
            modifiedCategorySlugValue = getSlugValue(value);
            modifiedCategorySlugValue = modifiedCategorySlugValue + "-" + counter;
            nluCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedCategorySlugValue;
            isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
            counter++;
        }
        categoryObject.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
        categoryObject.getValue('a_Old_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
        categoryObject.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);

        var subCategoryList = categoryObject.getChildren().toArray();
        for (var i = 0; i < subCategoryList.length; i++) {
            stepManager.executeInContext("FR_CA", function (frCaContextManager) {
                var subCat = frCaContextManager.getClassificationHome().getClassificationByID(subCategoryList[i].getID());
                if (subCat.getValue('a_Category_Description').getSimpleValue() != null && subCat.getValue('a_SubCategory_Slug').getSimpleValue() != null && subCat.getValue('a_Natural_Language_URL').getSimpleValue() == null) {
                    setSubCategoryNLU(subCat);
                }
            });
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
}