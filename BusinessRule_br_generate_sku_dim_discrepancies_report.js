/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_generate_sku_dim_discrepancies_report",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_generate_sku_dim_discrepancies_report",
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
    "contract" : "ObjectTypeBindContract",
    "alias" : "ccObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "CustomerChoice",
    "description" : null
  }, {
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
    "contract" : "AttributeBindContract",
    "alias" : "lifeCycleStatus",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Life_Cycle_Status",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (ccObjectType,step,node,lifeCycleStatus,queryHome,sizeModelRef,mail) {
//PPIM-15192

var atleastoneDifferent = false;
var filePath = "/opt/stibo/SKU_DIM_DISCREPANCIES.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
    file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("CC ID,CC Number,SKU ID,SKU Name,Size Variant,Dimension 1,Dimension 2,SKU Life Cycle status\n");


var c = com.stibo.query.condition.Conditions;
var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
    (c.objectType(ccObjectType))
        .and(c.hierarchy().simpleBelow(node)).and(c.valueOf(lifeCycleStatus).eq("Approved"))
);
var result = querySpecification.execute();
//log.info(result.asList(10).size())
result.forEach(function (cc) {
    checkSKUDimensionForCC(cc, step)
    return true;
})



fw.flush();
fw.close();

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-ddHH:mm:ss");
// Upload file to asset
var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("SKU_DIM_DISCREPANCIES");
var uploaded = asset.upload(fileInputStream, filePath);
var mailMethod = mail.mail();
mailMethod.addTo("sai_preethi_mandipalli@gap.com");
mailMethod.subject("SKU DIMENSION DISCREPANCIES REPORTT ");
mailMethod.plainMessage("");

// Attach CSV
var attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("SKU_DIM_DISCREPANCIES" + iso.format(time) + ".csv");
attachment.attach();

// Send
if (atleastoneDifferent) {
    var mailSentStatus = mailMethod.send();
    log.info("enddd")
} else {
    log.info("no mail will be sent")
}



function checkSKUDimensionForCC(cc, step) {
    var logArray = new Array();
    var CCLcs = cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
    var children = cc.getChildren();
    var expectOnlyDim1 = false;
    var expectBoth = false;
    var varaintDimMap = new java.util.HashMap();
    var varaintSKUMap = new java.util.HashMap();
    var dimDifferences = new java.util.HashSet();
    var variants = new java.util.HashSet();

    if (children.size() > 0) {
        var approvedSkus = [];
        var unapprovedSkus = [];
        var skuIter = children.iterator();
        while (skuIter.hasNext()) {
            var currSku = skuIter.next();
            var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
           // var classificationType = classificationTypeHome.getLinkTypeByID('SKUToSizeCode');
           // var refSizeCodeList = currSku.getClassificationProductLinks(classificationType);
           var refSizeCodeList =  currSku.queryClassificationProductLinks(sizeModelRef).asList(10);
            var skuLcs = currSku.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
            var skuEndDate = currSku.getValue("a_SKU_End_Date").getSimpleValue();
            var today = new Date().toISOString().substring(0, 10);

            if (skuLcs != null && skuLcs != "Draft" && skuLcs != "Purged" && (skuEndDate == null || skuEndDate > today)) {
                if (refSizeCodeList.size() == 1) {

                    var refSizeCode =refSizeCodeList.get(0).getClassification();
                    var variant = refSizeCode.getValue("a_SizeCodeVariant").getSimpleValue();
                    var dim1DimValue = refSizeCode.getValue("a_Dim1_Dimension_value").getSimpleValue();
                    var dim2 = refSizeCode.getValue("Dim2(child)").getSimpleValue();
                    if (variant != null) {

                        variants.add(variant);

                        if (varaintSKUMap.get(variant) != null) {
                            var skus = varaintSKUMap.get(variant);
                            skus.add(currSku);
                            varaintSKUMap.put(variant, skus)
                        } else {
                            var skus = new java.util.ArrayList();
                            skus.add(currSku);
                            varaintSKUMap.put(variant, skus)
                        }



                        var dim2DimValue = refSizeCode.getValue("a_Dim2_Dimension_value").getSimpleValue();
                        if (!dimDifferences.contains(variant)) {
                            if (dim1DimValue && (!dim2DimValue || dim2DimValue == "")) {
                                if (!varaintDimMap.get(variant)) {
                                    varaintDimMap.put(variant, "expectOnlyDim1")
                                } else {
                                    if (varaintDimMap.get(variant) != "expectOnlyDim1") {
                                        dimDifferences.add(variant);
                                    }
                                }
                                //expectOnlyDim1 = true;
                            } else if (dim1DimValue && dim2DimValue && (dim1DimValue != "" && dim2DimValue != "")) {
                                if (!varaintDimMap.get(variant)) {
                                    varaintDimMap.put(variant, "expectBoth")
                                } else {
                                    if (varaintDimMap.get(variant) != "expectBoth") {
                                        dimDifferences.add(variant)
                                    }
                                }
                                //expectBoth = true;
                            }
                        }
                    }
                }
            }
        }
        log.info(dimDifferences.size() + "," + variants.size())
        if (dimDifferences.size() > 0) {
            var variantIter = varaintSKUMap.keySet().iterator();
            while (variantIter.hasNext()) {
                var variant = variantIter.next();

                // check if this variant has a dimension discrepancy
                if (dimDifferences.contains(variant)) {
                    var skuList = varaintSKUMap.get(variant);
                    // log.info("Variant: " + variant + " has the following SKUs with Dim1/Dim2 discrepancy:");
                    for (var i = 0; i < skuList.size(); i++) {
                        var sku = skuList.get(i);
                        var sku_life_cycle_status = sku.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
                        atleastoneDifferent = true;
                        
                        var refSizeCodeList =  sku.queryClassificationProductLinks(sizeModelRef).asList(10);
                        var refSizeCode =refSizeCodeList.get(0).getClassification();
                    var variant = refSizeCode.getValue("a_SizeCodeVariant").getSimpleValue();
                    var dim1DimValue = refSizeCode.getValue("a_Dim1_Dimension_value").getSimpleValue();
                    var dim2 = refSizeCode.getValue("Dim2(child)").getSimpleValue();
                        fw.write(cc.getID() + "," + cc.getName() + "," + sku.getID() + "," + sku.getName() + "," + variant + "," + dim1DimValue+","+dim2+","+sku_life_cycle_status + "\n");
                        // log.info("   SKU ID: " + sku.getID() + ", SKU Name: " + sku.getName());
                    }
                }

            }
            log.info("This Product has discrepancies in Dim1-Dim2 Pattern for the Size Variants " + dimDifferences + " Please Correct them.")
        }
        log.info(variants)
        return true;

    } else {
        return "CC does not have any SKUs."
    }

}
}