/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckNonMerchStyleNonPrice",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CheckNonMerchStyleNonPrice",
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

	var brandNumber = node.getValue("a_Brand_Number").getSimpleValue();

	var pattern = new RegExp("^" + brandNumber + "(?=(_StoredValueCards$|_Gifts_Subclass$|_Services_Subclass$))");
		
	if (pattern.test(objID)) {
		result = true;
			
		return result;
	}

	var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();

	if (result == true) {
		if (nonMerchType != null) {
			if (nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS") {
				result = true;
			}
			else {
				result = false;
			}
		}
		else {
			result = false;
		}
	}
}

return result;
}