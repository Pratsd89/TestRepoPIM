/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Set_Inherit_US_Copy_Option",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Inherit US Copy Option",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
var markets = node.getValue("a_Style_Market_Designation").getSimpleValue();

if (markets.contains("US") == true) {
    var replicateCopy = node.getValue("a_Replicate_US_English_Copy").getSimpleValue();
    var inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();

    if (replicateCopy == "Yes" && inheritOption == null) {
        if (markets.contains("CAN") == true) {
            node.getValue("a_Inherit_US_Copy_Option").addValue("CAN");
        }
        if (markets.contains("JPN") == true) {
            node.getValue("a_Inherit_US_Copy_Option").addValue("JPN");
        }
    }
}
}