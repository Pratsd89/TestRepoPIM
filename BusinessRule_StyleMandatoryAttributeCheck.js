/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StyleMandatoryAttributeCheck",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "StyleMandatoryAttributeCheck",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,stepManager,compCheck) {
var result = true;
logArray = [];
//Check to Ignore web related validations for Non Merch Style - PPIM-1406
var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")) {
	var obj = node.getObjectType().getID();
	if (obj == "Style") {
		var attributeCheck=null;
		var attributeCheckGPS=null;
		//var attributeCheck = compCheck.attributeCompletenessCheck(node, step, "ag_Style_Final_Validation");

		var gpsBrandValue = node.getValue("a_Brand_Number").getSimpleValue();
		if (gpsBrandValue == "GPS") {
			 attributeCheckGPS = compCheck.attributeCompletenessCheck(node, stepManager, "ag_style_Validation");
		} else {
			 attributeCheck = compCheck.attributeCompletenessCheck(node, stepManager, "ag_Style_Validation");
		}
		/*if (attributeCheck != true) {
			node.getValue('a_error_message').setSimpleValue('Following attributes are mandatory and needs to be filled to proceed: \n' + attributeCheck);
			result = 'Following attributes are mandatory and needs to be filled to proceed: \n' + attributeCheck;
		}*/
		if ((attributeCheckGPS != null && attributeCheckGPS != true)) {
			node.getValue('a_error_message').setSimpleValue('Following attributes are mandatory and needs to be filled to proceed: \n' + attributeCheckGPS);
			logArray.push('Following attributes are mandatory and needs to be filled to proceed: \n' + attributeCheckGPS);
		} else if ((attributeCheck != null && attributeCheck != true)) {
			node.getValue('a_error_message').setSimpleValue('Following attributes are mandatory and needs to be filled to proceed: \n' + attributeCheck);
			logArray.push('Following attributes are mandatory and needs to be filled to proceed: \n' + attributeCheck);
		} 
	}
	else {
		result = "The object is not a Style";
	}
}
if (result != true) {
	node.getValue('a_error_message').setSimpleValue(result);
}
return result;

}