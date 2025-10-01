/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CAN_SKU_to_DGL_Filter",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_CAN_SKU_to_DGL_Filter",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
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
//This BR is created as part of PPIM-10586 
//STYLE PUBLISH CONDITION
var obj = node.getObjectType().getID();
if (obj == "SKU") {
	var SKU_ID = node.getID();
	var marketDesignation;
	var lifecycle_CA;
	manager.executeInContext('EN_CA', function (enContextManager) {
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(SKU_ID);
		lifecycle_CA = enCurrentProduct.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
		marketDesignation = enCurrentProduct.getValue("a_Market_Designation").getSimpleValue();
	})
	if (marketDesignation == null || !marketDesignation.contains("CAN")) {
		return false;
	}
	if (lifecycle_CA == null || lifecycle_CA == "DRAFT" || lifecycle_CA == "Draft") {
		return false;
	}
	else {
		return true;
	}
}
else {
	return false;
}

}