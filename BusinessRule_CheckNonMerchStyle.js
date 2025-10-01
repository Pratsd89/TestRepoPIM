/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckNonMerchStyle",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CheckNonMerchStyle",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
var result = false;

var objType = node.getObjectType().getID();

if (objType == "Style") {
	var objID = node.getParent().getID();

	var brandNumbers = [];
	
	step.getListOfValuesHome().getListOfValuesByID("Brand").queryValidValues().forEach(function (val) {
		brandNumbers.push(val.getValue());
		return true;
	});

	brandNumbers.forEach(function (num) {
		var pattern = new RegExp("^" + num + "(?=(_StoredValueCards$|_Gifts_Subclass$|_Services_Subclass$))");
		
		if (pattern.test(objID)) {
			result = true;
			
			return result;
		}
	});
}

return result;
}