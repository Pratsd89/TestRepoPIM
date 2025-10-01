/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CheckSizeCodeJP",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check SKU Size Code JP",
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
// Checking for Mandatory values to trigger event processor in JP context
var result = true;
step.executeInContext('EN_JP', function (jpContextManager) {
	var jpCurrentProduct = jpContextManager.getProductHome().getProductByID(node.getID());
	var skuNum = jpCurrentProduct.getValue("a_SKU_Number").getSimpleValue();
	if (skuNum == null) {
		result = false;
	}
	if (result != false) {
		var sizeCode = jpCurrentProduct.getValue("a_Size_Code").getSimpleValue();
		if (sizeCode == null) {
			result = false;
		}
	}
	if (result != false) {
		var marDesig = jpCurrentProduct.getValue("a_ACL_Market_Designation").getSimpleValue();
		if (marDesig != "JPN") {
			result = false;
		}
		else {
			if (jpCurrentProduct.getValue("a_ACL_Market_Designation").isInherited() != false) {
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