/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_modifyShotRequestImportValidations",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Modify Shot Request Bulk Import Validations",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
    "contract" : "ImportChangeInfoBind",
    "alias" : "importChanges",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestPrimaryImageRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestPrimaryImageRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "PrimaryProductImage",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestVideoRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestVideoRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,importChanges,LKT,CCToPhotoShotRef,ShotRequestPrimaryImageRef,PrimaryProductImage,ShotRequestVideoRef) {
var shotID = node.getID();
var shotCode = node.getValue("a_Shot_Code").getSimpleValue();
var shotType = node.getValue("a_Shot_Type").getSimpleValue();
var shotPlacement = node.getValue("a_Site_Placement").getSimpleValue();
var shotMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
var shotCC = node.getValue("a_Shot_CC_Number").getSimpleValue();
var shotStatus = node.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
var shotPrimaryMarket = node.getValue("a_Shot_Primary_Market").getSimpleValue();
var shotRevisions = node.getRevisions();
var prevRevisionNode = null;
if (shotRevisions.size() == 1) {
	prevRevisionNode = shotRevisions.get(0).getNode();
}
else {
	prevRevisionNode = shotRevisions.get(1).getNode();
}


var logArray = new Array();

var changedAttrs = importChanges.getChanges();

// for each change, ensure appropriate lifecycle status
if (changedAttrs) {

	changedAttrs = changedAttrs.getAttributes();

	// Shot requests should not be created OR modified if any one of required fields are missing: Shot Code, Shot Type, Site Placement, CC Number, Shared Markets
	if (shotCode == null) {
		logArray.push("\n<b>Shot Request was not modified due to required data missing for " + step.getAttributeHome().getAttributeByID("a_Shot_Code").getName() + "</b>");
	}

	if (shotType == null) {
		logArray.push("\n<b>Shot Request was not modified due to required data missing for " + step.getAttributeHome().getAttributeByID("a_Shot_Type").getName() + "</b>");
	}

	if (shotPlacement == null) {
		logArray.push("\n<b>Shot Request was not modified due to required data missing for " + step.getAttributeHome().getAttributeByID("a_Site_Placement").getName() + "</b>");
	}

	if (shotMarkets == null) {
		logArray.push("\n<b>Shot Request was not modified due to required data missing for " + step.getAttributeHome().getAttributeByID("a_Shared_Markets").getName() + "</b>");
	}

	if (shotCC == null) {
		logArray.push("\n<b>Shot Request was not modified due to required data missing for " + step.getAttributeHome().getAttributeByID("a_Shot_CC_Number").getName() + "</b>");
	}

	if (logArray.length > 0) {
		return "<b>Updates to Shot Request with ID " + shotID + " for CC " + shotCC + " were rejected for the following reasons:</b>" + logArray;
	}

	// set the Primary Market for the Shot Request when it is null
	if (shotPrimaryMarket == null) {

		if (changedAttrs.contains("a_Shared_Markets")) {
			var prevRevisionMarkets = prevRevisionNode.getValue("a_Shared_Markets").getSimpleValue();

			if (prevRevisionMarkets != null) {
				if (prevRevisionMarkets.contains("US")) {
					node.getValue("a_Shot_Primary_Market").setSimpleValue("US");
				}
				else if (prevRevisionMarkets.contains("CAN")) {
					node.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
				}
				else if (prevRevisionMarkets.contains("JPN")) {
					node.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
				}
				//Changes were added as a part of PPIM-10539
				else if (prevRevisionMarkets.contains("SA")) {
					node.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
				}
			}
		}
		else {
			if (shotMarkets.contains("US")) {
				node.getValue("a_Shot_Primary_Market").setSimpleValue("US");
			}
			else if (shotMarkets.contains("CAN")) {
				node.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
			}
			else if (shotMarkets.contains("JPN")) {
				node.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
			}
			//Changes were added as a part of PPIM-10539
			else if (prevRevisionMarkets.contains("SA")) {
				node.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
			}
		}
	}

	shotPrimaryMarket = node.getValue("a_Shot_Primary_Market").getSimpleValue();

	if (changedAttrs.contains("a_Shot_Code")) {
		if (shotStatus != "Draft" && shotStatus != null) {
			logArray.push("\n<b>You cannot modify Shot Code for Shot Requests with Status of " + shotStatus + "</b>");
		}
	}

	if (changedAttrs.contains("a_Shot_Type")) {
		if (shotStatus != "Draft" && shotStatus != "Submitted" && shotStatus != null) {
			logArray.push("\n<b>You cannot modify Shot Type for Shot Requests with Status of " + shotStatus + "</b>");
		}
	}

	if (changedAttrs.contains("a_Styling_Piece_CC_Number")) {
		if (shotStatus != "Draft" && shotStatus != "Submitted" && shotStatus != null) {
			logArray.push("\n<b>You cannot modify Styling Piece for Shot Requests with Status of " + shotStatus + "</b>");
		}
	}

	// if shared markets changed when status is ready for review, What to do in case of Main P1 > CC Photo Status complete
	if (changedAttrs.contains("a_Shared_Markets")) {
		if (shotStatus == "Submitted") {
			if (!shotMarkets.contains(shotPrimaryMarket)) {
				logArray.push("\n<b>You cannot remove " + shotPrimaryMarket + ", as this Shot Requests is currently in-process in Photo Studio for this market. Please email PhotoStudio to cancel this SR if it was accidently created against this Market</b>");
			}
		}

		if (shotStatus == "Complete" || shotStatus == "Ready for Review") {
			if (!shotMarkets.contains(shotPrimaryMarket)) {
				logArray.push("\n<b>You cannot remove " + shotPrimaryMarket + " from this Shot Request, as the associated asset was initially shot in this Market. Please reject this shot and resubmit a new shot request for the market you wish to retain. Please contact studio to leverage existing asset against other Markets.</b>");
			}
			if (changedAttrs.contains("a_Site_Placement")) {
				logArray.push("\n<b>You cannot modify Site Placement and Shared Markets simultaniously for completed Shot Requests. This will cause issues with handling the asset associated to the CC. Please update Shared Markets, then modify Site Placement.</b>");
			}
		}
	}

	if (changedAttrs.contains("a_Site_Placement")) {
		//Ensure Video Site Placement is not changed
		if (shotCode == 'DV' && shotPlacement != 'AV9 Video') {
			var shotVideo = node.getReferences(ShotRequestVideoRef);
			var prevShotPlacement = prevRevisionNode.getValue("a_Site_Placement").getSimpleValue();

			if (shotVideo.isEmpty() == false) {
				logArray.push("\n<b>You cannot modify Site Placement for a Video</b>");
			}
			if (prevShotPlacement == "AV9 Video" && shotStatus == "Complete" || prevShotPlacement == "AV9 Video" && shotStatus == "Complete") {
				logArray.push("\n<b>You cannot modify Site Placement for a Video</b>");
			}
		}
	}

	if (logArray.length > 0) {
		return "<b>Updates to Shot Request with ID " + shotID + " for CC " + shotCC + " were rejected for the following reasons:</b>" + logArray;
	}

	// Specific validations against Main P1 Site Placement changes 
	if (changedAttrs.contains("a_Site_Placement") || changedAttrs.contains("a_Shared_Markets")) {

		var referencingCCs = new java.util.ArrayList();

		//get CCs referencing the modified Shot
		referencingCCs.addAll(node.getReferencedByProducts());

		if (referencingCCs.isEmpty() == false) {
			for (var num = 0; num <= (referencingCCs.size() - 1); num++) {
				var cc = referencingCCs.get(num).getSource();
				var ccID = cc.getID();
				var ccNum = cc.getValue("a_CC_Number").getSimpleValue();
				var checkMarkets = null;

				// detemine which markets are valid for the CC
				checkMarkets = cc.getValue("a_Market_Designation").getSimpleValue();

				if (checkMarkets.contains(";")) {
					var checkMarketsArray = [];

					checkMarkets.split(";").forEach(function (mkt) {
						checkMarketsArray.push(mkt);
					});
				}
				else if (checkMarkets.contains("<multisep/>")) {
					var checkMarketsArray = [];

					checkMarkets.split("<multisep/>").forEach(function (mkt) {
						checkMarketsArray.push(mkt);
					});
				}
			}

			// check against each market that is valid for the CC
			if (checkMarketsArray != null) {

				checkMarketsArray.forEach(function (mkt) {
					// current market's context value
					var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);

					step.executeInContext(nextContext, function (manager) {
						var cntxtShot = manager.getEntityHome().getEntityByID(node.getID());
						var cntxtShotID = cntxtShot.getID();
						var cntxtShotMarkets = cntxtShot.getValue("a_Shared_Markets").getSimpleValue();

						// get all CCs referencing the shot in the current market
						var cntxtReferencingCCs = new java.util.ArrayList();
						cntxtReferencingCCs.addAll(cntxtShot.getReferencedByProducts());

						// Main P1 validations in when modified shot is referenced by the CC
						if (cntxtReferencingCCs.isEmpty() == false) {

							// get CC referencing modified Shot Request
							for (var num = 0; num <= (cntxtReferencingCCs.size() - 1); num++) {
								var cntxtCC = cntxtReferencingCCs.get(num).getSource();
								var cntxtCCNum = cntxtCC.getValue("a_CC_Number").getSimpleValue();
								var cntxtCCShotRequests = cntxtCC.getReferences(CCToPhotoShotRef).toArray();
								var ccPrimaryShotID = null;

								// validate against all shot requests for that CC
								cntxtCCShotRequests.forEach(function (ccShotRequest) {
									var currentShotRequest = ccShotRequest.getTarget();
									//get the Primary Shot for the CC
									var ccPrimaryImages = cntxtCC.getReferences(PrimaryProductImage).toArray();

									if (ccPrimaryImages.length > 0) {
										var ccPrimaryImage = ccPrimaryImages[0].getTarget();

										var currentShotPrimaryImages = currentShotRequest.getReferences(ShotRequestPrimaryImageRef).toArray();

										if (currentShotPrimaryImages.length > 0) {
											var currentShotPrimaryImage = currentShotPrimaryImages[0].getTarget();

											if (ccPrimaryImage.getID() == currentShotPrimaryImage.getID()) {
												ccPrimaryShotID = currentShotRequest.getID();
											}
										}
									}
								});

								// reject Main P1 changes when CC has primary image
								if (ccPrimaryShotID == cntxtShotID) {

									if (cntxtShotMarkets.contains(mkt) == false) {

										logArray.push("\n<b>You cannot remove Shared Market value of " + mkt + " from completed Main P1 Shot Requests via bulk upload, as there is no way to guarantee other completed Main P1 shot was added to to this market for " + cntxtCCNum + ". Please make this change through the WebUI.</b>");
									}

									if (changedAttrs.contains("a_Site_Placement")) {

										logArray.push("\n<b>You cannot modify Site Placement for completed Main P1 Shot Requests via bulk upload, as there is no way to guarantee other completed shot was switched to Main P1 for " + cntxtCCNum + ". Please make this change through the WebUI.</b>");
									}
								}
							}
						}
					});
				});
			}
		}
	}
	if (changedAttrs.contains("a_Shared_Markets")) {
		var prevRevisionMarkets = prevRevisionNode.getValue("a_Shared_Markets").getSimpleValue();
		if (prevRevisionMarkets.contains("SA") && !shotMarkets.contains("SA")) {
			if (shotMarkets.contains("US")) {
				checkForBOMCC("EN_US", node)

			}
			else if (shotMarkets.contains("JPN")) {
				checkForBOMCC("EN_JP", node)
			}
		}
	}
}
else {
	return "<b>No change identified on import for this Shot Request.</b>";
}

// If modify event and validations failed
if (logArray.length > 0) {
	return "<b>Updates to Shot Request with ID " + shotID + " for CC " + shotCC + " were rejected for the following reasons:</b>" + logArray;
}
// if no validations failed
else {
	return true;
}



function checkForBOMCC(context, shotRequest) {
	var cc;
	step.executeInContext(context, function (otherManager) {
		var contextshotRequest = otherManager.getObjectFromOtherManager(shotRequest);
		cc = contextshotRequest.queryReferencedBy(CCToPhotoShotRef).asList(100).get(0).getSource().getID();

	});
	step.executeInContext("EN_SA", function (otherManager) {
		var contextshotRequest = otherManager.getObjectFromOtherManager(shotRequest);
		contextshotRequest.queryReferencedBy(CCToPhotoShotRef).forEach(function (referenceInstance) {
			sa_cc = referenceInstance.getSource().getID();
			if (cc != sa_cc) {
				logArray.push("<b>You cannot remove SA Market" + " from Shot Request " + shotRequest.getID() + " as BOMCC is sharing this shot Request</b>");
				return false;
			}
			return true;
		});

	});


}
}