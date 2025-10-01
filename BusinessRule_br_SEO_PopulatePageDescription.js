/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_PopulatePageDescription",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "SEO Populate Page Description",
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
var objectType = node.getObjectType().getID();
log.info(objectType);
var BusinessRuleHome = step.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
var SEOMetaDescription = node.getValue("a_SEO_Meta_Description").getSimpleValue();
var SEOPageTitle = node.getValue("a_SEO_Page_Title").getSimpleValue();

if (SEOMetaDescription == null) {
    if (objectType == "WebDivision" || objectType == "WebCategory" || objectType == "WebSubCategory") {
        if (SEOPageTitle == null) {
            BusinessRuleHome.getBusinessActionByID("br_SEOPageTitleGeneration").execute(node);
        }
        SEO.generatePageDescription(step, node);
    }


	var inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
	//var inheritJP = node.getValue("a_JPN_Inherit_Option").getSimpleValue();
	var Context = step.getCurrentContext().getID();

	if (inheritCAN != null && Context == "EN_US") {
    		var attrGroup = ["a_SEO_Page_Title", "a_SEO_Meta_Description"];
    		SEO.copyAttributesFromOneContextToAnother(node, step, attrGroup, "EN_US", "EN_CA")
	}
}
	//if (inheritJP != null && Context == "EN_US") {
    	//	var attrGroup = ["a_SEO_Page_Title", "a_SEO_Meta_Description"];
    	//	SEO.copyAttributesFromOneContextToAnother(node, step, attrGroup, "EN_US", "EN_JP")
	//}
//}
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
