/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Style_Enrichment_Final_Validation_SA",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Style Enrichment Final Validation SA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "StyleUtilLibrary",
    "libraryAlias" : "StyleUtilLibrary"
  }, {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_CheckCurrentContextForSAWorkflow"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node,stepManager,StyleUtilLibrary,compCheck) {
//PPIM-15183
var markets = node.getValue("a_Style_Market_Designation").getSimpleValue();
if (markets != null && markets != "SA") {
    var brand = node.getValue("a_Brand_Number").getSimpleValue();
    var attrID = "a_" + brand + "_WebProductType";
    var checkId = stepManager.getAttributeHome().getAttributeByID(attrID);
    if (checkId) {
        var webProdType = node.getValue(attrID).getSimpleValue();
        if (webProdType == "needs wpt") {
            node.getValue('a_error_message').setSimpleValue('Web Product Type needs to be updated for the Style');
            return "Web Product Type needs to be updated for the Style";
        }
    }
}
return true;
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "MANAGER",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "LOG",
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
exports.operation2 = function (NODE,MANAGER,LOG,LKT,StyleUtilLibrary,compCheck) {
log.info("STATETEST1="+NODE.getID());
logger.warning("STATETEST1="+NODE.getID());
/*
	Ensure Copy attributes are filled out
	All English contexts have at least STEP Name of Style and a_Overview_Bullet1 is filled
	This rule no longer checks Product to Classification links and is now context agnostic
 */
var context = MANAGER.getCurrentContext().getID();
var mkt = LKT.getLookupTableValue("LKT_Context_to_Market", context);
var merchType = NODE.getValue("a_product_merch_type").getSimpleValue();
var nonMerch = false;

// current time stamp
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var now = java.time.ZonedDateTime.now().minusDays(30);
var final_date = now.format(formatter);
var today = new java.util.Date();
var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");

var isErrorOccurred = false;
var errorMsg = null;
var Style_Start_Date = NODE.getValue("a_Style_Start_Date").getSimpleValue();;
var marketCodes = NODE.getValue('a_Style_Market_Designation').getSimpleValue();
var CCList = NODE.getChildren();
var ccWaitingForStyleApproval = false;
var skuDimCheck = false;

if (merchType == "COMPLIMENTARY GIFT BOXES"
	|| merchType == "GIFTS"
	|| merchType == "MONOGRAM SERVICE"
	|| merchType == "PREMIUM GIFT BOXES"
	|| merchType == "PREMIUM GIFT BOXES SVC"
	|| merchType == "STORED VALUE CARDS FIXED"
	|| merchType == "STORED VALUE CARDS FIXED OPTIONS"
	|| merchType == "STORED VALUE CARDS OPEN") {
	nonMerch = true;
}

if (nonMerch == false) {
	if (Style_Start_Date == null) {
		NODE.getValue("a_Style_Start_Date").setSimpleValue(simpleDateFormat.format(today));
		Style_Start_Date = NODE.getValue("a_Style_Start_Date").getSimpleValue();
	}
}

if (Style_Start_Date != null) {
	if (Style_Start_Date > final_date || Style_Start_Date == final_date) {
		NODE.getValue("a_New_Style").setSimpleValue("Yes");
	} else {
		NODE.getValue("a_New_Style").setSimpleValue("No");
	}
}

// in Style Final Validation, need to check if EN_SA contains data for Copy.
if (marketCodes != null) {
	if (marketCodes.contains(mkt) == true) {
		var result = StyleUtilLibrary.checkAttributesAndName(NODE, MANAGER, context);

		if (result != true) {
			isErrorOccurred = true;
			errorMsg = result;
		}
	}
}

if (!isErrorOccurred) {
	//checking if at least one CC is in "Waiting for Style Approval"
	if (CCList.size() > 0) {
		for (var i = 0; i < CCList.size(); i++) {
			var cc = CCList.get(i);
			var marketDesignation = cc.getValue('a_Market_Designation').getSimpleValue();
			var lifeCycleStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();

			if (marketDesignation != null) {
				if (marketDesignation.contains(mkt) == true) {
					if (lifeCycleStatus != null) {
						if (lifeCycleStatus == "Waiting for Style Approval" || lifeCycleStatus == "Approved") {
							ccWaitingForStyleApproval = true;
                                   skuDimCheck = compCheck.checkSKUDimensionForCC(cc, MANAGER);
                                   if (skuDimCheck) {
							break;
						}
					}
				}
			}
		}
		}
		if (ccWaitingForStyleApproval == false) {
			//return 'There should be atleast one Ready For Approval CC before approving the Style.';
			errorMsg = 'There should be at least one Approved or Ready for Approval CC before approving the Style.';
			isErrorOccurred = true;
		}
		else if (ccWaitingForStyleApproval == true && skuDimCheck != true) {
        	  //PPIM-12814
            errorMsg = skuDimCheck;
            isErrorOccurred = true;
        }

	}
	else {
		//return 'The Style does not contain any CC. Please add CC and try again.';
		errorMsg = 'The Style does not contain any CC. Please add CC and try again.';
		isErrorOccurred = true;
	}
}

if (isErrorOccurred) {
	NODE.getValue('a_error_message').setSimpleValue(errorMsg);
	return errorMsg;
}

return true;
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_Copying_Image_From_CC_To_Style_SA"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "StyleSizeModelApprovalSA"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "StyleMandatoryAttributeCheck"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "NonMerchApprovalValidation"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation7 = function (node,StyleUtilLibrary,compCheck) {
// do not check Search color for Non Merch Styles. PPIM-2719

var merchType = node.getValue("a_product_merch_type").getSimpleValue();

if(merchType == "COMPLIMENTARY GIFT BOXES" 
   || merchType == "GIFTS" 
   || merchType == "MONOGRAM SERVICE" 
   || merchType == "PREMIUM GIFT BOXES" 
   || merchType == "PREMIUM GIFT BOXES SVC" 
   || merchType == "STORED VALUE CARDS OPEN"
   || merchType == "STORED VALUE CARDS FIXED" 
   || merchType == "STORED VALUE CARDS FIXED OPTIONS") {
   	// non merch style. return true
   	return true;
   }
				
var CCchildren = node.getChildren();
var errorMessage = null;

if(CCchildren.size() != 0) {
	for(var i=0; i<CCchildren.size(); i++) {
		var child = CCchildren.get(i);
		//PPIM-6590 -- Do not validate draft status CCs/SKUs
		var lifeCycleStatus = child.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
		
		if (child.isInState("wf_CCEnrichmentSA", "NewCCEnrich_Final") || lifeCycleStatus == "Approved") {
			/*logic removed as a part of PPIM-3472
			var searchColor = child.getValue("a_Search_Color").getSimpleValue();
			*/
			var searchColor = child.getValue("a_Search_Color_Calc").getSimpleValue();
			
			if(searchColor == "") {
				if(errorMessage == null) {
					errorMessage = "CC Search Color is missing, Please update it using CC Search Override Color (or) Color Palette Search Color for CC ID: " + child.getID();
				}
				else {
					errorMessage = errorMessage + " , " + child.getID();
				}
			}
		}
	}
	if(errorMessage != null) {
		node.getValue('a_error_message').setSimpleValue(errorMessage);
		return errorMessage;
	}
	else {
		return true;
	}
}
}