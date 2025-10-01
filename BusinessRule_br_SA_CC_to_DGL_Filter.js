/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SA_CC_to_DGL_Filter",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_SA_CC_to_DGL_Filter",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var obj = node.getObjectType().getID();

//CC PUBLISH CONDITION

if (obj == "CustomerChoice") {
    var CC_ID = node.getID();
    var marketDesignation;
    var lifecycle_US;
    manager.executeInContext('EN_SA', function(saContextManager) {
        var saCurrentProduct = saContextManager.getProductHome().getProductByID(node.getID());
        lifecycle_SA = saCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
        marketDesignation = saCurrentProduct.getValue("a_Market_Designation").getSimpleValue();
    })

    if (marketDesignation == null || !marketDesignation.contains("SA")) {
        return false;
    }
    if (lifecycle_SA == null || lifecycle_SA == "DRAFT" || lifecycle_SA == "Draft") {
        return false;
    } else {
        return true;
    }
} else {
    return false;
}
}