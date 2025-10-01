/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ApproveNewStyleEnrichment_FV__dup",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ApproveNewStyleEnrichment_FV",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "GlobalUtilLibrary"
  }, {
    "libraryId" : "StyleUtilLibrary",
    "libraryAlias" : "StyleUtilLibrary"
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "PrimaryProductImage",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "ref_Style",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "ref_SKU",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "ClassificationBindContract",
    "alias" : "node_Class",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "101471",
    "description" : null
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "agRequired",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_Required_Style_Fields",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,webui,PrimaryProductImage,ref_Style,ref_SKU,node_Class,agRequired,GlobalUtilLibrary,StyleUtilLibrary) {
//Declare variables
var appliesConditionConext = true;
var appliesCondition1 = true
var returnMsg = "";
var targetWorkflowUS = "wf_NewStyleEnrichment";
var targetState1US = "NewStyleEnrich_Final";
var targetWorkflowCA = "wf_NewStyleEnrichmentCanada";
var targetState1CA = "NewStyleEnrich_Final";
var currentContext = manager.getCurrentContext().getID();
var context;
if (currentContext == "EN_US") {
	context = "US";
}
if (currentContext == "EN_CA") {
	context = "CA";
}
if (currentContext == "FR_CA") {
	context = "CA";
}
var indexOfVar;
if (context == "US") {
	indexOfVar = "US";
}
if (context == "CA") {
	indexOfVar = "CA";
}

//if the Context is not EN_US, EN_CA, or FR_CA then this logic will not apply
if (context != "US" && context != "CA") {
	appliesConditionConext = false;
	returnMsg = 'The New Style Enrichment Workflow can only be triggered from the EN_US, EN_CA or FR_CA context. Please select the appropriate context and try again.';
	webui.showAlert("Error", "Button Does Not Apply", returnMsg);
	return;
}

//Check that the style is in the target workflow (depending on the context) to determine the value for appliesCondition1
if (context == "US") {
	//Check that the style is in the target workflow: New Style Enrichment(wf_NewStyleEnrichment)
	//and that the Style is in the target states: Missing Web Merchandising State(NewStyleEntrich_WebMerch1)
	if (node.isInWorkflow(targetWorkflowUS)) {
		if (!node.isInState(targetWorkflowUS, targetState1US)) {
			//Style is in the target workflow, but NOT in the target state
			appliesCondition1 = false;
			returnMsg = "Style is not in the \'Final Validation\' state for the New Style Enrichment Workflow";
			webui.showAlert("Error", "Button Does Not Apply", returnMsg);
			return;
		}
	}
	else {
		//Style is NOT in the target workflow
		appliesCondition1 = false;
		returnMsg = "Style is not in the \'New Style Enrichment Workflow\'";
		webui.showAlert("Error", "Button Does Not Apply", returnMsg);
		return;
	}
}
if (context == "CA") {
	//Check that the style is in the target workflow: New Style Enrichment Canada (wf_NewStyleEnrichmentCanada)
	//and that the Style is in the target states: Missing Web Merchandising State(NewStyleEntrich_WebMerch1)
	if (node.isInWorkflow(targetWorkflowCA)) {
		if (!node.isInState(targetWorkflowCA, targetState1CA)) {
			//Style is in the target workflow, but NOT in the target state
			appliesCondition1 = false;
			returnMsg = "Style is not in the \'Final Validation\' state for the New Style Enrichment Workflow Canada";
			webui.showAlert("Error", "Button Does Not Apply", returnMsg);
			return;
		}
	}
	else {
		//Style is NOT in the target workflow
		appliesCondition1 = false;
		returnMsg = "Style is not in the \'New Style Enrichment Workflow Canada\'";
		webui.showAlert("Error", "Button Does Not Apply", returnMsg);
		return;
	}
}

if (currentContext == "EN_US") {
	//////////////////////////////////////////////
	//Business Rule Start: Local JavaScript Condition #1 from br_Style_Enrichment_Final_Validation & br_Style_Enrichment_Final_Validation_CAN
	//bind node
	//bind manager
	//////////////////////////////////////////////
	/*
		Ensure Copy attributes are filled out
		All English contexts have at least STEP Name of Style and a_Overview_Bullet1 is filled
		Translation status = "In Progress" or "Completed"
	*/
	var appliesCondition2 = true;
	//Get user group from user id
	var noAccesstoUS = false;
	var userGroups = new java.util.ArrayList();
	userGroups.addAll(manager.getCurrentUser().getGroups());
	for (var n = 0; n < userGroups.size(); n++) {
		if (userGroups.get(n).getID() == "CA-PIM-MC-Security-Group") {
			noAccesstoUS = true;
		}
	}

	//a_Style_Start_Date = if start date is empty, enter today's date 
	// do not enter today's date for Non Merch products. PPIM-2719
	var merchType = node.getValue("a_product_merch_type").getSimpleValue();
	var nonMerch = false;
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
	if (!nonMerch) {
		if (node.getValue("a_Style_Start_Date").getSimpleValue() == "" || node.getValue("a_Style_Start_Date").getSimpleValue() == null) {
			var today = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
			node.getValue("a_Style_Start_Date").setSimpleValue(iso.format(today));
		}
	}

	//added as part of 2524
	var Style_ID = node.getID();
	// current time stamp
	var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
	var now = java.time.ZonedDateTime.now().minusDays(30);
	var final_date = now.format(formatter);

	if (context == "US") {
		//////// US Context //////////
		if (noAccesstoUS != true) {
			manager.executeInContext('EN_US', function (enContextManager) {
				var enCurrentProduct = enContextManager.getProductHome().getProductByID(Style_ID);
				/////New Color:
				var Style_Start_Date = enCurrentProduct.getValue("a_Style_Start_Date").getSimpleValue();
				if (Style_Start_Date != null) {
					if (Style_Start_Date > final_date || Style_Start_Date == final_date) {
						enCurrentProduct.getValue("a_New_Style").setSimpleValue("Yes");
					}
					else {
						enCurrentProduct.getValue("a_New_Style").setSimpleValue("No");
					}
				}
			})
		}
	}
	if (context == "CA") {
		//////// CA Context //////////
		manager.executeInContext('EN_CA', function (caContextManager) {
			var caCurrentProduct = caContextManager.getProductHome().getProductByID(Style_ID);
			/////New Color:
			var Style_Start_Date = caCurrentProduct.getValue("a_Style_Start_Date").getSimpleValue();
			if (Style_Start_Date != null) {
				if (Style_Start_Date > final_date || Style_Start_Date == final_date) {
					caCurrentProduct.getValue("a_New_Style").setSimpleValue("Yes");
				}
				else {
					caCurrentProduct.getValue("a_New_Style").setSimpleValue("No");
				}
			}
		})
	}

	var isErrorOccurred = false;
	//var returnMsg = '';
	var existingreturnMsg = '' + node.getValue('a_error_message').getSimpleValue();
	var marketCodes = node.getValue('a_Style_Market_Designation').getSimpleValue();

	// in Style Final Validation, need to check if EN_CA contains data for Copy. Translation may not have come back yet so FR_CA may still be empty.
	if (marketCodes.indexOf("CAN") >= 0) {
		var result = StyleUtilLibrary.checkAttributesAndName(node, manager, currentContext);
		if (result != true) {
			appliesCondition2 = false;
			isErrorOccurred = true;
			returnMsg = '' + result;
			webui.showAlert("Error", "Style Missing Data in EN_CA Context", returnMsg);
			return;
		}
	}

	if (!isErrorOccurred) {
		if (marketCodes.indexOf("US") >= 0) {
			var result = StyleUtilLibrary.checkAttributesAndName(node, manager, currentContext);
			if (result != true) {
				appliesCondition2 = false;
				isErrorOccurred = true;
				returnMsg = '' + result;
				webui.showAlert("Error", "Style Missing Data in EN_US Context", returnMsg);
				return;
			}
		}
	}

	if (!isErrorOccurred) {
		//checking if at least one CC is in "Waiting for Style Approval"
		var style = manager.getProductHome().getProductByID(node.getID());
		var CCList = style.getChildren();
		var ccWaitingForStyleApproval = false;

		if (CCList.size() > 0) {
			for (var i = 0; i < CCList.size(); i++) {
				if (CCList.get(i).getValue('a_Market_Designation').getSimpleValue().indexOf(indexOfVar) >= 0) {
					if (CCList.get(i).getValue('a_CC_Life_Cycle_Status').getLOVValue().getID() == "WAITING_FOR_STYLE_APPROVAL") {
						ccWaitingForStyleApproval = true;
						break;
					}
				}
			}
			if (ccWaitingForStyleApproval == false) {
				//return 'There should be atleast one Ready For Approval CC before approving the Style.';
				returnMsg = 'There should be at least one Ready For Approval CC before approving the Style.';
				isErrorOccurred = true;
				appliesCondition2 = false;
				webui.showAlert("Error", "Not Ready for Approval CC", returnMsg);
				return;
			}
		}
		else {
			//return 'The Style does not contain any CC. Please add CC and try again.';
			returnMsg = 'The Style does not contain any CC. Please add CC and try again.';
			isErrorOccurred = true;
			appliesCondition2 = false;
			webui.showAlert("Error", "No CCs on Style", returnMsg);
			return;
		}
	}

	if (!isErrorOccurred) {
		//Block to ignore Non-Merch Style for Web Categorization validation - PPIM-1406
		var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
		if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")) {

			// check if the Style has Primary Web Category assigned 
			var classificationTypeHome = manager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
			var classificationType = classificationTypeHome.getLinkTypeByID('StyleToWebSubCategoryRef');
			var classificationLinkList = node.getClassificationProductLinks(classificationType).toArray();
			if (classificationLinkList.length == 0) {
				var myChildren = node.getChildren();
				var noWebCatFound = false;
				for (var i = 0; i < myChildren.size(); i++) {
					var ccWebCatList = myChildren.get(i).getClassificationProductLinks(classificationType).toArray();
					if (ccWebCatList.length == 0) {
						//return 'Style does not have any Web Categories assigned';
						returnMsg = 'Style does not have any Web Categories assigned';
						isErrorOccurred = true;
						appliesCondition2 = false;
						webui.showAlert("Error", "Style Missing Web Categorization", returnMsg);
						return;
					}
				}
			}
			else {
				var primaryCategoryTrueFlag = false;
				var pCatStyle = node.getValue("a_Primary_Category").getSimpleValue();
				if (pCatStyle != null) {
					primaryCategoryTrueFlag = true;
				}
				if (primaryCategoryTrueFlag == false) {
					//return 'There should be at least one Primary Category associated with Style';
					returnMsg = 'There should be at least one Primary Category associated with Style';
					isErrorOccurred = true;
					appliesCondition2 = false;
					webui.showAlert("Error", "Style Missing Primary Category Association", returnMsg);
					return;
				}
			}
		}
	}
	//////////////////////////////////////////////
	//Business Rule End: Local JavaScript Condition #1 from br_Style_Enrichment_Final_Validation & br_Style_Enrichment_Final_Validation_CAN
	//////////////////////////////////////////////



	//////////////////////////////////////////////
	//Business Rule Start: br_Copying_Image_From_CC_To_Style & br_Copying_Image_From_CC_To_Style_CA
	//bind node
	//bind manager
	//bind PrimaryProductImage : Binds to - Reference Type : Parameter - PrimaryProductImage
	//////////////////////////////////////////////
	var appliesCondition3 = true;
	var style = manager.getProductHome().getProductByID(node.getID());
	var CCList = style.getChildren();
	var CCArray = [];
	var sortOrderArray = [];

    //PPIM-10685 - Handling Error message
    var isCCSortOrderPresent = false;
    var isCCActiveOrStatusPresent = false;
    var ccWaitingForStyleApproval = false;
    var ccMarketDesignationMatching =false;

	for (var i = 0; i < CCList.size(); i++) {
		var sortOrder = CCList.get(i).getValue('a_CC_Sort_Order').getSimpleValue();
        	if (sortOrder != null) {
            	if (CCList.get(i).getValue('a_Market_Designation').getSimpleValue().indexOf(indexOfVar) >= 0) {
            		var today = new Date().toISOString().substring(0, 10);
            		var CCEndDate = CCList.get(i).getValue('a_CC_End_Date').getSimpleValue();
            		if (CCList.get(i).getValue('a_CC_Life_Cycle_Status').getSimpleValue() != null && (CCEndDate > today || CCEndDate == null)) {
	                	var status = CCList.get(i).getValue('a_CC_Life_Cycle_Status').getLOVValue().getID();
	                	if (status == "WAITING_FOR_STYLE_APPROVAL") {
	                   		CCArray.push(CCList.get(i).getID());
	                    	sortOrderArray.push(sortOrder);
	                    	ccWaitingForStyleApproval = true
	                	}
	                	isCCActiveOrStatusPresent = true
                	}
                	ccMarketDesignationMatching = true
            	}
            	isCCSortOrderPresent = true
        	}
	}

	if (sortOrderArray.length != 0) {
		var minIndexOfSort = GlobalUtilLibrary.indexOfMax(sortOrderArray);
		var requiredCCId = CCArray[minIndexOfSort];
		var CC = manager.getProductHome().getProductByID(requiredCCId);
		var references = CC.getReferences().asList();
		var referenceExistFlag = false;
		for (var k = 0; k < references.size(); k++) {
			var referenceTypeID = references.get(k).getReferenceType().getID();
			if (referenceTypeID == 'PrimaryProductImage') {
				var referenceExistFlag = true;
				var referenceType = references.get(k).getReferenceType();
				var target = references.get(k).getTarget();
				var stylePrimaryReferences = node.getReferences(PrimaryProductImage).toArray();
				if (stylePrimaryReferences.length != 0) {
					stylePrimaryReferences[0].delete();
				}
				node.createReference(target, referenceType);
				break;
			}
		}
		if (referenceExistFlag == false) {
			returnMsg = "Missing P01 Photo";
			appliesCondition3 = false;
			webui.showAlert("Error", "Style Missing P01 Photo", returnMsg);
			return;
		}
	}
	else {
        //PPIM-10685 - Handling Error message
        if(!isCCSortOrderPresent){
            returnMsg = 'There is no CC with CC Sort Order Value.';
            node.getValue('a_error_message').setSimpleValue(returnMsg);
        } else if(!ccMarketDesignationMatching){
            returnMsg = 'There is no CC with Valid Market Designation Value i.e., '+ indexOfVar+' in this case.';
            node.getValue('a_error_message').setSimpleValue(returnMsg);
        } else if(!isCCActiveOrStatusPresent){
        	returnMsg = 'There is no CC with a LifeCycleStatus. (or) All the CCs for this Style are end-dated.';
		node.getValue('a_error_message').setSimpleValue(returnMsg);
	   } else if(!ccWaitingForStyleApproval){
            returnMsg = 'There is no CC with status "Waiting for StyleApproval"';
            node.getValue('a_error_message').setSimpleValue(returnMsg);
        }
        webui.showAlert("Error", "No CCs Ready For Approval", returnMsg);
        appliesCondition3 = false;
        return;
	}
	//////////////////////////////////////////////
	//Business Rule End: br_Copying_Image_From_CC_To_Style & br_Copying_Image_From_CC_To_Style_CA
	//////////////////////////////////////////////



	//////////////////////////////////////////////
	//Business Rule Start: StyleSizeModelApproval & StyleSizeModelApprovalCAN
	//bind node
	//bind ref_Style : Binds to - Classification Product Link Type : Parameter - SizeModelRef
	//bind ref_SKU : Binds to - Classification Product Link Type : Parameter - SKUToSizeCode
	//bind log
	//bind manager
	//bind node_Class : Binds to - Classification : Parameter - Size Model (101471)
	//////////////////////////////////////////////
	var appliesCondition4 = true;
	var classificationTypeHome = manager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
	var classificationType = classificationTypeHome.getLinkTypeByID('SizeModelRef');
	var x = node.getClassificationProductLinks(classificationType).toArray();
	var tarLen = x.length;//Target length

	if (x[0] != null && x[0] != '') {
		var a_TarObj = x[0].getClassification().getID();
		var status = x[0].getClassification().getValue("a_Size_Model_Status").getSimpleValue();
	}

	if (a_TarObj == null) {
		returnMsg += "\nNo Size Model Classification found.";
		appliesCondition3 = false;
		webui.showAlert("Error", "No Size Model Classification", returnMsg);
		return;
	}
	else {
		var refs = new java.util.ArrayList();
		refs.addAll(node.getChildren());
		if (refs.size() != 0) {
			for (var i = 0; i < refs.size(); i++) {
				var CC_ID = refs.get(i).getID();
				if (CC_ID != null) {
					var refs1 = new java.util.ArrayList();
					var SKUCheck = manager.getProductHome().getProductByID(CC_ID);
					refs1.addAll(SKUCheck.getChildren());
					if (refs1.size() != 0) {
						for (var j = 0; j < refs1.size(); j++) {
							if (refs1.get(j).getValue('a_Market_Designation').getSimpleValue().indexOf(indexOfVar) >= 0) {
								var SKU_ID = refs1.get(j).getID();
								var classificationType1 = classificationTypeHome.getLinkTypeByID('SKUToSizeCode');
								var x1 = refs1.get(j).getClassificationProductLinks(classificationType1).toArray();
								var tarLen1 = x1.length;//Target length
								if (x1[0] != null && x1[0] != '') {
									var a_TarObj1 = x1[0].getClassification().getID();
								}
								if (x1[0] != null && x1[0] != '') {
									var sku_code_id = x1[0].getClassification().getParent().getID();
								}
								else {
									var sku_code_id = 0;
									returnMsg = "SKU has no Web Size Code linked.";
									appliesCondition3 = false;
									webui.showAlert("Error", "Missing Web Size Code Link", returnMsg);
									return;
								}
								if (sku_code_id != a_TarObj) {
									returnMsg = "Size Code is missing for current Size Model.";
									appliesCondition3 = false;
									webui.showAlert("Error", "Missing Size Code", returnMsg);
									return;
								}
							}
						}
					}
					else {
						returnMsg = "No Skus found.";
						appliesCondition3 = false;
						webui.showAlert("Error", "SKUs Not Found", returnMsg);
						return;
					}
				}
				else {
					returnMsg = "No CC found.";
					appliesCondition3 = false;
					webui.showAlert("Error", "CCs Not Found", returnMsg);
					return;
				}
			}
		}
		else {
			returnMsg = "Style has no CC";
			appliesCondition3 = false;
			webui.showAlert("Error", "Style Missing CC", returnMsg);
			return;
		}
	}
	//////////////////////////////////////////////
	//Business Rule End: StyleSizeModelApproval & StyleSizeModelApprovalCAN
	//////////////////////////////////////////////



	//////////////////////////////////////////////
	//Business Rule Start: StyleMandatoryAttributeCheck
	//bind node
	//bind log
	//bind agRequired : Binds to - Attribute Group : Parameter - ag_Required_Style_Fields
	//////////////////////////////////////////////
	var appliesCondition4 = true;
	//Check to Ignore web related validations for Non Merch Style - PPIM-1406
	var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
	if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")) {
		var obj = node.getObjectType().getID();
		if (obj == "Style") {
			var sAttributes = new java.util.ArrayList();
			sAttributes.addAll(agRequired.getAllAttributes());
			for (var i = 0; i < sAttributes.size(); i++) {
				var attr = sAttributes.get(i).getID();
				var val = node.getValue(attr).getSimpleValue();
				if (val == null || val == '') {
					var msg = "Mandatory " + attr + " is missing";
					node.getValue("a_error_message").setSimpleValue(msg);
					returnMsg = "Missing mandatory attribute " + attr + ". Completeness Check failed.";
					appliesCondition4 = false;
					webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
					return;
				}
			}
		}
		else {
			returnMsg = "The object is not a Style";
			appliesCondition4 = false;
			webui.showAlert("Error", "Incorrect Object Type", returnMsg);
			return;
		}
	}
	//////////////////////////////////////////////
	//Business Rule End: StyleMandatoryAttributeCheck
	//////////////////////////////////////////////



	//////////////////////////////////////////////
	//Business Rule Start: NonMerchApprovalValidation
	//bind node
	//bind log
	//////////////////////////////////////////////
	//validation for Non Merch CC pre-approval - PPIM-1406
	var appliesCondition5 = true;
	var nonMerchType = null;
	var objType = node.getObjectType().getID();
	if (objType == "Style") {
		nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
			|| nonMerchType == "GIFTS"
			|| nonMerchType == "MONOGRAM SERVICE"
			|| nonMerchType == "PREMIUM GIFT BOXES"
			|| nonMerchType == "PREMIUM GIFT BOXES SVC"
			|| nonMerchType == "STORED VALUE CARDS FIXED"
			|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS"
			|| nonMerchType == "STORED VALUE CARDS OPEN") {
			if (node.getName() == null) {
				returnMsg = "Non-Merch Style name is required for approval.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
				return;
			}
			if (node.getValue("a_Copy_Complete_Status").getSimpleValue() != "Complete") {
				returnMsg = "Copy Status should be Complete for Style approval.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Incorrect Copy Status", returnMsg);
				return;
			}
			// Style publication date is required if it is non merch style. PPIM-2719
			if (node.getValue("a_Style_Start_Date").getSimpleValue() == "" || node.getValue("a_Style_Start_Date").getSimpleValue() == null) {
				returnMsg = "Required field of Style Publication Date is missing.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
				return;
			}
		}
	}
	else if (objType == "CustomerChoice") {
		nonMerchType = node.getParent().getValue("a_product_merch_type").getSimpleValue();
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
			|| nonMerchType == "GIFTS"
			|| nonMerchType == "MONOGRAM SERVICE"
			|| nonMerchType == "PREMIUM GIFT BOXES"
			|| nonMerchType == "PREMIUM GIFT BOXES SVC"
			|| nonMerchType == "STORED VALUE CARDS FIXED"
			|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS"
			|| nonMerchType == "STORED VALUE CARDS OPEN") {
			if (node.getName() == null) {
				returnMsg = "Non-Merch CC name is required for approval.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
				return;
			}
			if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
				|| nonMerchType == "GIFTS"
				|| nonMerchType == "MONOGRAM SERVICE"
				|| nonMerchType == "PREMIUM GIFT BOXES"
				|| nonMerchType == "PREMIUM GIFT BOXES SVC"
				|| nonMerchType == "STORED VALUE CARDS OPEN") {
				if (node.getValue("a_NonMerch_Price").getSimpleValue() == null) {
					returnMsg = "Non-Merch CC Price is required for approval.";
					appliesCondition5 = false;
					webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
					return;
				}
			}
			// CC publication date is required if it is non merch CC. PPIM-2719
			if (node.getValue("a_CC_Start_Date").getSimpleValue() == "" || node.getValue("a_CC_Start_Date").getSimpleValue() == null) {
				returnMsg = "Required field of CC Publication Date is missing.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
				return;
			}
		}
	}
	else if (objType == "SKU") {
		nonMerchType = node.getParent().getParent().getValue("a_product_merch_type").getSimpleValue();
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
			|| nonMerchType == "GIFTS"
			|| nonMerchType == "MONOGRAM SERVICE"
			|| nonMerchType == "PREMIUM GIFT BOXES"
			|| nonMerchType == "PREMIUM GIFT BOXES SVC"
			|| nonMerchType == "STORED VALUE CARDS FIXED"
			|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS"
			|| nonMerchType == "STORED VALUE CARDS OPEN") {
			if (node.getName() == null) {
				returnMsg = "Non-Merch SKU name is required for approval.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
				return;
			}
			if (nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS") {
				if (node.getValue("a_NonMerch_Price").getSimpleValue() == null) {
					returnMsg = "Non-Merch SKU Price is required for approval.";
					appliesCondition5 = false;
					webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
					return;
				}
			}
			if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
				|| nonMerchType == "GIFTS"
				|| nonMerchType == "MONOGRAM SERVICE"
				|| nonMerchType == "PREMIUM GIFT BOXES"
				|| nonMerchType == "PREMIUM GIFT BOXES SVC"
				|| nonMerchType == "STORED VALUE CARDS OPEN") {
				if (node.getValue("a_NonMerch_Price").getSimpleValue() != node.getParent().getValue("a_NonMerch_Price").getSimpleValue()) {
					returnMsg = "Non-Merch Price inheritance issue. Please remove Non Merch Price from SKU.";
					appliesCondition5 = false;
					webui.showAlert("Error", "Non-Merch Price Issue", returnMsg);
					return;
				}
			}
		}
	}
	//////////////////////////////////////////////
	//Business Rule End: NonMerchApprovalValidation
	//////////////////////////////////////////////



	//////////////////////////////////////////////
	//Business Rule Start: Local JavaScript Condition #2 from br_Style_Enrichment_Final_Validation & br_Style_Enrichment_Final_Validation_CAN
	//bind node
	//////////////////////////////////////////////
	// do not check Search color for Non-Merch Styles. PPIM-2719
	var appliesCondition6 = true;
	//merchType variable defined earlier

	if (merchType == "COMPLIMENTARY GIFT BOXES"
		|| merchType == "GIFTS"
		|| merchType == "MONOGRAM SERVICE"
		|| merchType == "PREMIUM GIFT BOXES"
		|| merchType == "PREMIUM GIFT BOXES SVC"
		|| merchType == "STORED VALUE CARDS OPEN"
		|| merchType == "STORED VALUE CARDS FIXED"
		|| merchType == "STORED VALUE CARDS FIXED OPTIONS") {
		// non merch style. return true
		appliesCondition6 = true;
	}

	var CCchildren = node.getChildren();
	//var returnMsg = null;
	if (CCchildren.size() != 0) {
		for (var i = 0; i < CCchildren.size(); i++) {
			var child = CCchildren.get(i);
			if (child.getValue('a_Market_Designation').getSimpleValue().indexOf(indexOfVar) >= 0) {
				//3664 search color attribute was updated in workflow to the calc attribute, changed here to reflect.
				var searchColor = child.getValue("a_Search_Color_Calc").getSimpleValue();
				//https://gapinc.atlassian.net/browse/PPIM-12807 
			     var brand = child.getValue("a_Brand_Number").getSimpleValue(); 
				if (searchColor == null && brand!='GPS') {
					if (returnMsg == null || returnMsg == "") {
						returnMsg = "CC Search Color is missing, Please update it using CC Search Override Color (or) Color Palette Search Color for CC ID: " + child.getID();
					}
					else {
						returnMsg = returnMsg + " , " + child.getID();
					}
				}
			}
		}
		if (returnMsg != null && returnMsg != '') {
			appliesCondition6 = false;
			webui.showAlert("Error", "Missing Search Color", returnMsg);
			return;
		}
		else {
			appliesCondition6 = true;
		}
	}
	//////////////////////////////////////////////
	//Business Rule End: Local JavaScript Condition #2 from br_Style_Enrichment_Final_Validation & br_Style_Enrichment_Final_Validation_CAN
	//////////////////////////////////////////////

	//if the appliesCondition1-6 and appliesConditionConext are true, 
	//then trigger the Style from the current state to the next Target State of "End"
	if (appliesCondition1 == true && appliesCondition2 == true && appliesCondition3 == true && appliesCondition4 == true
		&& appliesCondition5 == true && appliesCondition6 == true && appliesConditionConext == true) {
		var workflowIDUS = "wf_NewStyleEnrichment";
		var currentStateIDUS = "NewStyleEnrich_Final";
		var workflowIDCA = "wf_NewStyleEnrichmentCanada";
		var currentStateIDCA = "NewStyleEnrich_Final";
		var eventID = "FinalValidation";
		if (context == "US") {
			var task = node.getTaskByID(workflowIDUS, currentStateIDUS);
			task.triggerByID(eventID, "Submitting Style from \'NewStyleEntrich_WebMerch1\' to \'NewStyleEnrich_WebMerch2\'");
			/*if(!node.isInState(workflowIDUS, "NewStyleEnrich_WebMerch2")|| !node.isInWorkflow(workflowIDUS)){
				returnMsg = 'The Final Validation could not be completed for the Style.';
				webui.showAlert("Error","Workflow Submission Failed",returnMsg);
				return;
			}*/
		}
		/*else{
			var task = node.getTaskByID(workflowIDCA, currentStateIDCA);
			task.triggerByID(eventID, "Submitting Style from \'NewStyleEntrich_WebMerch1\' to \'NewStyleEnrich_WebMerch2\'");
			if(!node.isInState(workflowIDCA, "End")|| !node.isInWorkflow(workflowIDCA)){
				returnMsg = 'The Final Validation could not be completed for the Style.';
				webui.showAlert("Error","Workflow Submission Failed",returnMsg);
				return;
			}
		}*/
	}
}
else if (currentContext == "EN_CA") {
	//
	// start JavaScriptBusinessCondirionsWithBinds
	//
	var appliesCondition2 = true;
	//a_Style_Start_Date = if start date is empty, enter today's date 
	// do not enter today's date for Non Merch products. PPIM-2719
	var merchType = node.getValue("a_product_merch_type").getSimpleValue();
	var nonMerch = false;
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
	if (!nonMerch) {
		logger.info("setting date");
		if (node.getValue("a_Style_Start_Date").getSimpleValue() == "" || node.getValue("a_Style_Start_Date").getSimpleValue() == null) {
			var today = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
			node.getValue("a_Style_Start_Date").setSimpleValue(iso.format(today));
		}
	}

	//added as part of 2524
	var Style_ID = node.getID();
	// current time stamp
	var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
	var now = java.time.ZonedDateTime.now().minusDays(30);
	var final_date = now.format(formatter);
	//log.info(final_date);

	//////// CA Context //////////
	manager.executeInContext('EN_CA', function (caContextManager) {
		var caCurrentProduct = caContextManager.getProductHome().getProductByID(Style_ID);
		/////New Color:
		var Style_Start_Date = caCurrentProduct.getValue("a_Style_Start_Date").getSimpleValue();
		//log.info(Style_Start_Date);
		if (Style_Start_Date != null) {
			if (Style_Start_Date > final_date || Style_Start_Date == final_date) {
				caCurrentProduct.getValue("a_New_Style").setSimpleValue("Yes");
				//log.info(enCurrentProduct.getValue("a_New_Style").getSimpleValue());
			}
			else {
				caCurrentProduct.getValue("a_New_Style").setSimpleValue("No");
				//log.info(caCurrentProduct.getValue("a_New_Style").getSimpleValue());
			}
		}
	})
	///////////////////////////////

	var isErrorOccurred = false;
	var errorMsg = '';
	var existingErrorMsg = '' + node.getValue('a_error_message').getSimpleValue();

	var marketCodes = node.getValue('a_Style_Market_Designation').getSimpleValue();
	//var replicateEngCopy = node.getValue('a_Replicate_US_English_Copy').getSimpleValue();
	//var translationUrgency = node.getValue('a_Translation_Urgency').getSimpleValue();
	// in Style Final Validation, need to check if EN_CA contains data for Copy. Translation may not have come back yet so FR_CA may still be empty.
	if (marketCodes.indexOf("CAN") >= 0) {
		var result = StyleUtilLibrary.checkAttributesAndName(node, manager, currentContext);
		if (result != true) {
			appliesCondition2 = false;
			isErrorOccurred = true;
			errorMsg = '' + result;
			webui.showAlert("Error", "Style missing data in CA context", errorMsg);
			return;
		}

		if (!isErrorOccurred) {
			var lastModifiedUser = node.getRevision().getUserID();
			if (lastModifiedUser.toUpperCase() != "STIBOCATALOGSYNCUSER") {
				var translationStatus = node.getValue('a_Translation_Status').getSimpleValue();
				//if (translationStatus != 'Submitted' && translationStatus != 'Complete') {
				//PPIM-2940 - Logic updated to only consider Translation Status = Complete for CAN Workflow approval
				if (!(translationStatus == 'Complete')) {
					//return "Style contains CA market and Translation Request has not been submitted.";
					//errorMsg = "Style contains CA market and Translation Request has not been submitted.";
					errorMsg = "Style contains CA market and Translation Request Status is not Complete.";
					isErrorOccurred = true;
					appliesCondition2 = false;
					webui.showAlert("Error", node.getName(), errorMsg)
					return;
				}
			}
			else {
				node.getValue("a_Translation_Status").setSimpleValue("Complete");
			}
		}
	}

	if (!isErrorOccurred) {
		if (marketCodes.indexOf("US") >= 0) {
			var result = StyleUtilLibrary.checkAttributesAndName(node, manager, currentContext);
			if (result != true) {
				appliesCondition2 = false;
				isErrorOccurred = true;
				errorMsg = '' + result;
				webui.showAlert("Error", "Style missing data in US context.", errorMsg);
				return;
			}
		}
	}

	if (!isErrorOccurred) {
		//checking if at least one CC is in "Waiting for Style Approval"
		var style = manager.getProductHome().getProductByID(node.getID());
		var CCList = style.getChildren();
		var ccWaitingForStyleApproval = false;

		if (CCList.size() > 0) {
			for (var i = 0; i < CCList.size(); i++) {
				if (CCList.get(i).getValue('a_Market_Designation').getSimpleValue().indexOf("CAN") >= 0) {
					if (CCList.get(i).getValue('a_CC_Life_Cycle_Status').getLOVValue().getID() == "WAITING_FOR_STYLE_APPROVAL") {
						ccWaitingForStyleApproval = true;
						break;
					}
				}
			}
			if (ccWaitingForStyleApproval == false) {
				//return 'There should be a tleast one Ready For Approval CC before approving the Style.';
				errorMsg = 'There should be at least one Ready For Approval CC before approving the Style.';
				isErrorOccurred = true;
				appliesCondition2 = false;
				webui.showAlert("Error", node.getName(), errorMsg);
				return;
			}

		}
		else {
			//return 'The Style does not contain any CC. Please add CC and try again.';
			errorMsg = 'The Style does not contain any CC. Please add CC and try again.';
			isErrorOccurred = true;
			appliesCondition2 = false;
			webui.showAlert("Error", node.getName(), errorMsg);
			return;
		}
	}

	if (!isErrorOccurred) {
		//Block to ignore Non-Merch Style for Web Categorization validation - PPIM-1406
		var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
		if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")) {

			// check if the Style has Primary Web Category assigned 
			var classificationTypeHome = manager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
			var classificationType = classificationTypeHome.getLinkTypeByID('StyleToWebSubCategoryRef');
			var classificationLinkList = node.getClassificationProductLinks(classificationType).toArray();
			var classificationErrorFlag = false;
			if (classificationLinkList.length == 0) {

				var CCList = style.getChildren();
				if (CCList.size() > 0) {
					for (var i = 0; i < CCList.size(); i++) {
						var cc = CCList.get(i);
						var marketDesignation = cc.getValue('a_Market_Designation').getSimpleValue();
						var lifeCycleStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
						if (marketDesignation.contains('CAN') && lifeCycleStatus != "DRAFT") {
							var isCCActive = false;
							var ccDeactivationDate = cc.getValue('a_CC_End_Date').getSimpleValue();
							if (ccDeactivationDate == null) {
								isCCActive = true;
							}
							else {
								var ccDeactivationDateFlag = false;
								var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
								var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");
								var now = java.time.ZonedDateTime.now();
								var current = now.format(formatter);
								ccDeactivationDate = simpleDateFormat.parse(ccDeactivationDate);
								current = simpleDateFormat.parse(current);
								if (current.after(ccDeactivationDate) || current.compareTo(ccDeactivationDate) == 0) {
									ccDeactivationDateFlag = true;
								}

								if (ccDeactivationDateFlag == false) {
									isCCActive = true;
								}
							}
							if (isCCActive == true) {

								var ccClassificationLinkList = cc.getClassificationProductLinks(classificationType).toArray();
								if (ccClassificationLinkList.length == 0) {
									classificationErrorFlag = true;
									break;
								}
							}
						}
					}
				}

			}
			if (classificationErrorFlag == true) {
				//return 'Style does not have any Web Categories assigned';
				errorMsg = 'Style or CC missing web categorization';
				isErrorOccurred = true;
				appliesCondition2 = false;
				webui.showAlert("Error", node.getName(), errorMsg);
				return;
			}
			else {
				var primaryCategoryTrueFlag = false;
				var pCatStyle = node.getValue("a_Primary_Category").getSimpleValue();
				if (pCatStyle != null) {
					primaryCategoryTrueFlag = true;
				}
				/*for(var i =0;i<classificationLinkList.length;i++){
					var primaryCategory = classificationLinkList[i].getValue('a_Primary_Category').getSimpleValue();
					if(primaryCategory == 'Y'){
						primaryCategoryTrueFlag= true;
						break;
					}
				}*/
				if (primaryCategoryTrueFlag == false) {
					//return 'There should be at least one Web Category with Primary Category as "Y"';
					//return 'There should be at least one Primary Category associated with Style';
					errorMsg = 'There should be at least one Primary Category associated with Style';
					isErrorOccurred = true;
					appliesCondition2 = false;
					webui.showAlert("Error", node.getName(), errorMsg);
					return;
				}
			}
		}
	}
	/*
	if (isErrorOccurred) {
		node.getValue('a_error_message').setSimpleValue(errorMsg);
		return errorMsg;
	}
		
	return true;
	*/
	//
	// end JavaScriptBusinessCondirionsWithBinds
	//

	//
	// start br_Copy_Image_From_CC_to_Style_CAN
	//
	var appliesCondition3 = true;
	var style = manager.getProductHome().getProductByID(node.getID());
	var CCList = style.getChildren();
	var CCArray = [];
	var sortOrderArray = [];
	for (var i = 0; i < CCList.size(); i++) {
		var sortOrder = CCList.get(i).getValue('a_CC_Sort_Order').getSimpleValue();
		if (CCList.get(i).getValue('a_Market_Designation').getSimpleValue().indexOf("CAN") >= 0) {
			var status = CCList.get(i).getValue('a_CC_Life_Cycle_Status').getLOVValue().getID();
			if (status == "WAITING_FOR_STYLE_APPROVAL") {
				CCArray.push(CCList.get(i).getID());
				sortOrderArray.push(sortOrder);
			}
		}
	}

	if (sortOrderArray.length != 0) {
		var minIndexOfSort = GlobalUtilLibrary.indexOfMax(sortOrderArray);
		var requiredCCId = CCArray[minIndexOfSort];
		var CC = manager.getProductHome().getProductByID(requiredCCId);
		var references = CC.getReferences().asList();
		var referenceExistFlag = false;
		for (var k = 0; k < references.size(); k++) {
			var referenceTypeID = references.get(k).getReferenceType().getID();
			if (referenceTypeID == 'PrimaryProductImage') {
				var referenceExistFlag = true;
				var referenceType = references.get(k).getReferenceType();
				var target = references.get(k).getTarget();
				var stylePrimaryReferences = node.getReferences(PrimaryProductImage).toArray();
				if (stylePrimaryReferences.length != 0) {
					stylePrimaryReferences[0].delete();
				}
				node.createReference(target, referenceType);
				break;
			}

		}

		if (referenceExistFlag == false) {
			node.getValue('a_error_message').setSimpleValue("Missing P01 Photo");
			errorMsg = "Missing P01 Photo";
			appliesCondition3 = false;
			webui.showAlert("Error", node.getName(), errorMsg);
			return;
		}
	}
	//This else is making the rest of the code unreachable
	else {
		//node.getValue('a_error_message').setSimpleValue("There is no CC with status 'Ready For Approval'");
		errorMsg = "There is no CC with status 'Ready For Approval'";
		appliesCondition3 = false;
		webui.showAlert("Error", "There is no CC with status 'Ready For Approval'", errorMsg);
		return;
	}
	
	//
	// end br_Copy_Image_From_CC_to_Style_CAN
	//

	//
	// start StyleSizeModelApprovalCAN
	//
	var appliesCondition4 = true;
	var result = true;
	var classificationTypeHome = manager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
	var classificationType = classificationTypeHome.getLinkTypeByID('SizeModelRef');
	var x = node.getClassificationProductLinks(classificationType).toArray();
	var tarLen = x.length;//Target length
	if (x[0] != null && x[0] != '') {
		var a_TarObj = x[0].getClassification().getID();
		var status = x[0].getClassification().getValue("a_Size_Model_Status").getSimpleValue();

		// PPIM-3306 - Remove the check of size model status required to be in "Approved" workspace status for New style enrichment workflow style approval.
		/*
		if (status != "approved"){
		result = "The size Model is not in approved status.";
		}
		*/
	}

	//var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("SizeModelRef");
	//log.info("style classification code: "+linkType.getID());
	if (a_TarObj == null) {
		result = "No Size Model Classification found.";
		appliesCondition3 = false;
		webui.showAlert("Error", node.getName(), result);
		return;
	}
	else {
		var refs = new java.util.ArrayList();
		refs.addAll(node.getChildren());
		//log.info("CC number "+refs.size());
		if (refs.size() != 0) {
			for (var i = 0; i < refs.size(); i++) {
				var CC_ID = refs.get(i).getID();
				//log.info("CC"+CC_ID);
				if (CC_ID != null) {
					var refs1 = new java.util.ArrayList();
					var SKUCheck = manager.getProductHome().getProductByID(CC_ID);
					//log.info("test: "+SKUCheck);
					refs1.addAll(SKUCheck.getChildren());
					if (refs1.size() != 0) {
						for (var j = 0; j < refs1.size(); j++) {
							if (refs1.get(j).getValue('a_Market_Designation').getSimpleValue().indexOf("CAN") >= 0) {
								var SKU_ID = refs1.get(j).getID();
								//var sku_class = manager.getProductHome().getProductByID(SKU_ID).getClassificationProductLinkTypeByID("SKUToSizeCode");
								var classificationType1 = classificationTypeHome.getLinkTypeByID('SKUToSizeCode');
								var x1 = refs1.get(j).getClassificationProductLinks(classificationType1).toArray();
								var tarLen1 = x1.length;//Target length
								if (x1[0] != null && x1[0] != '') {
									var a_TarObj1 = x1[0].getClassification().getID();
								}

								if (x1[0] != null && x1[0] != '') {
									var sku_code_id = x1[0].getClassification().getParent().getID();
									// PPIM-3306 - Remove the check of size model status required to be in "Approved" workspace status for New style enrichment workflow style approval.
									/* 
									var status1 = x1[0].getClassification().getParent().getValue("a_Size_Model_Status").getSimpleValue();
										if (status1 != "approved"){
										result = "The SKU's Parent Style Size Model is not in approved status.";
										}
										*/
								}
								else {
									var sku_code_id = 0;
									result = "SKU has no Web Size Code linked.";
									appliesCondition3 = false;
									webui.showAlert("Error", node.getName(), result);
									return;
								}
								//log.info("style classification code: "+linkType.getID());
								if (sku_code_id != a_TarObj) {
									result = "Size Code is missing for current Size Model.";
									appliesCondition3 = false;
									webui.showAlert("Error", node.getName(), result);
									return;
								}

							}
						}
					}
					/*else{
						result="No Skus found.";
					}*/
				}
				else {
					result = "No CC found.";
					appliesCondition3 = false;
					webui.showAlert("Error", node.getName(), result);
					return;
				}
			}
		}
		else {
			result = "Style has no CC";
			appliesCondition3 = false;
			webui.showAlert("Error", node.getName(), result);
			return;
		}

	}
	/* this is causing the rest of the code to be unreachable
	if (result != true) {
		node.getValue('a_error_message').setSimpleValue(result);
	}
	return result;
	*/
	var appliesCondition4 = true;
	var result = true;
	//Check to Ignore web related validations for Non Merch Style - PPIM-1406
	var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
	if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")) {
		var obj = node.getObjectType().getID();
		if (obj == "Style") {
			var sAttributes = new java.util.ArrayList();
			sAttributes.addAll(agRequired.getAllAttributes());
			for (var i = 0; i < sAttributes.size(); i++) {
				var attr = sAttributes.get(i).getID();
				var val = node.getValue(attr).getSimpleValue();
				if (val == null || val == '') {
					var msg = "Mandatory " + attr + " is missing";
					node.getValue("a_error_message").setSimpleValue(msg);
					result = "Missing mandatory attribute " + attr + ". Completeness Check failed.";
					appliesCondition4 = false;
					webui.showAlert("Error", "Missing mandatory attribute. Completeness check failed.", result);
					return;
				}
			}
		}
		else {
			result = "The object is not a Style";
			appliesCondition4 = false;
			webui.showAlert("Error", node.getName(), result);
			return;
		}
	}
	/* This is causing the rest of the code to be unreachable
	if (result != true) {
		node.getValue('a_error_message').setSimpleValue(result);
	}

	return result;
	*/
	//
	// end StyleSizeModelApprovalCAN
	//

	//
	// start NonMerchApprovalValidation
	//
	var appliesCondition5 = true;
	var result = true;
	var nonMerchType = null;
	var objType = node.getObjectType().getID();
	if (objType == "Style") {
		nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
			|| nonMerchType == "GIFTS"
			|| nonMerchType == "MONOGRAM SERVICE"
			|| nonMerchType == "PREMIUM GIFT BOXES"
			|| nonMerchType == "PREMIUM GIFT BOXES SVC"
			|| nonMerchType == "STORED VALUE CARDS FIXED"
			|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS"
			|| nonMerchType == "STORED VALUE CARDS OPEN") {
			if (node.getName() == null) {
				result = "Non-Merch Style name is required for approval.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", result);
				return;
			}
			if (node.getValue("a_Copy_Complete_Status").getSimpleValue() != "Complete") {
				result = "Copy Status should be Complete for Style approval.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", result);
				return;
			}
			// Style publication date is required if it is non merch style. PPIM-2719
			if (node.getValue("a_Style_Start_Date").getSimpleValue() == "" || node.getValue("a_Style_Start_Date").getSimpleValue() == null) {
				//return "Required field of Style Publication Date is missing.";
				result = "Required field of Style Publication Date is missing.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", result);
				return;
			}
		}
	}
	else if (objType == "CustomerChoice") {
		nonMerchType = node.getParent().getValue("a_product_merch_type").getSimpleValue();
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
			|| nonMerchType == "GIFTS"
			|| nonMerchType == "MONOGRAM SERVICE"
			|| nonMerchType == "PREMIUM GIFT BOXES"
			|| nonMerchType == "PREMIUM GIFT BOXES SVC"
			|| nonMerchType == "STORED VALUE CARDS FIXED"
			|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS"
			|| nonMerchType == "STORED VALUE CARDS OPEN") {
			if (node.getName() == null) {
				result = "Non-Merch CC name is required for approval.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", result);
				return;
			}
			if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
				|| nonMerchType == "GIFTS"
				|| nonMerchType == "MONOGRAM SERVICE"
				|| nonMerchType == "PREMIUM GIFT BOXES"
				|| nonMerchType == "PREMIUM GIFT BOXES SVC"
				|| nonMerchType == "STORED VALUE CARDS OPEN") {
				if (node.getValue("a_NonMerch_Price").getSimpleValue() == null) {
					result = "Non-Merch CC Price is required for approval.";
					appliesCondition5 = false;
					webui.showAlert("Error", "Missing Mandatory Attribute(s)", result);
					return;
				}
			}
			// CC publication date is required if it is non merch CC. PPIM-2719
			if (node.getValue("a_CC_Start_Date").getSimpleValue() == "" || node.getValue("a_CC_Start_Date").getSimpleValue() == null) {
				//return "Required field of CC Publication Date is missing.";
				result = "Required field of CC Publication Date is missing.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", result);
				return;
			}
		}
	}
	else if (objType == "SKU") {
		nonMerchType = node.getParent().getParent().getValue("a_product_merch_type").getSimpleValue();
		if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
			|| nonMerchType == "GIFTS"
			|| nonMerchType == "MONOGRAM SERVICE"
			|| nonMerchType == "PREMIUM GIFT BOXES"
			|| nonMerchType == "PREMIUM GIFT BOXES SVC"
			|| nonMerchType == "STORED VALUE CARDS FIXED"
			|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS"
			|| nonMerchType == "STORED VALUE CARDS OPEN") {
			if (node.getName() == null) {
				result = "Non-Merch SKU name is required for approval.";
				appliesCondition5 = false;
				webui.showAlert("Error", "Missing Mandatory Attribute(s)", result);
				return;
			}
			if (nonMerchType == "STORED VALUE CARDS FIXED"
				|| nonMerchType == "STORED VALUE CARDS FIXED OPTIONS") {
				if (node.getValue("a_NonMerch_Price").getSimpleValue() == null) {
					result = "Non-Merch SKU Price is required for approval.";
					appliesCondition5 = false;
					webui.showAlert("Error", "Missing Mandatory Attribute(s)", result);
					return;
				}
			}
			if (nonMerchType == "COMPLIMENTARY GIFT BOXES"
				|| nonMerchType == "GIFTS"
				|| nonMerchType == "MONOGRAM SERVICE"
				|| nonMerchType == "PREMIUM GIFT BOXES"
				|| nonMerchType == "PREMIUM GIFT BOXES SVC"
				|| nonMerchType == "STORED VALUE CARDS OPEN") {
				if (node.getValue("a_NonMerch_Price").getSimpleValue() != node.getParent().getValue("a_NonMerch_Price").getSimpleValue()) {
					result = "Non-Merch Price inheritance issue. Please remove Non Merch Price from SKU.";
					appliesCondition5 = false;
					webi.showAlert("Error", "Non-Merch Price inheritance issue. Please remove Non Merch Price from SKU", result);
					return;
				}
			}
		}
	}
	//return result;
	//
	// end NonMerchApprovalValidation
	//

	//
	// start JavascriptBusinessConditionWithBinds
	//
	// do not check Search color for Non Merch Styles. PPIM-2719
	var appliesCondition6 = true;
	var merchType = node.getValue("a_product_merch_type").getSimpleValue();

	if (merchType == "COMPLIMENTARY GIFT BOXES"
		|| merchType == "GIFTS"
		|| merchType == "MONOGRAM SERVICE"
		|| merchType == "PREMIUM GIFT BOXES"
		|| merchType == "PREMIUM GIFT BOXES SVC"
		|| merchType == "STORED VALUE CARDS OPEN"
		|| merchType == "STORED VALUE CARDS FIXED"
		|| merchType == "STORED VALUE CARDS FIXED OPTIONS") {
		// non merch style. return true
		appliesCondition6 = true;
		//return true;
	}

	var CCchildren = node.getChildren();
	var errorMessage = null;
	if (CCchildren.size() != 0) {
		for (var i = 0; i < CCchildren.size(); i++) {
			var child = CCchildren.get(i);
			if (child.getValue('a_Market_Designation').getSimpleValue().indexOf("CAN") >= 0) {
				/*logic removed as a part of PPIM-3472
				var searchColor = child.getValue("a_Search_Color").getSimpleValue();
				*/
				var searchColor = child.getValue("a_Search_Color_Calc").getSimpleValue();
				//https://gapinc.atlassian.net/browse/PPIM-12807 
			      var brand = child.getValue("a_Brand_Number").getSimpleValue();
				if (searchColor == "" && brand!='GPS') {
					if (errorMessage == null) {
						errorMessage = "CC Search Color is missing, Please update it using CC Search Override Color (or) Color Palette Search Color for CC ID: " + child.getID();
					}
					else {
						errorMessage = errorMessage + " , " + child.getID();
					}
				}
			}
		}
		if (errorMessage != null) {
			node.getValue('a_error_message').setSimpleValue(errorMessage);
			//return errorMessage;
			appliesCondition6 = false;
			webui.showAlert("Error", "CC Search Color is missing", errorMessage);
			return;
		}
		else {
			appliesCondition6 = true;
			//return true;
		}
	}
	//
	// end JavascriptBusinessConditionWithBinds
	//
	if (appliesCondition1 == true && appliesCondition2 == true && appliesCondition3 == true && appliesCondition4 == true
		&& appliesCondition5 == true && appliesCondition6 == true && appliesConditionConext == true) {
		var workflowIDUS = "wf_NewStyleEnrichment";
		var currentStateIDUS = "NewStyleEnrich_Final";
		var workflowIDCA = "wf_NewStyleEnrichmentCanada";
		var currentStateIDCA = "NewStyleEnrich_Final";
		var eventID = "FinalValidation";
		if (context == "CA") {
			var task = node.getTaskByID(workflowIDCA, currentStateIDCA);
			task.triggerByID(eventID, "Submitting Style from \'NewStyleEntrich_WebMerch1\' to \'NewStyleEnrich_WebMerch2\'");
			/*if(!node.isInState(workflowIDUS, "NewStyleEnrich_WebMerch2")|| !node.isInWorkflow(workflowIDUS)){
				returnMsg = 'The Final Validation could not be completed for the Style.';
				webui.showAlert("Error","Workflow Submission Failed",returnMsg);
				return;
			}*/
		}
		if (context == "US") {
			var task = node.getTaskByID(workflowIDUS, currentStateIDUS);
			task.triggerByID(eventID, "Submitting Style from \'NewStyleEntrich_WebMerch1\' to \'NewStyleEnrich_WebMerch2\'");
			if(!node.isInState(workflowIDUS, "End")|| !node.isInWorkflow(workflowIDUS)){
				returnMsg = 'The Final Validation could not be completed for the Style.';
				webui.showAlert("Error","Workflow Submission Failed",returnMsg);
				return;
			}
		}
	}



}

}