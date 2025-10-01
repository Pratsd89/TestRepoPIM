/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_TestMVGTemplateCreation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test MVG Template Creation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
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
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,refType) {
var tagTypeID = "ActivityTag";
var tagValueID = "TAGVAL_129438488";
var tagTypeSeq = "1";
var tagValueSeq = "1";
var tagOriginatedFrom = node.getObjectType().getID();

var brand = node.getValue("a_Brand_Number").getSimpleValue();
var templateId = node.getID()+ "-" + node.getObjectType().getID()+"-Template";
var brandNode = step.getClassificationHome().getClassificationByID("MVGTemplateBrand_AT");
var templateNode = brandNode.createClassification(templateId,"MVGTemplate");
var variantId = "Variant_Object_" + tagValueID;
var multiVariantNode = templateNode.createClassification(variantId,"VariantObject");
multiVariantNode.getValue("a_Tag_Type_ID").setSimpleValue(tagTypeID);
multiVariantNode.getValue("a_Tag_Value_ID").setSimpleValue(tagTypeID);
multiVariantNode.getValue("a_Tag_Sequence").setSimpleValue(tagTypeSeq);
multiVariantNode.getValue("a_TagValue_Sequence").setSimpleValue(tagValueSeq);

templateNode.createClassificationProductLink(node,refType);

}