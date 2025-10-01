/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CheckSizeCodeSA",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check SKU Size Code SA",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
// Return true if sku has value for a_Size_Code
var result = true;
step.executeInContext('EN_SA', function (saContextManager) {
	var saCurrentProduct = saContextManager.getProductHome().getProductByID(node.getID());
	var skuNum = saCurrentProduct.getValue("a_SKU_Number").getSimpleValue();
	if (skuNum == null) {
		result = false;
	}
	if (result != false) {
		var sizeCode = saCurrentProduct.getValue("a_Size_Code").getSimpleValue();
		if (sizeCode == null) {
			result = false;
		}
	}
	if (result != false) {
		var marDesig = saCurrentProduct.getValue("a_ACL_Market_Designation").getSimpleValue();
		if (marDesig != "SA") {
			result = false;
		}
		else {
			if (saCurrentProduct.getValue("a_ACL_Market_Designation").isInherited() != false) {
				result = false;
			}
		}
	}
});
if (result != false) {
	var lastModifiedUser = node.getRevision().getUserID();
	if (lastModifiedUser.toUpperCase() != "STIBOACLUSER") {
		result = false;
	}
}
return result;
}