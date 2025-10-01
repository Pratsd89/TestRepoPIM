/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DRAFT_CheckonPublish_SA",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_DRAFT_CheckonPublish_SA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "contract" : "CurrentEventTypeBinding",
    "alias" : "currentEvent",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currentEvent) {
if (currentEvent.getID() == "Create" || currentEvent.getID() == "Delete"  ){
	return false;	
	}
else{   	
	return true;
	}
}
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
exports.operation1 = function (node,manager) {
// https://gapinc.atlassian.net/browse/PPIM-10470 (Franchise Exclusive: New DGL OIEPs for Styles, CCs, and SKUs)

var obj = node.getObjectType().getID();
//STYLE PUBLISH CONDITION
if (obj == "Style") {
	var marketDesignation;
	var lifecycle_SA;
	manager.executeInContext('EN_SA', function (saContextManager) {
		var saCurrentProduct = saContextManager.getProductHome().getProductByID(node.getID());
		lifecycle_SA = saCurrentProduct.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
		marketDesignation = saCurrentProduct.getValue("a_Style_Market_Designation").getSimpleValue();
	})
	
	if (marketDesignation == null || !marketDesignation.contains("SA")) {
		return false;
	}
	if (lifecycle_SA == null || lifecycle_SA == "DRAFT" || lifecycle_SA == "Draft") {
		return false;
	}
	else {
		return true;
	}
}
//CC PUBLISH CONDITION
else if (obj == "CustomerChoice") {
	var marketDesignation;
	var lifecycle_SA;
	manager.executeInContext('EN_SA', function (saContextManager) {
		var saCurrentProduct = saContextManager.getProductHome().getProductByID(node.getID());
		lifecycle_SA = saCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
		marketDesignation = saCurrentProduct.getValue("a_Market_Designation").getSimpleValue();
	})

	if (marketDesignation == null || !marketDesignation.contains("SA")) {
		return false;
	}
	if (lifecycle_SA == null || lifecycle_SA == "DRAFT" || lifecycle_SA == "Draft") {
		return false;
	}
	else {
		return true;
	}
}
//SKU PUBLISH CONDITION
else if (obj == "SKU") {	
	var marketDesignation;
	var lifecycle_SA;
	manager.executeInContext('EN_SA', function (saContextManager) {
		var saCurrentProduct = saContextManager.getProductHome().getProductByID(node.getID());
		lifecycle_SA = saCurrentProduct.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
		marketDesignation = saCurrentProduct.getValue("a_Market_Designation").getSimpleValue();
	})
	
	if (marketDesignation == null || !marketDesignation.contains("SA")) {
		return false;
	}
	if (lifecycle_SA == null || lifecycle_SA == "DRAFT" || lifecycle_SA == "Draft") {
		return false;
	}
	else {
		return true;
	}
}
else {
	return true;
}

}