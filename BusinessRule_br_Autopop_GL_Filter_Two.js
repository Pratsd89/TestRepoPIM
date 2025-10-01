/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Autopop_GL_Filter_Two",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Autopop GL Event Filter Two",
  "description" : "Event filter for Autopop EP. Duplicated to split load between EPs",
  "scope" : "Global",
  "validObjectTypes" : [ "Style", "WebCategory", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger) {
function forEPTwo(str) {
	return /[5-9]$/.test(str);
}

if (forEPTwo(node.getID())) {
	//log.info(forEPTwo(node.getID()) + " node id is: " + node.getID());	
	return true;
}

}