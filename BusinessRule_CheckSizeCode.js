/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckSizeCode",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CheckSizeCode",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refclass",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refcode",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
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
exports.operation0 = function (node,manager,refclass,refcode,portal,LKT) {
/* PPIM-10455 - Refactored the Code to implement the Context Agnostic Logic based on the Context to Market LKT
		   - Removed the commented line of code, existing functionality not altered.	*/		
if (manager.getCurrentWorkspace().getID() == "Main") {
    var obj = node.getObjectType().getID();
    var flag = 0;
    var sku = [];
    var time = new java.util.Date();
    if (obj == "Style") {

        var currentContext = manager.getCurrentContext().getID();
        var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);

        var refs = new java.util.ArrayList();
        var b = 0;
        refs.addAll(node.getClassificationProductLinks(refclass));
        if (refs.size() < 2 && refs.size() > 0) {
            b = refs.get(0).getClassification().getID();
            log.info("Parent Classification : " + b);
            //child of classificaton
            var refs1 = new java.util.ArrayList();
            refs1.addAll(node.getChildren());
            if (refs1.size() != 0) {
                for (var i = 0; i < refs1.size(); i++) {
                    var CC_ID = refs1.get(i).getID();
                    if (CC_ID != null) {
                        var refs2 = new java.util.ArrayList();
                        var SKUCheck = manager.getProductHome().getProductByID(CC_ID);
                        refs2.addAll(SKUCheck.getChildren());
                        if (refs2.size() != 0) {
                            for (var j = 0; j < refs2.size(); j++) {
                                var new_class1 = 0;
                                var SKU_ID = refs2.get(j).getID();
                                var sku = refs2.get(j);
                                var skuMarketDesig = sku.getValue('a_Market_Designation').getSimpleValue();
                                var lifeCycleStatus = sku.getValue('a_SKU_Life_Cycle_Status').getSimpleValue();
			                  var skuEndDate = sku.getValue('a_SKU_End_Date').getSimpleValue();
			                  var isSkuActive = (skuEndDate == null || skuEndDate >= time);
                                if (skuMarketDesig.contains(currentMarket)) {
                                    var refs3 = new java.util.ArrayList();
                                    refs3.addAll(refs2.get(j).getClassificationProductLinks(refcode));
                                    //As part of this a CC can be approved with the following condition’s on SKU:--https://gapinc.atlassian.net/browse/PPIM-13258
    							//*  When SKU’s are not in Draft, not purged and doesnt have deactivation date and these SKU’s should have proper Size Model Data (Size Code, DIM1, DIM2) then all the SKU’s will be approved 
                                    if (refs3.size() == 0 && isSkuActive =="true" && lifeCycleStatus != "Draft" && lifeCycleStatus != "" && lifeCycleStatus != null) {
                                        portal.showAlert("ERROR", "No SizeCode reference is present for SKU with id: " + SKU_ID + " . The SizeModel reference check is not complete");
                                    }

                                    for (var k = 0; k < refs3.size(); k++) {
                                        var parent = refs3.get(k).getClassification().getParent().getID();
                                        log.info("Parent" + parent);
                                        if (parent == b) {} else {
                                            flag = 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else if (refs.size() > 1) {
            portal.showAlert("ERROR", "More than one SizeModel is linked to the Style.");
        } else if (refs.size() == 0) {
            portal.showAlert("ERROR", "No SizeModel is linked to the Style.");
        }
    }
    if (flag != 0) {
        portal.showAlert("ERROR", "SKU with id: " + /*sku +*/ " is not correctly linked to SizeCode. Please check the SKUToSizeCode reference for the SKU");

    }
} else if (manager.getCurrentWorkspace().getID() == "Approved") {
    portal.showAlert("Warning", "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}