/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test_BulkUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "test_BulkUpdate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUi",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,webUi,sizeModelRef) {
log.info(checkDimensionAtSKULevel(node, sizeModelRef))
//PPIM-15068
function checkDimensionAtSKULevel(node, sizeModelRef) {

    var sizecode, dim1, dim2;
    node.queryClassificationProductLinks(sizeModelRef).forEach(function (referenceInstance) {
        sizecode = referenceInstance.getClassification();
        return true;
    });
    dim1 = sizecode.getValue("a_Dim1_Dimension_value").getSimpleValue();
    dim2 = sizecode.getValue("a_Dim2_Dimension_value").getSimpleValue();
    var variant = sizecode.getValue("a_SizeCodeVariant").getSimpleValue();
    var parentCC = node.getParent();
    var approved_expectOnlyDim1 = false;
    var approved_expectBoth = false;
    var unapproved_expectOnlyDim1 = false;
    var unapproved_expectBoth = false;
    approved_sku_exists = false;
    var skus = parentCC.getChildren().iterator();
    while (skus.hasNext()) {
        sku = skus.next();
        if (sku.getID() != node.getID()) {
            var approved = sku.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
            sku.queryClassificationProductLinks(sizeModelRef).forEach(function (referenceInstance) {
                var sizecode1 = referenceInstance.getClassification();
                var sDim1 = sizecode1.getValue("a_Dim1_Dimension_value").getSimpleValue();
                var sDim2 = sizecode1.getValue("a_Dim2_Dimension_value").getSimpleValue();
                var sVariant = sizecode1.getValue("a_SizeCodeVariant").getSimpleValue();

                if (sVariant == variant) {

                    if (sDim1 && (!sDim2 || sDim2 == "")) {

                        if (approved == "Approved") {
                            approved_expectOnlyDim1 = true;
                        }
                        else unapproved_expectOnlyDim1 = true;

                    } else if (sDim1 && sDim2 && (sDim1 != "" && sDim2 != "")) {

                        if (approved) {
                            approved_expectBoth = true;
                        } else {
                            unapproved_expectBoth = true;
                        }


                    }
                    if (approved) {
                        approved_sku_exists = true;
                    }
                }
                return true;
            });

        }
        else {
            log.info("same nodeee")
        }

    }
    //log.info(expectOnlyDim1 + "," + expectBoth + "," + dim1 + "," + dim2)
    log.info("approved_sku_exists " + approved_sku_exists)
    if (approved_sku_exists) {
        return compare_values(approved_expectOnlyDim1, approved_expectBoth, dim1, dim2, variant)
    }
    else {
        return compare_values(unapproved_expectOnlyDim1, unapproved_expectBoth, dim1, dim2, variant)
    }
    return true;

}
//PPIM-15068
function compare_values(expectOnlyDim1, expectBoth, dim1, dim2, variant) {
    if (expectOnlyDim1 && expectBoth) {
        log.info("This CC has discrepancies in Dim1-Dim2 Pattern for the size Variant " + variant + ", Please Correct themm. ")
        //webUI.showAlert("ERROR", "This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them.")
        return "This CC has discrepancies in Dim1-Dim2 Pattern for the Size Variant " + variant + ", Please Correct them.";
    }
    // Enforce the rule on current SKU
    if (expectOnlyDim1 && (dim1 && dim2 != "")) {
        //if(!(dim1 && !dim2)) { 
        log.info("This CC only uses Dim1 — Dim2 must be empty.")
        //webUI.showAlert("ERROR", "This style only uses Dim1 — Dim2 must be empty.");
        return "This CC only uses Dim1 — Dim2 must be empty for the Size Variant " + variant;
        //}
    } else if (expectBoth && (!(dim1 && dim2) || !(dim1 != "" && dim2 != ""))) {
        //if(!(dim1 && dim2) || !(dim1!="" && dim2!="")){
        log.info("This CC uses both Dim1 and Dim2 — please populate both.")
        //webUI.showAlert("ERROR", "This style uses both Dim1 and Dim2 — please populate both.");
        return "This CC uses both Dim1 and Dim2 — please populate both for the Size Variant " + variant;
        //}
    }
    return true;
}

}