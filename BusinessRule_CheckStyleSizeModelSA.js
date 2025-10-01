/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckStyleSizeModelSA",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Style Size Model SA",
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
//BR to check if size model will be triggered from EN_SA context
var result = true;
var currContext = step.getCurrentContext().getID();
if (currContext == "EN_SA") {
	result = true;
}
else {
	result = false;
}
if (result == true) {
	step.executeInContext('EN_SA', function (saContextManager) {
		var saCurrentProduct = saContextManager.getProductHome().getProductByID(node.getID());
		var legCorpNum = saCurrentProduct.getValue("a_Legacy_Corp_Number").getSimpleValue();
		if (legCorpNum == null) {
			result = false;
		}
		var sizeModel = saCurrentProduct.getValue("a_Source_Size_Model").getSimpleValue();
		if (sizeModel == null) {
			result = false;
		}
	});
}
if (result == true) {
	var lastModifiedUser = node.getRevision().getUserID();
	if (lastModifiedUser.toUpperCase() != "STIBOACLUSER") {
		result = false;
	}
}
return result;
}