/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckNonMerchCCNoName",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CheckNonMerchCCNoName",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
// get parent of the CC's Style
var obj = node.getParent().getParent().getID();
if (obj == "ON_StoredValueCards" || obj == "ON_Gifts_Subclass" || obj == "ON_Services_Subclass") {
    result = true;
}
var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
if (result == true) {
    if (nonMerchType != null) {
        if (nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS") {
            result = true;
        } else {
            result = false;
        }
    } else {
        result = false;
    }
}

return result;

	
	
}