/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Set_NewColor_NewStyle_WebUI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set_NewColor_NewStyle_WebUI",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
/* PPIM-10486 - Refactored the Code to implement the Context Agnostic Logic based on the Brand Number Applicable Markets only
		   - Existing functionality not altered.	*/		
log.info("Set_NewColor_NewStyle_WebUI");
if(manager.getCurrentWorkspace().getID()== "Main") {
	
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

	//Set a_New_Style and a_New_Color attributes based on Style and CC Start Dates for All Markets which are applicable for Style/CC
	brandMarketsArray.forEach(function (ctxt) {
		manager.executeInContext(ctxt, function (otherManager) {
			var otherNode = otherManager.getObjectFromOtherManager(node);
			var objectType = otherNode.getObjectType().getID();
			var startDate = null
			
			if(objectType == "Style") 
				startDate = otherNode.getValue("a_Style_Start_Date").getSimpleValue();	
			else if (objectType == "CustomerChoice") 
				startDate = otherNode.getValue("a_CC_Start_Date").getSimpleValue();	

			if(startDate != null) {	
				if( startDate > finalDate || startDate == finalDate) {
					if(objectType == "Style")
						otherNode.getValue("a_New_Style").setSimpleValue("Yes");
					else if (objectType == "CustomerChoice") 
						otherNode.getValue("a_New_Color").setSimpleValue("Yes");	
					
				}
				else {
					if(objectType == "Style") 
						otherNode.getValue("a_New_Style").setSimpleValue("No");	
					else if (objectType == "CustomerChoice") 
						otherNode.getValue("a_New_Color").setSimpleValue("No");	
					
					
				}
			}
		})
	})
}

}