/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CreateStyletoSizeModelRef_Non_WebUI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CreateStyletoSizeModelRef Non Web UI",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "ClassificationBindContract",
    "alias" : "sizeModelRoot",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "101471",
    "description" : null
  }, {
    "contract" : "ClassificationBindContract",
    "alias" : "newSizeModel",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "ON8",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,sizeModelRef,sizeCodeRef,sizeModelRoot,newSizeModel) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

// Initialize variables for iteration
var i = null;
var j = null;
var k = null;

// Initialize counters for validation
var ccmatch = 0; // Counter for matching style codes
var matchsc = 0; // Counter for matching size codes
var skuCount = 0; // Counter for total SKUs

// Get the current context and market designation
var currentCtx = step.getCurrentContext().getID();
var ctx = LKT.getLookupTableValue("LKT_Context_to_Market", currentCtx);

// Iterate over child nodes of the current node
var refc = new java.util.ArrayList();
refc.addAll(node.getChildren());
for (i = 0; i < refc.size(); i++) {
    var cc = refc.get(i);
    var refsk = new java.util.ArrayList();
    refsk.addAll(cc.getChildren());
    for (j = 0; j < refsk.size(); j++) {
        var sku = refsk.get(j);

        // Get the market designation and end date of the SKU
        var skuMarketDesig = sku.getValue('a_Market_Designation').getSimpleValue();
        var skuEndDate = sku.getValue('a_SKU_End_Date').getSimpleValue();
        var skuLcs = sku.getValue('a_SKU_Life_Cycle_Status').getSimpleValue();

        // Separate condition checks for SKU filtering
        var isMarketMatch = skuMarketDesig.contains(ctx);
        var isActive = (skuEndDate == null || skuEndDate >= time);

        // If SKU is active and matches the context, proceed
        if (isMarketMatch && isActive && skuLcs != "Purged") {
            skuCount++; // Increment SKU count
            var refsc = new java.util.ArrayList();
            refsc.addAll(sku.getClassificationProductLinks(sizeCodeRef));
            if (refsc.size() == 1) {
                for (k = 0; k < refsc.size(); k++) {
                    var sizeCodeID = refsc.get(k).getClassification().getID();
                    var sizeCodeName = refsc.get(k).getClassification().getName();

                    // Check the new size model for a matching size code
                    var refsmc = new java.util.ArrayList();
                    refsmc.addAll(newSizeModel.getChildren());
                    for (var m = 0; m < refsmc.size(); m++) {
                        var newScode = refsmc.get(m);
                        var newSCName = refsmc.get(m).getName();
                        if (newSCName != null && newSCName.equals(sizeCodeName)) {
                            matchsc++; // Increment matching size code count
                        }
                    }
                }
            }
        }
    }
}

// Check if the number of matching size codes is equal to the total SKU count
if (matchsc != skuCount) {
    log.info("Change of size model not permitted. Matching Size Codes not found in the new Web Size Model, change not executed");
} else {
    // Validation succeeded. Proceed with linking/unlinking of style and size codes
    //Reinitialize lists for re-use
    refc = new java.util.ArrayList();
    refsk = new java.util.ArrayList();
    refsc = new java.util.ArrayList();
    refsmc = new java.util.ArrayList();

    // Add style to size model reference and SKU to size code reference
    refc.addAll(node.getChildren());
    for (i = 0; i < refc.size(); i++) {
        var cc = refc.get(i);
        refsk.addAll(cc.getChildren());
        for (j = 0; j < refsk.size(); j++) {
            var sku = refsk.get(j);
            var refsc = new java.util.ArrayList();
            var skuMarketDesig = sku.getValue('a_Market_Designation').getSimpleValue();
            var skuEndDate = sku.getValue('a_SKU_End_Date').getSimpleValue();
            var skuLcs = sku.getValue('a_SKU_Life_Cycle_Status').getSimpleValue();

            //PPIM-12269
            var isMarketMatch = skuMarketDesig.contains(ctx);
            var isActive = (skuEndDate == null || skuEndDate >= time);

            //PPIM-14056
            if (isMarketMatch) {
                refsc.addAll(sku.getClassificationProductLinks(sizeCodeRef));
                if (refsc.size() == 1) {
                    for (k = 0; k < refsc.size(); k++) {
                        var sizeCodeName = refsc.get(k).getClassification().getName();

                        // Check the new size model for a matching size code and do linking/unlinking
                        var refsmc = new java.util.ArrayList();
                        refsmc.addAll(newSizeModel.getChildren());
                        for (var m = 0; m < refsmc.size(); m++) {
                            var newScode = refsmc.get(m);
                            var newSCName = refsmc.get(m).getName();
                            if (newSCName != null && newSCName.equals(sizeCodeName)) {
                                refsc.get(k).delete();
                                sku.createClassificationProductLink(newScode, sizeCodeRef);
                                helper.setSKUNameFromSizeCode(sku, step);
                                //Publish SKU
                                sku.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                            }
                        }
                    }
                } else {
                    var sizeCode = sku.getValue("a_Size_Code").getSimpleValue();
                    if (sizeCode != null) {
                        var refsmclasc = newSizeModel.getChildren();
                        for (var n = 0; n < refsmclasc.size(); n++) {
                            var newScode = refsmclasc.get(n);
                            var newSCName = refsmclasc.get(n).getName();
                            if (newSCName.equals(sizeCode)) {
                                sku.createClassificationProductLink(newScode, sizeCodeRef);
                                helper.setSKUNameFromSizeCode(sku, step);
                                sku.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                            }
                        }
                    }
                }

                if (!isActive || skuLcs == "Purged") {
                    //PPIM-12846
                    var refSizeCode = new java.util.ArrayList();
                    refSizeCode.addAll(sku.getClassificationProductLinks(sizeCodeRef));
                    if (refSizeCode.size() == 1) {
                        if (refSizeCode.get(0).getClassification().getParent().getID() != newSizeModel.getID()) {
                            refSizeCode.get(0).delete();
                            sku.setName(null);
                        }
                    }
                }
            }
        }
    }

    var refs = new java.util.ArrayList();
    refs.addAll(node.getClassificationProductLinks(sizeModelRef));
    if (refs.size() == 1) {
        for (i = 0; i < refs.size(); i++) {
            refs.get(i).delete();
            node.createClassificationProductLink(newSizeModel, sizeModelRef);
            node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        }
    }

    // Update dimension values for SKUs
    var children = newSizeModel.getChildren();
    if (children) {
        var childIter = children.iterator();
        while (childIter.hasNext()) {
            var child = childIter.next();
            var sVariant = child.getValue("a_SizeCodeVariant").getSimpleValue();
            if (sVariant != null) {
                var skuDim2 = null;
                var children1 = child.getChildren();
                if (children1) {
                    var childIter1 = children1.iterator();
                    while (childIter1.hasNext()) {
                        var child1 = childIter1.next();
                        var tObj = child1.getObjectType().getID();

                        if (tObj == "Dim1") {
                            var sDim1 = child1.getValue("a_Advanced_Dimension_Value").getSimpleValue();
                            if (sDim1 != null) {
                                var skuDim1 = sVariant + " " + sDim1;
                            }
                        }
                        if (tObj == "Dim2") {
                            var sDim2 = child1.getValue("a_Advanced_Dimension_Value").getSimpleValue();
                            if (sDim2 != null) {
                                skuDim2 = sVariant + " " + sDim2;
                            }
                        }
                    }
                }
            }
        }
    }
}

}