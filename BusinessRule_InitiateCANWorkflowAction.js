/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "InitiateCANWorkflowAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) InitiateCANWorkflowAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "webHierRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,shotRef,av1Ref,av2Ref,av3Ref,av4Ref,av5Ref,av6Ref,av7Ref,av8Ref,av9Ref,ppiRef,swatchRef,videoRef,webHierRef) {
//Style Workflow
function triggerStyleEnrichmentWorkflow(product, count, flag) {
	var wfErrorMessage = null;
	if ((!(product.isInWorkflow("wf_NewStyleEnrichmentCanada"))) && count >= 1) {
		if ((!(product.isInWorkflow("wf_NewStyleEnrichmentCanada"))) && product.getValue("a_Style_Life_Cycle_Status").getSimpleValue() == null) {
			product.startWorkflowByID("wf_NewStyleEnrichmentCanada", "Style CAN Workflow Initiation");
		}
	}
	if ((product.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrichState1")) && count >= 2) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment", "Style CAN Workflow movement from NewStyleEnrichState1").getScriptMessage();
	}
	if (((product.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrich_Copy1")) && count >= 3) || ((product.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrich_Copy1")) && count >= 2 && flag == 1)) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete", "Style CAN Workflow movement from NewStyleEnrich_Copy1").getScriptMessage();
	}
	if (((product.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEntrich_WebMerch1")) && count >= 3) || ((product.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEntrich_WebMerch1")) && count >= 2 && flag == 2)) {
		//if ((product.isInState("wf_NewStyleEnrichmentCanada","NewStyleEntrich_WebMerch1")) && count >= 3){
		if (wfErrorMessage == null) {
			wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEntrich_WebMerch1").triggerByID("Merch_complete", "Style CAN Workflow movement from NewStyleEntrich_WebMerch1").getScriptMessage();
		}
	}
	if ((product.isInState("wf_NewStyleEnrichmentCanada", "WaitingForFirst_CC")) && count >= 4) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("WaitingForFirst_CC").triggerByID("Submit", "Style CAN Workflow movement from WaitingForFirst_CC").getScriptMessage();
	}
	if ((product.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrich_Final")) && count == 5) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation", "Style CAN Workflow movement from NewStyleEnrich_Final").getScriptMessage();
	}
	if (wfErrorMessage != null) {
		product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessage);
	}
	else {
		if (product.getValue("a_error_message").getSimpleValue() != null) {
			product.getValue("a_error_message").deleteCurrent();
		}
	}
}
//CC Workflow
function triggerCCEnrichmentWorkflow(product, count) {
	var wfErrorMessage = null;
	if ((!(product.isInWorkflow("wf_CCEnrichmentCanada"))) && count >= 1) {
		if ((!(product.isInWorkflow("wf_CCEnrichmentCanada"))) && product.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == null) {
			product.startWorkflowByID("wf_CCEnrichmentCanada", "CC CAN Workflow Initiation");
		}
	}
	if ((product.isInState("wf_CCEnrichmentCanada", "NewCCEnrichState1")) && count >= 2) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment", "CC CAN Workflow movement from NewCCEnrichState1").getScriptMessage();
	}
	if ((product.isInState("wf_CCEnrichmentCanada", "NewCCEnrich_Photo1")) && count >= 3) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo1").triggerByID("Submit", "CC CAN Workflow movement from NewCCEnrich_Photo1").getScriptMessage();
	}
	if ((product.isInState("wf_CCEnrichmentCanada", "NewCCEnrich_Photo2")) && count >= 4) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview", "CC CAN Workflow movement from NewCCEnrich_Photo2").getScriptMessage();
	}
	if ((product.isInState("wf_CCEnrichmentCanada", "NewCCEnrich_Photo3")) && count >= 5) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo3").triggerByID("Submit", "CC CAN Workflow movement from NewCCEnrich_Photo3").getScriptMessage();
	}
	if ((product.isInState("wf_CCEnrichmentCanada", "NewCCEnrich_Copy1")) && count >= 5) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Copy1").triggerByID("CCNameComplete", "CC CAN Workflow movement from NewCCEnrich_Copy1").getScriptMessage();
	}
	if ((product.isInState("wf_CCEnrichmentCanada", "NewCCEnrich_Final")) && count == 6) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Final").triggerByID("Submit", "CC CAN Workflow movement from NewCCEnrich_Final").getScriptMessage();
	}
	if (wfErrorMessage != null) {
		product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessage);
	}
	else {
		if (product.getValue("a_error_message").getSimpleValue() != null) {
			product.getValue("a_error_message").deleteCurrent();
		}
	}
}
//SKU Workflow
function triggerSKUEnrichmentWorkflow(product, count) {
	var wfErrorMessage = null;
	if ((!(product.isInWorkflow("wf_NewSKUEnrichmentCanada"))) && count >= 1) {
		if ((!(product.isInWorkflow("wf_NewSKUEnrichmentCanada"))) && product.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() == null) {
			product.startWorkflowByID("wf_NewSKUEnrichmentCanada", "SKU CAN Workflow Initiation");
		}
	}
	if ((product.isInState("wf_NewSKUEnrichmentCanada", "NewSKUEnrich1")) && count >= 2) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_NewSKUEnrichmentCanada").getTaskByID("NewSKUEnrich1").triggerByID("Submit", "SKU CAN Workflow movement from NewSKUEnrich1").getScriptMessage();
	}
	if ((product.isInState("wf_NewSKUEnrichmentCanada", "NewSKUEnrich2")) && count == 3) {
		wfErrorMessage = product.getWorkflowInstanceByID("wf_NewSKUEnrichmentCanada").getTaskByID("NewSKUEnrich2").triggerByID("Submit", "SKU CAN Workflow movement from NewSKUEnrich2").getScriptMessage();
	}
	if (wfErrorMessage != null) {
		product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessage);
	}
	else {
		if (product.getValue("a_error_message").getSimpleValue() != null) {
			product.getValue("a_error_message").deleteCurrent();
		}
	}
}
///////////////////////////////////////////
var currContext = step.getCurrentContext().getID();
if (currContext == "EN_CA" || currContext == "FR_CA") {
	var order = 0;
	var flags = 0;
	var objType = node.getObjectType().getID();


	//PPIM-8134 - Below are the attributes to be ignored from Attribute Group : ag_Style_Copy_Attributes
	var attributesToIgnore = ["a_Translation_Status_ID", "a_Style_Copy_Smartsheet_Identifier",
		"a_Translation_Due_Date", "translation_sent_to_publish", "a_Translation_Status", "a_Translation_Urgency"];
	if (objType == "Style") {
		var styleMkts = node.getValue("a_Style_Market_Designation").getSimpleValue();
		var inheritOption = node.getValue('a_Inherit_US_Copy_Option').getSimpleValue();

		//if(node.getValue("a_Style_Life_Cycle_Status").getSimpleValue() == null){
		if (styleMkts != null) {
			if (!(styleMkts.contains("CAN"))) {

				node.getValue("a_Style_Market_Designation").addValue("CAN");
				styleMkts = node.getValue("a_Style_Market_Designation").getSimpleValue();
			}

			if (inheritOption != null) {
				if (styleMkts.contains("US") && styleMkts.contains("CAN") && inheritOption.contains("CAN")) {

					step.executeInContext('EN_US', function (enContextManager) {
						var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());
						var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_English_Replication_Attributes');
						var attributeList = attributeGroup.getAttributes().toArray();

						for (var y = 0; y < attributeList.length; y++) {
							var enAttributeValue = enCurrentProduct.getValue(attributeList[y].getID()).getSimpleValue();

							//PPIM-8134 - Added the list of attributes to be ignored while copying from US
							if (attributesToIgnore.indexOf(String(attributeList[y].getID())) < 0) {

								step.executeInContext('EN_CA', function (caContextManager) {
									var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());

									caCurrentProduct.getValue(attributeList[y].getID()).setSimpleValue(enAttributeValue);
								});
							}
							//}
						}
					});
				}
			}

			step.executeInContext("EN_US", function (contextManager) {
				var currentProduct = contextManager.getProductHome().getProductByID(node.getID());
				// Add Primary Image to Style
				var refStyle = new java.util.ArrayList();
				refStyle.addAll(currentProduct.getReferences(ppiRef));
				for (var z = 0; z < refStyle.size(); z++) {
					var assetLink = refStyle.get(z).getTarget();
					try {
						node.createReference(assetLink, ppiRef);
					}
					catch (e) {
						if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
							log.info("Asset Link already exist for " + node.getID());
						}
					}

				}
			});
		}
		else {
			node.getValue("a_Style_Market_Designation").addValue("CAN");
		}
		if (node.isInState("wf_NewStyleEnrichment", "NewStyleEnrichState1") || ((!(node.isInWorkflow("wf_NewStyleEnrichmentCanada"))) && node.getValue("a_Style_Life_Cycle_Status").getSimpleValue() == null)) {
			order = 1;
			triggerStyleEnrichmentWorkflow(node, order, flags);
		}
		else if (node.isInState("wf_NewStyleEnrichment", "NewStyleEnrich_Copy1") || node.isInState("wf_NewStyleEnrichment", "NewStyleEntrich_WebMerch1")) {
			if (!(node.isInState("wf_NewStyleEnrichment", "NewStyleEnrich_Copy1"))) {
				flags = 1;
			}
			else if (!(node.isInState("wf_NewStyleEnrichment", "NewStyleEntrich_WebMerch1"))) {
				flags = 2;
			}
			order = 2;
			triggerStyleEnrichmentWorkflow(node, order, flags);
		}
		else if (node.isInState("wf_NewStyleEnrichment", "WaitingForFirst_CC")) {
			order = 3;
			triggerStyleEnrichmentWorkflow(node, order, flags);
		}
		else if (node.isInState("wf_NewStyleEnrichment", "NewStyleEnrich_Final")) {
			order = 4;
			triggerStyleEnrichmentWorkflow(node, order, flags);
		}
		else if (!(node.isInWorkflow("wf_NewStyleEnrichment"))) {
			step.executeInContext("EN_US", function (contextManager) {
				var currentProduct = contextManager.getProductHome().getProductByID(node.getID());
				var usLifecycle = currentProduct.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
				if (usLifecycle == "Approved") {
					order = 5;
					triggerStyleEnrichmentWorkflow(node, order, flags);
				}
			});
		}

		//}
	}
	else if (objType == "CustomerChoice") {
		if (node.getValue("a_ACL_Market_Designation").getSimpleValue() == "CAN" && node.getValue("a_ACL_Market_Designation").isInherited() == false) {
			if (node.getValue("a_Market_Designation").getSimpleValue().contains("US")) {
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
						if (shared.contains("US") && (!(shared.contains("CAN")))) {
							shot.getValue("a_Shared_Markets").addValue("CAN");
							shot.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");
							try {
								node.createReference(shot, shotRef);
							}
							catch (e) {
								if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
									log.info("Shot Request Link already exist for " + node.getID());
								}
							}
							//add CC Number of Canada to shot request
							var ccNum = node.getValue("a_CC_Number").getSimpleValue();
							if (ccNum != null) {
								step.executeInContext("EN_CA", function (caContextManager) {
									var caEntity = caContextManager.getEntityHome().getEntityByID(shot.getID());
									caEntity.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
								});
							}
							var imgRef = [av1Ref, av2Ref, av3Ref, av4Ref, av5Ref, av6Ref, av7Ref, av8Ref, av9Ref, ppiRef, swatchRef, videoRef];
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
		if (node.isInState("wf_CCEnrichment", "NewCCEnrichState1") || ((!(node.isInWorkflow("wf_CCEnrichmentCanada"))) && node.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == null)) {
			if (node.getParent().getValue("a_Style_Life_Cycle_Status").getSimpleValue() == null && node.getParent().getValue("a_Style_Market_Designation").getSimpleValue().contains("CAN")) {
				if (!(node.getParent().isInWorkflow("wf_NewStyleEnrichmentCanada"))) {
					node.getParent().startWorkflowByID("wf_NewStyleEnrichmentCanada", "Style CAN Workflow Initiation from CC Market Update");
				}
			}
			order = 1;
			triggerCCEnrichmentWorkflow(node, order);
		}
		else if (node.isInState("wf_CCEnrichment", "NewCCEnrich_Copy1") || node.isInState("wf_CCEnrichment", "NewCCEnrich_Photo1")) {
			order = 2;
			triggerCCEnrichmentWorkflow(node, order);
		}
		else if (node.isInState("wf_CCEnrichment", "NewCCEnrich_Photo2")) {
			order = 3;
			triggerCCEnrichmentWorkflow(node, order);
		}
		else if (node.isInState("wf_CCEnrichment", "NewCCEnrich_Photo3")) {
			order = 4;
			triggerCCEnrichmentWorkflow(node, order);
		}
		else if (node.isInState("wf_CCEnrichment", "NewCCEnrich_Final")) {
			order = 5;
			triggerCCEnrichmentWorkflow(node, order);
		}
		else if (!(node.isInWorkflow("wf_CCEnrichment"))) {
			step.executeInContext("EN_US", function (contextManager) {
				var currentProduct = contextManager.getProductHome().getProductByID(node.getID());
				var usLifecycle = currentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
				if (usLifecycle == "Approved") {
					/*logic removed as a part of PPIM-3472
					//assign search color from US to CAN
					var searchColor = currentProduct.getValue("a_Search_Color").getSimpleValue();
					if(searchColor != null){
						node.getValue("a_Search_Color").setSimpleValue(searchColor);
						}*/
					order = 6;
					triggerCCEnrichmentWorkflow(node, order);
				}
			});
		}


	}
	else if (objType == "SKU") {
		if (node.getValue("a_ACL_Market_Designation").getSimpleValue() == "CAN" && node.getValue("a_ACL_Market_Designation").isInherited() == false) {
			if ((node.isInState("wf_NewSKUEnrichment", "NewSKUEnrich1")) || ((!(node.isInWorkflow("wf_NewSKUEnrichmentCanada"))) && node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() == null)) {
				order = 1;
				triggerSKUEnrichmentWorkflow(node, order);
			}
			else if (node.isInState("wf_NewSKUEnrichment", "NewSKUEnrich2")) {
				order = 2;
				triggerSKUEnrichmentWorkflow(node, order);
			}
			else if (!(node.isInWorkflow("wf_NewSKUEnrichment"))) {
				step.executeInContext("EN_US", function (contextManager) {
					var currentProduct = contextManager.getProductHome().getProductByID(node.getID());
					var usLifecycle = currentProduct.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
					if (usLifecycle == "Approved") {
						order = 3;
						triggerSKUEnrichmentWorkflow(node, order);
					}
				});

			}
		}
	}
}
}