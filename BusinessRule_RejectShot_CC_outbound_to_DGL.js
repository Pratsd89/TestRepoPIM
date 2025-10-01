/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "RejectShot_CC_outbound_to_DGL",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "RejectShot_CC_outbound_to_DGL",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  } ]
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookUpHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,lookUpHome,helper) {
/*
 * This rule works as follows:
 * -Get shot request and populate CC list
 * -For each CC in list, if CC is Approved, In Progress, or Waiting for Style Approval, set Last Modified Date
 * -Do this in each context based on sharedMarkets values
 */
 //PPIM-1063 - Modifed this to make Context Agnostic
var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();
if(sharedMarkets.length > 0){
	for(var itr = 0;itr < sharedMarkets.length; itr++){
		var value = sharedMarkets[itr].getSimpleValue();
		var contextId = lookUpHome.getLookupTableValue("LKT_MarketDesignationToMarket",value);
		setValuesBasedOnContext(node, stepManager, contextId);
		break;
	}
}

function setValuesBasedOnContext(node, stepManager, contextId){
	stepManager.executeInContext(contextId, function (manager) {
		var caShotRequest = manager.getEntityHome().getEntityByID(node.getID());
		var ccList = helper.getCCsFromShot(caShotRequest);
		
		for (i = 0; i < ccList.size(); i++) {
			var cc = ccList.get(i);
		
			if (
			cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Approved" ||
			cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "In Progress" ||
			cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue() ==
				"Waiting for Style Approval"
			) {
			var time = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			cc.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			}
		}
	});
}
}