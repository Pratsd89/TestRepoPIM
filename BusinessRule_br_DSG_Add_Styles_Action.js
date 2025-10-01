/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DSG_Add_Styles_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Duplicate Style Group Add Styles Action",
  "description" : "PPIM-10698",
  "scope" : "Global",
  "validObjectTypes" : [ "DuplicateStyleGroup" ],
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
    "alias" : "MergeDuplicateStyles",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_mergeDuplicateStyles",
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
exports.operation0 = function (node,step,MergeDuplicateStyles,LKT,styles,webUI) {
function inheritAttributes(primaryStyle, supportingStyle, manager) {
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
}

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var logArray = new Array();
var logArray1 = new Array();
var logArray2 = new Array();

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
        var currentStyleID = null;
        if (styleList[i].length == 6){
	       currentStyleID = "000" + styleList[i];
        }
        else if (styleList[i].length == 7){
	       currentStyleID = "00" + styleList[i];
        }
        var currentStyle = step.getProductHome().getProductByID(currentStyleID);
        if (currentStyle == null) {
            logArray1.push(styleList[i]);
        } else {
            var currentStyleClass = currentStyle.getParent().getParent();

            if (parentClass.getID() == currentStyleClass.getID()) {
            	
            	 var flag = false;
            	 var refByDSG = currentStyle.getReferencedBy().toArray();
    			 for (var j = 0; j < refByDSG.length; j++) {
        		 	if (refByDSG[j].getReferenceType().getID() == "rt_mergeDuplicateStyles") {
            	     	flag = true;
                	}
           	 }

           	 if (flag){
           	 	logArray2.push(currentStyle.getValue("a_Style_Number").getSimpleValue());
           	 }
                else{ 
                    var reference = node.createReference(currentStyle, MergeDuplicateStyles);
                    reference.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                    currentStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primarySellingStyleID);
                    currentStyle.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                    currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primarySellingStyleNumber);
                    var markets = currentStyle.getValue("a_Style_Market_Designation").getValues().toArray();
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
                        step.executeInContext(ctxt, function(contextManager) {
                            var contextPrimaryStyle = contextManager.getProductHome().getProductByID(primarySellingStyleID);
                            var contextStyle = contextManager.getProductHome().getProductByID(currentStyle.getID());
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
                    primarySellingStyle.getValue("a_Supporting_Styles").addValue(currentStyle.getID());
                    primarySellingStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));

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