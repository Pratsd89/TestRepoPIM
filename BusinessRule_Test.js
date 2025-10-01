/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
var targetWorkflowUS = "wf_NewStyleEnrichment";
var targetState1US = "NewStyleEnrich_Final";
var scMissingErrorMessage = "Size Code is missing for current Size Model."

var currentContext = stepManager.getCurrentContext().getID();
var market = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);


if (node.isInWorkflow(targetWorkflowUS) && node.isInState(targetWorkflowUS, targetState1US)) {

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
                        var skuSizeCodeId = skuSizeCodeLink[0].getClassification().getID()
                        var skuSizeModelId = skuSizeCodeLink[0].getClassification().getParent().getID();
                        if (skuSizeModelId != styleSizeModelId) {
                            skuSizeCodeLink[0].delete();
                            var skuSizeCodeLink = sku.getClassificationProductLinks(sizeCodeRef).toArray();
                        } else
                            log.info("cc: " + cc.getID() + "  sku: " + sku.getID() + "  with market Designation: " + skuMarketDesignation + "  have SKU and Style SM matching i.e., " + styleSizeModelId)
                    }
                }
            }
            sizeModelAssosciationBR.execute(node);

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