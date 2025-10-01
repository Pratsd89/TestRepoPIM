/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setNonMerchBOPISDefaultDates",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_setNonMerchBOPISDefaultDates",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
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
	|| nonMerchType == "STORED VALUE CARDS OPEN") {
		
		// BOPIS attributes date set ti default.PPIM-11399
		     var startDate = new Date("01/01/2023");
               var endDate = new Date("12/31/2400");
               var formatter = new java.text.SimpleDateFormat("yyyy-MM-dd");
               var finalStartDate = formatter.format(startDate);
               var finalEndDate = formatter.format(endDate);

               node.getValue("a_BOPIS_Style_Exclusion_Start_Date").setSimpleValue(finalStartDate);
               node.getValue("a_BOPIS_Style_Exclusion_End_Date").setSimpleValue(finalEndDate);
	}
}

}