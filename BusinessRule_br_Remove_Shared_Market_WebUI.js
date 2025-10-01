/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Remove_Shared_Market_WebUI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request - Remove Shared Market WebUI",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "removeMarkets",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Shared_Markets</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">removeMarketsVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
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
    "contract" : "DerivedEventTypeBinding",
    "alias" : "eventType",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "ShotRequestSubmit",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueSA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_SA",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,webUI,LKT,removeMarkets,assethubqueueUS,assethubqueueCA,assethubqueueJP,eventType,assethubqueueSA,CCToPhotoShotRef) {
/*
 * PPIM_10541 - Added logic w.r.t SA Market changes to set Shot Primary Market if Market is SA and publish the details to Assethub.
 * Existing functionality not altered.
 */
 
function removeSharedMarket(shotRequest) {
	var shotPrimaryMarket = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();

	//get the shot lifecyle status
	var shotRequestStatus = shotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
	logArray.push("\nShot Request lifecycle status is: " + shotRequestStatus);

	if (shotRequestStatus == "Ready for Review" || shotRequestStatus == "Complete") {
		var republish = false;

		//get the Site Placement
		var placementValue = shotRequest.getValue('a_Site_Placement').getLOVValue().getValue();
		logArray.push("\n -- Shot's placement value: " + placementValue);

		//for each selected context
		var removeMarketsIter = removeMarketsArray.iterator();

		while (removeMarketsIter.hasNext()) {
			var contextID = removeMarketsIter.next();

			//if Site Placement isn't Main P1, removeContentLink for the CC (node) and the selected context
			if (placementValue != 'Main P1') {
				//remove selected market from Shot Request
				var shotMktIter = shotRequest.getValue("a_Shared_Markets").getValues().iterator();

				while (shotMktIter.hasNext()) {
					var nextShotMkt = shotMktIter.next();
					var nextShotMktName = nextShotMkt.getValue();

					//make sure current Shot Request market designation value is one that was selected for removal
					if (contextID == LKT.getLookupTableValue("LKT_MarketDesignationToMarket", nextShotMktName)) {
						logArray.push("\n -- Removing " + nextShotMkt.getValue() + " from " + shotRequest.getID());
						//delete selected market designation value
						nextShotMkt.deleteCurrent();
						republish = true;
					}
				}
				//remove referece to Shot Request from CC in context
				logArray.push("\n -- Removing reference to CC from Shot Request");
				manager.executeInContext(contextID, function (step) {
					//context specific Shot Request
					var ctxtShot = step.getEntityHome().getEntityByID(shotRequest.getID());
					logArray.push("\n -- ctxtShot ID is: " + ctxtShot.getID());

					//context specific Shot Request referenced by
					var ctxtShotRefsIter = ctxtShot.getReferencedBy().iterator();
					logArray.push("\n -- ctxtShotRefsIter has next: " + ctxtShotRefsIter.hasNext());

					//for each reference by ref
					while (ctxtShotRefsIter.hasNext()) {
						//current ref
						var nextCtxtShotRefBy = ctxtShotRefsIter.next();

						//current ref's source
						var nextRefBySource = nextCtxtShotRefBy.getSource();
						logArray.push("\n -- nextCtxtShotRefBy source is: " + nextRefBySource.getID());

						//current ref's type
						var nextRefByType = nextCtxtShotRefBy.getReferenceType();
						logArray.push("\n -- nextCtxtShotRefBy type is: " + nextRefByType);

						//if ref's source is the CC and type is CCToPhotoShotRef...
						if (nextRefByType == "CCToPhotoShotRef") {
							// fix assets
							logArray.push("\n -- Removing " + placementValue + " reference from CC in " + contextID);
							removeContentLink(nextRefBySource, placementValue, step, contextID);
							// then delete
							logArray.push("\n -- CCToPhotoShotRef deleted on CC");
							nextCtxtShotRefBy.delete();
						}
					}

					// remove Shot Customer Choice Number and Shot Market Number from the Shot Request
					ctxtShot.getValue("a_Shot_CC_Number").setSimpleValue(null);
					ctxtShot.getValue("a_Shot_Market_Number").setSimpleValue(null);
				});

			}
			else {
				if (shotRequestStatus == "Complete" || shotRequestStatus == "Ready for Review") {
					webUI.showAlert("warning", "Cannot Remove Market", "Market removal would cause this CC to lose its only primary image in this market. Please submit new Shot Request for " + nextShotMktName);
				}
			}
		}

		if (republish) {

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

			//set CC a_main_last_modified_date
			var time = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			CC.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		}
	}
	else {
		var republish = false;

		var placementValue = shotRequest.getValue('a_Site_Placement').getLOVValue().getValue();
		logArray.push("\n -- Shot's placement value: " + placementValue);

		//for each selected context
		var removeMarketsIter = removeMarketsArray.iterator();

		while (removeMarketsIter.hasNext()) {
			var contextID = removeMarketsIter.next()

			if (placementValue != 'Main P1') {
				//remove selected market from Shot Request
				var shotMktIter = shotRequest.getValue("a_Shared_Markets").getValues().iterator();

				while (shotMktIter.hasNext()) {
					var nextShotMkt = shotMktIter.next();
					var nextShotMktName = nextShotMkt.getValue();

					//make sure current Shot Request market designation value is one that was selected for removal
					if (contextID == LKT.getLookupTableValue("LKT_MarketDesignationToMarket", nextShotMktName)) {
						logArray.push("\n -- Removing " + nextShotMkt.getValue() + " from " + shotRequest.getID());
						//delete selected market designation value
						nextShotMkt.deleteCurrent();

						republish = true;
					}
				}
				//remove referece to Shot Request from CC in context
				logArray.push("\n -- Removing reference to CC from Shot Request");
				manager.executeInContext(contextID, function (step) {
					//context specific Shot Request
					var ctxtShot = step.getEntityHome().getEntityByID(shotRequest.getID());
					logArray.push("\n -- ctxtShot ID is: " + ctxtShot.getID());

					//context specific Shot Request referenced by
					var ctxtShotRefsIter = ctxtShot.getReferencedBy().iterator();
					logArray.push("\n -- ctxtShotRefsIter has next: " + ctxtShotRefsIter.hasNext());

					//for each reference by ref
					while (ctxtShotRefsIter.hasNext()) {
						//current ref
						var nextCtxtShotRefBy = ctxtShotRefsIter.next();

						//current ref's source
						var nextRefBySource = nextCtxtShotRefBy.getSource();
						logArray.push("\n -- nextCtxtShotRefBy source is: " + nextRefBySource.getID());

						//current ref's type
						var nextRefByType = nextCtxtShotRefBy.getReferenceType();
						logArray.push("\n -- nextCtxtShotRefBy type is: " + nextRefByType);

						//if ref's source is the CC and type is CCToPhotoShotRef...
						if (nextRefByType == "CCToPhotoShotRef") {
							// fix assets
							logArray.push("\n -- Removing " + placementValue + " reference from CC in " + contextID);
							// then delete
							logArray.push("\n -- CCToPhotoShotRef deleted on CC");
							nextCtxtShotRefBy.delete();
						}
					}

					// remove Shot Customer Choice Number and Shot Market Number from the Shot Request
					ctxtShot.getValue("a_Shot_CC_Number").setSimpleValue(null);
					ctxtShot.getValue("a_Shot_Market_Number").setSimpleValue(null);
				});
			}
			else {
				webUI.showAlert("warning", "Cannot Remove Market", "The Shot Request selected is for a Main P1 Image. You cannot remove Primary Product Images for any Market. Please submit new Shot Request for " + nextShotMktName);
			}
		}

		if (republish) {

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

			//set CC a_main_last_modified_date
			var time = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			CC.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		}
	}
}


function removeMarketsValidation(shotRequest) {
		
	//get market designation from Shot Request
	var ShotMktArray = java.util.ArrayList();

	//get the site placement from the Shot Request
	var shotMarket = shotRequest.getValue("a_Shared_Markets").getSimpleValue();

	//get photo shot lifecycle status from Shot Request
	var shotRequestStatus = shotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();

	var shotPrimaryMarket = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();

	if (shotPrimaryMarket == null) {
		if (shotMarket.contains("US")) {
			shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("US");
		}
		else if (shotMarket.contains("CAN")) {
			shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
		}
		else if (shotMarket.contains("JPN")) {
			shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
		}
		else if (shotMarket.contains("SA")) {
			shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
		}
		shotPrimaryMarket = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();
	}

	if (shotRequestStatus == "Submitted" || shotRequestStatus == "Complete" || shotRequestStatus == "Ready for Review") {
		var isFound = false;

		removeMarkets.split("<multisep/>").forEach(function (m) {
			var lovName = manager.getAttributeHome().getAttributeByID("a_Shared_Markets").getListOfValues().getListOfValuesValueByID(m).getValue();

			if (lovName == shotPrimaryMarket) {
				isFound = true;
			}

			if (isFound == true) {

				if (shotRequestStatus == "Submitted") {
					validationArray.push("\n<b>You cannot remove Shared Market of " + shotPrimaryMarket + " from Shot Request " + shotRequest.getID() + ", as this Shot Request is currently in-process in PhotoStudio for this Market. Please email PhotoStudio to cancel this SR if it was accidently created against this Market</b>");
				}
				else if (shotRequestStatus == "Complete" || shotRequestStatus == "Ready for Review") {
					validationArray.push("\n<b>You cannot remove Shared Market of " + shotPrimaryMarket + " from Shot Request " + shotRequest.getID() + ", as the associated asset was initially shot in this Market. Please reject this shot and resubmit a new shot request for the market you wish to retain. Please contact studio to leverage existing asset against other Markets.</b>");
				}
			}
		});
	}

	shotRequest.getValue("a_Shared_Markets").getSimpleValue().split("<multisep/>").forEach(function (m) {
		ShotMktArray.add(m);
	});

	var count = 0;

	removeMarkets.split("<multisep/>").forEach(function (m) {
		var market = manager.getAttributeHome().getAttributeByID("a_Shared_Markets").getListOfValues().getListOfValuesValueByID(m).getValue();

		//if Shot Request's market designation doesn't contain selected market
		if (ShotMktArray.indexOf(market) == -1) {
			//throw error
			validationArray.push("\n<b>Cannot remove " + market + " from " + shotRequest.getID() + " because value is already missing</b>");
		}
		else {
			count++;
		}
	});

	//cannot remove all markets from shot request
	if (count == ShotMktArray.size()) {
		throw "<b>Cannot remove all markets from Shot Request. Must leave at least one market.</b>"
	}

	//check for BOMCC 
	if(removeMarketsArray.contains("EN_SA")){
		if (shotMarket.contains("US")) {
			checkForBOMCC("EN_US",shotRequest)
			
		}
		else if(shotMarket.contains("JPN")){
			checkForBOMCC("EN_JP",shotRequest)
		}
		
	}
	
}



function checkForBOMCC(context,shotRequest) {
	var cc;
	manager.executeInContext(context, function (otherManager) {
		var contextshotRequest = otherManager.getObjectFromOtherManager(shotRequest);		
		cc = contextshotRequest.queryReferencedBy(CCToPhotoShotRef).asList(100).get(0).getSource().getID();
		
	});
	manager.executeInContext("EN_SA", function (otherManager) {
		var contextshotRequest = otherManager.getObjectFromOtherManager(shotRequest);
		contextshotRequest.queryReferencedBy(CCToPhotoShotRef).forEach(function (referenceInstance) {
			sa_cc = referenceInstance.getSource().getID();
			if(cc != sa_cc){
				throw "\n<b>You cannot remove SA Market" + " from Shot Request "+shotRequest.getID() +" as BOMCC is sharing this shot Request</b>";
				}
			return true;
		});
				
	});
	
	
}

// function to remove a reference
function removeContentLink(source, refType, manager, contextID) {
	return manager.executeInContext(contextID, function (otherManager) {
		var sourceNode = otherManager.getObjectFromOtherManager(source);

		// fix refTyp for AV9 Video & Main P1
		if (refType == "AV9 Video") {
			refType = "AV9";
		}
		if (refType == "Main P1") {
			refType = "PrimaryProductImage";
		}
		var refs = sourceNode.getReferences(manager.getReferenceTypeHome().getReferenceTypeByID(refType));
		// if source object has the reference populated and is pointing to different asset, delete it
		for (var i = 0; i < refs.size(); i++) {
			var refToDelete = refs.get(i);

			refToDelete.delete();
		}
	});
}

//array to hold webUI log messages
var logArray = new Array();

//selection cannot be null
if (removeMarkets == null) {
	webUI.showAlert("Error", "Null Value", "<b>Please select a market to remove. Value cannot be Null</b>");
}
else {
	/*
		Shot Request validation section
	*/
		//Get selected context(s)
	var removeMarketsArray = new java.util.ArrayList();

	removeMarkets.split("<multisep/>").forEach(function (m) {
		var lovName = manager.getAttributeHome().getAttributeByID("a_Shared_Markets").getListOfValues().getListOfValuesValueByID(m).getValue();
		removeMarketsArray.add(LKT.getLookupTableValue("LKT_MarketDesignationToMarket", lovName));
	});
	logArray.push("\n Markets to remove: " + removeMarketsArray);

	//get selected Shot Requests
	var selectedIter = webUI.getSelection().iterator();

	//must select at least one Shot Request
	if (selectedIter == null) {
		throw "No Shot Requests selected. Please select Shot Requests to continue."
	}

	var validationArray = new Array();

	//for each selected Shot Request
	while (selectedIter.hasNext()) {
		var currSelected = selectedIter.next();
		var currObjectType = currSelected.getObjectType().getID();

		if (currObjectType == "ExternalStoredDAMAsset") {
			//get referencing shot request
			var referencedBy = currSelected.getReferencedBy().toArray();
			for (var m = 0; m < referencedBy.length; m++) {
				var referenceTypeId = referencedBy[m].getReferenceType().getID();

				if (referenceTypeId == 'ShotRequestToExternalAsset') {
					removeMarketsValidation(referencedBy[m].getSource());
				}
			}
		}
		else {
			removeMarketsValidation(currSelected);
		}
	}

	if (validationArray.length > 0) {
		throw validationArray;
	}

	/*
		Remove references and values section
	*/



	

	//get CC (node)
	var CC = node;
	var CCID = CC.getID();
	logArray.push("\nCC ID: " + CC.getID());

	//get selected Shot Requests
	var selectedIter = webUI.getSelection().iterator();

	//for each selected Shot Request
	while (selectedIter.hasNext()) {
		var currSelected = selectedIter.next();
		var currObjectType = currSelected.getObjectType().getID();

		if (currObjectType == "ExternalStoredDAMAsset") {
			//get referencing shot request
			var referencedBy = currSelected.getReferencedBy().toArray();
			for (var m = 0; m < referencedBy.length; m++) {
				var referenceTypeId = referencedBy[m].getReferenceType().getID();

				if (referenceTypeId == 'ShotRequestToExternalAsset') {
					logArray.push("\nProcessing Shot Request: " + referencedBy[m].getSource().getID());

					removeSharedMarket(referencedBy[m].getSource());
				}
			}
		}
		else {
			logArray.push("\nProcessing Shot Request: " + currSelected.getID());

			removeSharedMarket(currSelected);
		}
	}
	//webUI log information. Comment out this line when not in development
	//webUI.showAlert("warning", "Log", logArray);
}
}