/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Calculated_Values_Style",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Calculated_Values_Style",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
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
exports.operation0 = function (node,manager,LKT) {
/* PPIM-10453 - Refactored the Code to implement the Context Agnostic Logic based on the Brand Number Applicable Markets only
		   - Existing functionality not altered.	*/		

try{	

	var objectType = node.getObjectType().getID();
	if(objectType == "Style") {
		// current time stamp
		var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
		var now = java.time.ZonedDateTime.now().minusDays(30);
		var finalDate = now.format(formatter);
	
		//Fetch brand details from Node and get Markets from BrandNumber using LKT
		var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
		var brandMarkets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNum);
		var brandMarketsArray = [];
		if (brandMarkets.contains(";")) {
			brandMarkets.split(";").forEach(function (mkt) {
				brandMarketsArray.push(mkt);
			});
		}
		else
		    brandMarketsArray.push(brandMarkets);	
	
		//Set a_New_Style attribute based on Style Start Date for All Markets which are applicable for Style
		brandMarketsArray.forEach(function (ctxt) {
			manager.executeInContext(ctxt, function (otherManager) {
				var otherNode = otherManager.getObjectFromOtherManager(node);
				var startDate = otherNode.getValue("a_Style_Start_Date").getSimpleValue();

				if(startDate != null) {	
					if( startDate > finalDate || startDate == finalDate) 
						otherNode.getValue("a_New_Style").setSimpleValue("Yes");	
					else 
						otherNode.getValue("a_New_Style").setSimpleValue("No");		
				}
			})
		})
	}
}
catch(e){
	logger.info("SKU Created Size Code Invocation Event Processor Failed for ID : " + node.getID());
}


}