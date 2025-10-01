/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_autoClassification_EVP_Rule",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "AutoClassification Event Processor Rule",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style", "WebCategory", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_autoClassification",
    "libraryAlias" : "autoClassify"
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
exports.operation0 = function (node,step,autoClassify) {
var obj = node.getObjectType().getID();

if (obj == "Style" || obj == "CustomerChoice") {
    autoClassify.autoClassifyProduct(node, step);
} else if (obj == "WebCategory" || obj == "WebSubCategory") {
    autoClassify.syncProductsWithCategoryProductType(node, step);
}
}