/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetSlotName",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_SetSlotName",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Slot" ],
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
var slotID = node.getValue("a_Slot_ID").getSimpleValue();
var name = "Slot - "+slotID;
if (slotID != null)
{
node.setName(name);
logger.warning(node.getName());
}

}