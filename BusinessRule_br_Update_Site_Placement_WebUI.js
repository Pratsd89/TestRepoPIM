/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Update_Site_Placement_WebUI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request - Update Site Placement WebUI",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "SitePlacement",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Site_Placement</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">Change Site Placement To</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueUS",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_US",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueCA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_CA",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueJP",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_JP",
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "eventType",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "ShotRequestSubmit",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueSA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_SA",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (webUI,SitePlacement,manager,assethubqueueUS,assethubqueueCA,assethubqueueJP,node,eventType,CCToPhotoShotRef,LKT,assethubqueueSA) {
function modifySitePlacement(shotRequest) {
	var shotSitePlacement = shotRequest.getValue("a_Site_Placement").getID();
	var shotCode = shotRequest.getValue("a_Shot_Code").getSimpleValue();
	var shotRequestStatus = shotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();

	// CC must have a P01 site placement
	if (shotSitePlacement == "5" && SitePlacement != "5") {

		var referencingCCs = new java.util.ArrayList();

		referencingCCs.addAll(shotRequest.getReferencedByProducts());
		var validChange = false;

		if (referencingCCs.isEmpty() == false) {
			for (var num = 0; num <= (referencingCCs.size() - 1); num++) {
				var cc = referencingCCs.get(num).getSource();
				var ccMarketsArray = cc.getValue("a_Market_Designation").getValues().toArray();

				ccMarketsArray.forEach(function (mkt) {
					// current market's context value
					var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());

					manager.executeInContext(nextContext, function (step) {
						// get shot request details in context for validation
						var cntxtShot = step.getEntityHome().getEntityByID(shotRequest.getID());
						var cntxtShotStatus = cntxtShot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
						var cntxtShotMarkets = cntxtShot.getValue("a_Shared_Markets").getSimpleValue();
						// get context cc to check shot requests in each market
						var cntxtCC = step.getProductHome().getProductByID(cc.getID());
						var ccNum = cntxtCC.getValue("a_CC_Number").getSimpleValue();
						var ccShots = cntxtCC.getReferences(CCToPhotoShotRef).toArray();

						// validate against all shot requests for that CC
						ccShots.forEach(function (ccShot) {
							var currentShotRequest = ccShot.getTarget();
							var currentShotPlacement = currentShotRequest.getValue("a_Site_Placement").getSimpleValue();
							var currentShotStatus = currentShotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();

							if (currentShotRequest.getID() != cntxtShot.getID() && cntxtShotMarkets.contains(mkt.getValue()) == true) {
								if (cntxtShotStatus == "Complete" || cntxtShotStatus == "Ready for Review") {
									if (currentShotPlacement == "Main P1" && currentShotStatus == "Complete" || currentShotPlacement == "Main P1" && currentShotStatus == "Ready for Review") {
										validChange = true;
									}
								}
								else if (cntxtShotStatus == "Submitted") {
									if (currentShotPlacement == "Main P1") {
										validChange = true;
									}
								}
							}
						});
						if (validChange == false && cntxtShotStatus == "Complete" || validChange == false && cntxtShotStatus == "Ready for Review") {
							logArray.push("\n<b>Change would result in CC " + ccNum + " to lose its only primary image in market " + mkt.getValue() + ". Please ensure you change another completed shot request to Main P1 before changing placement on this Shot Request.</b>");
						}
						else if (validChange == false) {
							logArray.push("\n<b>Change would result in CC " + ccNum + " to lose its only primary image in market " + mkt.getValue() + ".</b>");
						}
					});
				});
			}
		}
		if (validChange == false) {
			throw "<b>Site Placement Change rejected for the following reasons: </b>" + logArray;
		}
	}

	if (shotRequestStatus == "Complete" || shotRequestStatus == "Ready for Review") {
		if (shotSitePlacement == "228" && SitePlacement != "228" && shotCode == "DV") {
			throw "<b>Cannot change Site Placement value for a video.</b>";
		}
	}

	if (shotSitePlacement == SitePlacement) {
		webUI.showAlert("No change: ", "Selected Site Placement is the current Site Placement for this Shot Request.", "");
	}
	if (SitePlacement == null) {
		throw "<b>Selected shot placement value cannot be null. Please select a value.</b>";
	}
	// otherwise change the site placement to the selected value
	// on the shot request and replbish
	else {
		shotRequest.getValue("a_Site_Placement");
		logArray.push("\nShot Request " + shotRequest.getID() + "'s Site Placement is: " + shotRequest.getValue("a_Site_Placement").getID());

		// set site placement value on Shot Request
		var SitePlacementObject = manager.getAttributeHome().getAttributeByID("a_Site_Placement").getListOfValues().getListOfValuesValueByID(SitePlacement);

		logArray.push("\nChanging site placement on Shot Request to " + SitePlacementObject.getID());
		shotRequest.getValue("a_Site_Placement").setLOVValue(SitePlacementObject);

		// republish
		if (shotRequestStatus == "Submitted" || shotRequestStatus == "Ready for Review" || shotRequestStatus == "Complete") {
			var sharedMarkets = shotRequest.getValue("a_Shared_Markets").getSimpleValue();
			var shotPrimaryMarket = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();

			if (shotPrimaryMarket == null) {
				if (sharedMarkets.contains("US")) {
					shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("US");
				}
				else if (sharedMarkets.contains("CAN")) {
					shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
				}
				else if (sharedMarkets.contains("JPN")) {
					shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
				}
				else if (sharedMarkets.contains("SA")) {
					shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
				}
				shotPrimaryMarket = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();
			}

			if (shotPrimaryMarket != null) {
				if (shotPrimaryMarket == "US") {
					assethubqueueUS.queueDerivedEvent(eventType, shotRequest);
				}
				else if (shotPrimaryMarket == "CAN") {
					assethubqueueCA.queueDerivedEvent(eventType, shotRequest);
				}
				else if (shotPrimaryMarket == "JPN") {
					assethubqueueJP.queueDerivedEvent(eventType, shotRequest);
				}
				else if (shotPrimaryMarket == "SA") {
					assethubqueueSA.queueDerivedEvent(eventType, shotRequest);
				}
			}
			if (SitePlacement == "5"){

				var sharedMarketsArray = shotRequest.getValue("a_Shared_Markets").getValues().toArray();
			    sharedMarketsArray.forEach(function (mkt) {
				var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());
				manager.executeInContext(nextContext, function (step) {							
				var referencingCCsFromShot = new java.util.ArrayList();
				referencingCCsFromShot.addAll(shotRequest.getReferencedByProducts());
				if (referencingCCsFromShot.isEmpty() == false) {
					for (var numb = 0; numb <= (referencingCCsFromShot.size() - 1); numb++) {
							ccNm = referencingCCsFromShot.get(numb).getSource();
							var otherCC = null;
							step.executeInContext(nextContext, function (otherContextManager) {
							 otherCC = otherContextManager.getObjectFromOtherManager(ccNm);
							});
							if (otherCC != null){
							getWorkflowVariables(otherCC, nextContext, shotRequestStatus);
							}
						 }
						}
			    	    });
			    });
			}
		}
	}
}

function getWorkflowVariables(CC, mkt, status) {

	var CCStates1 = new Array("NewCCEnrich_Photo1");
	var CCStates2 = new Array("NewCCEnrich_Photo1", "NewCCEnrich_Photo2");
	var CCStates3 = new Array("NewCCEnrich_Photo1", "NewCCEnrich_Photo2", "NewCCEnrich_Photo3");
	var states = null;
	var CCPhotoStatus = CC.getValue('a_CC_Photo_Status').getSimpleValue();
	var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
	var wf = LKT.getLookupTableValue("LKT_Context_to_CC_Enrich_Workflows", context);
	if (status == "Submitted") {
		if (CCPhotoStatus == "Complete") {
			CC.getValue('a_CC_Photo_Status').setSimpleValue("Complete: Request Submitted");
		}
		else {
			states = CCStates1;
		}
	}
	else if (status == "Ready for Review") {
		if (CCPhotoStatus == "Complete" || CCPhotoStatus == "Complete: Request Submitted") {
			CC.getValue('a_CC_Photo_Status').setSimpleValue("Complete: Ready for Review");
		}
		else {
			states = CCStates2;
		}
	}
	else if (status == "Complete") {
		states = CCStates3;
	}
	if (states != null){
	    AutoTriggerWorkflow(wf, states, CC);
	}
}

function AutoTriggerWorkflow(wf, wfStates, CC) {
	var errorMessage = null;
	wfStates.forEach(function (state) {
	var isInState = CC.isInState(wf, state);
	if (isInState) {
		var workflowObject = manager.getWorkflowHome().getWorkflowByID(wf);
		var wfObjectState = workflowObject.getStateByID(state);
		var transition = wfObjectState.getTransitions().toArray()[0];
		var event = transition.getEvents().toArray()[0].getID();
		errorMessage = CC.getWorkflowInstanceByID(wf).getTaskByID(state).triggerByID(event, "CC Workflow Trigger from Main P1 Shot Request market update").getScriptMessage();
		log.info("triggerByID result: " + errorMessage);
		}
	});



	var currentContext = manager.getCurrentContext().getID();
	if (errorMessage != null) {
		CC.getValue("a_error_message").setSimpleValue(currentContext + " : " + errorMessage);
	}
	else {
		if (CC.getValue("a_error_message").getSimpleValue() != null) {
			CC.getValue("a_error_message").deleteCurrent();
		}
	}
}



//get selected Shot Requests
var selectedIter = webUI.getSelection().iterator();
// make sure only one Shot Request is selected
var count = 0;
// array for webUI log message
var logArray = new Array();

while (selectedIter.hasNext()) {
	var next = selectedIter.next();

	if (next) {
		count++
		if (count > 1) {
			throw "<b>Cannot select more than one Image/Shot Request for Change Shot Placement.</b>"
		}
	}
}
//get selected Shot Requests
var selectedIter = webUI.getSelection().iterator();
//for each selected Shot Request
while (selectedIter.hasNext()) {
	var currSelected = selectedIter.next();
	var currObjectType = currSelected.getObjectType().getID();
	logArray.push("\nProcessing Shot Request: " + next.getID());

	if (currObjectType == "ExternalStoredDAMAsset") {
		//get referencing shot request
		var referencedBy = currSelected.getReferencedBy().toArray();
		for (var m = 0; m < referencedBy.length; m++) {
			var referenceTypeId = referencedBy[m].getReferenceType().getID();

			if (referenceTypeId == 'ShotRequestToExternalAsset') {
				logArray.push("\nProcessing Shot Request: " + referencedBy[m].getSource().getID());

				modifySitePlacement(referencedBy[m].getSource());
			}
		}
	}
	else {
		logArray.push("\nProcessing Shot Request: " + currSelected.getID());

		modifySitePlacement(currSelected);
	}
}
// comment out when not in development
//webUI.showAlert("WARNING", "Log", logArray);
}