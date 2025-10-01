/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ApproveNewStyleEnrichment_FV_WebUI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_ApproveNewStyleEnrichment_FV_WebUI",
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
var appliesConditionContext = true;
var appliesCondition1 = true;
var returnMsg = "";

var targetWorkflowUS = "wf_NewStyleEnrichment";
var targetState1US = "NewStyleEnrich_Final";
var targetWorkflowCA = "wf_NewStyleEnrichmentCanada";
var targetState1CA = "NewStyleEnrich_Final";
var targetWorkflowJP = "wf_NewStyleEnrichmentJapan";
var targetState1JP = "NewStyleEnrich_Final";

var currentContext = manager.getCurrentContext().getID();
var context;

//Assign context based on current context
if (currentContext == "EN_US") {
  context = "US";
}
if (currentContext == "EN_CA") {
  context = "CA";
}
if (currentContext == "FR_CA") {
  context = "CA";
}
if (currentContext == "EN_JP") {
  context = "JP";
}
if (currentContext == "JA_JP") {
  context = "JP";
}

var indexOfVar;

if (context == "US") {
  indexOfVar = "US";
}
if (context == "CA") {
  indexOfVar = "CA";
}
if (context == "JP") {
  indexOfVar = "JP";
}

//If context is NOT EN_US, EN_CA, FR_CA, EN_JP, or JA_JP then this logic will not apply
if (context != "US" && context != "CA" && context != "JP") {
  appliesConditionContext = false;
  returnMsg =
    "The New Style Enrichment Workflow can only be triggered from the EN_US, EN_CA, FR_CA, EN_JP, or JA_JP context. Please select the appropriate context and try again.";
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
      returnMsg =
        "Style is not in the 'Final Validation' state for the 'New Style Enrichment Workflow'";
      webui.showAlert("Error", "Button Does Not Apply", returnMsg);
      return;
    }
  } else {
    //Style is NOT in the target workflow
    appliesCondition1 = false;
    returnMsg = "Style is not in the 'New Style Enrichment Workflow'";
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
      returnMsg =
        "Style is not in the 'Final Validation' state for the 'New Style Enrichment Workflow Canada'";
      webui.showAlert("Error", "Button Does Not Apply", returnMsg);
      return;
    }
  } else {
    //Style is NOT in the target workflow
    appliesCondition1 = false;
    returnMsg = "Style is not in the 'New Style Enrichment Workflow Canada'";
    webui.showAlert("Error", "Button Does Not Apply", returnMsg);
    return;
  }
}
if (context == "JP") {
  //Check that the style is in the target workflow: New Style Enrichment Japan (wf_NewStyleEnrichmentJapan)
  //and that the Style is in the target states: Missing Web Merchandising State(NewStyleEntrich_WebMerch1)
  if (node.isInWorkflow(targetWorkflowJP)) {
    if (!node.isInState(targetWorkflowJP, targetState1JP)) {
      //Style is in the target workflow, but NOT in the target state
      appliesCondition1 = false;
      returnMsg =
        "Style is not in the 'Final Validation' state for the 'New Style Enrichment Workflow Japan'";
      webui.showAlert("Error", "Button Does Not Apply", returnMsg);
      return;
    }
  } else {
    //Style is NOT in the target workflow
    appliesCondition1 = false;
    returnMsg = "Style is not in the 'New Style Enrichment Workflow Japan'";
    webui.showAlert("Error", "Button Does Not Apply", returnMsg);
    return;
  }
}

/*
 * Business Rule Start: Local JavaScript Condition #1 from br_Style_Enrichment_Final_Validation & br_Style_Enrichment_Final_Validation_CAN
 * bind - node
 * bind - manager
 *
 *	-Ensure Copy attributes are filled out
 *	-All English contexts have at least STEP Name of Style and a_Overview_Bullet1 is filled
 *	-Translation status = "In Progress" or "Completed"
 */

var appliesCondition2 = true;

function checkAttributesAndName(node, manager, context) {
  var status = manager.executeInContext(context, function (enContextManager) {
    var enCurrentProduct = enContextManager
      .getProductHome()
      .getProductByID(node.getID());
    var attributeGroup = enContextManager
      .getAttributeGroupHome()
      .getAttributeGroupByID("ag_Style_Copy_Attributes");
    var attributeList = attributeGroup.getAttributes().toArray();
    var attributeExistFlag = false;

    //For each attribute in list
    for (var i = 0; i < attributeList.length; i++) {
      //If the current product's current attribute is NOT NULL or empty
      if (
        enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue() !=
        null &&
        enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue() !=
        ""
      ) {
        attributeExistFlag = true;
        break;
      }
    }

    //If attribute does not exist
    if (attributeExistFlag == false) {
      return (
        "Please fill atleast one Copy Attribute in " + context + " Context."
      );
    }

    //If STEP Name for current product is NULL or empty
    if (
      enCurrentProduct.getName() == "" ||
      enCurrentProduct.getName() == null
    ) {
      return "Please enter STEP Name for the Style in " + context + " Context.";
    }

    var bullet1 = enCurrentProduct
      .getValue("a_Overview_Bullet1")
      .getSimpleValue();

    //If Overview Bullet 1 for current product is NULL or empty
    if (bullet1 == "" || bullet1 == null) {
      return (
        "Please enter a value for a_Overview_Bullet1 in " +
        context +
        " Context."
      );
    }
    return true;
  });
  return status;
}

//a_Style_Start_Date = if start date is empty, enter today's date
//Do not enter today's date for Non-Merch products (PPIM-2719)
var merchType = node.getValue("a_product_merch_type").getSimpleValue();
var nonMerch = false;

//If merch type equals any of the following options
if (
  merchType == "COMPLIMENTARY GIFT BOXES" ||
  merchType == "GIFTS" ||
  merchType == "MONOGRAM SERVICE" ||
  merchType == "PREMIUM GIFT BOXES" ||
  merchType == "PREMIUM GIFT BOXES SVC" ||
  merchType == "STORED VALUE CARDS FIXED" ||
  merchType == "STORED VALUE CARDS FIXED OPTIONS" ||
  merchType == "STORED VALUE CARDS OPEN"
) {
  nonMerch = true;
}

//If NOT Non-Merch
if (!nonMerch) {
  //If Style Start Date is NULL or empty
  if (
    node.getValue("a_Style_Start_Date").getSimpleValue() == "" ||
    node.getValue("a_Style_Start_Date").getSimpleValue() == null
  ) {
    var today = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
    node.getValue("a_Style_Start_Date").setSimpleValue(iso.format(today));
  }
}

//PPIM-2524 addition
var Style_ID = node.getID();
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var now = java.time.ZonedDateTime.now().minusDays(30);
var final_date = now.format(formatter);

//Per given context
if (context == "US") {
  manager.executeInContext("EN_US", function (enContextManager) {
    var enCurrentProduct = enContextManager
      .getProductHome()
      .getProductByID(Style_ID);
    var Style_Start_Date = enCurrentProduct
      .getValue("a_Style_Start_Date")
      .getSimpleValue();
    //If Style Start Date is NOT NULL
    if (Style_Start_Date != null) {
      //If Stlye Start Date is greater than or equal to final date
      if (Style_Start_Date > final_date || Style_Start_Date == final_date) {
        enCurrentProduct.getValue("a_New_Style").setSimpleValue("Yes");
      } else {
        enCurrentProduct.getValue("a_New_Style").setSimpleValue("No");
      }
    }
  });
}
if (context == "CA") {
  manager.executeInContext("EN_CA", function (caContextManager) {
    var caCurrentProduct = caContextManager
      .getProductHome()
      .getProductByID(Style_ID);
    var Style_Start_Date = caCurrentProduct
      .getValue("a_Style_Start_Date")
      .getSimpleValue();
    //If Style Start Date is NOT NULL
    if (Style_Start_Date != null) {
      //If Stlye Start Date is greater than or equal to final date
      if (Style_Start_Date > final_date || Style_Start_Date == final_date) {
        caCurrentProduct.getValue("a_New_Style").setSimpleValue("Yes");
      } else {
        caCurrentProduct.getValue("a_New_Style").setSimpleValue("No");
      }
    }
  });
}
if (context == "JP") {
  manager.executeInContext("EN_JP", function (jpContextManager) {
    var jpCurrentProduct = jpContextManager
      .getProductHome()
      .getProductByID(Style_ID);
    var Style_Start_Date = jpCurrentProduct
      .getValue("a_Style_Start_Date")
      .getSimpleValue();
    //If Style Start Date is NOT NULL
    if (Style_Start_Date != null) {
      //If Stlye Start Date is greater than or equal to final date
      if (Style_Start_Date > final_date || Style_Start_Date == final_date) {
        jpCurrentProduct.getValue("a_New_Style").setSimpleValue("Yes");
      } else {
        jpCurrentProduct.getValue("a_New_Style").setSimpleValue("No");
      }
    }
  });
}

var isErrorOccurred = false;
var existingreturnMsg = "" + node.getValue("a_error_message").getSimpleValue();
var marketCodes = node.getValue("a_Style_Market_Designation").getSimpleValue();

//In Style Final Validation, need to check if EN_CA contains data for Copy
//Translation may not have come back yet so FR_CA may still be empty

//Market Code has index of CAN
if (marketCodes.indexOf("CAN") >= 0) {
  var result = StyleUtilLibrary.checkAttributesAndName(node, manager, "EN_CA");
  //If result is NOT true
  if (result != true) {
    appliesCondition2 = false;
    isErrorOccurred = true;
    errorMsg = "" + result;
    webui.showAlert("Error", "Style missing data in CA context", errorMsg);
    return;
  }

  manager.executeInContext("EN_CA", function (caContextManager) {
    var caNode = caContextManager.getProductHome().getProductByID(node.getID());

    var translationStatus = caNode
      .getValue("a_Translation_Status")
      .getSimpleValue();
    //If (translationStatus != 'Submitted' && translationStatus != 'Complete') {
    //PPIM-2940 - Logic updated to only consider Translation Status = Complete for CAN Workflow approval
    if (!(translationStatus == "Complete")) {
      //return "Style contains CA market and Translation Request has not been submitted.";
      //errorMsg = "Style contains CA market and Translation Request has not been submitted.";
      errorMsg =
        "Style contains CA market and Translation Request Status is not Complete.";
      isErrorOccurred = true;
      appliesCondition2 = false;
      webui.showAlert("Error", caNode.getName(), errorMsg);
      return;
    }
  });
}
//In Style Final Validation, need to check if EN_JP contains data for Copy
//Translation may not have come back yet so JA_JP may still be empty

//Market Code has index of CAN
else if (marketCodes.indexOf("JPN") >= 0) {
  var result = StyleUtilLibrary.checkAttributesAndName(node, manager, "EN_JP");
  //If result is NOT true
  if (result != true) {
    appliesCondition2 = false;
    isErrorOccurred = true;
    errorMsg = "" + result;
    webui.showAlert("Error", "Style missing data in JP context", errorMsg);
    return;
  }

  manager.executeInContext("EN_JP", function (jpContextManager) {
    var jpNode = jpContextManager.getProductHome().getProductByID(node.getID());

    var translationStatus = jpNode
      .getValue("a_Translation_Status")
      .getSimpleValue();
    //If (translationStatus != 'Submitted' && translationStatus != 'Complete') {
    //PPIM-2940 - Logic updated to only consider Translation Status = Complete for CAN Workflow approval
    if (!(translationStatus == "Complete")) {
      //return "Style contains CA market and Translation Request has not been submitted.";
      //errorMsg = "Style contains CA market and Translation Request has not been submitted.";
      errorMsg =
        "Style contains CA market and Translation Request Status is not Complete.";
      isErrorOccurred = true;
      appliesCondition2 = false;
      webui.showAlert("Error", jpNode.getName(), errorMsg);
      return;
    }
  });
}

//If market code equals US
if (marketCodes == "US") {
  node.getValue("a_Translation_Status").setSimpleValue("Complete");
}

//If NOT isErrorOccurred
if (!isErrorOccurred) {
  //Market Code has index of US
  if (marketCodes.indexOf("US") >= 0) {
    var result = checkAttributesAndName(node, manager, "EN_US");
    //If result is NOT true
    if (result != true) {
      appliesCondition2 = false;
      isErrorOccurred = true;
      returnMsg = "" + result;
      webui.showAlert(
        "Error",
        "Style Missing Data in EN_US Context",
        returnMsg
      );
      return;
    }
  }
}

//If NOT isErrorOccurred
if (!isErrorOccurred) {
  //Checking if at least one CC is in "Waiting for Style Approval"
  var style = manager.getProductHome().getProductByID(node.getID());
  var CCList = style.getChildren();
  var ccWaitingForStyleApproval = false;

  //If there are CCs in the list
  if (CCList.size() > 0) {
    //For each CC in list
    for (var i = 0; i < CCList.size(); i++) {
      //If CC at current position has a market designation
      if (
        CCList.get(i)
          .getValue("a_Market_Designation")
          .getSimpleValue()
          .indexOf(indexOfVar) >= 0
      ) {
        //If CC at current position has a life cycle status that is NOT equal to NULL or empty
        if (
          CCList.get(i).getValue("a_CC_Life_Cycle_Status").getLOVValue() !=
          null &&
          CCList.get(i).getValue("a_CC_Life_Cycle_Status").getLOVValue() != ""
        ) {
          //If CC at current position has a life cycle status equal to "WAITING_FOR_STYLE_APPROVAL"
          if (
            CCList.get(i)
              .getValue("a_CC_Life_Cycle_Status")
              .getLOVValue()
              .getID() == "WAITING_FOR_STYLE_APPROVAL"
          ) {
            ccWaitingForStyleApproval = true;
            break;
          }
        }
      }
    }

    //If CC is NOT waiitng for style approval
    if (ccWaitingForStyleApproval == false) {
      //Return 'There should be atleast one Ready For Approval CC before approving the Style.';
      returnMsg =
        "There should be atleast one Ready For Approval CC before approving the Style.";
      isErrorOccurred = true;
      appliesCondition2 = false;
      webui.showAlert("Error", "No Ready for Approval CC", returnMsg);
      return;
    }
  } else {
    //Return 'The Style does not contain any CC. Please add CC and try again.';
    returnMsg =
      "The Style does not contain any CC. Please add CC and try again.";
    isErrorOccurred = true;
    appliesCondition2 = false;
    webui.showAlert("Error", "No CCs on Style", returnMsg);
    return;
  }
}

//If NOT isErrorOccurred
if (!isErrorOccurred) {
  //Block to ignore Non-Merch Style for Web Categorization validation (PPIM-1406)
  var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
  //If Non-Merch type is NOT equal to one of the following types
  if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")) {
    //Check if the Style has Primary Web Category assigned
    var classificationTypeHome = manager.getHome(
      com.stibo.core.domain.classificationproductlinktype
        .ClassificationProductLinkTypeHome
    );
    var classificationType = classificationTypeHome.getLinkTypeByID(
      "StyleToWebSubCategoryRef"
    );
    var classificationLinkList = node
      .getClassificationProductLinks(classificationType)
      .toArray();

    //If Classification Link List is empty
    /*  PPIM-7616 Deprecate VMDD
    if (classificationLinkList.length == 0) {
      var myChildren = node.getChildren();
      var noWebCatFound = false;
      //For each child of node
      for (var i = 0; i < myChildren.size(); i++) {
        var ccWebCatList = myChildren
          .get(i)
          .getClassificationProductLinks(classificationType)
          .toArray();
        //If CC WebCat List is empty
        if (ccWebCatList.length == 0) {
          //Return 'Style does not have any Web Categories assigned';
          returnMsg = "Style does not have any Web Categories assigned";
          isErrorOccurred = true;
          appliesCondition2 = false;
          webui.showAlert(
            "Error",
            "Style Missing Web Categorization",
            returnMsg
          );
          return;
        }
      }
    }
    else {
    */
    var primaryCategoryTrueFlag = false;
    var pCatStyle = node.getValue("a_Primary_Category").getSimpleValue();
    //If Primary Category is NOT NULL
    if (pCatStyle != null) {
      primaryCategoryTrueFlag = true;
    }
    //https://gapinc.atlassian.net/browse/PPIM-12807
    var brand = node.getValue("a_Brand_Number").getSimpleValue();
    //If Primary Category True Flag is FALSE
    if (primaryCategoryTrueFlag == false && brand!='GPS') {
      //Return 'There should be atleast one Primary Category associated with Style';
      returnMsg =
        "There should be at least one Primary Category associated with Style";
      isErrorOccurred = true;
      appliesCondition2 = false;
      webui.showAlert(
        "Error",
        "Style Missing Primary Category Association",
        returnMsg
      );
      return;
    }
    /*  PPIM-7616 Deprecate VMDD
    }
    */
  }
}
/*
 * Business Rule End: Local JavaScript Condition #1 from br_Style_Enrichment_Final_Validation & br_Style_Enrichment_Final_Validation_CAN
 */

/*
 * Business Rule Start: br_Copying_Image_From_CC_To_Style & br_Copying_Image_From_CC_To_Style_CA
 * bind - node
 * bind - manager
 * bind - PrimaryProductImage : Binds to - Reference Type : Parameter - PrimaryProductImage
 */

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

function indexOfMax(arr) {
  //If array length equals 0
  if (arr.length == 0) {
    return -1;
  }
  var min = arr[0];
  var minIndex = 0;
  //For each position in array
  for (var i = 1; i < arr.length; i++) {
    //If current array position is less than min
    if (arr[i] < min) {
      minIndex = i;
      min = arr[i];
    }
  }
  return minIndex;
}

//For each CC in list
for (var i = 0; i < CCList.size(); i++) {
  var sortOrder = CCList.get(i).getValue("a_CC_Sort_Order").getSimpleValue();
  if (sortOrder != null) {
    //If CC at current position has a market designation
    if (
        CCList.get(i)
        .getValue("a_Market_Designation")
        .getSimpleValue()
        .indexOf(indexOfVar) >= 0
    ) {
        var today = new Date().toISOString().substring(0, 10);
        var CCEndDate = CCList.get(i).getValue('a_CC_End_Date').getSimpleValue();
        if (CCList.get(i).getValue('a_CC_Life_Cycle_Status').getSimpleValue() != null && (CCEndDate > today || CCEndDate == null)) {
            var status = CCList.get(i)
            .getValue("a_CC_Life_Cycle_Status")
            .getLOVValue()
            .getID();
            //If status is equal to "WAITING_FOR_STYLE_APPROVAL"
            //In Visual Studio Code
            if (status.toUpperCase() == "WAITING_FOR_STYLE_APPROVAL") {
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

//If sort order array is NOT empty
if (sortOrderArray.length != 0) {
  var minIndexOfSort = indexOfMax(sortOrderArray);
  var requiredCCId = CCArray[minIndexOfSort];
  var CC = manager.getProductHome().getProductByID(requiredCCId);
  var references = CC.getReferences().asList();
  var referenceExistFlag = false;

  //For each reference
  for (var k = 0; k < references.size(); k++) {
    var referenceTypeID = references.get(k).getReferenceType().getID();
    //If reference type ID equals "PrimaryProductImage"
    if (referenceTypeID == "PrimaryProductImage") {
      var referenceExistFlag = true;
      var referenceType = references.get(k).getReferenceType();
      var target = references.get(k).getTarget();
      var stylePrimaryReferences = node
        .getReferences(PrimaryProductImage)
        .toArray();
      //If Style primary references is NOT empty
      if (stylePrimaryReferences.length != 0) {
        stylePrimaryReferences[0].delete();
      }
      node.createReference(target, referenceType);
      break;
    }
  }
  //If reference does NOT exist
  if (referenceExistFlag == false) {
    returnMsg = "Missing P01 Photo";
    appliesCondition3 = false;
    webui.showAlert("Error", "Style Missing P01 Photo", returnMsg);
    return;
  }
} else {
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
  appliesCondition3 = false;
  webui.showAlert("Error", "No CCs Ready For Approval", returnMsg);
  return;
}
/*
 * Business Rule End: br_Copying_Image_From_CC_To_Style & br_Copying_Image_From_CC_To_Style_CA
 */

/*
 * Business Rule Start: StyleSizeModelApproval & StyleSizeModelApprovalCAN
 * bind - node
 * bind - ref_Style : Binds to - Classification Product Link Type : Parameter - SizeModelRef
 * bind - ref_SKU : Binds to - Classification Product Link Type : Parameter - SKUToSizeCode
 * bind - log
 * bind - manager
 * bind - node_Class : Binds to - Classification : Parameter - Size Model (101471)
 */
var appliesCondition4 = true;
var classificationTypeHome = manager.getHome(
  com.stibo.core.domain.classificationproductlinktype
    .ClassificationProductLinkTypeHome
);
var classificationType = classificationTypeHome.getLinkTypeByID("SizeModelRef");
var x = node.getClassificationProductLinks(classificationType).toArray();
var tarLen = x.length; //Target length

//If first position of classification product link (of type SizeModelRef) array is NOT NULL or empty
if (x[0] != null && x[0] != "") {
  var a_TarObj = x[0].getClassification().getID();
  var status = x[0]
    .getClassification()
    .getValue("a_Size_Model_Status")
    .getSimpleValue();
}

//If Target Object is NULL
if (a_TarObj == null) {
  returnMsg += "\nNo Size Model Classification found.";
  appliesCondition3 = false;
  webui.showAlert("Error", "No Size Model Classification", returnMsg);
  return;
} else {
  var refs = new java.util.ArrayList();
  refs.addAll(node.getChildren());
  //If there are references
  if (refs.size() != 0) {
    //For each reference
    for (var i = 0; i < refs.size(); i++) {
      var CC_ID = refs.get(i).getID();
      //If CC ID is NOT NULL
      if (CC_ID != null) {
        var refs1 = new java.util.ArrayList();
        var SKUCheck = manager.getProductHome().getProductByID(CC_ID);
        refs1.addAll(SKUCheck.getChildren());

        //If thereare references
        if (refs1.size() != 0) {
          //For each reference
          for (var j = 0; j < refs1.size(); j++) {
            //If reference has market designation
            if (
              refs1
                .get(j)
                .getValue("a_Market_Designation")
                .getSimpleValue()
                .indexOf(indexOfVar) >= 0
            ) {
              var SKU_ID = refs1.get(j).getID();
              var classificationType1 =
                classificationTypeHome.getLinkTypeByID("SKUToSizeCode");
              var x1 = refs1
                .get(j)
                .getClassificationProductLinks(classificationType1)
                .toArray();
              var tarLen1 = x1.length;
              //If first position of classification product link (of type SKUToSizeCode) array is NOT NULL or empty
              if (x1[0] != null && x1[0] != "") {
                //Does not look like it is used in other parts of code, potential candidate for removal
                var a_TarObj1 = x1[0].getClassification().getID();
              }
              //If first position of classification product link (of type SKUToSizeCode) array is NOT NULL or empty
              if (x1[0] != null && x1[0] != "") {
                var sku_code_id = x1[0].getClassification().getParent().getID();
              } else {
                var sku_code_id = 0;
                returnMsg = "SKU has no Web Size Code linked.";
                appliesCondition3 = false;
                webui.showAlert(
                  "Error",
                  "Missing Web Size Code Link",
                  returnMsg
                );
                return;
              }
              //If SKU Code ID does NOT equal
              if (sku_code_id != a_TarObj) {
                returnMsg = "Size Code is missing for current Size Model.";
                appliesCondition3 = false;
                webui.showAlert("Error", "Missing Size Code", returnMsg);
                return;
              }
            }
          }
        } else {
          returnMsg = "No Skus found.";
          appliesCondition3 = false;
          webui.showAlert("Error", "SKUs Not Found", returnMsg);
          return;
        }
      } else {
        returnMsg = "No CC found.";
        appliesCondition3 = false;
        webui.showAlert("Error", "CCs Not Found", returnMsg);
        return;
      }
    }
  } else {
    returnMsg = "Style has no CC";
    appliesCondition3 = false;
    webui.showAlert("Error", "Style Missing CC", returnMsg);
    return;
  }
}
/*
 * Business Rule End: StyleSizeModelApproval & StyleSizeModelApprovalCAN
 */

/*
 * Business Rule Start: StyleMandatoryAttributeCheck
 * bind - node
 * bind - log
 * bind - agRequired : Binds to - Attribute Group : Parameter - ag_Required_Style_Fields
 */

var appliesCondition4 = true;
//Check to Ignore web related validations for Non Merch Style (PPIM-1406)
var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
//If Non-Merch type is NOT equal to one of the following types
if (
  !(
    nonMerchType == "COMPLIMENTARY GIFT BOXES" ||
    nonMerchType == "GIFTS" ||
    nonMerchType == "MONOGRAM SERVICE" ||
    nonMerchType == "PREMIUM GIFT BOXES" ||
    nonMerchType == "PREMIUM GIFT BOXES SVC" ||
    nonMerchType == "STORED VALUE CARDS FIXED" ||
    nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" ||
    nonMerchType == "STORED VALUE CARDS OPEN"
  )
) {
  var obj = node.getObjectType().getID();

  //If Object Type equals Style
  if (obj == "Style") {
    var sAttributes = new java.util.ArrayList();
    sAttributes.addAll(agRequired.getAllAttributes());

    //For each attribute
    for (var i = 0; i < sAttributes.size(); i++) {
      var attr = sAttributes.get(i).getID();
      var val = node.getValue(attr).getSimpleValue();

      //If attirbute value is NULL or empty
      if (val == null || val == "") {
        var msg = "Mandatory " + attr + " is missing";
        node.getValue("a_error_message").setSimpleValue(msg);
        returnMsg =
          "Missing mandatory attribute " +
          attr +
          ". Completeness Check failed.";
        appliesCondition4 = false;
        webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
        return;
      }
    }
  } else {
    returnMsg = "The object is not a Style";
    appliesCondition4 = false;
    webui.showAlert("Error", "Incorrect Object Type", returnMsg);
    return;
  }
}
/*
 * Business Rule End: StyleMandatoryAttributeCheck
 */

/*
 * Business Rule Start: NonMerchApprovalValidation
 * bind - node
 * bind - log
 */

//validation for Non Merch CC pre-approval (PPIM-1406)
var appliesCondition5 = true;
var nonMerchType = null;
var objType = node.getObjectType().getID();

//If Object Type equals Style
if (objType == "Style") {
  nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();

  //If Non-Merch type is equal to one of the following types
  if (
    nonMerchType == "COMPLIMENTARY GIFT BOXES" ||
    nonMerchType == "GIFTS" ||
    nonMerchType == "MONOGRAM SERVICE" ||
    nonMerchType == "PREMIUM GIFT BOXES" ||
    nonMerchType == "PREMIUM GIFT BOXES SVC" ||
    nonMerchType == "STORED VALUE CARDS FIXED" ||
    nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" ||
    nonMerchType == "STORED VALUE CARDS OPEN"
  ) {
    //If node name is NULL
    if (node.getName() == null) {
      returnMsg = "Non-Merch Style name is required for approval.";
      appliesCondition5 = false;
      webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
      return;
    }

    //If node copy complete status is NOT "Complete"
    if (
      node.getValue("a_Copy_Complete_Status").getSimpleValue() != "Complete"
    ) {
      returnMsg = "Copy Status should be Complete for Style approval.";
      appliesCondition5 = false;
      webui.showAlert("Error", "Incorrect Copy Status", returnMsg);
      return;
    }

    //Style publication date is required if it is non merch style (PPIM-2719)
    if (
      node.getValue("a_Style_Start_Date").getSimpleValue() == "" ||
      node.getValue("a_Style_Start_Date").getSimpleValue() == null
    ) {
      returnMsg = "Required field of Style Publication Date is missing.";
      appliesCondition5 = false;
      webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
      return;
    }
  }

  //If Object Type equals CC
} else if (objType == "CustomerChoice") {
  nonMerchType = node
    .getParent()
    .getValue("a_product_merch_type")
    .getSimpleValue();

  //If Non-Merch type is equal to one of the following types
  if (
    nonMerchType == "COMPLIMENTARY GIFT BOXES" ||
    nonMerchType == "GIFTS" ||
    nonMerchType == "MONOGRAM SERVICE" ||
    nonMerchType == "PREMIUM GIFT BOXES" ||
    nonMerchType == "PREMIUM GIFT BOXES SVC" ||
    nonMerchType == "STORED VALUE CARDS FIXED" ||
    nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" ||
    nonMerchType == "STORED VALUE CARDS OPEN"
  ) {
    //If node name is NULL
    if (node.getName() == null) {
      returnMsg = "Non-Merch CC name is required for approval.";
      appliesCondition5 = false;
      webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
      return;
    }

    //If Non-Merch type is equal to one of the following types
    if (
      nonMerchType == "COMPLIMENTARY GIFT BOXES" ||
      nonMerchType == "GIFTS" ||
      nonMerchType == "MONOGRAM SERVICE" ||
      nonMerchType == "PREMIUM GIFT BOXES" ||
      nonMerchType == "PREMIUM GIFT BOXES SVC" ||
      nonMerchType == "STORED VALUE CARDS OPEN"
    ) {
      //If Non-Merch price equals NULL
      if (node.getValue("a_NonMerch_Price").getSimpleValue() == null) {
        returnMsg = "Non-Merch CC Price is required for approval.";
        appliesCondition5 = false;
        webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
        return;
      }
    }

    //CC publication date is required if it is non merch CC (PPIM-2719)
    if (
      node.getValue("a_CC_Start_Date").getSimpleValue() == "" ||
      node.getValue("a_CC_Start_Date").getSimpleValue() == null
    ) {
      returnMsg = "Required field of CC Publication Date is missing.";
      appliesCondition5 = false;
      webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
      return;
    }
  }

  //If Object Type equals SKU
} else if (objType == "SKU") {
  nonMerchType = node
    .getParent()
    .getParent()
    .getValue("a_product_merch_type")
    .getSimpleValue();

  //If Non-Merch type is equal to one of the following types
  if (
    nonMerchType == "COMPLIMENTARY GIFT BOXES" ||
    nonMerchType == "GIFTS" ||
    nonMerchType == "MONOGRAM SERVICE" ||
    nonMerchType == "PREMIUM GIFT BOXES" ||
    nonMerchType == "PREMIUM GIFT BOXES SVC" ||
    nonMerchType == "STORED VALUE CARDS FIXED" ||
    nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" ||
    nonMerchType == "STORED VALUE CARDS OPEN"
  ) {
    //If node name is NULL
    if (node.getName() == null) {
      returnMsg = "Non-Merch SKU name is required for approval.";
      appliesCondition5 = false;
      webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
      return;
    }

    //If Non-Merch type is equal to one of the following types
    if (
      nonMerchType == "STORED VALUE CARDS FIXED" ||
      nonMerchType == "STORED VALUE CARDS FIXED OPTIONS"
    ) {
      //If Non-Merch price equals NULL
      if (node.getValue("a_NonMerch_Price").getSimpleValue() == null) {
        returnMsg = "Non-Merch SKU Price is required for approval.";
        appliesCondition5 = false;
        webui.showAlert("Error", "Missing Mandatory Attribute(s)", returnMsg);
        return;
      }
    }

    //If Non-Merch type is equal to one of the following types
    if (
      nonMerchType == "COMPLIMENTARY GIFT BOXES" ||
      nonMerchType == "GIFTS" ||
      nonMerchType == "MONOGRAM SERVICE" ||
      nonMerchType == "PREMIUM GIFT BOXES" ||
      nonMerchType == "PREMIUM GIFT BOXES SVC" ||
      nonMerchType == "STORED VALUE CARDS OPEN"
    ) {
      //If Non-Merch price equals NULL
      if (
        node.getValue("a_NonMerch_Price").getSimpleValue() !=
        node.getParent().getValue("a_NonMerch_Price").getSimpleValue()
      ) {
        returnMsg =
          "Non-Merch Price inheritance issue. Please remove Non Merch Price from SKU.";
        appliesCondition5 = false;
        webui.showAlert("Error", "Non-Merch Price Issue", returnMsg);
        return;
      }
    }
  }
}
/*
 * Business Rule End: NonMerchApprovalValidation
 */

/*
 * Business Rule Start: Local JavaScript Condition #2 from br_Style_Enrichment_Final_Validation & br_Style_Enrichment_Final_Validation_CAN
 * bind - node
 */

//Do not check Search color for Non-Merch Styles (PPIM-2719)
var appliesCondition6 = true;

//If Non-Merch type is equal to one of the following types
if (
  merchType == "COMPLIMENTARY GIFT BOXES" ||
  merchType == "GIFTS" ||
  merchType == "MONOGRAM SERVICE" ||
  merchType == "PREMIUM GIFT BOXES" ||
  merchType == "PREMIUM GIFT BOXES SVC" ||
  merchType == "STORED VALUE CARDS OPEN" ||
  merchType == "STORED VALUE CARDS FIXED" ||
  merchType == "STORED VALUE CARDS FIXED OPTIONS"
) {
  //Non-Merch style
  //Return true
  appliesCondition6 = true;
}

var CCchildren = node.getChildren();

//If CC has children
if (CCchildren.size() != 0) {
  //For each child of CC
  for (var i = 0; i < CCchildren.size(); i++) {
    var child = CCchildren.get(i);

    //If child has market designation
    if (
      child
        .getValue("a_Market_Designation")
        .getSimpleValue()
        .indexOf(indexOfVar) >= 0
    ) {
      //Search color attribute was updated in workflow to the calc attribute, changed here to reflect (PPIM-3664)
      var searchColor = child.getValue("a_Search_Color_Calc").getSimpleValue();
      //https://gapinc.atlassian.net/browse/PPIM-12807 
	  var brand = child.getValue("a_Brand_Number").getSimpleValue();

      //If search color is NULL
      if (searchColor == null && brand!='GPS') {
        //If return message is NULL or empty
        if (returnMsg == null || returnMsg == "") {
          returnMsg = "CC Search Color is missing, Please update it using CC Search Override Color (or) Color Palette Search Color for CC ID: " + child.getID();
        } else {
          returnMsg = returnMsg + " , " + child.getID();
        }
      }
    }
  }

  //If return message is NOT NULL or empty
  if (returnMsg != null && returnMsg != "") {
    appliesCondition6 = false;
    webui.showAlert("Error", "Missing Search Color", returnMsg);
    return;
  } else {
    appliesCondition6 = true;
  }
}

//throw "Print All" +appliesCondition1+appliesCondition2+appliesCondition3+appliesCondition4+appliesCondition5+appliesCondition6+appliesConditionContext;

/*
 * Business Rule End: Local JavaScript Condition #2 from br_Style_Enrichment_Final_Validation & br_Style_Enrichment_Final_Validation_CAN
 */

//If the appliesCondition1-6 and appliesConditionContext are true,
//Then trigger the Style from the current state to the next Target State of "End"
if (
  appliesCondition1 == true &&
  appliesCondition2 == true &&
  appliesCondition3 == true &&
  appliesCondition4 == true &&
  appliesCondition5 == true &&
  appliesCondition6 == true &&
  appliesConditionContext == true
) {
  //throw "All cond" ;
  var workflowIDUS = "wf_NewStyleEnrichment";
  var currentStateIDUS = "NewStyleEnrich_Final";
  var workflowIDCA = "wf_NewStyleEnrichmentCanada";
  var currentStateIDCA = "NewStyleEnrich_Final";
  var workflowIDJP = "wf_NewStyleEnrichmentJapan";
  var currentStateIDJP = "NewStyleEnrich_Final";
  var eventID = "FinalValidation";

  //If context equals "US"
  if (context == "US") {
    var task = node.getTaskByID(workflowIDUS, currentStateIDUS);
    task.triggerByID(
      eventID,
      "Submitting Style from 'NewStyleEntrich_WebMerch1' to 'NewStyleEnrich_WebMerch2'"
    );
    //Else if context equals "CA"
  } else if (context == "CA") {
    var task = node.getTaskByID(workflowIDCA, currentStateIDCA);
    task.triggerByID(
      eventID,
      "Submitting Style from 'NewStyleEntrich_WebMerch1' to 'NewStyleEnrich_WebMerch2'"
    );
    //Else if context equals "JP"
  } else if (context == "JP") {
    var task = node.getTaskByID(workflowIDJP, currentStateIDJP);
    task.triggerByID(
      eventID,
      "Submitting Style from 'NewStyleEntrich_WebMerch1' to 'NewStyleEnrich_WebMerch2'"
    );
  }
}

}