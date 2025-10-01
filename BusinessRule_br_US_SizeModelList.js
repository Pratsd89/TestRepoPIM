/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_US_SizeModelList",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_US_SizeModelList",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
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
exports.operation0 = function () {
function getNodeList(){
	
	
var nodeList = new java.util.ArrayList();
java.util.Collections.addAll(nodeList, "M01", "M02");
	
	return nodeList;
	
	}
}