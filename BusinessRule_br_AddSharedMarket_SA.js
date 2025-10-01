/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_AddSharedMarket_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "SA Issue Fix BRs" ],
  "name" : "Add Shared Market SA",
  "description" : "PPIM-12253",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
var RefType = step.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");
var BOM_CCrefs = node.getReferences(RefType);
for (var i = 0; i < BOM_CCrefs.size(); i++) {
    var ref_BOMcc = BOM_CCrefs.get(i).getTarget();
    if (ref_BOMcc) {
        //log.info("ref_BOMcc " + ref_BOMcc);	
        step.executeInContext("EN_US", function (contextManager) {
            var enCurrentProduct = contextManager.getProductHome().getProductByID(ref_BOMcc.getID());
            //log.info("enCurrentProduct " + enCurrentProduct);
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
                var shotStatus = shot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();

                if (shared.contains("US") && (!(shared.contains("SA"))) && shotStatus != "Draft" && shotStatus != "Cancelled" && shotStatus != "Rejected") {

                    shot.getValue("a_Shared_Markets").addValue("SA");
                    shot.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");

                    step.executeInContext("EN_SA", function (otherContextManager) {
                        var saEntity = otherContextManager.getEntityHome().getEntityByID(shot.getID());
                        var saCurrentProduct = otherContextManager.getProductHome().getProductByID(node.getID());
                        saCurrentProduct.createReference(saEntity, shotRef);
                        //log.info(saEntity);
                        try {
                            saCurrentProduct.createReference(saEntity, shotRef);
                        }
                        catch (e) {
                        	   
                            if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
                                saCurrentProduct.createReference(saEntity, shotRef);
                            }
                        }
                        var ccNum = saCurrentProduct.getValue("a_CC_Number").getSimpleValue();
                        //log.info(ccNum);
                        saEntity.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
                    });
                }
            }
            /*var imgRef = [av1Ref, av2Ref, av3Ref, av4Ref, av5Ref, av6Ref, av7Ref, av8Ref, av9Ref, av10Ref, av11Ref, ppiRef, swatchRef, videoRef];
            for (var j = 0; j < 14; j++) {
                var refImg = new java.util.ArrayList();
                refImg.addAll(enCurrentProduct.getReferences(imgRef[j]));
                for (var k = 0; k < refImg.size(); k++) {
                    var imgAsset = refImg.get(k).getTarget();
                    step.executeInContext("EN_SA", function (otherContextManager) {
                        var saCurrentProduct = otherContextManager.getProductHome().getProductByID(node.getID());
                        try {
                            log.info(imgAsset);
                            saCurrentProduct.createReference(imgAsset, imgRef[j]);
                        }
                        catch (e) {
                            if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
                                log.info("Asset Link already exist for " + node.getID());
                            }
                        }

                    });
                }
            }*/
        });
    }
}
}