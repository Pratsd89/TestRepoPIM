/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_imp_bom_cc",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_imp_bom_cc",
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
//br_createDuplicateStyleGroups

var ccNumImp = node.getValue("a_CC_Number").getSimpleValue();
log.info("CC Num : "+ccNumImp);
var BOMCCNumImp = node.getValue("a_BOM_CC_Number").getSimpleValue();
log.info("BOM CC Num : "+BOMCCNumImp);
node.getValue("a_BOM_CC_Number").setValue(BOMCCNumImp);






}