/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_imp_primaryStyleToSSG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Import Primary Style To Similar StyleGroups",
  "description" : "PPIM-10838",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (manager,node,log,LKT) {
//br_imp_primaryStyleToSSG
function inheritAttributes(primaryStyle, supportingStyle, manager) {
    var inheritATG = manager.getAttributeGroupHome().getAttributeGroupByID("ag_SuperPDP_Inherit_Attributes");
    var inheritAttributes = [];
    inheritATG.getAttributes().toArray().forEach(function(attr) {
        inheritAttributes.push(attr);
    });
    for (var i = 0; i < inheritAttributes.length; i++) {
        var attributeId = inheritAttributes[i].getID();
        var attributeValue = primaryStyle.getValue(attributeId).getSimpleValue();
        var supportingStyleValue = supportingStyle.getValue(attributeId).getSimpleValue();
        if (supportingStyleValue == null) {
            supportingStyle.getValue(attributeId).setSimpleValue(attributeValue);
        }
    }
}

function getSimilarStyleGroup(style, refType) {
    var similarStyleGroup = null;
    var refBySSG = style.getReferencedBy().toArray();
    for (var i = 0; i < refBySSG.length; i++) {
        if (refBySSG[i].getReferenceType().getID() == "rt_styles") {
            similarStyleGroup = refBySSG[i].getSource();
        }
    }
    return similarStyleGroup;
}
var ssgPrimaryStyle = null;
var primaryStyleNumImp = node.getValue("a_SuperPDP_Program_ID").getSimpleValue();
var styleNum = node.getValue("a_Style_Number").getSimpleValue();
var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_styles");
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var canadaManager = "";
var context = manager.getCurrentContext().getID();
var marketSPDP = LKT.getLookupTableValue("LKT_Context_to_Market", context);
manager.executeInContext("EN_CA", function(contextManager) {
    canadaManager = contextManager;
});
if (primaryStyleNumImp != null && primaryStyleNumImp.trim() !== '' && !primaryStyleNumImp.equalsIgnoreCase('DELETE')) {
    var primaryStyleGroup = null;
    var supportingStyleGroup = null;
    if (primaryStyleNumImp == styleNum) {
        var primaryStyleGroup = getSimilarStyleGroup(node, refType);
        if (primaryStyleGroup != null) {
            // check group to ensure they are not changing the primary style to the current node
            var ssgPrimaryStyleID = primaryStyleGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
            if (node.getID() != ssgPrimaryStyleID) {
                // cannot modify similar style groups Primary Selling Style in smartsheet
                var ssgPrimaryStyle = manager.getProductHome().getProductByID(ssgPrimaryStyleID);
                var ssgPrimaryStyleNum = ssgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                node.getValue("a_SuperPDP_Program_ID").setSimpleValue(ssgPrimaryStyleNum);
                throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of a Duplicate Style Group.</b>");
            }
        } else {
            // only create similar style groups from supporting styles to ensure there is more than one style in the group
            node.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
            log.info("Skipping creation of grouping to avoid creating groups with only one Style: " + styleNum);
        }
    } else {
        var primaryStyleID = "000" + primaryStyleNumImp;
        var primaryStyle = manager.getProductHome().getProductByID(primaryStyleID);
        if (primaryStyle) {
            var supportingStyleGroup = getSimilarStyleGroup(node, refType);
            var primaryStyleGroup = getSimilarStyleGroup(primaryStyle, refType);
            if (supportingStyleGroup != null && primaryStyleGroup != null) {
                // ensure current Style belongs to the same group as the Primary Style
                if (supportingStyleGroup.getID() != primaryStyleGroup.getID()) {
                    // cannot modify similar style groups Primary Selling Style in smartsheet
                    var ssgPrimaryStyleID = supportingStyleGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
                    var ssgPrimaryStyle = manager.getProductHome().getProductByID(ssgPrimaryStyleID);
                    var ssgPrimaryStyleNum = ssgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                    node.getValue("a_SuperPDP_Program_ID").setSimpleValue(ssgPrimaryStyleNum);
                    throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of another Similar Style Group.</b>");
                } else {
                    var ssgPrimaryStyleID = supportingStyleGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
                    if (ssgPrimaryStyleID != null && ssgPrimaryStyleID != primaryStyleID) {
                        // cannot modify similar style groups Primary Selling Style in smartsheet
                        var ssgPrimaryStyle = manager.getProductHome().getProductByID(ssgPrimaryStyleID);
                        var ssgPrimaryStyleNum = ssgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                        node.getValue("a_SuperPDP_Program_ID").setSimpleValue(ssgPrimaryStyleNum);
                        throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of same Similar Style Group.</b>");
                    }
                }
            } else if (primaryStyleGroup != null) {
                // primaryStyle already has a group, so add the current style
                var primaryParentClassID = primaryStyle.getParent().getParent().getID();
                var parentClassID = node.getParent().getParent().getID();
                var primaryStyleMktDesg = primaryStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                var currentStyleMktDesg = node.getValue("a_Style_Market_Designation").getSimpleValue();
                if (primaryParentClassID == parentClassID) {
                    if ((marketSPDP = "US" && primaryStyleMktDesg.contains("US") && currentStyleMktDesg.contains("US")) || (marketSPDP = "CAN" && primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg.contains("CAN"))) {
                        var primaryStyleNumber = primaryStyle.getValue("a_Style_Number").getSimpleValue();
                        var newRef = primaryStyleGroup.createReference(node, "rt_styles");
                        //Adding Primary Style Copy to Supporting Styles
                        var markets = node.getValue("a_Style_Market_Designation").getValues().toArray();
                        var contextArray = [];
                        markets.forEach(function(market) {
                            var contexts = LKT.getLookupTableValue("LKT_MarketDesignationToContext", market.getSimpleValue());
                            if (contexts.contains(";")) {
                                contexts.split(";").forEach(function(ctx) {
                                    contextArray.push(ctx);
                                });
                            } else {
                                contextArray.push(contexts);
                            }
                        });
                        contextArray.forEach(function(ctxt) {
                            manager.executeInContext(ctxt, function(contextManager) {
                                var contextPrimaryStyle = contextManager.getProductHome().getProductByID(primaryStyleID);
                                var contextStyle = contextManager.getProductHome().getProductByID(node.getID());
                                var contextStyleStatus = contextStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                var contextStyleCopyStatus = contextStyle.getValue("a_Copy_Complete_Status").getSimpleValue();
                                if (contextStyleStatus == "In Progress" && contextStyleCopyStatus != "Complete") {
                                    var primaryTranslationStatus = contextPrimaryStyle.getValue("a_Translation_Status").getSimpleValue();
                                    if (primaryTranslationStatus != null) {
                                        contextStyle.getValue("a_Translation_Status").setSimpleValue(primaryTranslationStatus);
                                    }
                                    inheritAttributes(contextPrimaryStyle, contextStyle, manager);
                                }
                            });
                        });
                        node.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                        node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());
                        node.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                        newRef.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                        primaryStyle.getValue("a_Supporting_Styles").addValue(node.getID());
                        primaryStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        if (marketSPDP = "US" && primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg.contains("CAN")) {
                            var CanadaNode = canadaManager.getObjectFromOtherManager(node);
                            var CanadaDSG = getSimilarStyleGroup(CanadaNode, refType);
                            if (CanadaDSG == null) {
                                var USDSG = getSimilarStyleGroup(node, refType);
                                var CanadaSimilarStyleGroup = canadaManager.getObjectFromOtherManager(USDSG);
                                var canadaRef = CanadaSimilarStyleGroup.createReference(CanadaNode, refType);
                                canadaRef.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                            }
                        }
                    } else {
                        log.info("Unable to add Style " + styleNum + " to Style grouping, as the primary Style or supporting doesn't follow market desgination rule");
                    }
                } else {
                    log.info("Unable to add Style " + styleNum + " to Style grouping, as the primary Style for this group belongs to a different parent class");
                }
            } else if (supportingStyleGroup != null) {
                // user modified the primaryStyle value in import. Do not allow user to change the primaryStyle
                var ssgPrimaryStyleID = supportingStyleGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
                var ssgPrimaryStyle = manager.getProductHome().getProductByID(ssgPrimaryStyleID);
                var ssgPrimaryStyleNum = ssgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                node.getValue("a_SuperPDP_Program_ID").setSimpleValue(ssgPrimaryStyleNum);
                throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of another Duplicate Style Group.</b>");
            } else {
                var primaryParentClassID = primaryStyle.getParent().getParent().getID();
                var parentClassID = node.getParent().getParent().getID();
                var primaryStyleMKTDesg = primaryStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                var currentStyleMktDesg = node.getValue("a_Style_Market_Designation").getSimpleValue();
                var primaryStyleCAN = canadaManager.getObjectFromOtherManager(primaryStyle);
                var nodeCanada = canadaManager.getObjectFromOtherManager(node);
                if (primaryParentClassID == parentClassID) {
                    if ((marketSPDP = "US" && primaryStyleMktDesg.contains("US") && currentStyleMktDesg.contains("US")) || (marketSPDP = "CAN" && primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg.contains("CAN"))) {
                        // create new similar style group with the node as a supporting style
                        var primaryStyleDivisionID = primaryStyle.getParent().getParent().getParent().getParent().getID();
                        var primaryStyleID = primaryStyle.getID();
                        var primaryStyleName = primaryStyle.getName();
                        var primaryStyleNumber = primaryStyle.getValue("a_Style_Number").getSimpleValue();
                        var primaryStyleBrandNumber = primaryStyle.getValue("a_Brand_Number").getSimpleValue();
                        var primaryStyleDeptDesc = primaryStyle.getValue("a_Department_Description").getSimpleValue();
                        var primaryStyleClassDesc = primaryStyle.getValue("a_Class_Description").getSimpleValue();
                        var primaryStyleSubClasDesc = primaryStyle.getValue("a_SubClass_Description").getSimpleValue();
                        var productGroupingDivisionObj = manager.getNodeHome().getObjectByKey("ProductGroup_Division_Key", primaryStyleDivisionID); //XX_XXX_ProductGroupings
                        var newSimilarStyleGroupID = primaryStyleBrandNumber + "_SPDP_" + primaryStyleID;
                        if (productGroupingDivisionObj != null) {
                            var divisionobjectID = productGroupingDivisionObj.getID();
                            var productGroupingTypeID = divisionobjectID.replace("_ProductGroupings", "_SSGs"); //XX_XXX_SSGs
                            var productGroupingTypeObj = manager.getProductHome().getProductByID(productGroupingTypeID);
                            if (productGroupingTypeObj == null) {
                                productGroupingTypeObj = productGroupingDivisionObj.createProduct(productGroupingTypeID, "ProductGroupingType");
                            }
                            var newSimilarStyleGroup = productGroupingTypeObj.createProduct(newSimilarStyleGroupID, "SimilarStyleGroup");
                            primaryStyleName = primaryStyleName == null ? "" : primaryStyleName;
                            newSimilarStyleGroup.setName(primaryStyleName);
                            newSimilarStyleGroup.getValue("a_Brand_Number").setSimpleValue(primaryStyleBrandNumber);
                            newSimilarStyleGroup.getValue("a_Department_Description").setSimpleValue(primaryStyleDeptDesc);
                            newSimilarStyleGroup.getValue("a_Class_Description").setSimpleValue(primaryStyleClassDesc);
                            newSimilarStyleGroup.getValue("a_SubClass_Description").setSimpleValue(primaryStyleSubClasDesc);
                            newSimilarStyleGroup.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyleID);
                            newSimilarStyleGroup.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                            newSimilarStyleGroup.getValue("a_SuperPDP_Market").setSimpleValue(marketSPDP);
                            var supportingRef = newSimilarStyleGroup.createReference(node, refType);
                            var primaryRef = newSimilarStyleGroup.createReference(primaryStyle, refType);
                            //Adding Primary Style Copy to Supporting Styles
                            var markets = node.getValue("a_Style_Market_Designation").getValues().toArray();
                            var contextArray = [];
                            markets.forEach(function(market) {
                                var contexts = LKT.getLookupTableValue("LKT_MarketDesignationToContext", market.getSimpleValue());
                                if (contexts.contains(";")) {
                                    contexts.split(";").forEach(function(ctx) {
                                        contextArray.push(ctx);
                                    });
                                } else {
                                    contextArray.push(contexts);
                                }
                            });
                            contextArray.forEach(function(ctxt) {
                                manager.executeInContext(ctxt, function(contextManager) {
                                    var contextPrimaryStyle = contextManager.getProductHome().getProductByID(primaryStyleID);
                                    var contextStyle = contextManager.getProductHome().getProductByID(node.getID());
                                    var contextStyleStatus = contextStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                    var contextStyleCopyStatus = contextStyle.getValue("a_Copy_Complete_Status").getSimpleValue();
                                    if (contextStyleStatus == "In Progress" && contextStyleCopyStatus != "Complete") {
                                        var primaryTranslationStatus = contextPrimaryStyle.getValue("a_Translation_Status").getSimpleValue();
                                        if (primaryTranslationStatus != null) {
                                            contextStyle.getValue("a_Translation_Status").setSimpleValue(primaryTranslationStatus);
                                        }
                                        inheritAttributes(contextPrimaryStyle, contextStyle, manager);
                                    }
                                });
                            });
                            node.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                            node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());
                            node.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                            supportingRef.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                            primaryRef.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                            primaryStyle.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                            primaryStyle.getValue("a_Supporting_Styles").setSimpleValue(node.getID());
                            primaryStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());
                            primaryStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                            primaryStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                            node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                            newSimilarStyleGroup.getParent().approve();
                            newSimilarStyleGroup.approve();
                            if (marketSPDP = "US" && primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg.contains("CAN")) {
                                var newCANSimilarStyleGroup = canadaManager.getObjectFromOtherManager(newSimilarStyleGroup);
                                newCANSimilarStyleGroup.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyleID);
                                newCANSimilarStyleGroup.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                                newCANSimilarStyleGroup.getValue("a_SuperPDP_Market").addValue("CAN");
                                var supportingCANRef = newCANSimilarStyleGroup.createReference(nodeCanada, refType);
                                var primaryCANRef = newCANSimilarStyleGroup.createReference(primaryStyleCAN, refType);
                                nodeCanada.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                                nodeCanada.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());
                                nodeCanada.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                                supportingCANRef.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                                primaryCANRef.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                                primaryStyleCAN.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                                primaryStyleCAN.getValue("a_Supporting_Styles").setSimpleValue(node.getID());
                                primaryStyleCAN.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());
                                primaryStyleCAN.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                            }
                            clearUSReferences(node);
                        }
                    } else {
                        log.info("Unable to create Style grouping, as the primary Style and Supporting Style doesn't follow market desgination rule.");
                    }
                } else {
                    // do not create group, since the primaryStyle is classified under a different parent class
                    log.info("Unable to create Style grouping, as the primary Style and Supporting Style belong to a different parent class");
                }
            }
        } else {
            log.info("Could not find a Style using the Primary Style Number provided during import: " + primaryStyleNumImp);
        }
    }
} else if (primaryStyleNumImp != null && primaryStyleNumImp.equalsIgnoreCase('DELETE')) {
    var similarStyleGroup = null;
    var similarStyleGroup = getSimilarStyleGroup(node, refType);
    var canadaManager = "";
    var MktDesg =  similarStyleGroup.getValue("a_SuperPDP_Market").getSimpleValue();
    var context = manager.getCurrentContext().getID();
    manager.executeInContext("EN_CA", function(contextManager) {
        canadaManager = contextManager;
    });
    var CanadaNode = canadaManager.getObjectFromOtherManager(node);
    var CanadaSSG = getSimilarStyleGroup(CanadaNode, refType);
    if (similarStyleGroup != null) {
        var ssgPrimaryStyleID = similarStyleGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
        var ssgRefs = similarStyleGroup.getReferences(refType).toArray();
        if (node.getID() == ssgPrimaryStyleID) {
            // delete similar style group when the primary style is removed from the grouping
            for (var i = 0; i < ssgRefs.length; i++) {
                var currentStyle = ssgRefs[i].getTarget();
                currentStyle.getValue("a_Primary_Selling_Style").setSimpleValue(null);
                currentStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(null);
                currentStyle.getValue("a_Supporting_Styles").setSimpleValue(null);
                currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
                node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                currentStyle.getValue("a_Style_Group_Type").setSimpleValue("");
                ssgRefs[i].delete();
            }
            similarStyleGroup.approve();
            similarStyleGroup.delete();
        } else {
            // remove reference to the current similar style group and check how many Styles are left in the group
            var styleGroupCount = 0;
            var primaryStyle = manager.getProductHome().getProductByID(ssgPrimaryStyleID);
            for (var i = 0; i < ssgRefs.length; i++) {
                var currentStyle = ssgRefs[i].getTarget();
                if (currentStyle.getID() == node.getID()) {
                    currentStyle.getValue("a_Primary_Selling_Style").setSimpleValue(null);
                    currentStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(null);
                    currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
                    currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                    currentStyle.getValue("a_Style_Group_Type").setSimpleValue("");
                    ssgRefs[i].delete();
                } else {
                    styleGroupCount = styleGroupCount + 1;
                }
            }
            if (context == "EN_US" && MktDesg.contains("CAN")) {
                //Removing the reference from Canada Context when deleted in EN_US
                var ssgCANRefs = CanadaSSG.getReferences(refType).toArray();
                for (var i = 0; i < ssgCANRefs.length; i++) {
                    var currentStyle = ssgCANRefs[i].getTarget();
                    if (currentStyle.getID() == node.getID()) {
                        currentStyle.getValue("a_Primary_Selling_Style").setSimpleValue(null);
                        currentStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(null);
                        currentStyle.getValue("a_Supporting_Styles").setSimpleValue(null);
                        currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
                        node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        currentStyle.getValue("a_Style_Group_Type").setSimpleValue("");
                        ssgCANRefs[i].delete();
                    }
                }
            }
            if (styleGroupCount < 2) {
                // delete the similar style group when only one Style remains in the grouping
                ssgRefs = similarStyleGroup.getReferences(refType).toArray();
                for (var i = 0; i < ssgRefs.length; i++) {
                    var currentStyle = ssgRefs[i].getTarget();
                    currentStyle.getValue("a_Primary_Selling_Style").setSimpleValue(null);
                    currentStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(null);
                    currentStyle.getValue("a_Supporting_Styles").setSimpleValue(null);
                    currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
                    currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                    currentStyle.getValue("a_Style_Group_Type").setSimpleValue("");
                    ssgRefs[i].delete();
                }
                similarStyleGroup.approve();
                similarStyleGroup.delete();
            } else {
                // remove Supporting Style Number from Primary Style value and republish
                if (primaryStyle != null) {
                    var supportingStylesIter = primaryStyle.getValue("a_Supporting_Styles").getValues().iterator();
                    while (supportingStylesIter.hasNext()) {
                        var supportingStyleNum = supportingStylesIter.next();
                        var supportingStyleName = supportingStyleNum.getValue();
                        if (node.getID() == supportingStyleName) {
                            supportingStyleNum.deleteCurrent();
                            break;
                        }
                    }
                    primaryStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                } else {
                    //log.info("Invalid Primary Style ID");
                }
            }
        }
    }
} else if (similarStyleGroup == null) {
    node.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
}

function clearUSReferences(node){
var context = manager.getCurrentContext().getID();
if (context == "EN_CA") {
    manager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_styles");
        var similarStyleGroup = getSimilarStyleGroup(currentContextNode, refType);
        if (similarStyleGroup != null) {
            var dsgRefs = similarStyleGroup.getReferences(refType).toArray();
            for (var i in ssgRefs) {
                var currentStyle = ssgRefs[i].getTarget();
                currentStyle.getValue("a_Primary_Selling_Style").setSimpleValue(null);
                currentStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(null);
                currentStyle.getValue("a_Supporting_Styles").setSimpleValue(null);
                currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
                ssgRefs[i].delete();
            }
        }
    });
}
}
}