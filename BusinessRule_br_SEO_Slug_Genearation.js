/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Slug_Genearation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SEO Slug and Natural Language Generator",
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
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,divisionSlug,queryHome,stepManager,categorySlug,subCategorySlug,Natural_Language_URL,web,frenchSlug,slug) {
//global variable to check the Context 
//var currentContext=stepManager.getCurrentContext().getID();
var ISRevived = node.getValue("a_Is_Revived").getSimpleValue();
if (ISRevived != "Yes") {
    var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
    var objectType = node.getObjectType().getID();
    var divisionNLUExists = node.getValue("a_Natural_Language_URL").getSimpleValue();
    var CANInheritOption = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
    var children = node.getChildren().toArray();
    log.info(children.length);
    var Context = stepManager.getCurrentContext().getID();
    var locale = new java.util.HashMap();
    locale.put("EN_US", "en");
    locale.put("FR_CA", "fr");
    locale.put("EN_CA", "en");

    var finallocale = locale.get(Context);
    if (Context == "EN_US" || Context == "FR_CA" || Context == "EN_CA") {
        if (stiboValue != null && divisionNLUExists == null) {
            if (objectType == "WebDivision") {

            	stiboValue = String(stiboValue).replace(/<sup>.*?<\/sup>/g, "");

                if (Context == 'EN_US' || Context == 'EN_CA') {
                    var divisionSlugValue = slug.slugify(String(stiboValue), {
                        locale: finallocale
                    });
                } else if (Context == 'FR_CA') {
                    var divisionSlugValue = frenchSlug.slugify(String(stiboValue), {
                        locale: finallocale
                    });
                }

                log.info(divisionSlugValue);
                if (divisionSlugValue.length > 60) {
                    //throw "Error: Slug length exceeds 60 characters.";
                    divisionSlugValue = divisionSlugValue.slice(0, 60);
                }
                var nluDivision = "/" + divisionSlugValue;
                var isURLExists = searchExistingNaturalURL(nluDivision, Natural_Language_URL, node.getParent());
                var OldDivisionSlug = node.getValue('a_Old_Division_Slug').getSimpleValue();
                // if the Division name is not unique then validation will be triggered  
                if (isURLExists != 0) {
                    node.getValue('a_Category_Description').deleteCurrent();
                    web.showAlert("ERROR", "<b>The given Category Name already exists under this brand. Please provide a new name</b>");
                } else {
                    // if the Division name is unique under the brand then values will be set 
                    node.getValue('a_Division_Slug').setSimpleValue(divisionSlugValue);
                    node.getValue('a_Old_Division_Slug').setSimpleValue(divisionSlugValue);
                    node.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);

                }


            } else if (objectType == "WebCategory" && node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() != null) {

                // if (divisionNLUExists == null) {

                stiboValue = String(stiboValue).replace(/<sup>.*?<\/sup>/g, "");

                if (Context == 'EN_US' || Context == 'EN_CA') {
                    var categorySlugValue = slug.slugify(String(stiboValue), {
                        locale: finallocale
                    });
                } else if (Context == 'FR_CA') {
                    var categorySlugValue = frenchSlug.slugify(String(stiboValue), {
                        locale: finallocale
                    });

                }
                if (categorySlugValue.length > 60) {
                    // throw "Error: Slug length exceeds 60 characters.";
                    categorySlugValue = categorySlugValue.slice(0, 60);
                }

                var modifiedCategorySlugValue = categorySlugValue;
                var nluCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedCategorySlugValue;
                var isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
                var OldCategorySlug = node.getValue('a_Old_Category_Slug').getSimpleValue();
                // if the category name is duplicate then the validation will be triggered 

                if (isURLExists != 0) {
                    log.info("Error" + isURLExists);
                    node.getValue('a_Category_Description').deleteCurrent();
                    web.showAlert("ERROR", "<b>The given Category Name already exists under this brand. Please provide a new name</b>");
                } else {
                    // if the Category name is unique under the division then values will be set 
                    node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
                    node.getValue('a_Old_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
                    node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);

                }
                //}
            } else if (objectType == "WebSubCategory" && node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() != null) {
                // if (divisionNLUExists == null) {

                stiboValue = String(stiboValue).replace(/<sup>.*?<\/sup>/g, "");

                if (Context == 'EN_US' || Context == 'EN_CA') {
                    var subCategorySlugValue = slug.slugify(String(stiboValue), {
                        locale: finallocale
                    });
                } else if (Context == 'FR_CA') {
                    var subCategorySlugValue = frenchSlug.slugify(String(stiboValue), {
                        locale: finallocale
                    });

                }

                if (subCategorySlugValue.length > 60) {
                    // throw "Error: Slug length exceeds 60 characters.";
                    subCategorySlugValue = subCategorySlugValue.slice(0, 60);
                }

                var modifiedSubCategorySlugValue = subCategorySlugValue;
                var nluSubCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
                var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
                var OldSubCategorySlug = node.getValue('a_Old_SubCategory_Slug').getSimpleValue();
                // if the SUB category name is not unique then validation will be triggered  
                if (isURLExists != 0) {
                    // node.getValue('a_Category_Description').deleteCurrent();
                    node.getValue('a_Category_Description').setSimpleValue('');
                   web.showAlert("ERROR", "<b>The given Category Name already exists under this brand. Please provide a new name</b>");
                } else {
                    // if the SUB Category name is unique under the Category then values will be set 
                    node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
                    node.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
                    node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
                }
            }
            //}
        }
    }

    var trimAttributes = ['a_Category_Description'];
    for (var i in trimAttributes) {
        var value = node.getValue(trimAttributes[i]).getSimpleValue();
        value = trimValues(value);
        if (value != null) {
            node.getValue(trimAttributes[i]).setSimpleValue(value);
        }
    }
if (node.getName() != null){
    var name = node.getName().trim();
    name = trimValues(name);
    node.setName(name);
}
    if (CANInheritOption != null) {
        if (objectType == "WebDivision") {
            var Attributes = ['a_Category_Description', 'a_Division_Slug', 'a_Old_Division_Slug', 'a_Natural_Language_URL'];
            for (var m in Attributes) {
                CopyAttributeValues(node, Attributes[m]);
            }
            var children = node.getChildren().toArray();
            for (var j in children) {
                CopyWebCategoryAttributes(children[j]);
            }
        }
        if (objectType == "WebCategory") {
            CopyWebCategoryAttributes(node);
        }
        if (objectType == "WebSubCategory") {
            CopySubCategoryAttributes(node);
        }
    }
} else {
    //node.getValue("a_Is_Revived").setSimpleValue("");
}

function trimValues(value) {
    if (value != null) {
        //value = value.replaceAll("\\\\t", "");
        //value = value.replace("/t", "");
        //value = value.replace("/", "");
        value = value.replaceAll("\\\\", "");
        value = value.replace("<lt>", "<lt/>");
        value = value.replace("<gt>", "<gt/>");
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


function CopyAttributeValues(node, attributeID) {
    //log.info("attributeID="+attributeID);
    var AttributeValue;
    stepManager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
        AttributeValue = currentContextNode.getValue(attributeID).getSimpleValue();
        //log.info("AttributeValue="+AttributeValue);
        if (AttributeValue != null) {
            var context = ["EN_CA"];
            for (var j in context) {
                stepManager.executeInContext(context[j], function(currentContextManager) {
                    //log.info("context="+context[j]);
                    var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
                    currentContextNode.getValue(attributeID).setSimpleValue(AttributeValue);
                });
            }
        }
    });
}

function CopyWebCategoryAttributes(node) {
    var Attributes = ["a_Category_Description", "a_Category_Slug", "a_Old_Category_Slug", "a_Natural_Language_URL", "a_Web_Catergory_Start_Time"];
    for (var m in Attributes) {
        CopyAttributeValues(node, Attributes[m]);
    }
    var children = node.getChildren().toArray();
    for (var k in children) {
        CopySubCategoryAttributes(children[k]);
    }
}

function CopySubCategoryAttributes(node) {
    var Attributes = ["a_Category_Description", "a_SubCategory_Slug", "a_Old_SubCategory_Slug", "a_Natural_Language_URL"];
    for (var m in Attributes) {
        CopyAttributeValues(node, Attributes[m]);
    }
}

// Set a_SEO_No_Index_Tag as "No Index" when "a_WebCategory_Hide_Category" is set as Yes
//Set a_SEO_No_Index_Tag as "Index" when a_WebCategory_Hide_Category" is set as No 
// Set a_SEO_No_Index_Tag as "Index" when "a_WebCategory_Hide_Category" is null 
// br_SEO_Slug_Genearation updated Start Story PPIM-11700

// setSeoNonIndexDefaultValue is set to the  a_SEO_Non_Indexable when a brand new Division/Category/Sub category gets created 
// also when ever merchant changes the a_WebCategory_Hide_Category attribute value 
function setSeoNonIndexDefaultValue(node) {

    var isCategoryHide = node.getValue("a_WebCategory_Hide_Category").getSimpleValue();
    var isSeoIndxTag = node.getValue("a_SEO_Non_Indexable").getSimpleValue();
    var OldSeoNonIndexValue = node.getValue("a_Old_SEO_Non_Indexable").getSimpleValue();
    var automationDisabled = node.getValue("a_SEO_Index_Automation").getSimpleValue();

    // First time when user Create Division/Category/ Sub Category 
    //if ( (isCategoryHide == "No" ||   isCategoryHide == null ) && OldSeoNonIndexValue == null  ){
    if (automationDisabled == null) {
        var isCategoryHide = node.getValue("a_WebCategory_Hide_Category").getSimpleValue();
        if (isCategoryHide == "Yes") {
            node.getValue("a_SEO_Non_Indexable").setSimpleValue("No Index");
            node.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("No Index");
        } else {
            node.getValue("a_SEO_Non_Indexable").setSimpleValue("Index");
            node.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("Index");
        }
    }

   
}

function getContextSpecificObject(object, context) {
    var contextSpecificObject = "";
    contextSpecificObject = stepManager.executeInContext(context, function(specificManager) {
        var ObjectinContext = specificManager.getObjectFromOtherManager(object);
        if (ObjectinContext != "undefined" && ObjectinContext != null) {
            return ObjectinContext;
        }
    });
    return contextSpecificObject;
}

var currentContext = stepManager.getCurrentContext().getID();

if (currentContext == "EN_US") {

    var en_CAObject = getContextSpecificObject(node, "EN_CA");
    var fr_CAObject = getContextSpecificObject(node, "FR_CA");
    setSeoNonIndexDefaultValue(node);
    setSeoNonIndexDefaultValue(en_CAObject);
    setSeoNonIndexDefaultValue(fr_CAObject);

} else if (currentContext == "EN_CA") {

    var fr_CAObject = getContextSpecificObject(node, "FR_CA");
    setSeoNonIndexDefaultValue(fr_CAObject);
    setSeoNonIndexDefaultValue(node);

} else {
    setSeoNonIndexDefaultValue(node);
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,frenchSlug,slug) {
var categoryDescription = node.getValue("a_Category_Description").getSimpleValue();
if(categoryDescription!=null){
	return true;
} else return false;

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_SEO_Release_Condition_True"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "true"
  } ],
  "pluginType" : "Precondition"
}
*/
