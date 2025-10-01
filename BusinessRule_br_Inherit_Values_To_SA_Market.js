/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Inherit_Values_To_SA_Market",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Inherit_Values_To_SA_Market",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
    "alias" : "step",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "BOMStyleRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_BOM_Style",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "BOMCCRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_BOM_CC",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,BOMStyleRef,BOMCCRef) {
objectType = node.getObjectType().getName();
var mktDesignation = node.getValue("a_Style_Market_Designation").getSimpleValue();
if (mktDesignation != null) {
    if (objectType == "CC") {
        var bomCC = getBOMNode(BOMCCRef);

        if (!bomCC) {

            bomCC = getBOMRefByNode(BOMCCRef);
            log.info(bomCC + " bomCC")
            if (bomCC) {
                log.info("heree")
                source = node;
                target = bomCC;
            }
        } else {
            source = bomCC;
            target = node;
        }

        if (bomCC) {
            mktDesignation = target.getValue("a_Style_Market_Designation").getSimpleValue();
            if (mktDesignation.contains("SA") == true) {
                var bomCCMKT = source.getValue("a_Market_Designation").getSimpleValue();
                if (bomCCMKT != null) {
                    if (bomCCMKT.contains("US") == true) {
                        updateSearchColourAndName(source.getID(), "EN_US", target.getID(), "EN_SA");
                    }
                    /*else if (bomCCMKT.contains("JPN") == true) {
                        updateSearchColourAndName(source.getID(), "EN_JP", target.getID(), "EN_SA");
                    }*/
                }
            }

        }
    }

    else if (objectType == "Style") {
        var bomStyle = getBOMNode(BOMStyleRef);
        if (!bomStyle) {
            bomStyle = getBOMRefByNode(BOMStyleRef)
            if (bomStyle) {
                source = node;
                target = bomStyle;
            }
        }
        else {
            source = bomStyle;
            target = node;
        }
        if (bomStyle) {
            mktDesignation = target.getValue("a_Style_Market_Designation").getSimpleValue();
            if (mktDesignation.contains("SA") == true) {
                var bomStyleMKT = source.getValue("a_Style_Market_Designation").getSimpleValue();
                if (bomStyleMKT != null) {
                    if (bomStyleMKT.contains("US") == true) {

                        inheritAttributes(source.getID(), "EN_US", target.getID(), "EN_SA");

                    }
                    /*else if (bomStyleMKT.contains("JPN") == true) {

                        inheritAttributes(source.getID(), "EN_JP", target.getID(), "EN_SA");

                    }*/
                }
            }

        }


    }
}


function updateSearchColourAndName(fromNodeId, fromContext, toNodeId, toContext) {

    step.executeInContext(fromContext, function (fromManager) {
        var fromNode = fromManager.getProductHome().getProductByID(fromNodeId);
        var SearchColour = fromNode.getValue("a_Search_Color_Calc").getSimpleValue();
        name = fromNode.getName();
        log.info("name " + name + " ,SearchColour - " + SearchColour)
        step.executeInContext(toContext, function (otherContextManager) {

            var saCurrentProduct = otherContextManager.getProductHome().getProductByID(toNodeId);

            var saSearchColour = saCurrentProduct.getValue("a_Search_Color_Calc").getSimpleValue();
            //log.info("name in SA" + saSearchColour + " ,SearchColour - " + saCurrentProduct.getName()+", ")
            //log.info(saSearchColour )
            //log.info( SearchColour != null)
            var overrideSearchColour = saCurrentProduct.getValue("a_Override_Search_Color").getSimpleValue();
            if ((saSearchColour == "" || saSearchColour == null || (overrideSearchColour != null && overrideSearchColour != SearchColour)) && SearchColour != null) {
                saCurrentProduct.getValue("a_Override_Search_Color").setSimpleValue(SearchColour);
                log.info("update value" + SearchColour + "," + saCurrentProduct.getID())
            }
            if (name != null) {
                saCurrentProduct.setName(name)
            }
        });
    });
}




function inheritAttributes(fromNodeId, fromContext, toNodeId, toContext) {
    var inheritATG = step.getAttributeGroupHome().getAttributeGroupByID("ag_Style_Product_Tags");
    var inheritAttributes = [];
    inheritATG.getAttributes().toArray().forEach(function (attr) {
        inheritAttributes.push(attr);
    });
    step.executeInContext(fromContext, function (fromManager) {
        var fromNode = fromManager.getProductHome().getProductByID(fromNodeId);
        //log.info("update name")
        // update style name
        name = fromNode.getName();
        if (name != null) {
            fromManager.executeInContext(toContext, function (otherManager) {
                var cntxtToNode = otherManager.getProductHome().getProductByID(toNodeId);
               // log.info(fromNode.getName()+","+cntxtToNode.getName())
                cntxtToNode.setName(name)
               // log.info(fromNode.getName()+","+cntxtToNode.getName())
            });
        }

        for (var i = 0; i < inheritAttributes.length; i++) {
            var attributeId = inheritAttributes[i].getID();
            var attributeValue = fromNode.getValue(attributeId).getSimpleValue();
            step.executeInContext(toContext, function (otherManager) {
                var cntxtNode = otherManager.getProductHome().getProductByID(toNodeId);
                var cntxtValue = cntxtNode.getValue(attributeId).getSimpleValue();
                if (attributeValue != cntxtValue) {
                    //if (cntxtValue == null || cntxtValue == ""){
                    cntxtNode.getValue(attributeId).setSimpleValue(attributeValue);
                }
            });
        }
    });
}


function getBOMNode(ref) {
    log.info(node)
    x = "";
    node.queryReferences(ref).forEach(function (referenceInstance) {
        x = referenceInstance.getTarget();
        return true;
    });
    return x;
}

function getBOMRefByNode(ref) {
    log.info(node)
    y = "";
    node.queryReferencedBy(ref).forEach(function (referenceInstance) {
        y = referenceInstance.getSource();
        return true;
    });
    return y;
}
}