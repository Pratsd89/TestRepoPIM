/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DRAFT_CheckonPublish_JP",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_DRAFT_CheckonPublish_JP",
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
//This BR is created as part of PPIM-7125 for Japan

var obj = node.getObjectType().getID();
//STYLE PUBLISH CONDITION
if (obj == "Style") {
	var marketDesignation;
	var lifecycle;
	manager.executeInContext('EN_JP', function (jpContextManager) {
		var jpCurrentProduct = jpContextManager.getProductHome().getProductByID(node.getID());
		lifecycle = jpCurrentProduct.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
		marketDesignation = jpCurrentProduct.getValue("a_Style_Market_Designation").getSimpleValue();
	})
	if (marketDesignation == null || !marketDesignation.contains("JPN")) {
		return false;
	}
	if (lifecycle == null || lifecycle == "DRAFT" || lifecycle == "Draft") {
		return false;
	}
	else {
		return true;
	}
}
//CC PUBLISH CONDITION
else if (obj == "CustomerChoice") {
	var CC_ID = node.getID();
	var marketDesignation;
	var lifecycle_JP;
	manager.executeInContext('EN_JP', function (jpContextManager) {
		var jpContextManager = jpContextManager.getProductHome().getProductByID(CC_ID);
		lifecycle_JP = jpContextManager.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
		marketDesignation = jpContextManager.getValue("a_Market_Designation").getSimpleValue();
	})
	
	if (marketDesignation == null || !marketDesignation.contains("JPN")) {
		return false;
	}
	if (lifecycle_JP == null || lifecycle_JP == "DRAFT" || lifecycle_JP == "Draft") {
		return false;
	}
	else {
		return true;
	}
}
//SKU PUBLISH CONDITION
else if (obj == "SKU") {
	var SKU_ID = node.getID();
	var marketDesignation;
	var lifecycle_JP;
	manager.executeInContext('EN_JP', function (jpContextManager) {
		var jpContextManager = jpContextManager.getProductHome().getProductByID(SKU_ID);
		lifecycle_JP = jpContextManager.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
		marketDesignation = jpContextManager.getValue("a_Market_Designation").getSimpleValue();
	})
	
	if (marketDesignation == null || !marketDesignation.contains("JPN")) {
		return false;
	}
	if (lifecycle_JP == null || lifecycle_JP == "DRAFT" || lifecycle_JP == "Draft") {
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