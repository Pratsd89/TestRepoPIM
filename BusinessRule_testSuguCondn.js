/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testSuguCondn",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "testSuguCondn",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
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
exports.operation0 = function (node,stepManager,logger) {
/*
 	Ensure Copy attributes are filled out
 	All English contexts have at least STEP Name of Style and a_Overview_Bullet1 is filled
	Translation status = "In Progress" or "Completed"
 */
//logger.info(stepManager.getCurrentUser().getGroups());
//Get user group from user id
var noAccesstoUS = false;
var userGroups = new java.util.ArrayList();
userGroups.addAll(stepManager.getCurrentUser().getGroups());
for(var n=0;n<userGroups.size();n++){
	if(userGroups.get(n).getID() == "CA-PIM-MC-Security-Group"){
		noAccesstoUS = true;
	}
}


function checkAttributesAndName(node, stepManager, context) {
	var status = stepManager.executeInContext(context, function (enContextManager) {

		var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());
		var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_Style_Copy_Attributes');
		var attributeList = attributeGroup.getAttributes().toArray();
		var attributeExistFlag = false;
		for (var i = 0; i < attributeList.length; i++) {
			if (enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue() != null && enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue() != '') {
				attributeExistFlag = true;
				break;
			}
		}
		if (attributeExistFlag == false) {
			return "Please fill atleast one Copy Attribute in " + context + " Context.";
		}

		if (enCurrentProduct.getName() == '' || enCurrentProduct.getName() == null) {
			return "Please enter STEP Name for the Style in " + context + " Context.";
		}

		var bullet1 = enCurrentProduct.getValue("a_Overview_Bullet1").getSimpleValue();
		if (bullet1 == '' || bullet1 == null) {
			return "Please enter a value for a_Overview_Bullet1 in " + context + " Context.";
		}

		return true;
	});
	
	return status;
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
	|| merchType == "STORED VALUE CARDS OPEN"){
		nonMerch = true;
	}
if(!nonMerch) {
	logger.info("setting date");
	if(node.getValue("a_Style_Start_Date").getSimpleValue() == "" || node.getValue("a_Style_Start_Date").getSimpleValue() == null) {
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
	
		//////// US Context //////////
if(noAccesstoUS != true){
	stepManager.executeInContext('EN_US',function(enContextManager) {
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(Style_ID);
		/////New Color:
		var Style_Start_Date=enCurrentProduct.getValue("a_Style_Start_Date").getSimpleValue();
		//log.info(CC_Start_Date);
		if(Style_Start_Date != null)
		{
			if( Style_Start_Date > final_date || Style_Start_Date == final_date)
			{
			enCurrentProduct.getValue("a_New_Style").setSimpleValue("Yes");
			//log.info(enCurrentProduct.getValue("a_New_Style").getSimpleValue());
			}
			else
			{
			enCurrentProduct.getValue("a_New_Style").setSimpleValue("No");
			//log.info(enCurrentProduct.getValue("a_New_Style").getSimpleValue());
			}
		}
	})
}




var isErrorOccurred = false;
var errorMsg = '';
var existingErrorMsg = '' + node.getValue('a_error_message').getSimpleValue();

var marketCodes = node.getValue('a_Style_Market_Designation').getSimpleValue();
//var replicateEngCopy = node.getValue('a_Replicate_US_English_Copy').getSimpleValue();
//var translationUrgency = node.getValue('a_Translation_Urgency').getSimpleValue();
// in Style Final Validation, need to check if EN_CA contains data for Copy. Translation may not have come back yet so FR_CA may still be empty.
if (marketCodes.indexOf("CAN") >= 0) {
	var result = checkAttributesAndName(node, stepManager, "EN_CA");
	if (result != true) {
		isErrorOccurred = true;
		errorMsg = '' + result;
	}

	//PPIM-2940 - Removing Condition of Translation Status validation in US Workflow
	
	/*if (!isErrorOccurred) {
		var translationStatus = node.getValue('a_Translation_Status').getSimpleValue();
		if (translationStatus != 'Submitted' && translationStatus != 'Complete') {
			//return "Style contains CA market and Translation Request has not been submitted.";
			errorMsg = "Style contains CA market and Translation Request has not been submitted.";
			isErrorOccurred = true;
		}
	}*/
}

if (!isErrorOccurred) {
	if (marketCodes.indexOf("US") >= 0) {
		var result = checkAttributesAndName(node, stepManager, "EN_US");
		if (result != true) {
			isErrorOccurred = true;
			errorMsg = '' + result;
		}
	}
}

if (!isErrorOccurred) {
	//checking if at least one CC is in "Waiting for Style Approval"
	var style = stepManager.getProductHome().getProductByID(node.getID());
	var CCList = style.getChildren();
	var ccWaitingForStyleApproval = false;
	
	if (CCList.size() > 0) {
		for (var i = 0; i < CCList.size(); i++) {
			if(CCList.get(i).getValue('a_Market_Designation').getSimpleValue().indexOf("US") >= 0){
				if (CCList.get(i).getValue('a_CC_Life_Cycle_Status').getLOVValue().getID() == "WAITING_FOR_STYLE_APPROVAL"){
					ccWaitingForStyleApproval = true;
					break;
				}
			}
		}
		if (ccWaitingForStyleApproval == false) {
			//return 'There should be atleast one Ready For Approval CC before approving the Style.';
			errorMsg = 'There should be atleast one Ready For Approval CC before approving the Style.';
			isErrorOccurred = true;
		}
		
	} else {
		//return 'The Style does not contain any CC. Please add CC and try again.';
		errorMsg = 'The Style does not contain any CC. Please add CC and try again.';
		isErrorOccurred = true;
	}
}
logger.info("Current value of isErrorOccurred: " + isErrorOccurred);
logger.info("current value of errorMsg...: " + errorMsg);
if (!isErrorOccurred) {
	//Block to ignore Non-Merch Style for Web Categorization validation - PPIM-1406
	var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
	if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")){
	
		// check if the Style has Primary Web Category assigned 
		var classificationTypeHome = stepManager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
		var classificationType = classificationTypeHome.getLinkTypeByID('StyleToWebSubCategoryRef');
        var classificationLinkList = node.getClassificationProductLinks(classificationType).toArray();
        var classificationErrorFlag = false;
		if(classificationLinkList.length ==0) {

            var CCList = style.getChildren();
            if (CCList.size() > 0) {
                for (var i = 0; i < CCList.size(); i++) {
                    var cc= CCList.get(i);
                    var ccClassificationLinkList = cc.getClassificationProductLinks(classificationType).toArray();
                    if(ccClassificationLinkList.length ==0) {
                        classificationErrorFlag = true;
                        break;
                    }
                }
            }
			
        } 
		logger.info("current value of classificationErrorFlag...:" + classificationErrorFlag);
        if(classificationErrorFlag==true){
            //return 'Style does not have any Web Categories assigned';
			errorMsg = 'Style or CC missing web categorization';
			isErrorOccurred = true;
        }
        else {
			var primaryCategoryTrueFlag = false;
			var pCatStyle = node.getValue("a_Primary_Category").getSimpleValue();
			if(pCatStyle != null){
				primaryCategoryTrueFlag = true;
				}
			/*for(var i =0;i<classificationLinkList.length;i++){
				var primaryCategory = classificationLinkList[i].getValue('a_Primary_Category').getSimpleValue();
				if(primaryCategory == 'Y'){
					primaryCategoryTrueFlag= true;
					break;
				}
			}*/
			if(primaryCategoryTrueFlag == false){
				//return 'There should be atleast one Web Category with Primary Category as "Y"';
				//return 'There should be atleast one Primary Category associated with Style';
				errorMsg = 'There should be atleast one Primary Category associated with Style';
				isErrorOccurred = true;
			}
		}
	}
}

if (isErrorOccurred) {
	node.getValue('a_error_message').setSimpleValue(errorMsg);
	return errorMsg;
}
	
return true;

}