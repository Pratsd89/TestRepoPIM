/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Import_Template_to_Update_BOM_CC_Number",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Import Template to Update BOM CC Number",
  "description" : "PPIM-10753",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log) {
//br_createDuplicateStyleGroups

//var ccNumImp = node.getValue("a_CC_Number").getSimpleValue();
//log.info("CC Num : "+ccNumImp);
var BOMCCNumImp = node.getValue("a_BOM_CC_Number").getSimpleValue();
node.getValue("a_BOM_CC_Number").setValue(BOMCCNumImp);
}