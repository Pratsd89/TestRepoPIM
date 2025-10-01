/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetDefaultBackOrderableFlag",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_SetDefaultBackOrderableFlag",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
//PPIM-10826,PPIM-11012 - Updated the deafult CC Backorderable to No if it is empty. Also, the backorderable logic for Style has been removed.
if(node.getValue('a_Backorderable').getSimpleValue()== null) {
	node.getValue('a_Backorderable').setSimpleValue('No');
}
}