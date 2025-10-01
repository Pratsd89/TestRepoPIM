/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CreateShotRequest",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CreateShotRequest",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "utilLib"
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
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,lookupTable,portal,utilLib) {
//PPIM-8056 - This block is added to Warn if user tries to create Shot for CC in InValid Context
var isShotCreationEligible = false
var currentContext = step.getCurrentContext().getID()
var ccMarketDesignation = node.getValue("a_Market_Designation").getValues().toArray();
ccMarketDesignation.forEach(function (market) {
	if(currentContext.indexOf(market.getSimpleValue().substring(0,2)) > 0)	
		isShotCreationEligible = true
})
if(!isShotCreationEligible) {
	portal.showAlert("Warning",  "Shot creation not allowed in Current Context. Please switch the Context where CC is Eligible and try again.");
	log.info('Please switch the context to create the Shot, as CC is NOT eligible in '+ currentContext)
}

//Creating the reference if user is trying to create shot in Valid Context and the Current Workspace is Main.	
if (step.getCurrentWorkspace().getID() == "Main" && isShotCreationEligible) {
	var wf = step.getWorkflowHome().getWorkflowByID("wf_StyleMaintenanceWorkflow");

	if (node.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Approved" && !node.getWorkflowInstanceByID("wf_CCEnrichment") && !node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow")) {
		wf.start(node, "Started");
	}

	var oShotReqRoot = step.getEntityHome().getEntityByID("126402");
	var oNewShotRequest = oShotReqRoot.createEntity(null, "ProductShotRequest");
	var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
	
	//PPIM-8056 - Below block of changes reflects to update the shared market only if the lifecycle status not in Draft/NULL
	var newsharedMarket = null
	ccMarketDesignation.forEach(function (market) {
		var context = lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", market.getSimpleValue())
        	step.executeInContext(context, function (otherStepManager) {
            	otherNode = otherStepManager.getObjectFromOtherManager(node)

            	//Map the respective CC Eligible Market's a_CC_Number value to the newly created Shot Request
            	var aCCNumber = otherNode.getValue('a_CC_Number').getSimpleValue()
			if(aCCNumber != null )
				oNewShotRequest.getValue("a_Shot_CC_Number").setSimpleValue(aCCNumber);

			//Add the shared market from CC market designation only if CC life cycle status is not in Draft/NULL
            	if(true) { //otherNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue() != 'Draft'
                	if(otherNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue() != null && otherNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue() != '') {
                   		if(newsharedMarket!=null)
                       		newsharedMarket = newsharedMarket + '<multisep/>'+ market.getSimpleValue()
                    	else
                        	newsharedMarket = market.getSimpleValue()
                	}	
            	}
        	})
	});

	// If all markets in which the CC is eligible are in Draft/NULL status then pop up below warning
	if(newsharedMarket == null) {
		portal.showAlert("Warning",  "CC's Life Cycle Status are in Blank status. Proceed enriching the Product before creating the Shot");
		log.info('CCs Life Cycle Status are in Draft/Blank status. Proceed enriching the Product before creating the Shot')
	} else {
		oNewShotRequest.getValue("a_Shared_Markets").setSimpleValue(newsharedMarket);
		node.createReference(oNewShotRequest, "CCToPhotoShotRef");
		portal.navigate("GAPPhotoShotDetails", oNewShotRequest);
	

	}
	
}
else if (step.getCurrentWorkspace().getID() == "Approved" && isShotCreationEligible) {
	portal.showAlert("Warning",  "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}