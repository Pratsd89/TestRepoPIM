/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "LIB_AT",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "SEO" ],
  "name" : "LIB_AT",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
function getNodeList() {
	var nodeList = new java.util.ArrayList();
	java.util.Collections.addAll(nodeList,
	"000102461",
	"000102031",
	"000102529"
	);
	return nodeList;
}

/*===== business library exports - this part will not be imported to STEP =====*/
exports.getNodeList = getNodeList