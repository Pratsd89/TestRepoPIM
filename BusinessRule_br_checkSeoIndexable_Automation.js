/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_checkSeoIndexable_Automation",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "Check SEO Indexable Automation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
var currentSeoIndexable = node.getValue("a_SEO_Non_Indexable").getSimpleValue();
var oldSeoIndexable = node.getValue("a_Old_SEO_Non_Indexable").getSimpleValue();

if (currentSeoIndexable != oldSeoIndexable) {
    node.getValue("a_SEO_Index_Automation").setSimpleValue("Yes");
    node.getValue("a_Old_SEO_Non_Indexable").setSimpleValue(currentSeoIndexable);

   // var inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
    //var inheritJP = node.getValue("a_JPN_Inherit_Option").getSimpleValue();
    //var Context = step.getCurrentContext().getID();

   /* if (inheritCAN != null && Context == "EN_US") {
        var attrGroup = ["a_SEO_Index_Automation", "a_SEO_Non_Indexable", "a_Old_SEO_Non_Indexable"];
        SEO.copyAttributesFromOneContextToAnother(node, step, attrGroup, "EN_US", "EN_CA")
    }*/
    /*if (inheritJP != null && Context == "EN_US") {
        var attrGroup = ["a_SEO_Index_Automation", "a_Old_SEO_Non_Indexable"];
        SEO.copyAttributesFromOneContextToAnother(node, step, attrGroup, "EN_US", "EN_JP")
    }*/
}

}