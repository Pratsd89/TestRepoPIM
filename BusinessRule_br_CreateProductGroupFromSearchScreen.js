/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CreateProductGroupFromSearchScreen",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Create Product Group from Search Style Screen",
  "description" : "Create Product Group button in Search Style screen &  Create Product Groups from a list of selected Styles.",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
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
    "alias" : "productGroupReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "primaryProductNumber",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Style_Number</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "productGroupStartDate",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Product_Grouping_Start_date</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "productGroupEndDate",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Product_Grouping_End_Date</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,webui,LKT,productGroupReference,primaryProductNumber,productGroupStartDate,productGroupEndDate,pgLibrary) {
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
var primaryProductEstablished = false;
var selection = webui.getSelection();
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
    if (isAllAreStyles ) {
        var underSameClass = new java.util.HashSet(styleParent);
        if ((underSameClass.size() == 1 && brand!='GPS' ) || brand == 'GPS') {
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
                    webui.showAlert("ERROR", "Product Group End Date is earlier than the default Product Group Start Date, which is today.");
                }
                else if (startDate > endDate) {
                    webui.showAlert("ERROR", "Product Group Start Date is later than Product Group End Date..");
                }
                else {
                    var productGroupingDivisionObj = manager.getNodeHome().getObjectByKey("PG_Division_Key", productGroupingDivisionID);
                    if (productGroupingDivisionObj != null) {
                        var brandNumber = productGroupingDivisionObj.getValue("a_Brand_Number").getSimpleValue();
                        var newProductGroupID = brandNumber + '-' + 'PG' + '-' + pgLibrary.generateSequenceNumber();
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
                                        webui.showAlert("ERROR", "Primary Style provided is in Draft/Purged status in US market.");
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
                                        webui.showAlert("ERROR", "Primary Style provided is in Draft/Purged status in US market.");
                                    }
                                    else {
                                        createGroupRefsMain(newProductGroup, primaryStyleGiven);
                                        newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
                                        finalPrimaryStyle = primaryStyleGiven;
                                    }
                                }
                                else if (primaryStyleMktDesg.contains("CAN")) {
                                    webui.showAlert("ERROR", "Primary Style is not valid in US market.");
                                }
                            }
                            else {
                                var chosenPrimaryStyle = findPrimaryStyle(selection, "EN_US");
                                if (chosenPrimaryStyle == "Draft") {
                                    webui.showAlert("WARNING", "All selected styles are currently in Draft/Purged status.");
                                }
                                else {
                                    createGroupRefsMain(newProductGroup, chosenPrimaryStyle);
                                    newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
                                    var chosenPrimaryStyleMktDsg = chosenPrimaryStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                                    if (chosenPrimaryStyleMktDsg.contains("CAN")) {
                                        var chosenPrimaryStyle_CAN = canadaManager.getObjectFromOtherManager(chosenPrimaryStyle);
                                        var chosenPrimaryStyleLcs_CAN = chosenPrimaryStyle_CAN.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                                        if (chosenPrimaryStyleLcs_CAN != "Draft" && chosenPrimaryStyleLcs_CAN != "Purged") {
                                            createGroupRefsMain(newProductGroupCAN, chosenPrimaryStyle_CAN);
                                            newProductGroup.getValue("a_SuperPDP_Market").addValue("CAN");
                                            newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("US");
                                            newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                                        }
                                    }
                                    finalPrimaryStyle = chosenPrimaryStyle;
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
                                        logger.warning("styleMarkets="+styleMarkets);
                                        logger.warning("primaryStyleMktDesg="+primaryStyleMktDesg);
                                        logger.warning("superPDPMkt="+superPDPMkt);
                                        if(styleMarkets != null){
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
                                    webui.showAlert("ERROR", "Primary Style is not valid in CAN market.");
                                }
                            }
                            else {
                                var chosenPrimaryStyle = findPrimaryStyle(selection, "EN_CA");
                                if (chosenPrimaryStyle == "Draft") {
                                    webui.showAlert("WARNING", "All selected styles are currently in Draft/Purged status.");
                                }
                                else {
                                    createGroupRefsMain(newProductGroup, chosenPrimaryStyle);
                                    newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                                    finalPrimaryStyle = chosenPrimaryStyle;
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
                                        if(styleMarkets != null) {
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
                        pgLibrary.publishStyles(newProductGroup, productGroupReference, manager);
                        pgLibrary.publishStyles(newProductGroupCAN, productGroupReference, manager);
                    } else {
                        webui.showAlert("ERROR", "Unable to locate the Division Object " + productGroupingDivisionID);
                    }
                }
            } else {
                webui.showAlert("ERROR", "One or more selected styles already have a reference to a Product Group.");
            }
        } else {
            webui.showAlert("ERROR", "All selected Styles must be under same parent Class.");
        }
    } else {
        webui.showAlert("ERROR", "All selected objects must be Style.");
    }
} else {
    webui.showAlert("ERROR", "Please select at least two styles.");
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


function findPrimaryStyle(styleList, context) {
    var targetArray = [];
    for (var i = 0; i < styleList.size(); i++) {
        var currStyle = styleList.get(i);
        var styleMktDesg = currStyle.getValue("a_Style_Market_Designation").getSimpleValue();
        var stylelcs = null;

        if (context == "EN_US") {
            if (styleMktDesg.contains("US") && styleMktDesg.contains("CAN")) {
                stylelcs = currStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                var currStyle_CAN = canadaManager.getObjectFromOtherManager(currStyle);
                var stylelcs_CAN = currStyle_CAN.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (stylelcs != null && stylelcs != "Draft" && stylelcs != "Purged" && stylelcs_CAN != null && stylelcs_CAN != "Draft" && stylelcs_CAN != "Purged") {
                    return currStyle;
                }
            }
            if (styleMktDesg.contains("US")) {
                stylelcs = currStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (stylelcs != null && stylelcs != "Draft" && stylelcs != "Purged") {
                    targetArray.push(currStyle);
                }
            }
        }
        else if (context == "EN_CA") {
            if (styleMktDesg.contains("CAN")) {
                stylelcs = currStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (stylelcs != null && stylelcs != "Draft" && stylelcs != "Purged") {
                    return currStyle;
                }
            }
        }
    }
    if (targetArray.length == 0) {
        return "Draft";
    }
    return targetArray[0];
}

}