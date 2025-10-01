/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "check_PrimarySellingStyleNumber",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "check_PrimarySellingStyleNumber",
  "description" : "Check the changes on Primary Selling Style Number",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
  }, {
    "contract" : "ImportChangeInfoBind",
    "alias" : "importChangeInfo",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log,importChangeInfo) {
var program_ID = node.getValue("a_SuperPDP_Program_ID").getSimpleValue();

//PPIM-12127
if (program_ID != null) {
    var primaryStyleID = null;
    if (program_ID.length() == 6) {
        primaryStyleID = "000" + program_ID;
    }
    else if (program_ID.length() == 7) {
        primaryStyleID = "00" + program_ID;
    }
}

if (importChangeInfo.getChanges() != null) {
    //log.info(importChangeInfo.getChanges().getAttributes().contains("a_SuperPDP_Program_ID"));
    if (importChangeInfo.getChanges().getAttributes().contains("a_SuperPDP_Program_ID") && (program_ID == "" || program_ID == null)) {
        return "<b style='color:red;'>Primary Selling Style Number can't be changed to empty or blank. To remove the value, please use the 'DELETE' keyword.</b>";
    }
    if (program_ID != null &&  program_ID.equalsIgnoreCase('DELETE') ) {
        var styleObj = manager.getProductHome().getProductByID(node.getID());
        if (styleObj == null) {
            return "<b style='color:red;'>Style with Style Number '" + program_ID + "' doesn't Exists.</b>";
        }
        else{
            return true;
            }
    }
    if (program_ID != null) {
        var styleObj = manager.getProductHome().getProductByID(primaryStyleID);
        if (styleObj == null) {
            return "<b style='color:red;'>Style with Primary Selling Style Number '" + program_ID + "' doesn't Exists.</b>";
        }
        else{
            return true;
            }
    }
   
}
return true;
}