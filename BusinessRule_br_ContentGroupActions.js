/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ContentGroupActions",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_ContentGroupActions",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Content_Group" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var child = node.getChildren().toArray();

if(child.length == 1)
	{
	child[0].getValue("a_WebCategory_Sort_Order").setSimpleValue("20");
	}
else if(child.length >1)
	{
	for (i=0; i<child.length; i++)
	{
		var count = i +1;
		var sortOrder = 20*count;
		child[i].getValue("a_WebCategory_Sort_Order").setSimpleValue(sortOrder);
	}
	}

}