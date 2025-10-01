/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_FV_Styles_IncorrectSM",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "FV Styles With Incorrect SM",
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
    "alias" : "stepManager",
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeCodeRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "sizeModelAssosciationBR",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Size_Model_Association",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,LKT,sizeModelRef,sizeCodeRef,sizeModelAssosciationBR) {
function reprocessFVStylesWithInvalidSizeModel(node, contextID) {
    var market = LKT.getLookupTableValue("LKT_Context_to_Market", contextID);
    var styleEnrichWorkflow = LKT.getLookupTableValue("LKT_Context_to_Style_Enrich_Workflows", contextID);
    var targetWorkflowState = "NewStyleEnrich_Final";
    var scMissingErrorMessage = "Size Code is missing for current Size Model."
    if (node.isInWorkflow(styleEnrichWorkflow) && node.isInState(styleEnrichWorkflow, targetWorkflowState)) {

        var errorMessage = node.getValue("a_error_message").getSimpleValue();
        if (errorMessage != null && errorMessage.contains(scMissingErrorMessage)) {
            var isSkuStyleSMEqual = true
            var styleSizeModelLink = node.getClassificationProductLinks(sizeModelRef).toArray()[0];
            var styleSizeModelId = styleSizeModelLink.getClassification().getID();
            var refCCs = new java.util.ArrayList();
            var refSKUs = new java.util.ArrayList();
            if (styleSizeModelId != null) {
                refCCs.addAll(node.getChildren()); //fetch CCs
                for (var i = 0; i < refCCs.size(); i++) {
                    var cc = refCCs.get(i);
                    refSKUs.addAll(cc.getChildren()); //fetch SKUs
                    for (var j = 0; j < refSKUs.size(); j++) {
                        var sku = refSKUs.get(j);
                        var skuMarketDesignation = sku.getValue("a_Market_Designation").getSimpleValue();
                        if (skuMarketDesignation.contains(market)) {
                            var skuSizeCodeLink = sku.getClassificationProductLinks(sizeCodeRef).toArray();
                            if(skuSizeCodeLink.length > 0) {
                            	   var skuSizeCodeId = skuSizeCodeLink[0].getClassification().getID()
	                            var skuSizeModelId = skuSizeCodeLink[0].getClassification().getParent().getID();
	                            if (skuSizeModelId != styleSizeModelId) {
	                                skuSizeCodeLink[0].delete();
	                                var skuSizeCodeLink = sku.getClassificationProductLinks(sizeCodeRef).toArray();
	                            }
                            }
                        }
                    }
                }

                //update the SKU link from the Style level itself
                sizeModelAssosciationBR.execute(node);

                //update the SKU Name post SKUToSizeCode link is corrected
                for (var i = 0; i < refCCs.size(); i++) {
                    var cc = refCCs.get(i);
                    refSKUs.addAll(cc.getChildren()); //fetch SKUs
                    for (var j = 0; j < refSKUs.size(); j++) {
                        var sku = refSKUs.get(j);
                        sizeModelAssosciationBR.execute(sku);
                    }
                }
            }
        }
    }
}


var contextListItr = stepManager.getListOfValuesHome().getListOfValuesByID("English_Contexts_LoV").queryValidValues().asList(10).iterator();
while (contextListItr.hasNext()) {
    var contextID = contextListItr.next().getID();
    reprocessFVStylesWithInvalidSizeModel(node, contextID);
}
}