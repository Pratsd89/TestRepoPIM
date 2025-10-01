/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CCSecondMarketUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Second Market Update on CC and Style",
  "description" : "Update CC and Style accordingly if a new market is added to existing CC or new CC created with second market by ACL",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  }, {
    "libraryId" : "lib_MarketUpdate",
    "libraryAlias" : "marketUpdate"
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,compCheck,marketUpdate) {
/**
 * JP chanages added as part of PPIM-7581
 */
try{
	// first check a_Old_Market_Designation attribute on CC
	//Check to ignore validation for Non Merch - PPIM-1406
	var nonMerchType = node.getParent().getValue("a_product_merch_type").getSimpleValue();
	if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")){
		//code to put for merch ones
		
	
	var oldMarket = node.getValue("a_Old_Market_Designation").getSimpleValue();
	var currMarket = node.getValue("a_Market_Designation").getSimpleValue();
	
	if (oldMarket)
	    oldMarket = oldMarket.split("<multisep/>").sort().join(",");
	
	if (currMarket)
	    currMarket = currMarket.split("<multisep/>").sort().join(",");
	
	//logger.info("old = " + oldMarket);
	//logger.info("curr = " + currMarket);
	
	// if the old market designation and current market designation on the CC are different, new market was added
	if (oldMarket != currMarket && oldMarket != null) {
	    if (oldMarket.indexOf("CAN") < 0 && currMarket.indexOf("CAN") >= 0) {
	        //CAN was added to the CC
	        //logger.info("CAN was added to the CC");
	        //changes are added as a part of PPIM-9130
	        marketUpdate.updateCCForMarket(node, step, "EN_CA", "FR_CA", "EN_US", LKT);
	        
	    }
		else if (oldMarket.indexOf("US") < 0 && currMarket.indexOf("US") >= 0) {
	        //US was added to the CC
	        //logger.info("US was added to the CC");
	        marketUpdate.updateCCForMarket(node, step, "EN_US", null, "EN_CA", LKT);
	    }
		else if (oldMarket.indexOf("JPN") < 0 && currMarket.indexOf("JPN") >= 0) {
	        //JPN was added to the CC
	        //logger.info("JPN was added to the CC");
	        //changes are added as a part of PPIM-9130
	        marketUpdate.updateCCForMarket(node, step, "EN_JP", "JA_JP", "EN_US", LKT);
	    }
	    
         //SA chanages added as part of PPIM-10484
	    else if (oldMarket.indexOf("SA") < 0 && currMarket.indexOf("SA") >= 0) {
	    	   //SA was added to the CC
	        //logger.info("SA was added to the CC");
	        marketUpdate.updateCCForMarket(node, step, "EN_SA", null, "EN_US", LKT);
	    }
	}
	
	// update Style Market Designation
	//Removal of Non-DGL Outbound
	var rushQueue = "";
	var standardQueue = "";
	var translationEvent = "";

	marketUpdate.updateStyleMarketDesignation(node, step, LKT);
	
	//reset the old market so future update to current market can compare to correct value.
	node.getValue("a_Old_Market_Designation").setSimpleValue(node.getValue("a_Market_Designation").getSimpleValue());
	}
}
catch(e){

	logger.info("CC Created/Updated Event Processor Failed for : "+node.getID());
}

}