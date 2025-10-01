/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MergedStyleRef",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_MergedStyleRef",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "productGroupReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,productGroupReference,LKT,webui,pgLibrary) {
var productGroupStartDate = "2025-01-01";
var productGroupEndDate = "2025-01-02";
var FindPrimaryStyl = findPrimaryStyl(node);
var set2 = new java.util.ArrayList();

if (FindPrimaryStyl) {
    set2.add(node);
    var mergedStylesRef = manager.getReferenceTypeHome().getReferenceTypeByID("MergedStylesRef");
    node.queryReferences(mergedStylesRef).forEach(function (referenceInstance) {
        var refStyle = referenceInstance.getTarget();
        set2.add(refStyle);
        return true;

    });
    createProductGroup(set2, FindPrimaryStyl, productGroupStartDate, productGroupEndDate);
}

function findPrimaryStyl(node) {
    var nodeID = node.getID();
    var primaryProductNumber = "" + nodeID.substring(3);
    var style = node.getChildren();
    for (var i = 0; i < style.size(); i++) {
        var CC = style.get(i);
        var CCChild = CC.getChildren();
        for (var j = 0; j < CCChild.size(); j++) {
            var SKU = CCChild.get(j);
            var SKUVariant = SKU.getValue("a_SKU_Variant").getSimpleValue();
            if (SKUVariant == "Regular") {
                return primaryProductNumber;
            }
        }
    }
    return false;
}

function createProductGroup(selection, primaryProductNumber, productGroupStartDate, productGroupEndDate) {
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    var primaryProductEstablished = false;
    //var selection = webui.getSelection();
    var selectionCount = selection.size();
    var isAllAreStyles = true;
    var styleParent = [];
    var supportingStyle = [];
    var primaryStylePresent = false;
    var primaryStyleDivisionID = "";
    var primaryStyleID = "";
    var primaryStyleName = "";
    var primaryStyleNumber = "";
    var primaryStyleBrandNumber = "";
    var primaryStyleDeptDesc = "";
    var primaryStyleClassDesc = "";
    var primaryStyleSubClasDesc = "";
    var primaryStyleMKTDesg = "";
    var primaryProductNumberProvided = true;
    var context = manager.getCurrentContext().getID();
    var alreadyReferenced = false;
    var alreadyReferencedCAN = false;
    var productGroupingDivisionID = null;
    var time = new java.util.Date();
    var pgDateForamtter = new java.text.SimpleDateFormat("yyyy-MM-dd");
    var brandNumber = null;
    var market = LKT.getLookupTableValue("LKT_Context_to_Market", context);
    var canadaManager = "";
    manager.executeInContext("EN_CA", function (contextManager) {
        canadaManager = contextManager;
    });
    if (primaryProductNumber == null || primaryProductNumber == '') {
        primaryProductNumberProvided = false;
    }
    if (selectionCount >= 1) {
        for (var i = 0; i < selectionCount; i++) {
            var selectedNode = selection.get(i);
            if (selectedNode.getObjectType().getID() != "Style") {
                isAllAreStyles = false;
                break;
            } else if (selectedNode.getObjectType().getID() == "Style") {
                var classObj = selectedNode.getParent().getParent();
                var brand = classObj.getValue("a_Brand_Number").getSimpleValue();
                styleParent.push(classObj.getID());
                if (productGroupingDivisionID == null) {
                    productGroupingDivisionID = classObj.getParent().getParent().getID();
                }
                if (brandNumber == null) {
                    brandNumber = classObj.getValue("a_Brand_Number").getSimpleValue();
                }
                if (pgLibrary.checkReferencedBy(selectedNode) == true) {
                    alreadyReferenced = true;
                    break;
                }
                //check for CAN references for US Styles
                var selectedCANNode = canadaManager.getObjectFromOtherManager(selectedNode);
                if (context == "EN_US" && pgLibrary.checkReferencedBy(selectedCANNode) == true) {
                    alreadyReferencedCAN = true;
                }
            }
        }
        if (isAllAreStyles) {
            //var underSameClass = new java.util.HashSet(styleParent);
            //if ((underSameClass.size() == 1 && brand != 'GPS') || brand == 'GPS') {
                if (alreadyReferenced == false && alreadyReferencedCAN == false) {
                    var Dateformatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    var startDate = null;
                    var endDate = null;
                    if (productGroupStartDate != null) {
                        startDate = java.time.LocalDate.parse(productGroupStartDate, Dateformatter);
                    }
                    if (productGroupEndDate != null) {
                        endDate = java.time.LocalDate.parse(productGroupEndDate, Dateformatter);
                    }

                    if (startDate == null && endDate != null && endDate < pgDateForamtter.format(time)) {
                        log.info("Product Group End Date is earlier than the default Product Group Start Date, which is today.");
                    }
                    else if (startDate > endDate) {
                        log.info("Product Group Start Date is later than Product Group End Date..");
                    }
                    else {
                        var productGroupingDivisionObj = manager.getNodeHome().getObjectByKey("PG_Division_Key", productGroupingDivisionID);
                        if (productGroupingDivisionObj != null) {
                            var brandNumber = productGroupingDivisionObj.getValue("a_Brand_Number").getSimpleValue();
                            var newProductGroupID = brandNumber + '-' + 'PG' + '-' + pgLibrary.generateSequenceNumber(manager);
                            var newProductGroup = productGroupingDivisionObj.createProduct(newProductGroupID, "Product_Group");
                            newProductGroup.setName(newProductGroupID);
                            newProductGroup.getValue("a_Brand_Number").setSimpleValue(brandNumber);
                            var newProductGroupCAN = canadaManager.getObjectFromOtherManager(newProductGroup);

                            if (context == "EN_US") {
                                var finalPrimaryStyle = null;
                                if (primaryProductNumberProvided) {
                                    var primaryStyleID = null;
                                    if (primaryProductNumber.length == 6) {
                                        primaryStyleID = "000" + primaryProductNumber;
                                    } else if (primaryProductNumber.length == 7) {
                                        primaryStyleID = "00" + primaryProductNumber;
                                    }
                                    if (primaryStyleID.length > 9) {
                                        primaryStyleID = primaryStyleID.slice(-9);
                                    }

                                    var primaryStyleGiven = manager.getProductHome().getProductByID(primaryStyleID);
                                    var primaryStyleMktDesg = primaryStyleGiven.getValue("a_Style_Market_Designation").getSimpleValue();
                                    var primaryStyleLcs = primaryStyleGiven.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                    if (primaryStyleMktDesg.contains("US") && primaryStyleMktDesg.contains("CAN")) {

                                        var primaryStyleGiven_CAN = canadaManager.getObjectFromOtherManager(primaryStyleGiven);
                                        var primaryStyleLcs_CAN = primaryStyleGiven_CAN.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                        if (primaryStyleLcs == "Draft" || primaryStyleLcs == "Purged") {
                                            log.info("Primary Style provided is in Draft/Purged status in US market.");
                                        }
                                        else {
                                            createGroupRefsMain(newProductGroup, primaryStyleGiven);
                                            newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
                                            if (primaryStyleLcs_CAN != "Draft" && primaryStyleLcs_CAN != "Purged") {
                                                createGroupRefsMain(newProductGroupCAN, primaryStyleGiven_CAN);
                                                newProductGroup.getValue("a_SuperPDP_Market").addValue("CAN");
                                                newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("US");
                                                newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                                            }
                                            finalPrimaryStyle = primaryStyleGiven;
                                        }
                                    }

                                    else if (primaryStyleMktDesg == "US") {
                                        if (primaryStyleLcs == "Draft" || primaryStyleLcs == "Purged") {
                                            log.info("Primary Style provided is in Draft/Purged status in US market.");
                                        }
                                        else {
                                            createGroupRefsMain(newProductGroup, primaryStyleGiven);
                                            newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
                                            finalPrimaryStyle = primaryStyleGiven;
                                        }
                                    }
                                    else if (primaryStyleMktDesg.contains("CAN")) {
                                        log.info("Primary Style is not valid in US market.");
                                    }
                                }

                                if (finalPrimaryStyle) {
                                    var primaryStyleMktDesg = finalPrimaryStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                                    var finalPrimaryStyleNum = finalPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                                    var superPDPMkt = newProductGroup.getValue("a_SuperPDP_Market").getSimpleValue();
                                    for (var j = 0; j < selectionCount; j++) {
                                        var selStyle = selection.get(j);
                                        var selStyleNum = selStyle.getValue("a_Style_Number").getSimpleValue();
                                        if (selStyleNum != finalPrimaryStyleNum) {
                                            var styleMarkets = selStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                                            var stylelcs = selStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                            
                                            if (styleMarkets != null) {
                                                if (styleMarkets.contains("US") && primaryStyleMktDesg.contains("US") && superPDPMkt.contains("US")) {
                                                    if (stylelcs != "Draft" && stylelcs != "Purged") {
                                                        ref = newProductGroup.createReference(selStyle, "rt_ProductGroups");
                                                        ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                                                        pgLibrary.setStyleDatesFromGroupDate(newProductGroup, productGroupReference, manager);
                                                    }
                                                }

                                                if (styleMarkets.contains("CAN") && primaryStyleMktDesg.contains("CAN") && superPDPMkt.contains("CAN")) {
                                                    var selStyleCAN = canadaManager.getObjectFromOtherManager(selStyle);
                                                    var stylelcs_CAN = selStyleCAN.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                                    if (stylelcs_CAN != "Draft" && stylelcs_CAN != "Purged") {
                                                        refCAN = newProductGroupCAN.createReference(selStyleCAN, "rt_ProductGroups");
                                                        refCAN.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                                                        pgLibrary.setStyleDatesFromGroupDate(newProductGroupCAN, productGroupReference, manager);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else if (context == "EN_CA") {
                                var finalPrimaryStyle = null;
                                if (primaryProductNumberProvided) {
                                    var primaryStyleID = null;
                                    if (primaryProductNumber.length == 6) {
                                        primaryStyleID = "000" + primaryProductNumber;
                                    } else if (primaryProductNumber.length == 7) {
                                        primaryStyleID = "00" + primaryProductNumber;
                                    }
                                    if (primaryStyleID.length > 9) {
                                        primaryStyleID = primaryStyleID.slice(-9);
                                    }

                                    var primaryStyleGiven = manager.getProductHome().getProductByID(primaryStyleID);
                                    var primaryStyleMktDesg = primaryStyleGiven.getValue("a_Style_Market_Designation").getSimpleValue();
                                    if (primaryStyleMktDesg.contains("CAN")) {
                                        var primaryStyleLcs = primaryStyleGiven.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                        if (primaryStyleLcs == "Draft" || primaryStyleLcs == "Purged") {
                                            webui.showAlert("ERROR", "Primary Style provided is in Draft/Purged status in CAN market.");
                                        }
                                        else {
                                            createGroupRefsMain(newProductGroup, primaryStyleGiven);
                                            newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                                            finalPrimaryStyle = primaryStyleGiven;
                                        }
                                    }
                                    else {
                                        log.info("Primary Style is not valid in CAN market.");
                                    }
                                }

                                if (finalPrimaryStyle) {
                                    var primaryStyleMktDesg = finalPrimaryStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                                    var finalPrimaryStyleNum = finalPrimaryStyle.getValue("a_Style_Number").getSimpleValue();
                                    var superPDPMkt = newProductGroup.getValue("a_SuperPDP_Market").getSimpleValue();
                                    for (var j = 0; j < selectionCount; j++) {
                                        var selStyle = selection.get(j);
                                        var selStyleNum = selStyle.getValue("a_Style_Number").getSimpleValue();
                                        if (selStyleNum != finalPrimaryStyleNum) {
                                            var styleMarkets = selStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                                            var stylelcs = selStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                            if (styleMarkets != null) {
                                                if (styleMarkets.contains("CAN") && primaryStyleMktDesg.contains("CAN") && superPDPMkt.contains("CAN")) {
                                                    var stylelcs = selStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                                    if (stylelcs != "Draft" && stylelcs != "Purged") {
                                                        ref = newProductGroup.createReference(selStyle, "rt_ProductGroups");
                                                        ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                                                        pgLibrary.setStyleDatesFromGroupDate(newProductGroup, productGroupReference, manager);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //pgLibrary.publishStyles(newProductGroup, productGroupReference, manager);
                            //pgLibrary.publishStyles(newProductGroupCAN, productGroupReference, manager);
                        } else {
                            log.info("Unable to locate the Division Object " + productGroupingDivisionID);
                        }
                    }
                } else {
                    log.info("One or more selected styles already have a reference to a Product Group.");
                }
            /*} else {
                log.info("All selected Styles must be under same parent Class.");
            }*/
        } else {
            log.info("All selected objects must be Style.");
        }
    } else {
        log.info("Please select at least two styles.");
    }

}

function setProductGroupStartEndDate(varGroup) {
    if (productGroupStartDate == null || productGroupStartDate == '') {
        varGroup.getValue("a_Product_Grouping_Start_date").setSimpleValue(pgDateForamtter.format(time));
    } else {
        varGroup.getValue("a_Product_Grouping_Start_date").setSimpleValue(productGroupStartDate);
    }
    if (productGroupEndDate == null || productGroupEndDate == '') {
        varGroup.getValue("a_Product_Grouping_End_Date").setSimpleValue("2400-01-01");
    } else {
        varGroup.getValue("a_Product_Grouping_End_Date").setSimpleValue(productGroupEndDate);
    }
    varGroup.getValue("a_Start_Time").setSimpleValue("12:00 AM");
    varGroup.getValue("a_Origin_Merge_Type").setSimpleValue("SIZE_VARIANT");
    pgLibrary.setStyleDatesFromGroupDate(varGroup, productGroupReference, manager);
}

function setGroupData(newGroup, selStyle) {
    newGroup.getValue("a_Primary_Selling_Style_ID").setSimpleValue(selStyle.getID());
    newGroup.getValue("a_Product_Group_Name").setSimpleValue(selStyle.getName());
    newGroup.setName(selStyle.getName());
    newGroup.getValue("a_Department_Description").setSimpleValue(selStyle.getParent().getParent().getParent().getName());
    newGroup.getValue("a_Class_Description").setSimpleValue(selStyle.getParent().getParent().getName());
    newGroup.getValue("a_SubClass_Description").setSimpleValue(selStyle.getParent().getName());
    setProductGroupStartEndDate(newGroup, selStyle);
}

function createGroupRefsMain(newProductGroup, selStyle) {
    var styleNumber = selStyle.getValue("a_Style_Number").getSimpleValue();
    ref = newProductGroup.createReference(selStyle, "rt_ProductGroups");
    ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
    selStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(styleNumber);
    setGroupData(newProductGroup, selStyle);
    primaryProductEstablished = true;
}
}