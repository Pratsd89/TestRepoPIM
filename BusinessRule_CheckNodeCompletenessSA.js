/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckNodeCompletenessSA",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Node CompletenessForSA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  } ]
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
exports.operation0 = function (node,step,log,compCheck) {
var context = step.getCurrentContext().getID();
if(context != 'EN_SA'){
	return false;
}

var objType = node.getObjectType().getID();
if(objType == "Style"){

	//If Style is in Draft state of Style Enrichment, perform completeness check.
	if (node.isInState("wf_NewStyleEnrichmentSA", "NewStyleEnrichState1") == true){
		var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN"){
			return compCheck.nonMerchStyleCompletenessCheck(node, step);
		} else {
			return compCheck.styleCompletenessCheck(node, step);
		}
	}
	else {
		return false;
	}
} else if (objType == "CustomerChoice"){

	//If CC is in Draft state of CC Enrichment, perform completeness check.
	if (node.isInState("wf_CCEnrichmentSA", "NewCCEnrichState1") == true) {
		var nonMerchType = node.getParent().getValue("a_product_merch_type").getSimpleValue();
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN"){
			return compCheck.nonMerchCcCompletenessCheck(node, step);
		} else {
			return compCheck.ccCompletenessCheck(node, step);
		}
	}
	else {
		return false;
	}
} else if(objType == "SKU"){
	
	//If SKU is in Draft state of SKU Enrichment, perform completeness check.
	if (node.isInState("wf_NewSKUEnrichmentSA", "NewSKUEnrich1") == true){
		var nonMerchType = node.getParent().getParent().getValue("a_product_merch_type").getSimpleValue();
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN"){
			return compCheck.nonMerchSkuCompletenessCheck(node, step);
		} else {
			return compCheck.skuCompletenessCheck(node, step);
		}
	}
	else {
		return false;
	}
}

}