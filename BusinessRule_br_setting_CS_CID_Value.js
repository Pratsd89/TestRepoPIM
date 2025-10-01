/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setting_CS_CID_Value",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Setting CS CID Value",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerServiceBusinessUnit", "CustomerServiceCategory", "CustomerServiceHome" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ID_Generator_Library",
    "libraryAlias" : "IDGeneratorLibrary"
  } ]
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,IDGeneratorLibrary) {
var currentVal = node.getValue("a_WebCategory_CID").getSimpleValue()

if(currentVal == null || currentVal == "" )
{
IDGeneratorLibrary.setIDValue(node,stepManager,'CIDGenerator','a_WebCategory_CID');
}
}