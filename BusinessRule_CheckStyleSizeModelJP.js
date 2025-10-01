/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckStyleSizeModelJP",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Style Size Model JP",
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
//BR will check a_Legacy_Corp_Number, a_Source_Size_Model is available or not and last modified user is STIBOACLUSER to trigger StyleSizeModelCreate Event
var result = true;
var currContext = step.getCurrentContext().getID();
if (currContext == "EN_JP" || currContext == "JA_JP") {
	result = true;
}
else {
	result = false;
}
if (result == true) {
	step.executeInContext('EN_JP', function (jpContextManager) {
		var jpCurrentProduct = jpContextManager.getProductHome().getProductByID(node.getID());
		var legCorpNum = jpCurrentProduct.getValue("a_Legacy_Corp_Number").getSimpleValue();
		if (legCorpNum == null) {
			result = false;
		}
		var sizeModel = jpCurrentProduct.getValue("a_Source_Size_Model").getSimpleValue();
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