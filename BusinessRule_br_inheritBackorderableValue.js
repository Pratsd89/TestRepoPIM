/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_inheritBackorderableValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Inherit Backorder Value",
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
/*PPIM-10826 - Removed the logic for Style Object. 
		- Did not altered logic for CC */
if (node.getObjectType().getID() == 'CustomerChoice') {
    var skuList = node.getChildren();
    for (var j = 0; j < skuList.size(); j++) {
        if (!skuList.get(j).getValue('a_Backorderable').isInherited() && skuList.get(j).getValue('a_Backorderable').getSimpleValue() != node.getValue('a_Backorderable').getSimpleValue())
            skuList.get(j).getValue('a_Backorderable').deleteCurrent();
    }
}
}