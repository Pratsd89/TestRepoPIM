/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test_spdp_prod",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "check import template to create dsg(2)",
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
function searchByAttributeValue(manager, attributeID, attributeValue) {
    var attribute = manager.getAttributeHome().getAttributeByID(attributeID);
    searchHome = manager.getHome(com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome);
    searchArg = new com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome.SingleAttributeQuerySpecification(com.stibo.core.domain.Product, attribute, attributeValue);
    var searchResult = "";
    if ((searchArg != null) && (attributeValue != null) && (attributeValue != "")){
        searchResult = searchHome.querySingleAttribute(searchArg);
    }
    return searchResult;
}

var program_ID = node.getValue("a_SuperPDP_Program_ID").getSimpleValue();

if (importChangeInfo.getChanges() != null) {

    if (importChangeInfo.getChanges().getAttributes().contains("a_SuperPDP_Program_ID") && (program_ID == "" || program_ID == null)) {
        return "<b style='color:red;'>Primary Selling Style Number can't be changed to empty or blank.</b>";
    }
    if (program_ID != null && program_ID.equalsIgnoreCase('DELETE')) {
        return "<b style='color:red;'>Delete Operation is not supported. Please use - Import SmartSheet to Modify/Delete Duplicate Style Groups link.</b>";
    }
    if (program_ID != null) {
        var styleObj = searchByAttributeValue(manager, "a_Style_Number", program_ID);
        if (styleObj == null) {
            return "<b style='color:red;'>Style with Primary Selling Style Number '" + program_ID + "' doesn't Exists.</b>";
        }
        else {
            return true;
        }
    }
}
return true;
}