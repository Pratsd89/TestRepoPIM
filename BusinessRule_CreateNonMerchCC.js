/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CreateNonMerchCC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) CreateNonMerchCC",
  "description" : null,
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "ccName",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">Name</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">A_attr</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "nonMerchPrice",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_NonMerch_Price</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">B_attr</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,portal,ccName,nonMerchPrice) {
/*Create Non-Merch CC
- First get current context and set Market Code.
- Second set sequence number for current CC under the parent Style.
- Third Suffix above two to Parent Style id.
*/
var result = true;
var nonMerchPriceS = nonMerchPrice;
if (ccName == null) {
	result = false;
	portal.showAlert("ERROR", null, "The CC was not created. Please enter CC Name during creation.");
}
else {
	var merchFlag = node.getValue("a_product_merch_type").getSimpleValue();
	if (merchFlag == "STORED VALUE CARDS OPEN" || merchFlag == "PREMIUM GIFT BOXES" || merchFlag == "GIFTS" || merchFlag == "PREMIUM GIFT BOXES SVC" || merchFlag == "COMPLIMENTARY GIFT BOXES" || merchFlag == "MONOGRAM SERVICE") {
		if (nonMerchPrice == null) {
			result = false;
			portal.showAlert("ERROR", null, "The CC was not created. Please enter Non-Merch Price during creation.");
		} else if (isNaN(nonMerchPrice)) {
			// if the value entered for Non Merch Price is not a number, throw an error
			result = false;
			portal.showAlert("ERROR", null, "The CC was not created. Price value is not valid.");
		}
	}
	else {
		if (nonMerchPrice != null) {
			//result=false;
			portal.showAlert("INFO", null, "CC has been created. Non-Merch Price is not applicable for the Parent Style.");
			nonMerchPriceS = null;
		}
	}
}
//end of validation
if (result == true) {
	var styleID = node.getID();
	//get a_Style_Number for CC Number logic
	var nmStyleID = node.getValue("a_Style_Number").getSimpleValue();
	var nmCCID = null;
	var marketCode = null;
	var seqNum = null;
	var ccID = null;
	var currentContext = step.getCurrentContext().getID();
	if (currentContext == "EN_US") {
		marketCode = "1";
	}
	else if (currentContext == "EN_CA" || currentContext == "FR_CA") {
		marketCode = "4";
	}
	else if (currentContext == "EN_JP" || currentContext == "JA_JP") {
		marketCode = "6";
	}
	var sCC = new java.util.ArrayList();
	sCC.addAll(node.getChildren());
	seqNum = sCC.size();
	//log.info(seqNum);
	if (seqNum != null) {
		seqNum = parseInt(seqNum) + 1;
		if (parseInt(seqNum) <= 9) {
			seqNum = "0" + seqNum;
			//log.info(seqNum);
		}
		ccID = styleID + seqNum + marketCode;
		//value to be inserted in CC Number without prefix
		if (nmStyleID != null) {
			nmCCID = nmStyleID + seqNum + marketCode;
		}
		else {
			nmCCID = seqNum + marketCode;
		}
		log.info("cc id " + ccID);
		try {
			var cc = node.createProduct(ccID, "CustomerChoice");
			if (step.getCurrentContext().getID() == "EN_CA" || step.getCurrentContext().getID() == "FR_CA") {
				cc.startWorkflowByID("wf_CCEnrichmentCanada", "CC CAN Workflow Initiation");
			}
			else if (step.getCurrentContext().getID() == "EN_US") {
				cc.startWorkflowByID("wf_CCEnrichment", "CC US Workflow Initiation");
			}
			else if (step.getCurrentContext().getID() == "EN_JP") {
				cc.startWorkflowByID("wf_CCEnrichmentJapan", "CC JP Workflow Initiation");
			}
			//setting up of the sort order of the CC 
			if (cc.getValue('a_CC_Sort_Order').getSimpleValue() == null || cc.getValue('a_CC_Sort_Order').getSimpleValue() == '') {
				var style = cc.getParent();
				var ccList = style.getChildren();
				if (ccList.size() == 1) {
					cc.getValue('a_CC_Sort_Order').setSimpleValue('999');
				}
				else {
					var sortOrder = 999;
					for (var i = 0; i < ccList.size(); i++) {
						if (cc.getID() != ccList.get(i).getID()) {
							var ccSortOrder = ccList.get(i).getValue('a_CC_Sort_Order').getSimpleValue();
							if (ccSortOrder != null && ccSortOrder != '') {
								parseInt(ccSortOrder);
								if (ccSortOrder < sortOrder) {
									sortOrder = ccSortOrder;
								}
							}
						}

					}
					var newSortOrder = sortOrder - 1;
					cc.getValue('a_CC_Sort_Order').setSimpleValue(newSortOrder);
				}
			}
			//end of the code
		}
		catch (e) {
			if (e.javaException instanceof com.stibo.core.domain.NodeIdUniqueConstraintException || e.javaException instanceof com.stibo.core.domain.ObjectTypeConstraintException) {
				throw (e);
			}
		}
		var ccList = new java.util.ArrayList();
		ccList.addAll(node.getChildren());
		for (var k = 0; k < ccList.size(); k++) {
			if (ccList.get(k).getID() == ccID) {
				var cCC = ccList.get(k);
				ccList.get(k).getValue("a_CC_Number").setSimpleValue(nmCCID);
				ccList.get(k).getValue("a_Market_Designation").addLOVValueByID(marketCode);
				cCC.setName(ccName);
				if (nonMerchPriceS != null) {
					cCC.getValue("a_NonMerch_Price").setSimpleValue(nonMerchPriceS);
				}
				//--------- PPIM-2931 -------------------------------------------------
				//get column values from Brand - CC->Style->Subclass->Class->Department->Division->Brand
				var brandObj = cCC.getParent().getParent().getParent().getParent().getParent().getParent();
				var brandNum = brandObj.getValue("a_Brand_Number").getSimpleValue();
				var channelNum = brandObj.getValue("a_Channel_Number").getSimpleValue();
				cCC.getValue("a_Brand_Number").setSimpleValue(brandNum);
				cCC.getValue("a_Channel_Number").setSimpleValue(channelNum);
			}
		}

		if (merchFlag == "STORED VALUE CARDS FIXED" || merchFlag == "STORED VALUE CARDS FIXED OPTIONS") {
			portal.navigate("GAPNonMerchCCDetailsListNoName", cCC);
		} else {
			portal.navigate("GAPNonMerchCCDetailsList", cCC);
		}
	}
}
}