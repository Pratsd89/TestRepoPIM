/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Slug_Generation_French_Bulk",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "SEO French Slug Generation Bulk",
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
//global variable to check the Context 
//var currentContext=stepManager.getCurrentContext().getID();







var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
var objectType = node.getObjectType().getID();
var divisionNLUExists = node.getValue("a_Natural_Language_URL").getSimpleValue();
//var CANInheritOption = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
var children = node.getChildren().toArray();
//if (stiboValue != null && divisionNLUExists == null) {
if (stiboValue != null) {
    if (objectType == "WebDivision") {

        var divisionSlugValue = slug.slugify(String(stiboValue), {
            locale: "fr"
        });
        if (divisionSlugValue.length > 60) {
            //throw "Error: Slug length exceeds 60 characters.";
            divisionSlugValue = divisionSlugValue.slice(0, 60);
        }
        var nluDivision = "/" + divisionSlugValue;
        var isURLExists = searchExistingNaturalURL(nluDivision, Natural_Language_URL, node.getParent());
        var counter = 1;
        var OldDivisionSlug = node.getValue('a_Old_Division_Slug').getSimpleValue();
        // if (isURLExists != 0 && divisionSlugValue!=OldDivisionSlug) {
        /* if (isURLExists != 0 ) {
         	divisionSlugValue= divisionSlugValue+generateSequenceNumber();
         	 nluDivision="/"+divisionSlugValue;
         	  
         	
             
         }*/
        while (isURLExists != 0) {
            divisionSlugValue = slug.slugify(String(stiboValue), {
                locale: "fr"
            });
            if (divisionSlugValue.length > 60) {
                divisionSlugValue = divisionSlugValue.slice(0, 60);
            }
            divisionSlugValue = divisionSlugValue + "-" + counter;
            nluDivision = "/" + divisionSlugValue;
            isURLExists = searchExistingNaturalURL(nluDivision, Natural_Language_URL, node.getParent());
            counter++;

        }
        //else{
        node.getValue('a_Division_Slug').setSimpleValue(divisionSlugValue);
        node.getValue('a_Old_Division_Slug').setSimpleValue(divisionSlugValue);
        node.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);
        // }

    } else if (objectType == "WebCategory" && node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() != null) {
        //else if (objectType == "WebCategory" && children.length==0 && node.getParent().getValue('a_Natural_Language_URL').getSimpleValue()!=null) {  //this line is removed for bulk updating
        // if (divisionNLUExists == null) {
        var categorySlugValue = slug.slugify(String(stiboValue), {
            locale: "fr"
        });
        if (categorySlugValue.length > 60) {
            // throw "Error: Slug length exceeds 60 characters.";
            categorySlugValue = categorySlugValue.slice(0, 60);
        }

        // var modifiedCategorySlugValue = categorySlugValue;            
        var nluCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + categorySlugValue;
        var isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
        var OldCategorySlug = node.getValue('a_Old_Category_Slug').getSimpleValue();
        var counter = 1;
        /*if (isURLExists != 0 ) {
            	
            	 categorySlugValue= categorySlugValue+generateSequenceNumber();
            	   nluCategory=node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + categorySlugValue;
               
            }*/
        while (isURLExists != 0) {
            categorySlugValue = slug.slugify(String(stiboValue), {
                locale: "fr"
            });
            if (categorySlugValue.length > 60) {
                categorySlugValue = categorySlugValue.slice(0, 60);
            }
            categorySlugValue = categorySlugValue + "-" + counter;
            nluCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + categorySlugValue;
            isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
            counter++;
        }



        // else{
        node.getValue('a_Category_Slug').setSimpleValue(categorySlugValue);
        node.getValue('a_Old_Category_Slug').setSimpleValue(categorySlugValue);
        node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);
        //}
        //}
    }
    //else if (objectType == "WebSubCategory" && children.length==0 && node.getParent().getValue('a_Natural_Language_URL').getSimpleValue()!=null) {
    else if (objectType == "WebSubCategory" && node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() != null) {
        // if (divisionNLUExists == null) {
        var subCategorySlugValue = slug.slugify(String(stiboValue), {
            locale: "fr"
        });
        if (subCategorySlugValue.length > 60) {
            // throw "Error: Slug length exceeds 60 characters.";
            subCategorySlugValue = subCategorySlugValue.slice(0, 60);
        }

        //  var modifiedSubCategorySlugValue = subCategorySlugValue;           
        var nluSubCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + subCategorySlugValue;
        var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
        var OldSubCategorySlug = node.getValue('a_Old_SubCategory_Slug').getSimpleValue();
         var counter = 1;
        // if (isURLExists != 0 && modifiedSubCategorySlugValue!=OldSubCategorySlug) {
        /* if (isURLExists != 0) {
         	
         	 subCategorySlugValue= subCategorySlugValue+generateSequenceNumber();
         	  nluSubCategory= node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + subCategorySlugValue;
             
         }*/

        while (isURLExists != 0) {
            subCategorySlugValue = slug.slugify(String(stiboValue), {
                locale: "fr"
            });
            if (subCategorySlugValue.length > 60) {
                subCategorySlugValue = subCategorySlugValue.slice(0, 60);
            }
            subCategorySlugValue = subCategorySlugValue + "-" + counter;
            nluSubCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue()+"/" + subCategorySlugValue;
            isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
            counter++;

        }

        node.getValue('a_SubCategory_Slug').setSimpleValue(subCategorySlugValue);
        node.getValue('a_Old_SubCategory_Slug').setSimpleValue(subCategorySlugValue);
        node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
        //  }
    }
    //}
}

/*if (CANInheritOption != null) {
    if (objectType == "WebDivision") {
        var Attributes = ['a_Division_Slug', 'a_Old_Division_Slug', 'a_Natural_Language_URL'];
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
}*/


function searchExistingNaturalURL(nluValue, Attribute, Parent) {
    var condition = com.stibo.query.condition.Conditions;
    var isBelowCondition = condition.hierarchy().simpleBelow(Parent);
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
        .and(condition.valueOf(Attribute).eq(nluValue))
    );
    var result = querySpecification.execute();
    return result.asList(500).size();
}

function generateSequenceNumber() {
    const timestamp = new Date().getTime();
    const sequenceNumber = timestamp.toString().slice(-6);
    return sequenceNumber;
}


/*function searchExistingSlugValue(slugValue, objectType, slugType) {
    var condition = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(
        condition.valueOf(slugType).eq(slugValue)
        .and(condition.objectType(stepManager.getObjectTypeHome().getObjectTypeByID(objectType)))
    );
    var result = querySpecification.execute();
    return result.asList(500).size();
}*/

/*function generateSequenceNumber() {
    const timestamp = new Date().getTime();
    const sequenceNumber = timestamp.toString().slice(-6);
    return sequenceNumber;
}*/


/*function CopyAttributeValues(node, attributeID) {
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
    var Attributes = ["a_Category_Slug", "a_Old_Category_Slug", "a_Natural_Language_URL"];
    for (var m in Attributes) {
        CopyAttributeValues(node, Attributes[m]);
    }
    var children = node.getChildren().toArray();
    for (var k in children) {
        CopySubCategoryAttributes(children[k]);
    }
}

function CopySubCategoryAttributes(node) {
        var Attributes = ["a_SubCategory_Slug", "a_Old_SubCategory_Slug", "a_Natural_Language_URL"];
        for (var m in Attributes) {
            CopyAttributeValues(node, Attributes[m]);
        }
}*/
}