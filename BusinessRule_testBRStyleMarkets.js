/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testBRStyleMarkets",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "testBRStyleMarkets",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "GlobalUtil"
  }, {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  }, {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step,LKT,shotRef,av1Ref,av2Ref,av3Ref,av4Ref,av5Ref,av6Ref,av7Ref,av8Ref,av9Ref,ppiRef,swatchRef,videoRef,GlobalUtil,compCheck,helper) {
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
		}
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
		//getWorkflowVariables(node);
	}
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

						if (shared.contains("US") && (!(shared.contains(currentMarket)))) {

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
										saCurrentProduct.createReference(shot, shotRef);
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
							
							
							
							var imgRef = [av1Ref, av2Ref, av3Ref, av4Ref, av5Ref, av6Ref, av7Ref, av8Ref, av9Ref, ppiRef, swatchRef, videoRef];
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
		//getWorkflowVariables(node);
		//Get Workflow Variables and Auto-Trigger the parent Style
		//getWorkflowVariables(parentStyle);
	}	
}