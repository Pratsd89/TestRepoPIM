/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_checkSizeModelRef",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Size Model Reference",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
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
exports.operation0 = function (node,sizeModelRef,sizeCodeRef,step,logger,LKT) {
var newSizeModel = node.getClassificationProductLinks(sizeModelRef).toArray()[0];

if (newSizeModel != null) {
    var newSizeModelNode = newSizeModel.getClassification();
    var newSizeModelNodeID = newSizeModelNode.getID();
    var allRevs = node.getRevisions();

    if (allRevs.size() <= 1) {
        return true;
    }

    var prevRevNode = allRevs.get(1).getNode();
    var prevSizeModel = prevRevNode.getClassificationProductLinks(sizeModelRef).toArray()[0];
    var prevSizeModelNodeID = null;

    if (prevSizeModel) {     
        prevSizeModelNodeID = prevSizeModel.getClassification().getID();
    }

    if (newSizeModelNodeID != prevSizeModelNodeID) {
        var i = null;
        var j = null;
        var k = null;

        var matchsc = 0;
        var skuCount = 0;

        var currentCtx = step.getCurrentContext().getID();
        var mkt = LKT.getLookupTableValue("LKT_Context_to_Market", currentCtx);

        var refc = new java.util.ArrayList();
        refc.addAll(node.getChildren());
        for (i = 0; i < refc.size(); i++) {
            var cc = refc.get(i);
            var refsk = new java.util.ArrayList();
            refsk.addAll(cc.getChildren());
            for (j = 0; j < refsk.size(); j++) {
                var sku = refsk.get(j);
                var skuEndDate = sku.getValue("a_SKU_End_Date").getSimpleValue();
                // Check if SKU is deactivated (end date in the past), skip processing if deactivated
                if (skuEndDate && skuEndDate <= new Date().toISOString().substring(0, 10)) {
                    continue; // Skip processing deactivated SKUs
                }
                var skuMarketDesig = sku.getValue("a_Market_Designation").getSimpleValue();
                if (skuMarketDesig.contains(mkt)) {
                    skuCount++;
                    var refsc = new java.util.ArrayList();
                    refsc.addAll(sku.getClassificationProductLinks(sizeCodeRef));
                    if (refsc.size() == 1) {
                        for (k = 0; k < refsc.size(); k++) {
                            var sizeCodeName = refsc.get(k).getClassification().getName();
                            var refsmc = new java.util.ArrayList();
                            refsmc.addAll(newSizeModelNode.getChildren());
                            for (var m = 0; m < refsmc.size(); m++) {
                                var newSCName = refsmc.get(m).getName();
                                if (newSCName == sizeCodeName) {
                                    matchsc++;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (matchsc != skuCount) {
            throw "<b style='color:blue;'>ERROR: Change of Size Model for Style " + node.getValue("a_Style_Number").getSimpleValue() + " is not permitted. Matching Size Codes not found in the new Web Size Model, change not executed.</b>";
        } else {
            return true;
        }
    } else {
        return true;
    }
} else {
    throw "<b style='color:blue;'>ERROR: Style " + node.getValue("a_Style_Number").getSimpleValue() + " does not contain reference to a valid Size Model. Please apply valid Size Model ID and re-import</b>";
}

}