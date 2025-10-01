/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_generate_sku_dim_discrepanciesreport2",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_generate_sku_dim_discrepancies_report(2)",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (ccObjectType,step,node,lifeCycleStatus,queryHome,sizeModelRef) {
var c = com.stibo.query.condition.Conditions;
var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
    (c.objectType(ccObjectType))
        .and(c.hierarchy().simpleBelow(node)).and(c.valueOf(lifeCycleStatus).eq("Approved"))
);
var result = querySpecification.execute();
//log.info(result.asList(10).size())
result.forEach(function (cc) {
	//log.info(cc.getID())
	var skus = cc.getChildren().iterator();
    while (skus.hasNext()) {
        sku = skus.next();
        sku_end_date = sku.getValue("a_SKU_End_Date").getSimpleValue();
        	  if(sku_end_date== null || sku_end_date > today){
        	  	//if(sku.getID() =="322270644") {
        	  	returnedvalue = checkDimensionAtSKULevel(sku, sizeModelRef)
        	  	if(returnedvalue !=true)
        	  	log.info("returneddd "+returnedvalue)
        	 // }
        	  }
    }
	
                        return true;
})




//PPIM-15068
function checkDimensionAtSKULevel(sku1, sizeModelRef) {
	//log.info(sku.getID())

    var sizecode, dim1, dim2;
    sku1.queryClassificationProductLinks(sizeModelRef).forEach(function (referenceInstance) {
        sizecode = referenceInstance.getClassification();
        return true;
    });
    dim1 = sizecode.getValue("a_Dim1_Dimension_value").getSimpleValue();
    dim2 = sizecode.getValue("a_Dim2_Dimension_value").getSimpleValue();
    var variant = sizecode.getValue("a_SizeCodeVariant").getSimpleValue();
    var parentCC = sku1.getParent();
    var approved_expectOnlyDim1 = false;
    var approved_expectBoth = false;
    var unapproved_expectOnlyDim1 = false;
    var unapproved_expectBoth = false;
    approved_sku_exists = false;
    var today = new Date().toISOString().substring(0, 10);
    var skus = parentCC.getChildren().iterator();
    while (skus.hasNext()) {
        sku = skus.next();
        sku_end_date = sku.getValue("a_SKU_End_Date").getSimpleValue();
        if (sku.getID() != sku1.getID()) {
        //log.info("hhh")
        	  if(sku_end_date== null || sku_end_date > today){
            var approved = sku.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
            sku.queryClassificationProductLinks(sizeModelRef).forEach(function (referenceInstance) {
                var sizecode1 = referenceInstance.getClassification();
                var sDim1 = sizecode1.getValue("a_Dim1_Dimension_value").getSimpleValue();
                var sDim2 = sizecode1.getValue("a_Dim2_Dimension_value").getSimpleValue();
                var sVariant = sizecode1.getValue("a_SizeCodeVariant").getSimpleValue();
                //log.info(sVariant +" sVariant"+variant+" variant")
                if (sVariant == variant) {
					//log.info("sku "+sku.getID())
                    if (sDim1 && (!sDim2 || sDim2 == "")) {
                    	
                        if (approved == "Approved") {
                            approved_expectOnlyDim1 = true;
                        }
                        else unapproved_expectOnlyDim1 = true;

                    } else if (sDim1 && sDim2 && (sDim1 != "" && sDim2 != "")) {
                    	//log.info("sku1 "+sku.getID())
                        if (approved == "Approved") {
                            approved_expectBoth = true;
                        } else {
                            unapproved_expectBoth = true;
                        }


                    }
                    if (approved == "Approved") {
                        approved_sku_exists = true;
                    }
                }
                return true;
            });
        	  }
        	  else{
        	  	//log.info("sku is endedd ")
        	  }

        }
        else {
           // log.info("same skuee "+sku.getID())
        }

    }
    //log.info(expectOnlyDim1 + "," + expectBoth + "," + dim1 + "," + dim2)
   // log.info("approved_sku_exists " + approved_sku_exists)
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
        log.info("This CC uses both Dim1 and Dim2 — please populate both for the Size Variant " + variant)
        //webUI.showAlert("ERROR", "This style uses both Dim1 and Dim2 — please populate both.");
        return "This CC uses both Dim1 and Dim2 — please populate both for the Size Variant " + variant;
        //}
    }
    return true;
}
}