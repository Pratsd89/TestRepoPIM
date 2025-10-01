/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Update_Site_Placement_WebUI_Temp",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request - Update Site Placement WebUI Temp",
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
function modifySitePlacement(shotRequest, newSitePlacement) {
	var shotSitePlacement = shotRequest.getValue("a_Site_Placement").getID();
	var shotCode = shotRequest.getValue("a_Shot_Code").getSimpleValue();
	var shotRequestStatus = shotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
	var logArray = new Array();

	// CC must have a P01 site placement
	if (shotSitePlacement == "5" && newSitePlacement != "5") {
		var referencingCCs = new java.util.ArrayList();
		referencingCCs.addAll(shotRequest.getReferencedByProducts());
		var validChange = false;

		if (!referencingCCs.isEmpty()) {
			for (var num = 0; num < referencingCCs.size(); num++) {
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
								if ((cntxtShotStatus == "Complete" || cntxtShotStatus == "Ready for Review") &&
									(currentShotPlacement == "Main P1" && (currentShotStatus == "Complete" || currentShotStatus == "Ready for Review"))) {
									validChange = true;
								}
								else if (cntxtShotStatus == "Submitted" && currentShotPlacement == "Main P1") {
									validChange = true;
								}
							}
						});
						
						if (validChange == false && (cntxtShotStatus == "Complete" || cntxtShotStatus == "Ready for Review")) {
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

	if ((shotRequestStatus == "Complete" || shotRequestStatus == "Ready for Review") &&
		shotSitePlacement == "228" && newSitePlacement != "228" && shotCode == "DV") {
		throw "<b>Cannot change Site Placement value for a video.</b>";
	}

	if (shotSitePlacement == newSitePlacement) {
		webUI.showAlert("No change: ", "Selected Site Placement is the current Site Placement for this Shot Request.", "");
		return;
	}
	
	if (newSitePlacement == null) {
		throw "<b>Selected shot placement value cannot be null. Please select a value.</b>";
	}
	
	// otherwise change the site placement to the selected value
	// on the shot request and republish
	logArray.push("\nShot Request " + shotRequest.getID() + "'s Site Placement is: " + shotRequest.getValue("a_Site_Placement").getID());

	// set site placement value on Shot Request
	var sitePlacementObject = manager.getAttributeHome().getAttributeByID("a_Site_Placement").getListOfValues().getListOfValuesValueByID(newSitePlacement);

	logArray.push("\nChanging site placement on Shot Request to " + sitePlacementObject.getID());
	shotRequest.getValue("a_Site_Placement").setLOVValue(sitePlacementObject);

	// republish and update related CC Photo Status
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
		
		// Update the Photo Status based on site placement changes
		// If changing to Main P01, set status to "Ready for Review"
		if (newSitePlacement == "5") { // Assuming "5" is the ID for "Main P01"
			if (shotRequestStatus == "Submitted") {
				shotRequest.getValue("a_Shot_Request_Lifecycle_Status").setSimpleValue("Ready for Review");
				logArray.push("\nUpdated Shot Request status to 'Ready for Review' because placement changed to Main P01");
			}
			
			// Also update any associated CC records to reflect the new status
			updateRelatedCCPhotoStatus(shotRequest);
		}

		// Define eventType for republishing
		var eventType = "ShotRequestSubmit"; //  event type
		
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
	}
	
	return logArray;
}

// Function to update CC Photo Status when a shot request's site placement changes
function updateRelatedCCPhotoStatus(shotRequest) {
	// Get all CCs referencing this shot request
	var referencingCCs = new java.util.ArrayList();
	referencingCCs.addAll(shotRequest.getReferencedByProducts());
	
	if (!referencingCCs.isEmpty()) {
		for (var num = 0; num < referencingCCs.size(); num++) {
			var cc = referencingCCs.get(num).getSource();
			var ccMarketsArray = cc.getValue("a_Market_Designation").getValues().toArray();
			
			// For each market, update the CC photo status
			ccMarketsArray.forEach(function (mkt) {
				var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());
				
				manager.executeInContext(nextContext, function (step) {
					var cntxtCC = step.getProductHome().getProductByID(cc.getID());
					var ccNum = cntxtCC.getValue("a_CC_Number").getSimpleValue();
					
					// Check current CC photo status
					var currentPhotoStatus = cntxtCC.getValue("a_CC_Photo_Status").getSimpleValue();
					
					// If shot is becoming Main P01 and is Ready for Review, update CC Photo Status
					if (currentPhotoStatus == "Submitted") {
						cntxtCC.getValue("a_CC_Photo_Status").setSimpleValue("Ready for Review");
						logArray.push("\nUpdated CC " + ccNum + " Photo Status from 'Submitted' to 'Ready for Review'");
					}
				});
			});
		}
	}
}

// Main execution starts here
var logArray = new Array();

// Get UI selection and validate only one shot request is selected
var selectedIter = webUI.getSelection().iterator();
var selectedItem = null;
var count = 0;

while (selectedIter.hasNext()) {
	var next = selectedIter.next();
	if (next) {
		count++;
		selectedItem = next;
		if (count > 1) {
			throw "<b>Cannot select more than one Image/Shot Request for Change Shot Placement.</b>";
		}
	}
}

if (count === 0) {
	throw "<b>Please select one Shot Request or Image.</b>";
}

// Prompt for new site placement
var newSitePlacement = webUI.showInputDialog("Change Site Placement", "Enter new Site Placement ID:", "");

}