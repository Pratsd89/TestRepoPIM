/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testInheritCopy",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBRs_Indu" ],
  "name" : "Test Inherit US Copy Actions",
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
var inheritCopyMkts = node.getValue("a_Inherit_US_Copy_Option").getValues().toArray();
var inheritCopyMktsString = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
var mktDesignation = node.getValue("a_Style_Market_Designation").getSimpleValue();
var currentContext = step.getCurrentContext().getID();

if (mktDesignation != null) {
	if (mktDesignation.contains("US") == true) {
		if (inheritCopyMkts != null) {
			inheritCopyMkts.forEach(function (mkt) {
				if (mktDesignation.contains(mkt.getValue()) == true) {
					var toContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());

					if (toContext == "EN_SA") {
						var bomStyleUS = getBOMStyleTarget();
						if (bomStyleUS == false) {
							inheritAttributes(node.getID(), "EN_US", node.getID(), "EN_SA");
						}
						else {
							if (currentContext == "EN_SA") {
								inheritAttributes(bomStyleUS.getID(), "EN_US", node.getID(), "EN_SA");
							}
						}
					}
					else {
						inheritAttributes(node.getID(), "EN_US", node.getID(), toContext);
					}
				} else {
					// remove inherit option since the inheriting market is not valid for the Style
					mkt.deleteCurrent();
				}
			});
		}

		//Auto enrichment/copy to Franchise style which lives in another brand
		var bomStyleSA = getBOMStyleSource();
		if (bomStyleSA != false) {
			var inheritOptions = bomStyleSA.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
			if (inheritOptions != null) {
				if (inheritOptions.contains("SA")) {
					inheritAttributes(node.getID(), "EN_US", bomStyleSA.getID(), "EN_SA");
				}
			}
		}
	} else if (mktDesignation.contains("JPN") == true && mktDesignation.contains("SA") == true) {
		var bomStyleUS = getBOMStyleTarget();
		
		if (bomStyleUS != false && currentContext == "EN_SA") {
			var bomStyleMKT = bomStyleUS.getValue("a_Style_Market_Designation").getSimpleValue();
			if (bomStyleMKT != null) {
				if (bomStyleMKT == "US" && inheritCopyMktsString != null && inheritCopyMktsString.contains("SA")) {
					inheritAttributes(bomStyleUS.getID(), "EN_US", node.getID(), "EN_SA");
				}
			}
		}
		else {
			//Japan Exclusive style adopted in Franchise
			if (inheritCopyMktsString != null) {
				if (inheritCopyMktsString.contains("SA")) {
					inheritAttributes(node.getID(), "EN_JP", node.getID(), "EN_SA");
				}
			}
		}

	} else if (mktDesignation.contains("SA") == true) {
		if (inheritCopyMktsString != null) {
			if (inheritCopyMktsString.contains("SA")) {
				//Auto enrichment/copy to Franchise style which lives in another brand
				var bomStyleUS = getBOMStyleTarget();
				if (bomStyleUS != false) {
					var bomStyleMKT = bomStyle.getValue("a_Style_Market_Designation").getSimpleValue();
					if (bomStyleMKT != null) {
						if (bomStyleMKT.contains("US") == true) {
							inheritAttributes(bomStyleUS.getID(), "EN_US", node.getID(), "EN_SA");
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
	inheritATG.getAttributes().toArray().forEach(function (attr) {
		inheritAttributes.push(attr);
	});
	step.executeInContext(fromContext, function (fromManager) {
		var fromNode = fromManager.getProductHome().getProductByID(fromNodeId);
		for (var i = 0; i < inheritAttributes.length; i++) {
			var attributeId = inheritAttributes[i].getID();
			var attributeValue = fromNode.getValue(attributeId).getSimpleValue();
			fromManager.executeInContext(toContext, function (otherManager) {
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
}
}