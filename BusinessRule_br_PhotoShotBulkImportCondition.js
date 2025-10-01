/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PhotoShotBulkImportCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Photo Shot Bulk Import Condition",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var sitePlacement = node.getValue("a_Site_Placement").getSimpleValue();
var shotCode = node.getValue("a_Shot_Code").getSimpleValue();
var msg = "";

if (sitePlacement == null)
	msg += "Site Placement is missing. \n";

if (shotCode == null) 
	msg += "Shot Code is missing.";

if (msg.length == 0)
	return true;
else
	return msg;
}