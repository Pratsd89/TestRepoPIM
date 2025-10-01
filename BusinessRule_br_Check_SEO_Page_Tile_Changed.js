/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Check_SEO_Page_Tile_Changed",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "BR Check SEO Page Title Changed",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
exports.operation0 = function (node,web) {

var isSeoIndxTag = node.getValue("a_SEO_Non_Indexable").getSimpleValue();
var isOldSeoIndexTag = node.getValue("a_Old_SEO_Non_Indexable").getSimpleValue();
var isCategoryHide = node.getValue("a_WebCategory_Hide_Category").getSimpleValue();


if (isSeoIndxTag == "Index" && isOldSeoIndexTag == null  &&  (isCategoryHide == "No" || isCategoryHide == null ))
{
// Not required to set the value it means the a_SEO_Non_Indexable value was never changed by the SEO user 
	node.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("");
}else if (isSeoIndxTag == "No Index"  && isOldSeoIndexTag == null  &&  isCategoryHide == "Yes")
{
	node.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("");

}else if (isSeoIndxTag == "Index" && isOldSeoIndexTag == null  && isCategoryHide == "Yes" )
{
		node.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("No Index");
}else if (isSeoIndxTag == "No Index" && isOldSeoIndexTag == null  &&  (isCategoryHide == "No" || isCategoryHide == null ))
{
		node.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("Index");
}
}