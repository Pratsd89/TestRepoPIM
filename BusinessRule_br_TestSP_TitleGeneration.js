/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_TestSP_TitleGeneration",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TestSP TitleGeneration",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "SEO"
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,SEO) {
var ObjectType = node.getObjectType().getID();
var CategoryDescription = node.getValue("a_Category_Description").getSimpleValue();
var BrandNumber = node.getValue("a_Brand_Number").getSimpleValue();
var SEOPageTitle = node.getValue("a_SEO_Page_Title").getSimpleValue();
log.info(CategoryDescription);


if(SEOPageTitle == null){
if (ObjectType == "WebDivision") {
    if (CategoryDescription != null && BrandNumber != null && SEOPageTitle == null) {
        var SEOTitle = CategoryDescription + " | " + BrandNumber;
        log.info(SEOTitle.length);
        if (SEOTitle.length > 60) {
            for (var i = 0; 60 < SEOTitle.length; i++) {
                CategoryDescription = CategoryDescription.slice(0, -1);
                SEOTitle = CategoryDescription + " | " + BrandNumber;
            }
        }
        log.info(SEOTitle.length);
        node.getValue("a_SEO_Page_Title").setSimpleValue(SEOTitle);

    }
} else if (ObjectType == "WebCategory") {
    var div = node.getParent();
    var divCategoryDescription = div.getValue("a_Category_Description").getSimpleValue();
    var divSEOTitle = div.getValue("a_SEO_Page_Title").getSimpleValue();
    if (CategoryDescription != null && BrandNumber != null && divCategoryDescription != null && SEOPageTitle == null && divSEOTitle != null) {
        var SEOTitle = divCategoryDescription + " " + CategoryDescription + " | " + BrandNumber;
        log.info(SEOTitle.length);
        if (SEOTitle.length > 60) {
            for (var i = 0; 60 < SEOTitle.length; i++) {
                CategoryDescription = CategoryDescription.slice(0, -1);
                SEOTitle = divCategoryDescription + " " + CategoryDescription + " | " + BrandNumber;
            }
        }
        log.info(SEOTitle.length);
        node.getValue("a_SEO_Page_Title").setSimpleValue(SEOTitle);
    
    }

} else if (ObjectType == "WebSubCategory") {
    var cat = node.getParent();
    var div = node.getParent().getParent();
    var divSEOTitle = div.getValue("a_SEO_Page_Title").getSimpleValue();
    var catSEOTitle = cat.getValue("a_SEO_Page_Title").getSimpleValue();
    var divCategoryDescription = div.getValue("a_Category_Description").getSimpleValue();
    var catCategoryDescription = cat.getValue("a_Category_Description").getSimpleValue();
    if (CategoryDescription != null && BrandNumber != null && divCategoryDescription != null && catCategoryDescription != null && SEOPageTitle == null && divSEOTitle != null && catSEOTitle != null) {
        var SEOTitle = divCategoryDescription + " " + catCategoryDescription + " " + CategoryDescription + " | " + BrandNumber;
        log.info(SEOTitle.length);
        if (SEOTitle.length > 60) {
            for (var i = 0; 60 < SEOTitle.length; i++) {
                CategoryDescription = CategoryDescription.slice(0, -1);
                SEOTitle = divCategoryDescription + " " + catCategoryDescription + " " + CategoryDescription + " | " + BrandNumber;
            }
        }
        log.info(SEOTitle.length);
        node.getValue("a_SEO_Page_Title").setSimpleValue(SEOTitle);

    }

}

var inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
var inheritJP = node.getValue("a_JPN_Inherit_Option").getSimpleValue();
var Context = step.getCurrentContext().getID();

if (inheritCAN != null && Context == "EN_US") {
    var attrGroup = ["a_SEO_Page_Title", "a_SEO_Meta_Description"];
     for (var i in attrGroup) {
     log.info(attrGroup[i]);
     }
    SEO.copyAttributesFromOneContextToAnother(node, step, attrGroup, "EN_US", "EN_CA")
}
if (inheritJP != null && Context == "EN_US") {
    var attrGroup = ["a_SEO_Page_Title", "a_SEO_Meta_Description"];
    
    SEO.copyAttributesFromOneContextToAnother(node, step, attrGroup, "EN_US", "EN_JP")
}
}


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
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
