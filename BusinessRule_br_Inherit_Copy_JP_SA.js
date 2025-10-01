/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Inherit_Copy_JP_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "SA Issue Fix BRs" ],
  "name" : "Inherit Copy JP SA",
  "description" : "PPIM-12253",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT) {
/*var mktDesignation = node.getValue("a_Style_Market_Designation").getSimpleValue();
if (mktDesignation.contains("CAN") == true && mktDesignation.contains("SA") == true) {
	inheritAttributes(node.getID(), "EN_CA", node.getID(), "EN_SA");
}*/

//inheritAttributes(node.getID(), "EN_US", node.getID(), "EN_SA");


function inheritAttributes(fromNodeId, fromContext, toNodeId, toContext) {
    var inheritATG = step.getAttributeGroupHome().getAttributeGroupByID("ag_English_Replication_Attributes");
    var inheritAttributes = [];
    inheritATG.getAttributes().toArray().forEach(function(attr) {
        inheritAttributes.push(attr);
    });
    step.executeInContext(fromContext, function(fromManager) {
        var fromNode = fromManager.getProductHome().getProductByID(fromNodeId);
        for (var i = 0; i < inheritAttributes.length; i++) {
            var attributeId = inheritAttributes[i].getID();
            var attributeValue = fromNode.getValue(attributeId).getSimpleValue();
            fromManager.executeInContext(toContext, function(otherManager) {
                var cntxtNode = otherManager.getProductHome().getProductByID(toNodeId);
                var cntxtValue = cntxtNode.getValue(attributeId).getSimpleValue();
                if (attributeValue != cntxtValue) {
                    cntxtNode.getValue(attributeId).setSimpleValue(attributeValue);
                }
            });
        }
    });
}

function getBOMStyleTarget() {
    var styleRefs = node.getReferences().asList();
    for (var i = 0; i < styleRefs.size(); i++) {
        if (styleRefs.get(i).getReferenceType().getID() == "rt_BOM_Style") {
            var bomStyle = styleRefs.get(i).getTarget();
            return bomStyle;
        }
    }
    return false;
}


var bomStyle = getBOMStyleTarget();
inheritAttributes(bomStyle.getID(), "EN_US", node.getID(), "EN_SA");



/*var inheritCopyMkts = node.getValue("a_Inherit_US_Copy_Option").getValues().toArray();
var inheritCopyMktsString = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
var mktDesignation = node.getValue("a_Style_Market_Designation").getSimpleValue();
if (mktDesignation != null) {
    if (mktDesignation.contains("US") == true) {
        if (inheritCopyMkts != null) {
            inheritCopyMkts.forEach(function(mkt) {
                if (mktDesignation.contains(mkt.getValue()) == true) {
                    var toContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());
                    var lifeCycleStatus = null;
                    step.executeInContext("EN_SA", function (otherManager) {
				     var otherCtxtNode = otherManager.getProductHome().getProductByID(node.getID());
					lifeCycleStatus = otherCtxtNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
				});
				
                    if (toContext == "EN_SA"){
                    	if (lifeCycleStatus == "In Progress"){
                    		inheritAttributes(node.getID(), "EN_US", node.getID(), "EN_SA");
                    	}
                    }
                    else{
                    	inheritAttributes(node.getID(), "EN_US", node.getID(), toContext);
                    }
                } else {
                    // remove inherit option since the inheriting market is not valid for the Style
                    mkt.deleteCurrent();
                }
            });
        }
        //Auto enrichment/copy to Franchise style which lives in another brand
        var bomStyle = getBOMStyleSource();
        if (bomStyle != false) {
            var inheritOptions = bomStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
            if (inheritOptions != null) {
                if (inheritOptions.contains("SA")) {
                    inheritAttributes(node.getID(), "EN_US", bomStyle.getID(), "EN_SA");
                }
            }
        }
    } else if (mktDesignation.contains("JPN") == true && mktDesignation.contains("SA") == true) {
        //Japan Exclusive style adopted in Franchise
        var inheritOptions = node.getValue("a_Inherit_JPN_Copy_Option").getSimpleValue();
        if (inheritOptions != null) {
            if (inheritOptions.contains("SA")) {
                inheritAttributes(node.getID(), "EN_JP", node.getID(), "EN_SA");
            }
        }

        //inheritAttributes(node.getID(), "EN_JP", node.getID(), "EN_SA");
    } else if (mktDesignation.contains("SA") == true) {
        if (inheritCopyMktsString != null) {
            if (inheritCopyMktsString.contains("SA")) {
                //Auto enrichment/copy to Franchise style which lives in another brand
                var bomStyle = getBOMStyleTarget();
                if (bomStyle != false) {
                    var bomStyleMKT = bomStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                    if (bomStyleMKT != null) {
                        if (bomStyleMKT.contains("US") == true) {
                            inheritAttributes(bomStyle.getID(), "EN_US", node.getID(), "EN_SA");
                        }
                    }
                }
            }
        }
    }
}

function inheritAttributes(fromNodeId, fromContext, toNodeId, toContext) {
    var inheritATG = step.getAttributeGroupHome().getAttributeGroupByID("ag_English_Replication_Attributes");
    var inheritAttributes = [];
    inheritATG.getAttributes().toArray().forEach(function(attr) {
        inheritAttributes.push(attr);
    });
    step.executeInContext(fromContext, function(fromManager) {
        var fromNode = fromManager.getProductHome().getProductByID(fromNodeId);
        for (var i = 0; i < inheritAttributes.length; i++) {
            var attributeId = inheritAttributes[i].getID();
            var attributeValue = fromNode.getValue(attributeId).getSimpleValue();
            fromManager.executeInContext(toContext, function(otherManager) {
                var cntxtNode = otherManager.getProductHome().getProductByID(toNodeId);
                var cntxtValue = cntxtNode.getValue(attributeId).getSimpleValue();
                if (attributeValue != cntxtValue) {
                    cntxtNode.getValue(attributeId).setSimpleValue(attributeValue);
                }
            });
        }
    });
}

function getBOMStyleSource() {
    var styleRefBy = node.getReferencedBy().toArray();
    for (var i = 0; i < styleRefBy.length; i++) {
        if (styleRefBy[i].getReferenceType().getID() == "rt_BOM_Style") {
            var bomStyle = styleRefBy[i].getSource();
            return bomStyle;
        }
    }
    return false;
}

function getBOMStyleTarget() {
    var styleRefs = node.getReferences().asList();
    for (var i = 0; i < styleRefs.size(); i++) {
        if (styleRefs.get(i).getReferenceType().getID() == "rt_BOM_Style") {
            var bomStyle = styleRefs.get(i).getTarget();
            return bomStyle;
        }
    }
    return false;
}*/
}