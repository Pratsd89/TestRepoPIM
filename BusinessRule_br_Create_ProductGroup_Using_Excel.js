/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_ProductGroup_Using_Excel",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Create Product Group Using Excel",
  "description" : "Business rule  to Create Product Groups (Create Excel Link -First)",
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ProductGroupLibrary",
    "libraryAlias" : "pgLibrary"
  } ]
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "createProductGroups",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MVGRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MultiVariant_Group_Reference",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,log,LKT,createProductGroups,MVGRefType,pgLibrary) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var pgDateFormatter = new java.text.SimpleDateFormat("yyyy-MM-dd");
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var startDate = node.getValue("a_Product_Grouping_Start_date").getSimpleValue();
var endDate = node.getValue("a_Product_Grouping_End_Date").getSimpleValue();
var dsgPrimaryStyle = null;
var productGroupingDivisionID = null;
var styleAlreadyReferencedFlagCAN = false;
var primaryStyleNumImp = node.getValue("a_SuperPDP_Program_ID").getSimpleValue();
var styleNum = node.getValue("a_Style_Number").getSimpleValue();
var refType = step.getReferenceTypeHome().getReferenceTypeByID("rt_ProductGroups");
var canadaManager = "";
var context = step.getCurrentContext().getID();
var marketSPDP = LKT.getLookupTableValue("LKT_Context_to_Market", context);
step.executeInContext("EN_CA", function (contextManager) {
    canadaManager = contextManager;
});

if (primaryStyleNumImp != null && primaryStyleNumImp.trim() !== '' && !primaryStyleNumImp.equalsIgnoreCase('DELETE')) {
    var primaryStyleGroup = null;
    var supportingStyleGroup = null;
    if (primaryStyleNumImp == styleNum) {
        var primaryStyleGroup = pgLibrary.getDuplicateStyleGroup(node, refType);
        if (primaryStyleGroup != null) {
            // check group to ensure they are not changing the primary style to the current node
            var dsgPrimaryProductNum = primaryStyleGroup.getValue("a_Primary_Product").getSimpleValue();
            var dsgPrimaryStyleID = pgLibrary.getPrimaryStyleID(dsgPrimaryProductNum);

            if (node.getID() != dsgPrimaryStyleID) {
                // cannot modify duplicate style groups Primary Selling Style in smartsheet
                var dsgPrimaryStyle = step.getProductHome().getProductByID(dsgPrimaryStyleID);
                var dsgPrimaryStyleNum = dsgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                node.getValue("a_SuperPDP_Program_ID").setSimpleValue(dsgPrimaryStyleNum);
                throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of a SimpleMergeGroup.</b>");
            }
            else {
                var nodePGStartDate = node.getValue("a_Product_Grouping_Start_date").getSimpleValue();
                var nodePGEndDate = node.getValue("a_Product_Grouping_End_Date").getSimpleValue();
                var groupStartDate = primaryStyleGroup.getValue("a_Product_Grouping_Start_date").getSimpleValue();
                var groupEndDate = primaryStyleGroup.getValue("a_Product_Grouping_End_Date").getSimpleValue();
                var Dateformatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

                if (nodePGStartDate != null) {
                    nodePGStartDate = java.time.LocalDate.parse(nodePGStartDate, Dateformatter);
                }
                if (nodePGEndDate != null) {
                    nodePGEndDate = java.time.LocalDate.parse(nodePGEndDate, Dateformatter);
                }
                if (groupStartDate != null) {
                    groupStartDate = java.time.LocalDate.parse(groupStartDate, Dateformatter);
                }
                if (groupEndDate != null) {
                    groupEndDate = java.time.LocalDate.parse(groupEndDate, Dateformatter);
                }

                //Start Date should not be greater than End Date
                if (nodePGStartDate <= nodePGEndDate) {
                    if (nodePGStartDate != null && nodePGStartDate < groupStartDate) {
                        primaryStyleGroup.getValue("a_Product_Grouping_Start_date").setSimpleValue(nodePGStartDate.toString());
                    }
                    if (nodePGEndDate != null && nodePGEndDate < groupEndDate) {
                        primaryStyleGroup.getValue("a_Product_Grouping_End_Date").setSimpleValue(nodePGEndDate.toString());
                    }
                }
                pgLibrary.setStyleDatesFromGroupDate(primaryStyleGroup, createProductGroups, step);

                var superPDPMkt = primaryStyleGroup.getValue("a_SuperPDP_Market").getSimpleValue();
                if (context != "EN_CA" && superPDPMkt != null && superPDPMkt.contains("CAN")) {
                    var PG_CAN = canadaManager.getObjectFromOtherManager(primaryStyleGroup);
                    PG_CAN.getValue("a_Product_Grouping_Start_date").setSimpleValue(primaryStyleGroup.getValue("a_Product_Grouping_Start_date").getSimpleValue());
                    PG_CAN.getValue("a_Product_Grouping_End_Date").setSimpleValue(primaryStyleGroup.getValue("a_Product_Grouping_End_Date").getSimpleValue());
                    pgLibrary.setStyleDatesFromGroupDate(PG_CAN, createProductGroups, step);
                }
            }
        } else {
            var styleMkts = node.getValue("a_Style_Market_Designation").getSimpleValue();
            var stylelcs = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

            if (context == "EN_US") {
                if (styleMkts != null && styleMkts.contains("US")) {
                    if (stylelcs == null || stylelcs == "Draft" || stylelcs == "Purged") {
                        throw ("Primary Style provided is in Draft/Purged/Blank status in US market.");
                    }
                    else {
                        //PPIM-14609
                        if (styleMkts.contains("CAN")) {
                            var canadaCurrentStyle = canadaManager.getObjectFromOtherManager(node);
                            var stylelcs_CAN = canadaCurrentStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                            if (stylelcs_CAN == null || stylelcs_CAN == "Draft" || stylelcs_CAN == "Purged") {
                                log.info("Primary Style provided is in Draft/Purged/Blank status in one of the markets.");
                            }
                            else {
                                var CanadaDSG = pgLibrary.getDuplicateStyleGroup(canadaCurrentStyle, refType);
                                if (CanadaDSG == null) {
                                    var newProductGroup = pgLibrary.createGroup(node, marketSPDP, context, step, createProductGroups);
                                    if (newProductGroup != null) {
                                        pgLibrary.createDSGStyleReference(context, step, node, 'Yes', newProductGroup, createProductGroups);
                                        newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
                                        var newProductGroupCAN = canadaManager.getObjectFromOtherManager(newProductGroup);
                                        pgLibrary.createDSGStyleReference("EN_CA", step, node, 'Yes', newProductGroup, createProductGroups);
                                        newProductGroup.getValue("a_SuperPDP_Market").addValue("CAN");
                                        newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("US");
                                        newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                                    }
                                } else {
                                    throw ("Primary style " + styleNum + " is part of another SimpleMergeGroup in CAN market.");
                                }
                            }
                        } else {
                            var newProductGroup = pgLibrary.createGroup(node, marketSPDP, context, step, createProductGroups);
                            pgLibrary.createDSGStyleReference(context, step, node, 'Yes', newProductGroup, createProductGroups);
                            newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
                        }

                        /*var newProductGroup = pgLibrary.createGroup(node, marketSPDP, context, step, createProductGroups);
                        pgLibrary.createDSGStyleReference(context, step, node, 'Yes', newProductGroup, createProductGroups);
                        newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
                        if (newProductGroup != null && styleMkts.contains("CAN")) {
                            var canadaCurrentStyle = canadaManager.getObjectFromOtherManager(node);
                            var stylelcs_CAN = canadaCurrentStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                            if (stylelcs_CAN == null || stylelcs_CAN == "Draft" || stylelcs_CAN == "Purged") {
                                log.info("Primary Style provided is in Draft/Purged/Blank status in one of the markets");
                            }
                            else {
                                var CanadaDSG = pgLibrary.getDuplicateStyleGroup(canadaCurrentStyle, refType);
                                if (CanadaDSG == null) {
                                    var newProductGroupCAN = canadaManager.getObjectFromOtherManager(newProductGroup);
                                    pgLibrary.createDSGStyleReference("EN_CA", step, node, 'Yes', newProductGroup, createProductGroups);
                                    newProductGroup.getValue("a_SuperPDP_Market").addValue("CAN");
                                    newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("US");
                                    newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                                }
                            }
                        }*/
                    }
                }
            }
            else if (context == "EN_CA") {
                if (styleMkts.contains("CAN")) {
                    if (stylelcs == null || stylelcs == "Draft" || stylelcs == "Purged") {
                        throw ("Primary Style provided is in Draft/Purged/Blank status in CAN market.");
                    }
                    else {
                        var newProductGroup = pgLibrary.createGroup(node, marketSPDP, context, step);
                        pgLibrary.createDSGStyleReference(context, step, node, 'Yes', newProductGroup, createProductGroups);
                        newProductGroup.getValue("a_SuperPDP_Market").addValue("CAN");
                    }
                }
            }
        }
    } else {
        var primaryStyleID = pgLibrary.getPrimaryStyleID(primaryStyleNumImp);
        var primaryStyle = step.getProductHome().getProductByID(primaryStyleID);
        if (primaryStyle) {
            var supportingStyleGroup = pgLibrary.getDuplicateStyleGroup(node, refType);
            var primaryStyleGroup = pgLibrary.getDuplicateStyleGroup(primaryStyle, refType);
            if (supportingStyleGroup != null && primaryStyleGroup != null) {
                if (supportingStyleGroup.getID() != primaryStyleGroup.getID()) {
                    // cannot modify duplicate style groups Primary Selling Style in smartsheet
                    var dsgPrimaryProductNum = supportingStyleGroup.getValue("a_Primary_Product").getSimpleValue();
                    var dsgPrimaryStyleID = pgLibrary.getPrimaryStyleID(dsgPrimaryProductNum);
                    var dsgPrimaryStyle = step.getProductHome().getProductByID(dsgPrimaryStyleID);
                    var dsgPrimaryStyleNum = dsgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                    node.getValue("a_SuperPDP_Program_ID").setSimpleValue(dsgPrimaryStyleNum);
                    throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of another SimpleMergeGroup.</b>");
                } else {
                    var dsgPrimaryProductNum = supportingStyleGroup.getValue("a_Primary_Product").getSimpleValue();
                    var dsgPrimaryStyleID = pgLibrary.getPrimaryStyleID(dsgPrimaryProductNum);
                    if (dsgPrimaryStyleID != null && dsgPrimaryStyleID != primaryStyleID) {
                        // cannot modify duplicate style groups Primary Selling Style in smartsheet
                        var dsgPrimaryStyle = step.getProductHome().getProductByID(dsgPrimaryStyleID);
                        var dsgPrimaryStyleNum = dsgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                        node.getValue("a_SuperPDP_Program_ID").setSimpleValue(dsgPrimaryStyleNum);
                        throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of same SimpleMergeGroup.</b>");
                    }
                    else {
                        pgLibrary.setStyleDatesFromGroupDate(primaryStyleGroup, createProductGroups, step);
                    }
                }
            } else if (primaryStyleGroup != null) {
                var primaryProductNum = primaryStyleGroup.getValue("a_Primary_Product").getSimpleValue();
                if (primaryProductNum != primaryStyleNumImp) {
                    throw ("<b style='color:red;'>'" + primaryStyleNumImp + "' is a product of an existing SimpleMergeGroup. It cannot be utilised as a Primary Selling Style.</b>");
                } else {
                    log.info("primaryStyle already has a group, so add the current style");
                    var primaryParentClassID = primaryStyle.getParent().getParent().getID();
                    var parentClassID = node.getParent().getParent().getID();
                    var primaryStyleMktDesg = primaryStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                    var currentStyleMktDesg = node.getValue("a_Style_Market_Designation").getSimpleValue();
                    var currentStyleLcs = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                    var currentStyleNum = node.getValue("a_Style_Number").getSimpleValue();
                    var superPDPMkt = primaryStyleGroup.getValue("a_SuperPDP_Market").getSimpleValue();
                    var parentClassBrand = node.getParent().getParent().getValue("a_Brand_Number").getSimpleValue();
                    var primaryParentClass = primaryStyle.getParent().getParent().getValue("a_Brand_Number").getSimpleValue();

                    //if (primaryParentClassID == parentClassID || (parentClassBrand == 'GPS' && primaryParentClass == 'GPS')) {
                    if (context == "EN_US") {
                        if (primaryStyleMktDesg.contains("US") && currentStyleMktDesg != null && currentStyleMktDesg.contains("US") && superPDPMkt != null && superPDPMkt.contains("US")) {
                            if (currentStyleLcs == null || currentStyleLcs == "Draft" || currentStyleLcs == "Purged") {
                                pgLibrary.clearStyleData(node);
                            }
                            else {
                                //PPIM-14609
                                if (superPDPMkt.contains("CAN") && primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg.contains("CAN")) {
                                    var CanadaNode = canadaManager.getObjectFromOtherManager(node);
                                    var currentStyleLcs_CAN = CanadaNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

                                    if (currentStyleLcs_CAN != null && currentStyleLcs_CAN != "Draft" && currentStyleLcs_CAN != "Purged") {
                                        var CanadaDSG = pgLibrary.getDuplicateStyleGroup(CanadaNode, refType);
                                        if (CanadaDSG == null) {
                                            pgLibrary.createDSGStyleReference(context, step, node, "No", primaryStyleGroup, createProductGroups);
                                            pgLibrary.createDSGStyleReference("EN_CA", step, node, "No", primaryStyleGroup, createProductGroups);
                                            pgLibrary.addToMVGIfRequired(node, primaryStyle, context, MVGRefType, step);
                                            pgLibrary.addToMVGIfRequired(node, primaryStyle, "EN_CA", MVGRefType, step);
                                            
                                        } else {
                                            throw ("Style with Style number " + styleNum + " is part of another SimpleMergeGroup in CAN market.");
                                        }
                                    }
                                } else {
                                    pgLibrary.createDSGStyleReference(context, step, node, "No", primaryStyleGroup, createProductGroups);
                                    pgLibrary.addToMVGIfRequired(node, primaryStyle, context, MVGRefType, step);
                                }

                                /*if (superPDPMkt.contains("CAN") && primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg.contains("CAN")) {
                                    var CanadaNode = canadaManager.getObjectFromOtherManager(node);
                                    var currentStyleLcs_CAN = CanadaNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
    
                                    if (currentStyleLcs_CAN != null && currentStyleLcs_CAN != "Draft" && currentStyleLcs_CAN != "Purged") {
                                        var CanadaDSG = pgLibrary.getDuplicateStyleGroup(CanadaNode, refType);
                                        if (CanadaDSG == null) {
                                            pgLibrary.createDSGStyleReference("EN_CA", step, node, "No", primaryStyleGroup, createProductGroups);
                                        }
                                    }
                                }*/
                            }
                        }
                        else {
                            throw ("Unable to add Style " + styleNum + " to Style grouping, as the primary product doesn't follow market desgination rule.");
                        }
                    }
                    else if (context == "EN_CA") {
                        if (primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg != null && currentStyleMktDesg.contains("CAN") && superPDPMkt != null && superPDPMkt.contains("CAN")) {
                            if (currentStyleLcs == null || currentStyleLcs == "Draft" || currentStyleLcs == "Purged") {
                                pgLibrary.clearStyleData(node);
                            }
                            else {
                                var CanadaDSG = pgLibrary.getDuplicateStyleGroup(node, refType);
                                pgLibrary.createDSGStyleReference(context, step, node, "No", primaryStyleGroup, createProductGroups);
                                pgLibrary.addToMVGIfRequired(node, primaryStyle, context, MVGRefType, step);
                            }
                        }
                        else {
                            throw ("Unable to add Style " + styleNum + " to Style grouping, as the primary product doesn't follow market desgination rule.");
                        }
                    }
                    /*} else {
                        throw ("Unable to add Style " + styleNum + " to Style grouping, as the primary Product for this group belongs to a different parent class");
                    }*/
                }
            } else if (supportingStyleGroup != null) {
                // user modified the primaryStyle value in import. Do not allow user to change the primaryStyle
                var dsgPrimaryProductNum = supportingStyleGroup.getValue("a_Primary_Product").getSimpleValue();
                var dsgPrimaryStyleID = pgLibrary.getPrimaryStyleID(dsgPrimaryProductNum);
                var dsgPrimaryStyle = step.getProductHome().getProductByID(dsgPrimaryStyleID);
                var dsgPrimaryStyleNum = dsgPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                node.getValue("a_SuperPDP_Program_ID").setSimpleValue(dsgPrimaryStyleNum);
                throw ("<b style='color:red;'>Style with Style number '" + styleNum + "' is part of another SimpleMergeGroup.</b>");
            }
            else {
                var primaryParentClassID = primaryStyle.getParent().getParent().getID();
                var parentClassID = node.getParent().getParent().getID();
                var parentClassBrand = node.getParent().getParent().getValue("a_Brand_Number").getSimpleValue();
                var primaryParentClass = primaryStyle.getParent().getParent().getValue("a_Brand_Number").getSimpleValue();
                var primaryStyleMktDesg = primaryStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                var currentStyleMktDesg = node.getValue("a_Style_Market_Designation").getSimpleValue();
                var primaryStyleCAN = canadaManager.getObjectFromOtherManager(primaryStyle);
                var nodeCanada = canadaManager.getObjectFromOtherManager(node);
                var primaryStyleLcs = primaryStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                var currentStyleLcs = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                var primaryStyleLcs_CAN = primaryStyleCAN.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                var currentStyleLcs_CAN = nodeCanada.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

                //if (primaryParentClassID == parentClassID || (parentClassBrand == 'GPS' && primaryParentClass == 'GPS')) {
                if (context == "EN_US") {
                    if (primaryStyleMktDesg != null && primaryStyleMktDesg.contains("US") && currentStyleMktDesg != null && currentStyleMktDesg.contains("US")) {
                        if (primaryStyleLcs == null || primaryStyleLcs == "Draft" || primaryStyleLcs == "Purged") {
                            throw ("Primary Style provided is in Draft/Purged/Blank status in US market.");
                        }
                        else {
                            if (primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg.contains("CAN")) {
                                if (primaryStyleLcs_CAN == null || primaryStyleLcs_CAN == "Draft" || primaryStyleLcs_CAN == "Purged") {
                                    log.info("Primary Style provided is in Draft/Purged/Blank status in CAN market.");
                                }
                                else {
                                    var CanadaDSG = pgLibrary.getDuplicateStyleGroup(primaryStyleCAN, refType);
                                    if (CanadaDSG == null) {
                                        //create new duplicate style group with the node as a supporting style
                                        var group = pgLibrary.createGroup(primaryStyle, marketSPDP, context, step);
                                        pgLibrary.createDSGStyleReference(context, step, primaryStyle, "Yes", group, createProductGroups);
                                        group.getValue("a_SuperPDP_Market").addValue("US");
                                        group.getValue("a_SuperPDP_Market").addValue("CAN");
                                        var newProductGroupCAN = canadaManager.getObjectFromOtherManager(group);
                                        newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("US");
                                        newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                                        pgLibrary.createDSGStyleReference("EN_CA", step, primaryStyle, "Yes", group, createProductGroups);

                                        if (currentStyleLcs == null || currentStyleLcs == "Draft" || currentStyleLcs == "Purged") {
                                            pgLibrary.clearStyleData(node);
                                        }
                                        else {
                                            if (currentStyleLcs_CAN != null && currentStyleLcs_CAN != "Draft" && currentStyleLcs_CAN != "Purged") {
                                                var currentStyleGroupCAN = pgLibrary.getDuplicateStyleGroup(nodeCanada, refType);
                                                if (currentStyleGroupCAN == null) {
                                                    pgLibrary.createDSGStyleReference(context, step, node, "No", group, createProductGroups);
                                                    pgLibrary.createDSGStyleReference("EN_CA", step, node, "No", group, createProductGroups);
                                                } else {
                                                    throw ("Style with Style number " + styleNum + " is part of another SimpleMergeGroup in CAN market.");
                                                }
                                            }
                                        }
                                    } else {
                                        var primaryStyleNum = primaryStyle.getValue("a_Style_Number").getSimpleValue();
                                        throw ("Primary style " + primaryStyleNum + " is part of another SimpleMergeGroup in CAN market.");
                                    }
                                }
                            } else {
                                var group = pgLibrary.createGroup(primaryStyle, marketSPDP, context, step);
                                pgLibrary.createDSGStyleReference(context, step, primaryStyle, "Yes", group, createProductGroups);
                                group.getValue("a_SuperPDP_Market").addValue("US");

                                if (currentStyleLcs == null || currentStyleLcs == "Draft" || currentStyleLcs == "Purged") {
                                    pgLibrary.clearStyleData(node);
                                } else {
                                    pgLibrary.createDSGStyleReference(context, step, node, "No", group, createProductGroups);
                                }
                            }
                            
                            /*//create new duplicate style group with the node as a supporting style
                            var group = pgLibrary.createGroup(primaryStyle, marketSPDP, context, step);
                            pgLibrary.createDSGStyleReference(context, step, primaryStyle, "Yes", group, createProductGroups);
                            group.getValue("a_SuperPDP_Market").addValue("US");
                            if (currentStyleLcs == null || currentStyleLcs == "Draft" || currentStyleLcs == "Purged") {
                                pgLibrary.clearStyleData(node);
                            }
                            else {
                                pgLibrary.createDSGStyleReference(context, step, node, "No", group, createProductGroups);
                            }

                            if (primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg.contains("CAN")) {
                                if (primaryStyleLcs_CAN == null || primaryStyleLcs_CAN == "Draft" || primaryStyleLcs_CAN == "Purged") {
                                    log.info("Primary Style provided is in Draft/Purged/Blank status in CAN market.");
                                }
                                else {
                                    var CanadaDSG = pgLibrary.getDuplicateStyleGroup(nodeCanada, refType);
                                    if (CanadaDSG == null) {
                                        var newProductGroupCAN = canadaManager.getObjectFromOtherManager(group);
                                        group.getValue("a_SuperPDP_Market").addValue("CAN");
                                        newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("US");
                                        newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                                        pgLibrary.createDSGStyleReference("EN_CA", step, primaryStyle, "Yes", group, createProductGroups);

                                        if (currentStyleLcs_CAN != null && currentStyleLcs_CAN != "Draft" && currentStyleLcs_CAN != "Purged") {
                                            pgLibrary.createDSGStyleReference("EN_CA", step, node, "No", group, createProductGroups);
                                        }
                                    }
                                }
                            }*/
                        }
                    }
                    else {
                        throw ("Unable to create Style grouping, as the Primary Style and Supporting Style doesn't follow market desgination rule.")
                    }
                }
                else if (context == "EN_CA") {
                    if (primaryStyleMktDesg != null && primaryStyleMktDesg.contains("CAN") && currentStyleMktDesg != null && currentStyleMktDesg.contains("CAN")) {
                        if (primaryStyleLcs == null || primaryStyleLcs == "Draft" || primaryStyleLcs == "Purged") {
                            throw ("Primary Style provided is in Draft/Purged/Blank status in CAN market");
                        }
                        else {
                            var newProductGroup = pgLibrary.createGroup(node, marketSPDP, context, step);
                            pgLibrary.createDSGStyleReference(context, step, primaryStyle, 'Yes', newProductGroup, createProductGroups);
                            newProductGroup.getValue("a_SuperPDP_Market").addValue("CAN");

                            if (currentStyleLcs == null || currentStyleLcs == "Draft" || currentStyleLcs == "Purged") {
                                pgLibrary.clearStyleData(node);
                            }
                            else {
                                pgLibrary.createDSGStyleReference(context, step, node, "No", newProductGroup, createProductGroups);
                            }
                        }
                    }
                    else {
                        throw ("Unable to create Style grouping, as the Primary Style and Supporting Style doesn't follow market desgination rule.")
                    }
                }
                /*} else {
                    // do not create group, since the primaryStyle is classified under a different parent class
                    throw ("Unable to create Style grouping, as the Primary Style and Supporting Style belong to a different Parent Class.");
                }*/
            }
        } else {
            throw ("Could not find a Style using the Primary Style Number provided during import: " + primaryStyleNumImp);
        }
    }
}

}