/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_filterNonMerchSKU",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_filterNonMerchSKU",
  "description" : "Return false if it is a Non-Merch SKU",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var obj = node.getObjectType().getID();
//Return false for Non Merch SKU - PPIM-2719
if(obj == "SKU") {
	var merchType = node.getParent().getParent().getValue("a_product_merch_type").getSimpleValue();
	//logger.info(merchType);
	if (merchType == "COMPLIMENTARY GIFT BOXES" 
	 || merchType == "GIFTS" 
	 || merchType == "MONOGRAM SERVICE" 
	 || merchType == "PREMIUM GIFT BOXES" 
	 || merchType == "PREMIUM GIFT BOXES SVC" 
	 || merchType == "STORED VALUE CARDS FIXED" 
	 || merchType == "STORED VALUE CARDS FIXED OPTIONS" 
	 || merchType == "STORED VALUE CARDS OPEN") {
		return false;
	}
}

return true;
}