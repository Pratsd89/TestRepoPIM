/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetPageIndex_OneTime",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "SetPageIndex_OneTime",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {

var isCategoryHide = node.getValue("a_WebCategory_Hide_Category").getSimpleValue();
var isSeoIndxTag = node.getValue("a_SEO_Non_Indexable").getSimpleValue();
var OldSeoNonIndexValue = node.getValue("a_Old_SEO_Non_Indexable").getSimpleValue();

var isCategoryHide = node.getValue("a_WebCategory_Hide_Category").getSimpleValue();
if (isCategoryHide == "Yes") {
    node.getValue("a_SEO_Non_Indexable").setSimpleValue("No Index");
    node.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("No Index");
}
else {
    node.getValue("a_SEO_Non_Indexable").setSimpleValue("Index");
    node.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("Index");
}



}