/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testttt",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBRs_Indu" ],
  "name" : "TestBR(2)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "SizeCodeRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "SizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,SizeCodeRef,SizeModelRef,webUI,LKT,helper) {
//PPIM-13412
var currentCtx = step.getCurrentContext().getID();
var ctx = LKT.getLookupTableValue("LKT_Context_to_Market", currentCtx);
var today = new Date().toISOString().substring(0, 10);

var sizeCodeList = node.getClassificationProductLinks(SizeCodeRef);
var id_classification_SKU = node.getValue("a_Size_Code").getSimpleValue();
var skuMarketDesig = node.getValue('a_Market_Designation').getSimpleValue();
var skuEndDate = node.getValue('a_SKU_End_Date').getSimpleValue();
var skuLcs = node.getValue('a_SKU_Life_Cycle_Status').getSimpleValue();

var isMarketMatch = skuMarketDesig.contains(ctx);
var isActive = (skuEndDate == null || skuEndDate >= today);

if (sizeCodeList.size() == 0) {
    if (isMarketMatch && isActive && skuLcs != "Purged" && skuLcs != "Draft") {
        if (id_classification_SKU != null) {
            var classification_SKU = null;
            var sizeModelList = node.getParent().getParent().getClassificationProductLinks(SizeModelRef);
            if (sizeModelList.size() == 1) {
                var sizeModelNode = sizeModelList.get(0).getClassification();

                //code block to get size code name and its size code id
                var refsmclasc = sizeModelNode.getChildren();
                if (refsmclasc.size() != 0) {
                    for (var n = 0; n < refsmclasc.size(); n++) {
                        var newSCName = refsmclasc.get(n).getName();
                        if (newSCName == id_classification_SKU) {
                            classification_SKU = refsmclasc.get(n);
                        }
                    }
                }

                if (classification_SKU != null) {
                    var parentID = classification_SKU.getParent().getID();
                    if (sizeModelNode.getID() == parentID) {
                        try {
                            node.createClassificationProductLink(classification_SKU, SizeCodeRef);
                            helper.setSKUNameFromSizeCode(node, step);
                        } catch (e) {
                            if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
                                log.warning("Link between product and classification with already exists.");
                            } else {
                                throw e;
                            }
                        }
                    }
                }
                else {
                	webUI.showAlert("ERROR", null, "Matching size code for this SKU was not found in the new web size model.");
                }
            }
        }
    }
}

}