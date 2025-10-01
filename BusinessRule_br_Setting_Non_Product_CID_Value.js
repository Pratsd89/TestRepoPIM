/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Setting_Non_Product_CID_Value",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Setting Non Product CID Value",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "NonProductBusinessUnit", "NonProductCategory" ],
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
IDGeneratorLibrary.setIDValue(node,stepManager,'CIDGenerator','a_WebCategory_CID');
}