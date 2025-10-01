/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckNonMerchNode",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CheckNonMerchNode",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Class", "Department", "Division" ],
  "allObjectTypesValid" : false,
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log) {
var objID = node.getID();

var brandNumbers = [];

step.getListOfValuesHome().getListOfValuesByID("Brand").queryValidValues().forEach(function (val) {
	brandNumbers.push(val.getValue());
	return true;
});

brandNumbers.forEach(function (num) {
	var pattern = new RegExp("^" + num + "(?=(_Non-Merch_Division$|_Non-Merch_Online_Dept$|_GiftCards_Class$|_StoredValueCards$|_Gifts_Class$|_Gifts_Subclass$|_Services_Class$|_Services_Subclass$))");

	if (pattern.test(objID)) {
		result = true;

		return result;
	}
});

if (result == true) {
	return true;
}
else {
	return false;
}
}