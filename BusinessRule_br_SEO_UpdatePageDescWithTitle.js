/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_UpdatePageDescWithTitle",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO_Rules" ],
  "name" : "br_SEO_UpdatePageDescWithTitle",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (SEO) {
var objectType = node.getObjectType().getID();
log.info(objectType);
var BusinessRuleHome = step.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
var SEOMetaDescription = node.getValue("a_SEO_Meta_Description").getSimpleValue();
if (objectType == "WebDivision") {
    if (node.getValue("a_SEO_Page_Title") == null) {
        BusinessRuleHome.getBusinessActionByID("br_SEOPageTitleGeneration").execute(node);

        SEO.generatePageDescription(step,node);

    } else {
        SEO.generatePageDescription(step,node);
    }

} else if (objectType == "WebCategory") {
    if (node.getValue("a_SEO_Page_Title") == null) {
        BusinessRuleHome.getBusinessActionByID("br_SEOPageTitleGeneration").execute(node);

        SEO.generatePageDescription(step,node);

    } else {
        SEO.generatePageDescription(step,node);
    }


} else if (objectType == "WebSubCategory") {
    if (node.getValue("a_SEO_Page_Title") == null) {
        BusinessRuleHome.getBusinessActionByID("br_SEOPageTitleGeneration").execute(node);
        SEO.generatePageDescription(step,node);

    } else {
        SEO.generatePageDescription(step,node);
    }


}

var inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
var inheritJP = node.getValue("a_JPN_Inherit_Option").getSimpleValue();
var Context = step.getCurrentContext().getID();

if (inheritCAN != null && Context == "EN_US") {
    var attrGroup = ["a_SEO_Page_Title", "a_SEO_Meta_Description"];
    SEO.copyAttributesFromOneContextToAnother(node, step, attrGroup, "EN_US", "EN_CA")
}
if (inheritJP != null && Context == "EN_US") {
    var attrGroup = ["a_SEO_Page_Title", "a_SEO_Meta_Description"];
    SEO.copyAttributesFromOneContextToAnother(node, step, attrGroup, "EN_US", "EN_JP")
}



}