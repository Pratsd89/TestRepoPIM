/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_JPN_Style_to_DGL_Filter",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "JPN Style to DGL Filter",
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
var objectType = node.getObjectType().getID();
//STYLE PUBLISH CONDITION

if(objectType == "Style")
{
	var marketDesignation;
	var lifecycle;
	manager.executeInContext('EN_JP',function(jpContextManager) {	
		var jpCurrentProduct = jpContextManager.getProductHome().getProductByID(node.getID());
	     lifecycle = jpCurrentProduct.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	     marketDesignation = jpCurrentProduct.getValue("a_Style_Market_Designation").getSimpleValue();
	})
	if (marketDesignation == null || !marketDesignation.contains("JPN") || lifecycle == null || "DRAFT" == lifecycle.toUpperCase()) {
		return false;
	}
	else
		return true;
} else {
	return false;
}
}