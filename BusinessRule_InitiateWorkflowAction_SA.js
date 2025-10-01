/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "InitiateWorkflowAction_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DELETE) InitiateWorkflowAction_SA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av1Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV1",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av2Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV2",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av3Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV3",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av4Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV4",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av5Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV5",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av6Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV6",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av7Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV7",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av8Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV8",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av9Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV9",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ppiRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "swatchRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Swatch",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "videoRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Video",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av10Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV10",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av11Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV11",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,shotRef,av1Ref,av2Ref,av3Ref,av4Ref,av5Ref,av6Ref,av7Ref,av8Ref,av9Ref,ppiRef,swatchRef,videoRef,av10Ref,av11Ref) {
function AutoTriggerWorkflow(wfID, wfStates, wfNode) {
	// placeholder for the triggerByID return message
	var errorMessage = null;

	wfStates.forEach(function (state) {
		// make sure node is in the current state
		var isInState = wfNode.isInState(wfID, state);
		log.info(wfNode.getID() + " is in " + state + " state? " + isInState);

		if (isInState) {
			// get a workflow object by ID
			var workflowObject = step.getWorkflowHome().getWorkflowByID(wfID);

			// get state object from workflow object
			var wfObjectState = workflowObject.getStateByID(state);

			// get wf transition for given state
			var transition = wfObjectState.getTransitions().toArray()[0];

			// get wf event for given state
			var event = transition.getEvents().toArray()[0].getID();
			log.info("Event: " + event);

			// trigger node in workflow event
			errorMessage = wfNode.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Delta Load based trigger").getScriptMessage();
			log.info("triggerByID result: " + errorMessage);
		}
	});

	if (errorMessage != null) {
		wfNode.getValue("a_error_message").setSimpleValue(currentContext + " : " + errorMessage);
	}
	else {
		if (wfNode.getValue("a_error_message").getSimpleValue() != null) {
			wfNode.getValue("a_error_message").deleteCurrent();
		}
	}
}

function getWorkflowVariables(wfNode) {

	var StyleStates = new Array("NewStyleEnrichState1");

	var CCStates = new Array("NewCCEnrichState1");

	var SKUStates = new Array("NewSKUEnrich1", "NewSKUEnrich2");

	var objectType = wfNode.getObjectType().getID();
	var stepLifeStatus = null;
	var endDate = null;
	var wf = null;

	if (objectType == "Style") {
		stepLifeStatus = wfNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
		endDate = wfNode.getValue("a_Style_End_Date").getSimpleValue();
          wf = LKT.getLookupTableValue("LKT_Context_to_Style_Enrich_Workflows", currentContext);
		var states = StyleStates;
	}
	if (objectType == "CustomerChoice") {
		stepLifeStatus = wfNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
		endDate = wfNode.getValue("a_CC_End_Date").getSimpleValue();
          wf = LKT.getLookupTableValue("LKT_Context_to_CC_Enrich_Workflows", currentContext);
		var states = CCStates;
	}
	if (objectType == "SKU") {
		stepLifeStatus = wfNode.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
		endDate = wfNode.getValue("a_SKU_End_Date").getSimpleValue();
          wf = LKT.getLookupTableValue("LKT_Context_to_SKU_Enrich_Workflows", currentContext);
          var states = SKUStates;
	}

	//get today's date
	var today = new Date().toISOString().split('T')[0];
	//log.info("today is " + today);

	if (!endDate) {
		const timestamp = Date.parse("12/31/9999");
		endDate = new Date(timestamp).toISOString().split('T')[0];
		//log.info("endDate was null");
	}

	//log.info("end date is " + endDate);
	if (stepLifeStatus != "Approved" && stepLifeStatus != "Purged") {
		if (!wfNode.isInWorkflow(wf)) {
			wfNode.startWorkflowByID(wf, objectType + " " + currentMarket + " Workflow Initiation from CC Market Update");
		}
		//log.info("Current Workflow is: " + wf);
		AutoTriggerWorkflow(wf, states, wfNode);
	}
}

var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);

if (currentContext != "FR_CA" && currentContext != "JA_JP") {
	var objectType = node.getObjectType().getID();
	var parentStyle = null;
	var parentCC = null;

	if (objectType == "Style") {
		//set style market designation
		var styleMktDsg = node.getValue("a_Style_Market_Designation").getSimpleValue();
		if (styleMktDsg == null) {
			node.getValue("a_Style_Market_Designation").setSimpleValue(currentMarket);
			styleMktDsg = node.getValue("a_Style_Market_Designation").getSimpleValue();
		}
		else if (styleMktDsg.contains(currentMarket) == false) {
			node.getValue("a_Style_Market_Designation").addValue(currentMarket);
			styleMktDsg = node.getValue("a_Style_Market_Designation").getSimpleValue();

			//US copy actions
			if (currentMarket != "US" && styleMktDsg.contains("US")) {
				var inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();

				if (inheritOption == null) {
					node.getValue("a_Inherit_US_Copy_Option").setSimpleValue(currentMarket);
					inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
				}
				else if (inheritOption.contains(currentMarket) == false) {
					node.getValue("a_Inherit_US_Copy_Option").addValue(currentMarket);
					inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
				}

				if (inheritOption != null) {
					if (styleMktDsg.contains(currentMarket) && inheritOption.contains(currentMarket)) {

						step.executeInContext('EN_US', function (enContextManager) {
							var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());
							var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_English_Replication_Attributes');
							var attributeList = attributeGroup.getAttributes().toArray();

							for (var y = 0; y < attributeList.length; y++) {
								var enAttributeValue = enCurrentProduct.getValue(attributeList[y].getID()).getSimpleValue();

								step.executeInContext(currentContext, function (otherContextManager) {
									var otherCurrentProduct = otherContextManager.getProductHome().getProductByID(node.getID());

									otherCurrentProduct.getValue(attributeList[y].getID()).setSimpleValue(enAttributeValue);
								});
							}
						});
					}
				}
			}
			else if (currentMarket == 'US'){
				inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
				styleMktDsg = node.getValue("a_Style_Market_Designation").getSimpleValue();
				var marketsArray = [];
				marketsArray = styleMktDsg.split("<multisep/>");
				marketsArray.forEach(function (mkt) {
				     if(mkt != 'US'){	
			               var otherCtxt = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
						step.executeInContext(otherCtxt, function (otherManager) {
							var otherCtxtNode = otherManager.getProductHome().getProductByID(node.getID());
							var copyStatus = otherCtxtNode.getValue("a_Copy_Complete_Status").getSimpleValue();
							var lifeCycleStatus = otherCtxtNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
							if ((copyStatus == "In Progress" || copyStatus == "Complete") && lifeCycleStatus != "Approved"){
								if (inheritOption == null) {
									node.getValue("a_Inherit_US_Copy_Option").setSimpleValue(mkt);
								}
								else if (inheritOption.contains(mkt) == false) {
									node.getValue("a_Inherit_US_Copy_Option").addValue(mkt);
								}
								inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
							}
						});
					}
			    });
			}
			else if (currentMarket == "SA" && styleMktDsg.contains("JPN") && !styleMktDsg.contains("US") && !styleMktDsg.contains("CAN")){
				var inheritJPOption = node.getValue("a_Inherit_JP_Copy_Option").getSimpleValue();
				if (inheritJPOption == null) {
					node.getValue("a_Inherit_JP_Copy_Option").setSimpleValue(currentMarket);
					inheritJPOption = node.getValue("a_Inherit_JP_Copy_Option").getSimpleValue();
				}
			}
		}
		//BOM Style Inheritance PPIM-10744
          var styleRefType = step.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_Style");	
		var bomStyleRefs = node.getReferences(styleRefType);
		for (var i = 0; i < bomStyleRefs.size(); i++) {
        			var ref_bomStyle = bomStyleRefs.get(i).getTarget();
        			if(ref_bomStyle){
        				log.info(ref_bomStyle);
        				node.getValue("a_Inherit_US_Copy_Option").addValue("SA");
        				step.executeInContext('EN_US', function (enContextManager) {
							var enCurrentProduct = enContextManager.getProductHome().getProductByID(ref_bomStyle.getID());
							var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_English_Replication_Attributes');
							var attributeList = attributeGroup.getAttributes().toArray();

							for (var y = 0; y < attributeList.length; y++) {
								var enAttributeValue = enCurrentProduct.getValue(attributeList[y].getID()).getSimpleValue();
								//log.info(enAttributeValue);

								step.executeInContext("EN_SA", function (otherContextManager) {
									var otherCurrentProduct = otherContextManager.getProductHome().getProductByID(node.getID());
									log.info("SA CONTEXT NODE " + otherCurrentProduct);

									otherCurrentProduct.getValue(attributeList[y].getID()).setSimpleValue(enAttributeValue);
								});
							}
						});
        				
        			}
		}	
	

		//Get Workflow Variables and Auto-Trigger the Style
		getWorkflowVariables(node);
	}
	if (objectType == "CustomerChoice") {

		// ASLR Shot Request Actions
		if (currentMarket != "US") {
			var aclMarket = node.getValue("a_ACL_Market_Designation").getSimpleValue();
			var mktDsg = node.getValue("a_Market_Designation").getSimpleValue();

			if (aclMarket == currentMarket && mktDsg.contains("US")) {

				step.executeInContext("EN_US", function (contextManager) {
					var currentProduct = contextManager.getProductHome().getProductByID(node.getID());
					var refs = new java.util.ArrayList();

					refs.addAll(currentProduct.getReferences(shotRef));

					for (var i = 0; i < refs.size(); i++) {
						var shot = refs.get(i).getTarget();

						if (shot.getValue("a_Shot_Request_Method").getSimpleValue() == "ASLR") {
							if (currentProduct.isInWorkflow("wf_CCEnrichment")) {
								currentProduct.getWorkflowInstanceByID("wf_CCEnrichment").setSimpleVariable("NonUSASLRCodeAlreadyTriggeredFlag", "true");
							}
						}
						var shared = shot.getValue("a_Shared_Markets").getSimpleValue();

						//if (shared.contains("US") && (!(shared.contains(currentMarket)))) {
						if (shared!=null && shared.contains("US") && (!(shared.contains(currentMarket)))) { //this line has been added on 27-Jan-2024 as part of FSAL GAP Dataload Issue
							shot.getValue("a_Shared_Markets").addValue(currentMarket);
							shot.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");
							try {
								node.createReference(shot, shotRef);
							}
							catch (e) {
								if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
									log.info("Shot Request Link already exist for " + node.getID());
								}
							}
							//add CC Number of the current market to shot request
							var ccNum = node.getValue("a_CC_Number").getSimpleValue();

							if (ccNum != null) {
								step.executeInContext(currentContext, function (otherContextManager) {
									var otherEntity = otherContextManager.getEntityHome().getEntityByID(shot.getID());
									otherEntity.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
								});
							}
							var imgRef = [av1Ref, av2Ref, av3Ref, av4Ref, av5Ref, av6Ref, av7Ref, av8Ref, av9Ref, av10Ref, av11Ref, ppiRef, swatchRef, videoRef];
							for (var j = 0; j < 12; j++) {
								var refImg = new java.util.ArrayList();
								refImg.addAll(currentProduct.getReferences(imgRef[j]));
								for (var k = 0; k < refImg.size(); k++) {
									var imgAsset = refImg.get(k).getTarget();
									try {
										node.createReference(imgAsset, imgRef[j]);
									}
									catch (e) {
										if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
											log.info("Asset Link already exist for " + node.getID());
										}
									}
								}
							}
						}
					}
				});
			}
			else if (aclMarket == currentMarket && currentMarket == "SA" && mktDsg.contains("JPN")){

				step.executeInContext("EN_JP", function (contextManager) {
					var currentProduct = contextManager.getProductHome().getProductByID(node.getID());
					var refs = new java.util.ArrayList();

					refs.addAll(currentProduct.getReferences(shotRef));

					for (var i = 0; i < refs.size(); i++) {
						var shot = refs.get(i).getTarget();

						var shared = shot.getValue("a_Shared_Markets").getSimpleValue();

						if (shared.contains("JPN") && (!(shared.contains(currentMarket)))) {

							shot.getValue("a_Shared_Markets").addValue(currentMarket);
							//shot.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");
							try {
								node.createReference(shot, shotRef);
							}
							catch (e) {
								if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
									log.info("Shot Request Link already exist for " + node.getID());
								}
							}
							//add CC Number of the current market to shot request
							var ccNum = node.getValue("a_CC_Number").getSimpleValue();

							if (ccNum != null) {
								step.executeInContext(currentContext, function (otherContextManager) {
									var otherEntity = otherContextManager.getEntityHome().getEntityByID(shot.getID());
									otherEntity.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
								});
							}
							var imgRef = [av1Ref, av2Ref, av3Ref, av4Ref, av5Ref, av6Ref, av7Ref, av8Ref, av9Ref, av10Ref, av11Ref, ppiRef, swatchRef, videoRef];
							for (var j = 0; j < 12; j++) {
								var refImg = new java.util.ArrayList();
								refImg.addAll(currentProduct.getReferences(imgRef[j]));
								for (var k = 0; k < refImg.size(); k++) {
									var imgAsset = refImg.get(k).getTarget();
									try {
										node.createReference(imgAsset, imgRef[j]);
									}
									catch (e) {
										if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
											log.info("Asset Link already exist for " + node.getID());
										}
									}
								}
							}
						}
					}
				});
			}
		}
		//BOM CC Inheritance PPIM-10744
		var RefType = step.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");	
		var BOM_CCrefs = node.getReferences(RefType);
		for (var i = 0; i < BOM_CCrefs.size(); i++) {
        			var ref_BOMcc = BOM_CCrefs.get(i).getTarget();
        			if(ref_BOMcc){
        			log.info("ref_BOMcc " + ref_BOMcc);	
				step.executeInContext("EN_US", function (contextManager) {
					var enCurrentProduct = contextManager.getProductHome().getProductByID(ref_BOMcc.getID());
					log.info("enCurrentProduct " + enCurrentProduct);
					var refs = new java.util.ArrayList();

					refs.addAll(enCurrentProduct.getReferences(shotRef));

					for (var i = 0; i < refs.size(); i++) {
						var shot = refs.get(i).getTarget();

						if (shot.getValue("a_Shot_Request_Method").getSimpleValue() == "ASLR") {
							if (enCurrentProduct.isInWorkflow("wf_CCEnrichment")) {
								enCurrentProduct.getWorkflowInstanceByID("wf_CCEnrichment").setSimpleVariable("NonUSASLRCodeAlreadyTriggeredFlag", "true");
							}
						}
						var shared = shot.getValue("a_Shared_Markets").getSimpleValue();

						if (shared.contains("US") && (!(shared.contains("SA")))) {

							shot.getValue("a_Shared_Markets").addValue("SA");
							shot.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");
							
							step.executeInContext("EN_SA", function (otherContextManager) {
								     var saEntity = otherContextManager.getEntityHome().getEntityByID(shot.getID());
								     var saCurrentProduct = otherContextManager.getProductHome().getProductByID(node.getID());
								     log.info(saEntity);
  									try {
										saCurrentProduct.createReference(saEntity, shotRef);
									}
									catch (e) {
										if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
											log.info("Shot Request Link already exist for " + saCurrentProduct.getID());
								     	}
							       	}
							       	var ccNum = saCurrentProduct.getValue("a_CC_Number").getSimpleValue();
							       	log.info(ccNum);
							       	saEntity.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
							});
							
							
							
							var imgRef = [av1Ref, av2Ref, av3Ref, av4Ref, av5Ref, av6Ref, av7Ref, av8Ref, av9Ref, av10Ref, av11Ref, ppiRef, swatchRef, videoRef];
							for (var j = 0; j < 12; j++) {
								var refImg = new java.util.ArrayList();
								refImg.addAll(enCurrentProduct.getReferences(imgRef[j]));
								
								for (var k = 0; k < refImg.size(); k++) {
									var imgAsset = refImg.get(k).getTarget();
									
									step.executeInContext("EN_SA", function (otherContextManager) {
									var saCurrentProduct = otherContextManager.getProductHome().getProductByID(node.getID());
  										try {
											saCurrentProduct.createReference(imgAsset, imgRef[j]);
										}
										catch (e) {
											if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
												log.info("Asset Link already exist for " + node.getID());
											}
							       		}
							       	
									});
								}
						    }
						}
					}
				});
        				
        			}
		}	
		//Get the parent Style for the CC
		parentStyle = node.getParent();
		//Get Workflow Variables and Auto-Trigger the CC
		getWorkflowVariables(node);
		//Get Workflow Variables and Auto-Trigger the parent Style
		getWorkflowVariables(parentStyle);
	}
	if (objectType == "SKU") {
		//Get the parent Style for the SKU
		parentStyle = node.getParent().getParent();
		//Get the parent CC for the SKU
		parentCC = node.getParent();
		//Get Workflow Variables and Auto-Trigger the SKU
		getWorkflowVariables(node);
		//Get Workflow Variables and Auto-Trigger the parent CC
		getWorkflowVariables(parentCC);
		//Get Workflow Variables and Auto-Trigger the parent Style
		getWorkflowVariables(parentStyle);
	}
}
}