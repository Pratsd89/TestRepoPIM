/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SizeModelApprovalValidation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "SizeModelApprovalValidation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeModel" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
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
    "alias" : "ref_Style",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "ref_SKU",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "ClassificationBindContract",
    "alias" : "node_Class",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "101471",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,ref_Style,ref_SKU,log,manager,node_Class) {
var result = true;
var obj = node.getObjectType().getID();
var sModelID = node.getID();
log.info(obj);
if (obj == "SizeModel") {
    var classSKU = node.getClassificationProductLinks();
    if (classSKU) {
        var chIter11 = classSKU.iterator();
        while (chIter11.hasNext()) {
            var chprod11 = chIter11.next();
            var x = chprod11.getProduct();
            log.info("styles are " + x.getID());
            var y = x.getChildren();
            if (y) {
                var yIter = y.iterator();
                while (yIter.hasNext()) {
                    var chprodX = yIter.next();
                    log.info("CCs are :" + chprodX.getID());
                    var z = chprodX.getChildren();
                    if (z) {
                        var zIter = z.iterator();
                        while (zIter.hasNext()) {
                            var chprodZ = zIter.next();
                            log.info("SKUs are :" + chprodZ.getID());
                            //var sClassi = chprodZ.getClassificationProductLinkTypeByID("SKUToSizeCode");
                            //
                            var catProd1 = chprodZ.getClassificationProductLinks().asList();
                            if (catProd1) {
                                var chIter1 = catProd1.iterator();
                                while (chIter1.hasNext()) {
                                    var chprod1 = chIter1.next();
                                    var link1 = chprod1.getLinkType().getID();
                                    if (link1 == "SKUToSizeCode") {
                                        var Style_attr1 = chprod1.getClassification().getID();
                                        log.info("sku link id " + Style_attr1);
                                        var sParentID = chprod1.getClassification().getParent().getID();
                                        log.info("sParentID " + sParentID);
                                        if (sParentID != sModelID) {
                                            result = "The SKU's Size Code does not comply with Parent's Style Size Model";
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
    }



    var children = node.getChildren();
    if (children) {
        var childIter = children.iterator();
        while (childIter.hasNext()) {
            var child = childIter.next();
            var sVariant = child.getValue("a_SizeCodeVariant").getSimpleValue();
            if (sVariant != null) {
                var children1 = child.getChildren();
                if (children1) {
                    var childIter1 = children1.iterator();
                    while (childIter1.hasNext()) {
                        var child1 = childIter1.next();
                        //log.info(child1.getObjectType().getID());
                        var tObj = child1.getObjectType().getID();
                        if (tObj == "Dim1") {
                            var sDim1 = child1.getValue("a_Advanced_Dimension_Value").getSimpleValue();
                            if (sDim1 != null) {
                                var skuDim1 = sVariant + " " + sDim1;
                                log.info("skuDim1 " + skuDim1);
                            }
                        }
                        if (tObj == "Dim2") {
                            var sDim2 = child1.getValue("a_Advanced_Dimension_Value").getSimpleValue();
                            if (sDim2 != null) {
                                var skuDim2 = sVariant + " " + sDim2;
                                log.info("skuDim2 " + skuDim2);
                            } else {
                                result = "Dim2 Object exist but dim2 dimension value is missing.";
                            }

                        }
                    }
                }
                // 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
                /*
            	var classSKU = child.getClassificationProductLinks();
			log.info("classSKU: "+classSKU);
				if(classSKU){
            		var chIter11=classSKU.iterator();
            		while(chIter11.hasNext()){
            			var chprod11 = chIter11.next(); 
						//log.info("chprod11 "+chprod11.getProduct().getID());
						chprod11.getProduct().getValue("a_Size_Dim1_Description").setSimpleValue(skuDim1);
						chprod11.getProduct().getValue("a_Size_Dim2_Description").setSimpleValue(skuDim2);
						
						var cSkuDim1 = chprod11.getProduct().getValue("a_Size_Dim1_Description").getSimpleValue();
						if (cSkuDim1 == null || cSkuDim1 != skuDim1){
							result =  "Dim1 value is not valid.";
							}
						var cSkuDim2 = chprod11.getProduct().getValue("a_Size_Dim2_Description").getSimpleValue();
						if(sDim2 != null && cSkuDim2 != skuDim2){
							result =  "Dim2 value is not valid.";
							
							}
            		}
            		}
            		*/
            } else {
                result = "The Size Code does not have a value for variant attribute";
            }

        }
    }
}


if (result == "true") {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    logger.info(iso.format(time));


    if (node.isInWorkflow("SizeModelEnrichmentWorkflow")) {
        if (node.isInState("SizeModelEnrichmentWorkflow", "Draft")) {
            var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
            wf.getTaskByID("Draft").triggerByID("Submit", "Size Model send for In Progress");
            if (node.isInState("SizeModelEnrichmentWorkflow", "InProgress")) {
                log.info("ye");
                var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
                wf.getTaskByID("InProgress").triggerByID("Approve", "start");
            }
        } else if (node.isInState("SizeModelEnrichmentWorkflow", "InProgress")) {
            log.info("ye");
            var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
            wf.getTaskByID("InProgress").triggerByID("Approve", "start");
        }

        //publish Style

        workflow_status = node.getValue("a_Size_Model_Status").getSimpleValue();
        log.info(workflow_status);
        if (workflow_status == "Approved") {
            node.approve();
            var classStyle = node.getClassificationProductLinks();
            if (classStyle) {
                var chIter11 = classStyle.iterator();
                while (chIter11.hasNext()) {
                    var chprod11 = chIter11.next();
                    var x = chprod11.getProduct();
                    log.info("styles are " + x.getID());
                    //set outbound for STYLE
                    x.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                    log.info(x.getValue("a_main_last_modified_date").getSimpleValue());
                    var y = x.getChildren();
                    if (y) {
                        var yIter = y.iterator();
                        while (yIter.hasNext()) {
                            var chprodX = yIter.next();
                            log.info("CCs are :" + chprodX.getID());
                            var z = chprodX.getChildren();
                            if (z) {
                                var zIter = z.iterator();
                                while (zIter.hasNext()) {
                                    var chprodZ = zIter.next();
                                    log.info("SKUs are :" + chprodZ.getID());

                                    //set outbound for SKU
                                    chprodZ.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                    log.info(chprodZ.getValue("a_main_last_modified_date").getSimpleValue());
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        node.startWorkflowByID("SizeModelEnrichmentWorkflow", '');
        if (node.isInWorkflow("SizeModelEnrichmentWorkflow")) {
            if (node.isInState("SizeModelEnrichmentWorkflow", "Draft")) {
                var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
                wf.getTaskByID("Draft").triggerByID("Submit", "Size Model send for In Progress");
                if (node.isInState("SizeModelEnrichmentWorkflow", "InProgress")) {
                    log.info("ye");
                    var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
                    wf.getTaskByID("InProgress").triggerByID("Approve", "start");
                }
            } else if (node.isInState("SizeModelEnrichmentWorkflow", "InProgress")) {
                log.info("ye");
                var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
                wf.getTaskByID("InProgress").triggerByID("Approve", "start");
            }

            //publish Style

            workflow_status = node.getValue("a_Size_Model_Status").getSimpleValue();
            log.info(workflow_status);
            if (workflow_status == "approved") {
                node.approve();
                var classStyle = node.getClassificationProductLinks();
                if (classStyle) {
                    var chIter11 = classStyle.iterator();
                    while (chIter11.hasNext()) {
                        var chprod11 = chIter11.next();
                        var x = chprod11.getProduct();
                        log.info("styles are " + x.getID());
                        //set outbound for STYLE
                        x.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        log.info(x.getValue("a_main_last_modified_date").getSimpleValue());
                        var y = x.getChildren();
                        if (y) {
                            var yIter = y.iterator();
                            while (yIter.hasNext()) {
                                var chprodX = yIter.next();
                                log.info("CCs are :" + chprodX.getID());
                                var z = chprodX.getChildren();
                                if (z) {
                                    var zIter = z.iterator();
                                    while (zIter.hasNext()) {
                                        var chprodZ = zIter.next();
                                        log.info("SKUs are :" + chprodZ.getID());

                                        //set outbound for SKU
                                        chprodZ.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                        log.info(chprodZ.getValue("a_main_last_modified_date").getSimpleValue());
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /*if(node.isInWorkflow("SizeModelEnrichmentWorkflow")){
    		var task=node.getTaskByID("SizeModelEnrichmentWorkflow","Draft");
         	var triggerResult = task.triggerByID("Submit",'');
         	//node.getWorkflowInstance(workflow).setSimpleVariable(;
         	var task2=node.isInState("SizeModelEnrichmentWorkflow", "InProgress");
              var triggerResult1 = task2.triggerByID("Approve",'');
    }*/
} else {
    return result;
}

}