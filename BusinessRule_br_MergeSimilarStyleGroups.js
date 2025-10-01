/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MergeSimilarStyleGroups",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Merge Similar StyleGroups",
  "description" : "Merge Similar Styles button in Search Style screen &  CreateSimilarStyleGroups from a list of selected Styles.",
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "rt_styles",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_styles",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,webui,primarySellingStyleNumber,LKT,rt_styles) {
//br_createSimilarStyleGroups
function checkReferencedBy(node) {
    var isReferenced = false;
    var refBy = node.getReferencedBy().toArray();
    for (var i = 0; i < refBy.length; i++) {
        if (refBy[i].getReferenceType().getID() == "rt_styles") {
            isReferenced = true;
        } else if (refBy[i].getReferenceType().getID() == "rt_mergeDuplicateStyles") {
            isReferenced = true;
        }
    }
    return isReferenced;
}

function createContextSSGReference(contextid, manager) {
    var contextNewSimilarStyleGroup = manager.executeInContext(contextid, function(cmmanager) {
        return cmmanager.getObjectFromOtherManager(newSimilarStyleGroup);
    });
    var contextSelStyle = manager.executeInContext(contextid, function(cmmanager) {
        return cmmanager.getObjectFromOtherManager(selStyle);
    });
    manager.executeInContext(contextid, function(cmmanager) {
        var ref = contextNewSimilarStyleGroup.createReference(contextSelStyle, "rt_styles");
        var styleGroupType = selStyle.getValue("a_Style_Group_Type").getSimpleValue();
        if (styleGroupType == null){
            selStyle.getValue("a_Style_Group_Type").setSimpleValue("Similar Style Group");
        }
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
            } else{
            selStyle.getValue("a_Supporting_Styles").setSimpleValue(supportingStyle.join("<multisep/>"));}
            ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
        } else {
            selStyle.getValue("a_Primary_Selling_Style").setSimpleValue("No");
            ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");
        }
    });
}
var newSimilarStyleGroup;
var supportingStyleMKTDesg = "";
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
var selection = webui.getSelection();
var selectionCount = selection.size();
var isStyleSelected = true;
var styleParent = [];
var supportingStyle = [];
var styleAlreadyReferencedFlag = false;
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var context = manager.getCurrentContext().getID();
var market = LKT.getLookupTableValue("LKT_Context_to_Market", context);
var canadaManager = "";
manager.executeInContext("EN_CA", function(contextManager) {
    canadaManager = contextManager;
});
var contextFlag = false;
if (context == "EN_JP" || context == "JA_JP" || context == "EN_SA") {
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
                    primaryStyleMKTDesg = selectedNode.getValue("a_Style_Market_Designation").getSimpleValue();
                } else {
                	 var tempDESG = selectedNode.getValue("a_Style_Market_Designation").getSimpleValue();
                	 supportingStyleMKTDesg += tempDESG;                	 
                    supportingStyle.push(selectedNode.getID());
                }
            }
        }
        if((context == "EN_US" && primaryStyleMKTDesg.contains("US") && supportingStyleMKTDesg.indexOf("US") != -1) || (context != "EN_US" && primaryStyleMKTDesg.contains("CAN") && supportingStyleMKTDesg.indexOf("CAN") != -1)){
        if (isStyleSelected) {
            var selectedStyleCount = styleParent.length;
            if (selectedStyleCount > 1) {
                var sameParent = new java.util.HashSet(styleParent);
                if (sameParent.size() == 1) {
                    if (primaryStylePresent) {
                        if (styleAlreadyReferencedFlag == false) {
                            var productGroupingDivisionObj = manager.getNodeHome().getObjectByKey("ProductGroup_Division_Key", primaryStyleDivisionID); //XX_XXX_ProductGroupings
                            var newSimilarStyleGroupID = primaryStyleBrandNumber + "_SPDP_" + primaryStyleID;
                            if (productGroupingDivisionObj != null) {
                                var divisionobjectID = productGroupingDivisionObj.getID();
                                var productGroupingTypeID = divisionobjectID.replace("_ProductGroupings", "_SSGs"); //XX_XXX_DSGs
                                var productGroupingTypeObj = manager.getProductHome().getProductByID(productGroupingTypeID);
                                if (productGroupingTypeObj == null) {
                                    productGroupingTypeObj = productGroupingDivisionObj.createProduct(productGroupingTypeID, "ProductGroupingType");
                                }
                                var newSimilarStyleGroup = productGroupingTypeObj.createProduct(newSimilarStyleGroupID, "SimilarStyleGroup");
                                var newCANSimilarStyleGroup = canadaManager.getProductHome().getProductByID(newSimilarStyleGroupID);
                                primaryStyleName = primaryStyleName == null ? "" : primaryStyleName;
                                newSimilarStyleGroup.setName(primaryStyleName);
                                newSimilarStyleGroup.getValue("a_Brand_Number").setSimpleValue(primaryStyleBrandNumber);
                                newSimilarStyleGroup.getValue("a_Department_Description").setSimpleValue(primaryStyleDeptDesc);
                                newSimilarStyleGroup.getValue("a_Class_Description").setSimpleValue(primaryStyleClassDesc);
                                newSimilarStyleGroup.getValue("a_SubClass_Description").setSimpleValue(primaryStyleSubClasDesc);
                                newSimilarStyleGroup.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyleID);
                                newSimilarStyleGroup.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                                if (context == "EN_US") {
                                    newSimilarStyleGroup.getValue("a_SuperPDP_Market").setSimpleValue(market);
                                    if(primaryStyleMKTDesg.contains("CAN") && supportingStyleMKTDesg.indexOf("CAN") != -1){
                                    	newCANSimilarStyleGroup.setName(primaryStyleName);
                                    newCANSimilarStyleGroup.getValue("a_SuperPDP_Market").addValue("US");
                                    newCANSimilarStyleGroup.getValue("a_SuperPDP_Market").addValue("CAN");
                                    newSimilarStyleGroup.getValue("a_SuperPDP_Market").addValue("CAN");
                                    }
                                } else if (context == "EN_CA" || context == "FR_CA") {
                                    newSimilarStyleGroup.getValue("a_SuperPDP_Market").setSimpleValue(market);     
                                }
                                var primaryStyle = manager.getProductHome().getProductByID(primaryStyleID);
                                for (var j = 0; j < selectionCount; j++) {
                                    var selStyle = selection.get(j);
                                    var styleSSGRef = checkReferencedBy(selStyle);
                                    selStyle.getValue("a_Supporting_Styles").deleteCurrent();
                                    if (styleSSGRef == false) {
                                        if (context == "EN_CA" || context == "FR_CA") {
                                            createContextSSGReference("EN_CA", manager);
                                        } else if (context != "EN_CA" || context != "FR_CA") {
                                            createContextSSGReference("EN_US", manager);
                                            if(primaryStyleMKTDesg.contains("CAN") && supportingStyleMKTDesg.indexOf("CAN") != -1){                                            	
                                            	var CANSelStyle = canadaManager.getProductHome().getProductByID(selStyle.getID());
                                        		newCANSimilarStyleGroup.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyleID);
                                        		newCANSimilarStyleGroup.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
                                        		CANSelStyle.getValue("a_Supporting_Styles").setSimpleValue(supportingStyle.join("<multisep/>"));
                                            	createContextSSGReference("EN_CA", manager);

                                            }
                                        }
                                        selStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                    } else {
                                        webui.showAlert("ERROR",  selStyle.getID() + " already have a reference to a SimilarStyleGroup.");
                                    }
                                }
                            }
                        } else {
                            webui.showAlert("ERROR",  "One or more selected styles already have a reference to a SimilarStyleGroup.");
                        }
                    } else {
                        webui.showAlert("ERROR",  "Selected styles don't have the Style Number of the Primary Style.");
                    }
                } else {
                    webui.showAlert("ERROR",  "Selected styles should live under the same Parent Class.");
                }
            } else {
                webui.showAlert("ERROR",  "Please select at least two styles.");
            }
        } else {
            webui.showAlert("ERROR",  "Please select only style objects.");
        }
      } else {
            webui.showAlert("ERROR",  "Selected styles should have certain Market Desginations as US/CAN with respect to their contexts");
        }
    } else {
        webui.showAlert("ERROR",  "Please select at least two styles.");
    }
} else {
    webui.showAlert("ERROR",  "Cannot create Similar Style Group in this Context.");
}

if (newSimilarStyleGroup != null) {
    manager.executeInContext("EN_US", function(currentContextManager) {
        var US_SSG = currentContextManager.getProductHome().getProductByID(newSimilarStyleGroup.getID());
        var US_Ref = US_SSG.getReferences(rt_styles).toArray();
        for (var i in US_Ref) {
            var style = US_Ref[i].getTarget();
            var styleMKTDesg = style.getValue("a_Style_Market_Designation").getSimpleValue();
            if (!styleMKTDesg.contains("US")) {
                US_Ref[i].delete();
            }
        }
    });
}


if (newSimilarStyleGroup != null) {
    manager.executeInContext("EN_CA", function(currentContextManager) {
        var CAN_SSG = currentContextManager.getProductHome().getProductByID(newSimilarStyleGroup.getID());
        var CAN_Ref = CAN_SSG.getReferences(rt_styles).toArray();
        for (var i in CAN_Ref) {
            var style = CAN_Ref[i].getTarget();
            var styleMKTDesg = style.getValue("a_Style_Market_Designation").getSimpleValue();
            if (!styleMKTDesg.contains("CAN")) {
                CAN_Ref[i].delete();
            }
        }
    });
}

}