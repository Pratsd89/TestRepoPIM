/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_runAutoClassificationFromCategory",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Run AutoClassification From Category or SubCategory",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
//trigger autoclassification events for all Styles and CCs linked to the Web Category or SubCategory
var catProd = node.getClassificationProductLinks();
if (catProd) {
    var prodIter = catProd.iterator();
    while (prodIter.hasNext()) {
        var prod = prodIter.next();
        //log.info(chprod.getProduct());
        //queue.republish(prod.getProduct());
    }
}
}