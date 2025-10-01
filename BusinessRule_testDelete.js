/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testDelete",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "testDelete",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,createProductGroups,LKT,styles,webUI) {
/*function inheritAttributes(primaryStyle, supportingStyle, manager) {
    var inheritATG = manager.getAttributeGroupHome().getAttributeGroupByID("ag_SuperPDP_Inherit_Attributes");
    var inheritAttributes = [];

    inheritATG.getAttributes().toArray().forEach(function(attr) {
        inheritAttributes.push(attr);
    });

    for (var k = 0; k < inheritAttributes.length; k++) {
        var attributeId = inheritAttributes[k].getID();
        var attributeValue = primaryStyle.getValue(attributeId).getSimpleValue();
        var supportingStyleValue = supportingStyle.getValue(attributeId).getSimpleValue();
        if (supportingStyleValue == null) {
            supportingStyle.getValue(attributeId).setSimpleValue(attributeValue);
        }
    }
}*/

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

function createDSGStyleReference(contextid, step){

    var contextCurrentStyle = step.executeInContext(contextid, function(cmmanager) {
        return cmmanager.getObjectFromOtherManager(currentStyle);
    });

    var contextPrimarySellingStyle = step.executeInContext(contextid, function(cmmanager) {
        return cmmanager.getObjectFromOtherManager(primarySellingStyle);
    });
	
	var contextNode = step.executeInContext(contextid, function(cmmanager) {
        return cmmanager.getObjectFromOtherManager(node);
    });

    var reference = contextNode.createReference(contextCurrentStyle, createProductGroups);
    reference.getValue("a_Primary_Selling_Style").setSimpleValue("No");
    contextCurrentStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primarySellingStyleID);
    contextCurrentStyle.getValue("a_Primary_Selling_Style").setSimpleValue("No");
    contextCurrentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primarySellingStyleNumber);
    var markets = contextCurrentStyle.getValue("a_Style_Market_Designation").getValues().toArray();
    var contextArray = [];
    markets.forEach(function(market) {
        if (market != "JPN") {
            var contexts = LKT.getLookupTableValue("LKT_MarketDesignationToContext", market.getSimpleValue());
            if (contexts.contains(";")) {
                contexts.split(";").forEach(function(ctx) {
                    contextArray.push(ctx);
                });
            } else {
                contextArray.push(contexts);
            }
        }
    });
    contextArray.forEach(function(ctxt) {
        step.executeInContext(ctxt, function(contextManager) {
            var contextPrimaryStyle = contextManager.getProductHome().getProductByID(primarySellingStyleID);
            var contextStyle = contextManager.getProductHome().getProductByID(contextCurrentStyle.getID());
            var contextStyleStatus = contextStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
            var contextStyleCopyStatus = contextStyle.getValue("a_Copy_Complete_Status").getSimpleValue();
            if (contextStyleStatus == "In Progress" && contextStyleCopyStatus != "Complete") {
                var primaryTranslationStatus = contextPrimaryStyle.getValue("a_Translation_Status").getSimpleValue();
                if (primaryTranslationStatus != null) {
                    contextStyle.getValue("a_Translation_Status").setSimpleValue(primaryTranslationStatus);
                }
                inheritAttributes(contextPrimaryStyle, contextStyle, step);
            }
        });
    });
    currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    contextPrimarySellingStyle.getValue("a_Supporting_Styles").addValue(contextCurrentStyle.getID());
    contextPrimarySellingStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));

}

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var logArray = new Array();
var logArray1 = new Array();
var logArray2 = new Array();
var context = step.getCurrentContext().getID();
var refType = step.getReferenceTypeHome().getReferenceTypeByID("rt_ProductGroups");
var superPDPMarket = node.getValue("a_SuperPDP_Market").getSimpleValue();

if (context == "EN_CA" && superPDPMarket != null && superPDPMarket.contains("US")) {
    webUI.showAlert("ERROR",  "Please proceed to US market and then add the styles from US market only.")
} else {
    step.executeInContext("EN_CA", function(contextManager) {
        canadaManager = contextManager;
    });

    if (styles == null) {
        webUI.showAlert("Error",  "Please provide atleast one Style Number and try again.");
    } else {
        var styleList = [];
        styleList = styles.split(",");

        var primarySellingStyleID = node.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
        var primarySellingStyle = step.getProductHome().getProductByID(primarySellingStyleID);
        var primarySellingStyleNumber = primarySellingStyle.getValue("a_Style_Number").getSimpleValue();
        var parentClass = primarySellingStyle.getParent().getParent();
        

        for (var i = 0; i < styleList.length; i++) {
            var currentStyleID = "000" + styleList[i];
            var currentStyle = step.getProductHome().getProductByID(currentStyleID);
            var canadaCurrentStyle = canadaManager.getObjectFromOtherManager(currentStyle);
            var CanadaDSG = getDuplicateStyleGroup(canadaCurrentStyle, refType);
            
            if (currentStyle == null) {
                logArray1.push(styleList[i]);
            } else {
                var currentStyleClass = currentStyle.getParent().getParent();

                if (parentClass.getID() == currentStyleClass.getID()) {
                    
                    var flag = false;
                    var refByDSG = currentStyle.getReferencedBy().toArray();
                    for (var j = 0; j < refByDSG.length; j++) {
                        if (refByDSG[j].getReferenceType().getID() == "rt_ProductGroups") {
                            flag = true;
                        }
                }

                if (flag){
                    logArray2.push(currentStyle.getValue("a_Style_Number").getSimpleValue());
                }
                    else{ 
                    // Creating Reference in Canada Market when Styles have been added to US Market - PIM-11365
                    if (context == "EN_US" ){
                    createDSGStyleReference("EN_US", step);
                    if (CanadaDSG == null && superPDPMarket.contains("CAN")){
                    createDSGStyleReference("EN_CA", step);
                    }
                    }
                    else{
                        createDSGStyleReference(context, step);
                    }
                    } 
                } else {
                    logArray.push(styleList[i]);
                }
            }
        }

        if (logArray1.length > 0) {
            webUI.showAlert("ERROR", "Mentioned style numbers are either invalid or Styles are not available in Stibo. Please check and try again. ", logArray1);
        } else if (logArray.length > 0) {
            webUI.showAlert("ERROR", "These Style(s) doesn't belong to same Class as Primary Selling Style: ", logArray);
        } else if (logArray2.length > 0) {
            webUI.showAlert("ERROR", "These Style(s) are already a part of DSG: ", logArray2);
        }
    }
}
}