/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "NonMerchApprovalValidation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "NonMerchApprovalValidation",
  "description" : "Non Merch Validation pre-approval",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
exports.operation0 = function (node,log) {
//validation for Non Merch CC pre-approval - PPIM-1406
var result = true;
var nonMerchType = null;
var objType = node.getObjectType().getID();
if(objType == "Style"){
	nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
	if (nonMerchType == "COMPLIMENTARY GIFT BOXES" 
	|| nonMerchType == "GIFTS" 
	|| nonMerchType == "MONOGRAM SERVICE" 
	|| nonMerchType == "PREMIUM GIFT BOXES" 
	|| nonMerchType == "PREMIUM GIFT BOXES SVC" 
	|| nonMerchType == "STORED VALUE CARDS FIXED" 
	|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" 
	|| nonMerchType == "STORED VALUE CARDS OPEN"){
	if(node.getName() == null){
		result = "Non-Merch Style name is required for approval.";
		}
	if(node.getValue("a_Copy_Complete_Status").getSimpleValue() != "Complete"){
		result = "Copy Status should be Complete for Style approval.";
		}
	// Style publication date is required if it is non merch style. PPIM-2719
	if(node.getValue("a_Style_Start_Date").getSimpleValue() == "" || node.getValue("a_Style_Start_Date").getSimpleValue() == null) {
			return "Required field of Style Publication Date is missing.";
		}
	}
}
else if (objType == "CustomerChoice"){
	nonMerchType = node.getParent().getValue("a_product_merch_type").getSimpleValue();
	if (nonMerchType == "COMPLIMENTARY GIFT BOXES" 
	|| nonMerchType == "GIFTS" 
	|| nonMerchType == "MONOGRAM SERVICE" 
	|| nonMerchType == "PREMIUM GIFT BOXES" 
	|| nonMerchType == "PREMIUM GIFT BOXES SVC" 
	|| nonMerchType == "STORED VALUE CARDS FIXED" 
	|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" 
	|| nonMerchType == "STORED VALUE CARDS OPEN"){
		if(node.getName() == null){
			result = "Non-Merch CC name is required for approval.";
			}
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES" 
		|| nonMerchType == "GIFTS" 
		|| nonMerchType == "MONOGRAM SERVICE" 
		|| nonMerchType == "PREMIUM GIFT BOXES" 
		|| nonMerchType == "PREMIUM GIFT BOXES SVC" 
		|| nonMerchType == "STORED VALUE CARDS OPEN"){	
			if(node.getValue("a_NonMerch_Price").getSimpleValue() == null){
				result = "Non-Merch CC Price is required for approval.";
				}
			}
		// CC publication date is required if it is non merch CC. PPIM-2719
		if(node.getValue("a_CC_Start_Date").getSimpleValue() == "" || node.getValue("a_CC_Start_Date").getSimpleValue() == null) {
			return "Required field of CC Publication Date is missing.";
		}
		}
	}
else if (objType == "SKU"){
	nonMerchType = node.getParent().getParent().getValue("a_product_merch_type").getSimpleValue();
	if (nonMerchType == "COMPLIMENTARY GIFT BOXES" 
	|| nonMerchType == "GIFTS" 
	|| nonMerchType == "MONOGRAM SERVICE" 
	|| nonMerchType == "PREMIUM GIFT BOXES" 
	|| nonMerchType == "PREMIUM GIFT BOXES SVC" 
	|| nonMerchType == "STORED VALUE CARDS FIXED" 
	|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" 
	|| nonMerchType == "STORED VALUE CARDS OPEN"){
		if(node.getName() == null){
			result = "Non-Merch SKU name is required for approval.";
			}
		if (nonMerchType == "STORED VALUE CARDS FIXED" 
		|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS"){
			if(node.getValue("a_NonMerch_Price").getSimpleValue() == null){
					result = "Non-Merch SKU Price is required for approval.";
					}
			}
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES" 
		|| nonMerchType == "GIFTS" 
		|| nonMerchType == "MONOGRAM SERVICE" 
		|| nonMerchType == "PREMIUM GIFT BOXES" 
		|| nonMerchType == "PREMIUM GIFT BOXES SVC" 
		|| nonMerchType == "STORED VALUE CARDS OPEN"){
			if(node.getValue("a_NonMerch_Price").getSimpleValue() != node.getParent().getValue("a_NonMerch_Price").getSimpleValue()){
					result = "Non-Merch Price inheritance issue. Please remove Non Merch Price from SKU.";
					}
			}
		}
	}

return result;
}