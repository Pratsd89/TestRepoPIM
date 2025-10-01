/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_createDuplicateStyleGroups",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create DuplicateStyleGroups",
  "description" : "Merge Duplicate Styles button in Search Style screen &  Create DuplicateStyleGroups from a list of selected Styles.",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "primarySellingStyleNumber",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Style_Number</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
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
exports.operation0 = function (manager,webui,primarySellingStyleNumber,LKT) {
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

function checkReferencedBy(node) {
    var isReferenced = false;
    var refBy = node.getReferencedBy().toArray();
    for (var i = 0; i < refBy.length; i++) {
        if (refBy[i].getReferenceType().getID() == "rt_mergeDuplicateStyles") {
            isReferenced = true;
        }
    }
    return isReferenced;
}

var primaryStylePresent = false;
var primaryStyleDivisionID = "";
var primaryStyleID = "";
var primaryStyleName = "";
var primaryStyleNumber = "";
var primaryStyleBrandNumber = "";
var primaryStyleDeptDesc = "";
var primaryStyleClassDesc = "";
var primaryStyleSubClasDesc = "";
var selection = webui.getSelection();
var selectionCount = selection.size();
var isStyleSelected = true;
var styleParent = [];
var supportingStyle = [];
var styleAlreadyReferencedFlag = false;
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var context = manager.getCurrentContext().getID();
var contextFlag = false;
if (context == "EN_JP" || context == "JA_JP") {
    contextFlag = true;
}
if (contextFlag == false) {
    if (selectionCount > 1) {
        for (var i = 0; i < selectionCount; i++) {
            var selectedNode = selection.get(i);
            if (selectedNode.getObjectType().getID() != "Style") {
                isStyleSelected = false;
            } else if (selectedNode.getObjectType().getID() == "Style") {
                if (checkReferencedBy(selectedNode) == true) {
                    styleAlreadyReferencedFlag = true;
                }
                styleParent.push(selectedNode.getParent().getParent().getID());
                var styleNumber = selectedNode.getValue("a_Style_Number").getSimpleValue();
                if (styleNumber == primarySellingStyleNumber) {
                    primaryStylePresent = true;
                    primaryStyleDivisionID = selectedNode.getParent().getParent().getParent().getParent().getID();
                    primaryStyleID = selectedNode.getID();
                    primaryStyleName = selectedNode.getName();
                    primaryStyleNumber = selectedNode.getValue("a_Style_Number").getSimpleValue();
                    primaryStyleBrandNumber = selectedNode.getValue("a_Brand_Number").getSimpleValue();
                    primaryStyleDeptDesc = selectedNode.getValue("a_Department_Description").getSimpleValue();
                    primaryStyleClassDesc = selectedNode.getValue("a_Class_Description").getSimpleValue();
                    primaryStyleSubClasDesc = selectedNode.getValue("a_SubClass_Description").getSimpleValue();
                } else {
                    supportingStyle.push(selectedNode.getID());
                }
            }
        }
        if (isStyleSelected) {
            var selectedStyleCount = styleParent.length;
            if (selectedStyleCount > 1) {
                var sameParent = new java.util.HashSet(styleParent);
                if (sameParent.size() == 1) {
                    if (primaryStylePresent) {
                        if (styleAlreadyReferencedFlag == false) {
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

                                var primaryStyle = manager.getProductHome().getProductByID(primaryStyleID);
                                for (var j = 0; j < selectionCount; j++) {
                                    var selStyle = selection.get(j);
                                    var styleDSGRef = checkReferencedBy(selStyle);
                                    if (styleDSGRef == false) {
                                        var ref = newDuplicateStyleGroup.createReference(selStyle, "rt_mergeDuplicateStyles");
                                        selStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                                        selStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyleID);
                                        if (selStyle.getID() == primaryStyleID) {
                                            selStyle.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                                            var alreadySupportingStyles = selStyle.getValue("a_Supporting_Styles").getSimpleValue();
                                            if (alreadySupportingStyles != null) {
                                                var alreadySupportingStyleIDs = alreadySupportingStyles.split("<multisep/>");
                                                for each(var myStyleID in alreadySupportingStyleIDs) {
                                                    if (supportingStyle.indexOf(myStyleID) == -1) {
                                                        supportingStyle.push(myStyleID);
                                                    }
                                                }
                                            }
                                            selStyle.getValue("a_Supporting_Styles").setSimpleValue(supportingStyle.join("<multisep/>"));
                                            ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                                        } else {
                                            selStyle.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                                            ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");

                                            var markets = selStyle.getValue("a_Style_Market_Designation").getValues().toArray();
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
                                                    var contextPrimaryStyle = contextManager.getProductHome().getProductByID(primaryStyle.getID());
                                                    var contextStyle = contextManager.getProductHome().getProductByID(selStyle.getID());
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
                                        }
                                        selStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                    } else {
                                        webui.showAlert("ERROR", selStyle.getID() + " already have a reference to a DuplicateStyleGroup.");
                                    }
                                }
                            }
                        } else {
                            webui.showAlert("ERROR", "One or more selected styles already have a reference to a DuplicateStyleGroup.");
                        }
                    } else {
                        webui.showAlert("ERROR", "Selected styles don't have the Style Number of the Primary Style.");
                    }
                } else {
                    webui.showAlert("ERROR", "Selected styles should live under the same Parent Class.");
                }
            } else {
                webui.showAlert("ERROR", "Please select at least two styles.");
            }
        } else {
            webui.showAlert("ERROR", "Please select only style objects.");
        }
    } else {
        webui.showAlert("ERROR", "Please select at least two styles.");
    }
} else {
    webui.showAlert("ERROR", "Cannot create Duplicate Style Group in Japan Context.");
}
}