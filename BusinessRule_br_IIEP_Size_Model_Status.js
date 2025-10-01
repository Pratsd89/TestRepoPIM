/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_IIEP_Size_Model_Status",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "IIEP Size Model Status Set",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeModel" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "SetAttributeValueBusinessAction",
  "parameters" : [ {
    "id" : "FromAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : null
  }, {
    "id" : "FromWorkflow",
    "type" : "com.stibo.core.domain.state.unstable.stateflow.StateFlow",
    "value" : null
  }, {
    "id" : "FromWorkflowVariableName",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "TextValue",
    "type" : "java.lang.String",
    "value" : "approved"
  }, {
    "id" : "ToAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Size_Model_Status"
  } ],
  "pluginType" : "Operation"
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,manager) {
var result = true;
var sModelID = node.getID();
var sModelStatus = node.getValue("a_Size_Model_Status").getSimpleValue();
var currentContext = manager.getCurrentContext().getID();

//log.info(obj);
if (currentContext == "EN_US" || currentContext == "EN_CA" || currentContext == "EN_JP") {
    if (sModelStatus != "approved") {
        var classSKU = node.getClassificationProductLinks();
        if (classSKU) {
            var chIter11 = classSKU.iterator();
            while (chIter11.hasNext()) {
                var chprod11 = chIter11.next();
                var x = chprod11.getProduct();
                //log.info("styles are " + x.getID());
                var y = x.getChildren();
                if (y) {
                    var yIter = y.iterator();
                    while (yIter.hasNext()) {
                        var chprodX = yIter.next();
                        //log.info("CCs are :" + chprodX.getID());
                        var z = chprodX.getChildren();
                        if (z) {
                            var zIter = z.iterator();
                            while (zIter.hasNext()) {
                                var chprodZ = zIter.next();
                                //log.info("SKUs are :" + chprodZ.getID());
                                var catProd1 = chprodZ.getClassificationProductLinks().asList();
                                if (catProd1) {
                                    var chIter1 = catProd1.iterator();
                                    while (chIter1.hasNext()) {
                                        var chprod1 = chIter1.next();
                                        var link1 = chprod1.getLinkType().getID();
                                        if (link1 == "SKUToSizeCode") {
                                            var Style_attr1 = chprod1.getClassification().getID();
                                            //log.info("sku link id " + Style_attr1);
                                            var sParentID = chprod1.getClassification().getParent().getID();
                                            //log.info("sParentID " + sParentID);
                                            if (sParentID != sModelID) {
                                                log.info("sku " + chprodZ.getID() + "style " + x.getID());
                                                result = "The SKU's Size Code does not comply with Parent's Style Size Model";
                                                node.getValue("a_error_message").setSimpleValue(result);
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
                                var sDim1 = child1.getValue("a_Dimension_value").getSimpleValue();
                                if (sDim1 != null) {
                                    var skuDim1 = sVariant + " " + sDim1;
                                    //log.info("skuDim1 " + skuDim1);
                                }
                            }
                            if (tObj == "Dim2") {
                                var sDim2 = child1.getValue("a_Dimension_value").getSimpleValue();
                                if (sDim2 != null) {
                                    var skuDim2 = sVariant + " " + sDim2;
                                    //log.info("skuDim2 " + skuDim2);
                                }
                                else {
                                    result = "Dim2 Object exist but dim2 dimension value is missing.";
                                    node.getValue("a_error_message").setSimpleValue(result);
                                }

                            }
                        }
                    }
                }
            }
        }
    }
}
if (currentContext == "JA_JP" || currentContext == "FR_CA") {
    result = "Invalid Context";
}
return result;

}