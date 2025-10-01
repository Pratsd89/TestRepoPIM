/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "PhotoShotMandatoryCheck",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Photo Shot Mandatory Check",
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
var attributeName = node.getValue('a_Shot_Request_Type').getSimpleValue();
var attributeName1 = node.getValue('a_Shot_Code').getSimpleValue();
var attributeName2 = node.getValue('a_Shot_Type').getSimpleValue();
var attributeName3 = node.getValue('a_Market').getSimpleValue();
if(attributeName == null || attributeName == '')
{
    return "Mandatory Attribute Shot Request Type is Missing.";
}
else if (attributeName1 == null || attributeName1 == '')
{
    return "Mandatory Attribute Shot Code is Missing.";
}
else if (attributeName2 == null || attributeName2 == '')
{
	return "Mandatory Attribute Shot Type is Missing.";
}
else if (attributeName3 == null || attributeName3 == '')
{
	return "Mandatory Attribute Market is Missing.";
	}
else
{
}

}