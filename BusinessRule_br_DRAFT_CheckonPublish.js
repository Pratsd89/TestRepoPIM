/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DRAFT_CheckonPublish",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_DRAFT_CheckonPublish",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
var obj = node.getObjectType().getID();
//STYLE PUBLISH CONDITION
if (obj == "Style") {
	var lifecycle = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	//log.info("lifecycle: " +lifecycle);
	if (lifecycle == "DRAFT" || lifecycle == "Draft") {
		return false;
	}
	else {
		return true;
	}
}
//CC PUBLISH CONDITION
else if (obj == "CustomerChoice") {
	var CC_ID = node.getID();
	var lifecycle_US;
	var lifecycle_CA;
	var lifecycle_FR;
	manager.executeInContext('EN_US', function (enContextManager) {
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(CC_ID);
		lifecycle_US = enCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
		//log.info("lifecycle: " +lifecycle_US);
	})
	manager.executeInContext('EN_CA', function (caContextManager) {
		var caCurrentProduct = caContextManager.getProductHome().getProductByID(CC_ID);
		lifecycle_CA = caCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
		//log.info("lifecycle: " +lifecycle_CA);
	})
	manager.executeInContext('FR_CA', function (frContextManager) {
		var frCurrentProduct = frContextManager.getProductHome().getProductByID(CC_ID);
		lifecycle_FR = frCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
		//log.info("lifecycle: " +lifecycle_FR);
	})
	if (lifecycle_US == "DRAFT" || lifecycle_US == "Draft" || lifecycle_CA == "DRAFT" || lifecycle_CA == "Draft"
		|| lifecycle_FR == "DRAFT" || lifecycle_FR == "Draft") {
		return false;
	}
	else {
		return true;
	}
}
//SKU PUBLISH CONDITION
else if (obj == "SKU") {
	//var lifecycle = node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
	//log.info("lifecycle: " +lifecycle);
	var SKU_ID = node.getID();
	var lifecycle_US;
	var lifecycle_CA;
	var lifecycle_FR;
	manager.executeInContext('EN_US', function (enContextManager) {
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(SKU_ID);
		lifecycle_US = enCurrentProduct.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
		//log.info("lifecycle: " +lifecycle_US);
	})
	manager.executeInContext('EN_CA', function (caContextManager) {
		var caCurrentProduct = caContextManager.getProductHome().getProductByID(SKU_ID);
		lifecycle_CA = caCurrentProduct.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
		//log.info("lifecycle: " +lifecycle_CA);
	})
	manager.executeInContext('FR_CA', function (frContextManager) {
		var frCurrentProduct = frContextManager.getProductHome().getProductByID(SKU_ID);
		lifecycle_FR = frCurrentProduct.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
		//log.info("lifecycle: " +lifecycle_FR);
	})
	if (lifecycle_US == "DRAFT" || lifecycle_US == "Draft" || lifecycle_CA == "DRAFT" || lifecycle_CA == "Draft"
		|| lifecycle_FR == "DRAFT" || lifecycle_FR == "Draft") {
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