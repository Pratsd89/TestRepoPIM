/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckNonMerchCCNoPriceValidity",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CheckNonMerchCCNoPriceValidity",
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
var objType = node.getObjectType().getID();
if (objType == "CustomerChoice"){
		var merchFlag = node.getParent().getValue("a_product_merch_type").getSimpleValue();	
		if(!(merchFlag == "STORED VALUE CARDS OPEN" || merchFlag == "PREMIUM GIFT BOXES" || merchFlag == "GIFTS" || merchFlag == "PREMIUM GIFT BOXES SVC" || merchFlag == "COMPLIMENTARY GIFT BOXES" || merchFlag == "MONOGRAM SERVICE")){
			result = true;
			}
		}		
return result;
}