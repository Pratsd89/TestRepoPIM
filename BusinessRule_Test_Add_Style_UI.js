/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Add_Style_UI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Test_Business_Rules" ],
  "name" : "TEST Product Group Add Style Action",
  "description" : "PPIM-10698",
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group" ],
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "createProductGroups",
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
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "styles",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_SuperPDP_Style</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,createProductGroups,LKT,styles,webUI,logger) {
function utilityMethod(styleList, index, primaryStyleID) {
    logger.info("Primary Style ID " + primaryStyleID);
    var parentClass = primaryStyleID.getParent().getParent();
    for (var i = index; i < styleList.length; i++) {
        var currentStyleID = null;
        if (styleList[i].length == 6) {
            currentStyleID = "000" + styleList[i];
        } else if (styleList[i].length == 7) {
            currentStyleID = "00" + styleList[i];
        }
        var currentStyle = step.getProductHome().getProductByID(currentStyleID);
        if (currentStyle == null) {
            logArray1.push(styleList[i]);
        } else {
            var canadaCurrentStyle = canadaManager.getObjectFromOtherManager(currentStyle);
            var CanadaDSG = getDuplicateStyleGroup(canadaCurrentStyle, refType);
            var currentStyleClass = currentStyle.getParent().getParent();
            if (parentClass.getID() == currentStyleClass.getID()) {
                var flag = false;
                var refByDSG = currentStyle.getReferencedBy().toArray();
                for (var j = 0; j < refByDSG.length; j++) {
                    if (refByDSG[j].getReferenceType().getID() == "rt_ProductGroups") {
                        flag = true;
                    }
                }
                if (flag) {
                    logArray2.push(currentStyle.getValue("a_Style_Number").getSimpleValue());
                } else {
                    // Creating Reference in Canada Market when Styles have been added to US Market - PIM-11365
                    if (context == "EN_US") {
                        if (currentStyle.getValue("a_Style_Market_Designation").getSimpleValue().contains("US")) {
                            if (currentStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Draft' && currentStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Purged') {
                                createDSGStyleReference("EN_US", step, currentStyle, 'No');
                            }
                        }

                        if (CanadaDSG == null && superPDPMarket.contains("CAN") && currentStyle.getValue("a_Style_Market_Designation").getSimpleValue().contains("CAN")) {
                            if (canadaCurrentStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Draft' && canadaCurrentStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Purged') {
                                createDSGStyleReference("EN_CA", step, currentStyle, 'No');
                            }
                        }
                    } else {
                        createDSGStyleReference(context, step, currentStyle, primaryStyleID);
                    }
                }
            } else {
                logArray.push(styleList[i]);
            }
        }
    }
    publishStyles();
    if (logArray1.length > 0) {
        webUI.showAlert("ERROR", "Mentioned style numbers are either invalid or Styles are not available in Stibo. Please check and try again. ", logArray1.toString());
    } else if (logArray.length > 0) {
        webUI.showAlert("ERROR", "These Style(s) doesn't belong to same Class as Primary Selling Style: ", logArray.toString());
    } else if (logArray2.length > 0) {
        webUI.showAlert("ERROR", "These Style(s) are already a part of Product Groups: ", logArray2.toString());
    }
}

function getDuplicateStyleGroup(style, refType) {
    var duplicateStyleGroup = null;
    var refByDSG = style.getReferencedBy().toArray();
    for (var i = 0; i < refByDSG.length; i++) {
        if (refByDSG[i].getReferenceType().getID() == "rt_ProductGroups") {
            duplicateStyleGroup = refByDSG[i].getSource();
        }
    }
    return duplicateStyleGroup;
}

function createDSGStyleReference(contextid, step, currentStyle, primarySellingStyle) {
    var contextCurrentStyle = step.executeInContext(contextid, function (cmmanager) {
        return cmmanager.getObjectFromOtherManager(currentStyle);
    });

    var contextNode = step.executeInContext(contextid, function (cmmanager) {
        return cmmanager.getObjectFromOtherManager(node);
    });
    var sellingStyleID = contextNode.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
    if (sellingStyleID == null) {
        primarySellingStyle = 'Yes';
    }
    var reference = contextNode.createReference(contextCurrentStyle, createProductGroups);
    log.info("executing the add style " + reference);
    log.info(contextNode);
    if (primarySellingStyle == 'Yes') {
        reference.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
        contextNode.getValue("a_Primary_Selling_Style_ID").setSimpleValue(contextCurrentStyle.getID());
        contextNode.setName(contextCurrentStyle.getName());
        contextNode.getValue("a_Product_Group_Name").setSimpleValue(contextCurrentStyle.getName());
        if (contextNode.getValue("a_Product_Grouping_Start_date").getSimpleValue() == null || contextNode.getValue("a_Product_Grouping_Start_date").getSimpleValue() == '') {
            contextNode.getValue("a_Product_Grouping_Start_date").setSimpleValue(pgDateForamtter.format(time));
        }
        if (contextNode.getValue("a_Product_Grouping_End_Date").getSimpleValue() == null || contextNode.getValue("a_Product_Grouping_End_Date").getSimpleValue() == '') {
            contextNode.getValue("a_Product_Grouping_End_Date").setSimpleValue("2400-01-01");
        }
    } else {
        reference.getValue("a_Primary_Selling_Style").setSimpleValue("No");
    }
    currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    //setting startdate,enddate,primarystyleID on added style
    contextCurrentStyle.getValue("a_Product_Grouping_Start_date").setSimpleValue(contextNode.getValue("a_Product_Grouping_Start_date").getSimpleValue());
    contextCurrentStyle.getValue("a_Product_Grouping_End_Date").setSimpleValue(contextNode.getValue("a_Product_Grouping_End_Date").getSimpleValue());
    var primaryStyleNum = contextNode.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
    var primaryStyleObj = step.getProductHome().getProductByID(primaryStyleNum);
    if (primaryStyleObj != null) {
        contextCurrentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleObj.getValue("a_Style_Number").getSimpleValue());
    }
}

function publishStyles() {
    var publishStyles = node.getReferences(createProductGroups).toArray();
    var groupStartDate = node.getValue("a_Product_Grouping_Start_date").getSimpleValue();
    var groupEndDate = node.getValue("a_Product_Grouping_End_Date").getSimpleValue();
    var primaryStyleNumber = '';
    var groupPrimaryStyleID = node.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
    var groupPrimaryStyleObject = step.getProductHome().getProductByID(groupPrimaryStyleID);
    if (groupPrimaryStyleObject != null) {
        primaryStyleNumber = groupPrimaryStyleObject.getValue("a_Style_Number").getSimpleValue();
    }
    for (var i = 0; i < publishStyles.length; i++) {
        var currentStyle = publishStyles[i].getTarget();
        currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    }
}




var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var pgDateForamtter = new java.text.SimpleDateFormat("yyyy-MM-dd");
var logArray = new Array();
var logArray1 = new Array();
var logArray2 = new Array();
var context = step.getCurrentContext().getID();
var refType = step.getReferenceTypeHome().getReferenceTypeByID("rt_ProductGroups");
var superPDPMarket = node.getValue("a_SuperPDP_Market").getSimpleValue();

if (context == "EN_CA" && superPDPMarket != null && superPDPMarket.contains("US")) {
    webUI.showAlert("ERROR", "Please proceed to US market and then add the styles from US market only.");
} else if (superPDPMarket == null || superPDPMarket == '') {
    webUI.showAlert("WARNING", "<b>ALERT: " + "This is not a Valid Operation" + "</b>");
} else {
    step.executeInContext("EN_CA", function (contextManager) {
        canadaManager = contextManager;
    });
    if (styles == null) {
        webUI.showAlert("Error", "Please provide atleast one Style Number and try again.");
    } else {
        var styleList = [];
        styleList = styles.split(",");
        var reftType = step.getReferenceTypeHome().getReferenceTypeByID("rt_ProductGroups");
        var refList = node.getReferences(reftType);
        if (refList.size() >= 1) {
            var primaryStyle = null;
            step.executeInContext(context, function (ctxmanager) {
                for (var i = 0; i < refList.size(); i++) {
                    var ref = refList.get(i);
                    var flag = ref.getValue("a_Primary_Selling_Style").getSimpleValue();
                    log.info("Primary Selling Style is found" + flag);
                    if (flag == 'Yes') {
                        log.info("Primary Selling Style is found");
                        primaryStyle = ref.getTarget();
                        break;
                    }
                }
            });
            utilityMethod(styleList, 0, primaryStyle);
        }
        else {
            var styleList = [];
            styleList = styles.split(",");
            var primaryStyle = null;
            if (styleList[0].length == 6) {
                primaryStyle = "000" + styleList[0];
            } else if (styleList[0].length == 7) {
                primaryStyle = "00" + styleList[0];
            }
            var styleAtZeroIndex = step.getProductHome().getProductByID(primaryStyle);
            try {
                if (context == "EN_US") {
                    var markets = styleAtZeroIndex.getValue("a_Style_Market_Designation").getSimpleValue();
                    if (markets.contains("US") && (styleAtZeroIndex.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Draft' && styleAtZeroIndex.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Purged')) {
                        var primaryRef = node.createReference(styleAtZeroIndex, refType);
                        primaryRef.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                        node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(styleAtZeroIndex.getID());
                        node.setName(styleAtZeroIndex.getName());
                        node.getValue("a_Product_Group_Name").setSimpleValue(styleAtZeroIndex.getName());
                        if (node.getValue("a_Product_Grouping_Start_date").getSimpleValue() == null || node.getValue("a_Product_Grouping_Start_date").getSimpleValue() == '') {
                            node.getValue("a_Product_Grouping_Start_date").setSimpleValue(pgDateForamtter.format(time));
                        }
                        if (node.getValue("a_Product_Grouping_End_Date").getSimpleValue() == null || node.getValue("a_Product_Grouping_End_Date").getSimpleValue() == '') {
                            node.getValue("a_Product_Grouping_End_Date").setSimpleValue("2400-01-01");
                        }
                    }
                    if (markets.contains("CAN") && (styleAtZeroIndex.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Draft' && styleAtZeroIndex.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Purged')) {
                        createDSGStyleReference("EN_CA", step, styleAtZeroIndex, 'Yes');
                    }
                }
                if (context == "EN_CA") {
                    var CANMarkets = styleAtZeroIndex.getValue("a_Style_Market_Designation").getSimpleValue();
                    if (CANMarkets.contains("CAN") && (styleAtZeroIndex.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Draft' && styleAtZeroIndex.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != 'Purged')) {
                        createDSGStyleReference("EN_CA", step, styleAtZeroIndex, 'Yes');
                    }
                }
            } catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) { }
            }
            utilityMethod(styleList, 1, styleAtZeroIndex)
        }
    }
}
}