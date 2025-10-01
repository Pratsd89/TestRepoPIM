/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ApproveStyleCopy",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ApproveStyleCopy",
  "description" : "ApproveStyle",
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
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,web) {
try {
							node.approve();
							
							} 
							catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.synchronize.exception.SynchronizeException) {
							throw(e);
							} 
							}
web.showAlert("ACKNOWLEDGMENT",  "Style Approved Successfully.");
//var forwardScreenID = "Style_Details_Screen";
//Seperate Screen Movement for Non Merch Style - PPIM-1406
		var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
		if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")){
			var forwardScreenID = "Style_Details_Screen";
			}
			else{
				var forwardScreenID = "GAPNonMerchStyleDetailsList";
				}
		//End
web.navigate(forwardScreenID, node);

}
/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateTriggerStateFlowEvent",
  "parameters" : [ {
    "id" : "currentStateID",
    "type" : "java.lang.String",
    "value" : "AssignCopy"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "Approve"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : "Approved"
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_StyleMaintenanceWorkflow"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_setMainLastUpdateDate"
  } ],
  "pluginType" : "Operation"
}
*/
