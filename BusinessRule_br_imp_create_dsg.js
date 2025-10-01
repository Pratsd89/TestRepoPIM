/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_imp_create_dsg",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Import Template to Create Duplicate Style Group",
  "description" : "PPIM-10973",
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
//br_createDuplicateStyleGroups
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

function getDuplicateStyleGroup(style, refType) {
    var duplicateStyleGroup = null;
    var refByDSG = style.getReferencedBy().toArray();
    for (var i = 0; i < refByDSG.length; i++) {
        if (refByDSG[i].getReferenceType().getID() == "rt_mergeDuplicateStyles") {
            duplicateStyleGroup = refByDSG[i].getSource();
        }
    }
    return duplicateStyleGroup;
}

var dsgPrimaryStyle = null;
var primaryStyleNumImp = node.getValue("a_SuperPDP_Program_ID").getSimpleValue();
var styleNum = node.getValue("a_Style_Number").getSimpleValue();
var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_mergeDuplicateStyles");
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

if (primaryStyleNumImp != null && primaryStyleNumImp.trim() !== '' && !primaryStyleNumImp.equalsIgnoreCase('DELETE')) {
    var primaryStyleGroup = null;
    var supportingStyleGroup = null;
    if (primaryStyleNumImp == styleNum) {
        var primaryStyleGroup = getDuplicateStyleGroup(node, refType);
        if (primaryStyleGroup != null) {
            // check group to ensure they are not changing the primary style to the current node
            var dsgPrimaryStyleID = primaryStyleGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();

            if (node.getID() != dsgPrimaryStyleID) {
                // cannot modify duplicate style groups Primary Selling Style in smartsheet
                var dsgPrimaryStyle = manager.getProductHome().getProductByID(dsgPrimaryStyleID);
                var dsgPrimaryStyleNum = dsgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                node.getValue("a_SuperPDP_Program_ID").setSimpleValue(dsgPrimaryStyleNum);

                throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of a Duplicate Style Group.</b>");
            }
        } else {
            // only create duplicate style groups from supporting styles to ensure there is more than one style in the group
            node.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
            log.info("Skipping creation of grouping to avoid creating groups with only one Style: " + styleNum);
            //PPIM-11159
           // throw ("<b style='color:red;'>Skipping creation of grouping to avoid creating groups with only one Style: '" + styleNum + "'</b>");
        }
    } else {
    	   //PPIM-12127
        var primaryStyleID = null;
	   if (primaryStyleNumImp.length() == 6){
		  primaryStyleID = "000" + primaryStyleNumImp;
        }
        else if (primaryStyleNumImp.length() == 7){
	       primaryStyleID = "00" + primaryStyleNumImp;
        }
        var primaryStyle = manager.getProductHome().getProductByID(primaryStyleID);

        if (primaryStyle) {
            var supportingStyleGroup = getDuplicateStyleGroup(node, refType);
            var primaryStyleGroup = getDuplicateStyleGroup(primaryStyle, refType);

            if (supportingStyleGroup != null && primaryStyleGroup != null) {
                // ensure current Style belongs to the same group as the Primary Style
                if (supportingStyleGroup.getID() != primaryStyleGroup.getID()) {
                    // cannot modify duplicate style groups Primary Selling Style in smartsheet
                    var dsgPrimaryStyleID = supportingStyleGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
                    var dsgPrimaryStyle = manager.getProductHome().getProductByID(dsgPrimaryStyleID);
                    var dsgPrimaryStyleNum = dsgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                    node.getValue("a_SuperPDP_Program_ID").setSimpleValue(dsgPrimaryStyleNum);

                    throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of another Duplicate Style Group.</b>");
                } else {
                    var dsgPrimaryStyleID = supportingStyleGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
                    if (dsgPrimaryStyleID != null && dsgPrimaryStyleID != primaryStyleID) {
                        // cannot modify duplicate style groups Primary Selling Style in smartsheet
                        var dsgPrimaryStyle = manager.getProductHome().getProductByID(dsgPrimaryStyleID);
                        var dsgPrimaryStyleNum = dsgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                        node.getValue("a_SuperPDP_Program_ID").setSimpleValue(dsgPrimaryStyleNum);

                        throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of same Duplicate Style Group.</b>");
                    }
                }
            } else if (primaryStyleGroup != null) {
                // primaryStyle already has a group, so add the current style
                var primaryParentClassID = primaryStyle.getParent().getParent().getID();
                var parentClassID = node.getParent().getParent().getID();

                if (primaryParentClassID == parentClassID) {
                    log.info("VICE: 89" + node.getID());
                    var primaryStyleNumber = primaryStyle.getValue("a_Style_Number").getSimpleValue();
                    var newRef = primaryStyleGroup.createReference(node, "rt_mergeDuplicateStyles");

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
                } else {
                    //PPIM-11159
                    throw ("<b style='color:red;'>Unable to add Style '" + styleNum + "' to Style grouping, as the primary Style for this group belongs to a different parent class.</b>");
                    //log.info("Unable to add Style " + styleNum + " to Style grouping, as the primary Style for this group belongs to a different parent class");
                }
            } else if (supportingStyleGroup != null) {
                // user modified the primaryStyle value in import. Do not allow user to change the primaryStyle
                var dsgPrimaryStyleID = supportingStyleGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
                var dsgPrimaryStyle = manager.getProductHome().getProductByID(dsgPrimaryStyleID);
                var dsgPrimaryStyleNum = dsgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();

                node.getValue("a_SuperPDP_Program_ID").setSimpleValue(dsgPrimaryStyleNum);

                throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of another Duplicate Style Group.</b>");
            } else {
                var primaryParentClassID = primaryStyle.getParent().getParent().getID();
                var parentClassID = node.getParent().getParent().getID();

                if (primaryParentClassID == parentClassID) {
                    // create new duplicate style group with the node as a supporting style
                    var primaryStyleDivisionID = primaryStyle.getParent().getParent().getParent().getParent().getID();
                    var primaryStyleID = primaryStyle.getID();
                    var primaryStyleName = primaryStyle.getName();
                    var primaryStyleNumber = primaryStyle.getValue("a_Style_Number").getSimpleValue();
                    var primaryStyleBrandNumber = primaryStyle.getValue("a_Brand_Number").getSimpleValue();
                    var primaryStyleDeptDesc = primaryStyle.getValue("a_Department_Description").getSimpleValue();
                    var primaryStyleClassDesc = primaryStyle.getValue("a_Class_Description").getSimpleValue();
                    var primaryStyleSubClasDesc = primaryStyle.getValue("a_SubClass_Description").getSimpleValue();
                    var productGroupingDivisionObj = manager.getNodeHome().getObjectByKey("Product_Group_Division_Key", primaryStyleDivisionID); //XX_XXX_ProductGroupings
                    var newDuplicateStyleGroupID = primaryStyleBrandNumber + "_SPDP_" + primaryStyleID;
                    if (productGroupingDivisionObj != null) {
                        var divisionobjectID = productGroupingDivisionObj.getID();
                        var productGroupingTypeID = divisionobjectID.replace("_ProductGroupings", "_DSGs"); //XX_XXX_DSGs
                        var productGroupingTypeObj = manager.getProductHome().getProductByID(productGroupingTypeID);
                        if (productGroupingTypeObj == null) {
                            productGroupingTypeObj = productGroupingDivisionObj.createProduct(productGroupingTypeID, "ProductGroupingType");
                        }
                        var newDuplicateStyleGroup = productGroupingTypeObj.createProduct(newDuplicateStyleGroupID, "DuplicateStyleGroup");
                        primaryStyleName = primaryStyleName == null ? "" : primaryStyleName;
                        newDuplicateStyleGroup.setName(primaryStyleName);
                        newDuplicateStyleGroup.getValue("a_Brand_Number").setSimpleValue(primaryStyleBrandNumber);
                        newDuplicateStyleGroup.getValue("a_Department_Description").setSimpleValue(primaryStyleDeptDesc);
                        newDuplicateStyleGroup.getValue("a_Class_Description").setSimpleValue(primaryStyleClassDesc);
                        newDuplicateStyleGroup.getValue("a_SubClass_Description").setSimpleValue(primaryStyleSubClasDesc);
                        newDuplicateStyleGroup.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyleID);
                        newDuplicateStyleGroup.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                        var supportingRef = newDuplicateStyleGroup.createReference(node, refType);
                        var primaryRef = newDuplicateStyleGroup.createReference(primaryStyle, refType);

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
                        newDuplicateStyleGroup.approve();
                    }
                } else {
                    // do not create group, since the primaryStyle is classified under a different parent class
                    //log.info("Unable to create Style grouping, as the primary Style and Supporting Style belong to a different parent class");
                    //PPIM-11159
                    throw ("<b style='color:red;'>Unable to create Style grouping, as the primary Style and Supporting Style belong to a different parent class.</b>");
                }
            }
        } else {
            //PPIM-11159
            throw ("<b style='color:red;'>Could not find a Style using the Primary Style Number provided during import:  '" + primaryStyleNumImp + "'</b>");
            //log.info("Could not find a Style using the Primary Style Number provided during import: " + primaryStyleNumImp);
        }
    }
} else if (primaryStyleNumImp != null && primaryStyleNumImp.equalsIgnoreCase('DELETE')) {
    // node.getValue("a_SuperPDP_Program_ID").setSimpleValue(dsgPrimaryStyleNum); //do nothing
}
}