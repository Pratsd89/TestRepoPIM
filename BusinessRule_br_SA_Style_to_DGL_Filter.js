/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SA_Style_to_DGL_Filter",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "SA Style to DGL Filter",
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
	manager.executeInContext('EN_SA',function(saContextManager) {	
		var saCurrentProduct = saContextManager.getProductHome().getProductByID(node.getID());
	     lifecycle = saCurrentProduct.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	     marketDesignation = saCurrentProduct.getValue("a_Style_Market_Designation").getSimpleValue();
	})
	
	if (marketDesignation == null || !marketDesignation.contains("SA") || lifecycle == null || "DRAFT" == lifecycle.toUpperCase()) {
		return false;
	}
	else
		return true;
} else {
	return false;
}
}