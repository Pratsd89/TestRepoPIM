/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_updateChildAttributeFromParent_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Update Child Attributes From Parent CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeCodeRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,sizeModelRef,sizeCodeRef,step,webui,helper) {
log.info("br_updateChildAttributeFromParent_CC");
//PPIM-8959 - Validity for Attribute and Object added
function checkAttributeObjectValidity(node, attribute) {
	var validityFlag = false;
	var validObjectTypes = attribute.getValidForObjectTypes().toArray();
	for (var j = 0; j < validObjectTypes.length; j++) {
		if (validObjectTypes[j].getID() == node.getObjectType().getID()) {
			validityFlag = true;
			break;
		}
	}
	return validityFlag;
}

//Parent is CC
//Child is SKU
function updateChildDates(parent, child, parentType, childType) {
	var oldParentStartDate = parent.getValue("a_Old_" + parentType + "_Start_Date").getSimpleValue();
	var oldParentEndDate = parent.getValue("a_Old_" + parentType + "_End_Date").getSimpleValue();
	var parentStartDate = parent.getValue("a_" + parentType + "_Start_Date").getSimpleValue();
	var parentEndDate = parent.getValue("a_" + parentType + "_End_Date").getSimpleValue();

	//Check if update was made on CC Start/Publication Date then perform below logic :
	/*  1. Update SKU Start Date with CC Start Date. No condition check is required.
		2. All SKUs to be published to downstream. */
	if (parentStartDate != oldParentStartDate) {
		child.getValue("a_" + childType + "_Start_Date").setSimpleValue(parentStartDate);
		child.getValue("a_main_last_modified_date").setSimpleValue(iso.format(today));

		//update Parent old StartDate with updated StartDate
		//parent.getValue("a_Old_" + parentType + "_Start_Date").setSimpleValue(parentStartDate);
		ccStartDateModified = true;

	}

	//Check if update was made on CC End/Deactivation Date then perform below logic :
	/*  1. Check if SKU End Date is null → Sync with CC End Date
		2. Check if SKU has Future End Date(greater than today) →  Check if SKU end date > CC end date then only sync with CC End Date.
		3. Check if SKU has Past End Date(less than today) →  NO action to be performed on SKU End Date. 

		**PPIM-10436
	   4. Check if SKU End Date is not null and CC End Date is null  
			  a. Check if CC Old End Date  is null → No action
			  b. Check if CC Old End Date has a value → if cc old end date is equal to sku end date then only set SKU end date to null.
	    
	    
		*/
	if (parentEndDate != oldParentEndDate) {
		var childEndDate = child.getValue("a_" + childType + "_End_Date").getSimpleValue();
		var ccDeactivationReason = parent.getValue("a_CC_Deactivation_Reason").getSimpleValue();
		if (childEndDate == null) {
			// 1. Update SKU Enddate with CC Enddate if SKU Enddate is null
			if (checkAndEstablishSizeModelSKULink(parent, child)) {
				child.getValue("a_" + childType + "_End_Date").setSimpleValue(parentEndDate);
				child.getValue("a_Sku_Deactivation_Reason").setSimpleValue(ccDeactivationReason);
			}
		}
		else if (childEndDate != null && parentEndDate == null) {
			if (oldParentEndDate != null && oldParentEndDate == childEndDate) {
				if (checkAndEstablishSizeModelSKULink(parent, child)) {
					child.getValue("a_" + childType + "_End_Date").setSimpleValue(null);
					child.getValue("a_Sku_Deactivation_Reason").setSimpleValue(null);
				}
			}
		}
		else if (childEndDate > todayDate && childEndDate > parentEndDate){
			//2. Update SKU Enddate if SKU has Future Enddate and SKU Enddate > CC Enddate
			if (checkAndEstablishSizeModelSKULink(parent, child)) {
				child.getValue("a_" + childType + "_End_Date").setSimpleValue(parentEndDate);
				child.getValue("a_Sku_Deactivation_Reason").setSimpleValue(ccDeactivationReason);
			}
		}
		else if (parentEndDate != null && childEndDate != null && parentEndDate != childEndDate) {
			if (checkAndEstablishSizeModelSKULink(parent, child)) {
				if (oldParentEndDate == childEndDate) {
					child.getValue("a_" + childType + "_End_Date").setSimpleValue(parentEndDate);
					child.getValue("a_Sku_Deactivation_Reason").setSimpleValue(ccDeactivationReason);
				} else {
					logArray.push(child.getID());
				}
			}
		}
		child.getValue("a_main_last_modified_date").setSimpleValue(iso.format(today));
		//update Parent old EndDate with updated EndDate
		//parent.getValue("a_Old_" + parentType + "_End_Date").setSimpleValue(parentEndDate);
		ccEndDateModified = true;
	}
}

function checkAndEstablishSizeModelSKULink(parent, child) {
	//checkAndEstablishSizeModelSKULink
	parentEndDate = parent.getValue("a_CC_End_Date").getSimpleValue();
	var oldParentEndDate = parent.getValue("a_Old_CC_End_Date").getSimpleValue();
	childEndDate = child.getValue("a_SKU_End_Date").getSimpleValue();
	if (parentEndDate >= todayDate || parentEndDate == null) {
		log.info(parentEndDate + " parentEndDate")
		// log.info("heree")
		var style = parent.getParent();
		var SKU_SIZE_CODE = child.getValue("a_Size_Code").getSimpleValue();
		var sizeModelRefs = style.queryClassificationProductLinks(sizeModelRef).asList(10);
		sizeCodeClassification = null
		log.info("sizeModelRefs " + sizeModelRefs.size())
		if (sizeModelRefs.size() == 1) {
			sizeModel = sizeModelRefs.get(0).getClassification();
			//get all children size codes ,compare it with the size code of SKU ,if matches create a link btw size code and SKU and break the loop
			sizeCodes = sizeModel.getChildren();
			log.info("size codes count " + sizeModel.getChildren().size())
			for (var index = 0; index < sizeCodes.size(); index++) {
				if (sizeCodes.get(index).getName() == SKU_SIZE_CODE) {
					sizeCodeClassification = sizeCodes.get(index);
					break;
				}
			}
			//  log.info(sizeCodeClassification +" sizeCodeClassification")
			if (sizeCodeClassification) {
				//Check if a reference link btw size code and sku already exists
				sizeCodeRefs = child.queryClassificationProductLinks(sizeCodeRef).asList(10);
				if (sizeCodeRefs.size() == 1) {
					sizeCode = sizeCodeRefs.get(0).getClassification();
					if (!(sizeCode.getParent().getID() == sizeModel.getID() && sizeCode.getName() == SKU_SIZE_CODE)) {
						//ref link doesn't already exists;
						sizeCodeRefs.get(0).delete();
						child.createClassificationProductLink(sizeCodeClassification, sizeCodeRef);
						helper.setSKUNameFromSizeCode(child, step);

					}
					else {
						log.info("right size code ref link already exists " + child.getID() + " ,size code " + SKU_SIZE_CODE)
					}

				} else {
					child.createClassificationProductLink(sizeCodeClassification, sizeCodeRef);
					helper.setSKUNameFromSizeCode(child, step);
				}
			} else {
				log.info("size model doesn't have this size code " + child.getID() + " ,size code " + SKU_SIZE_CODE)
				sku_number = child.getValue("a_SKU_Number").getSimpleValue();
				if (sku_number == null) {
					skus += child.getID() + " ";
				}
				else {
					skus += child.getValue("a_SKU_Number").getSimpleValue() + " ";
				}
				count--;
				return false;
			}

		}
	}
	return true;
}
/*PPIM-11012 - This BR works only for CC based on the latest requirement(7th Sept 2023) in below confluence :
			 - https://gapinc.atlassian.net/wiki/spaces/PPIM/pages/1277366812/Functionality+of+Backorderable+ReturnLocationType+and+Start+End+Date+for+Style+and+CC */

var today = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var dateFormatterWithoutTimeStamp = new java.text.SimpleDateFormat("yyyy-MM-dd");
var todayDate = dateFormatterWithoutTimeStamp.format(today);
var objectType = node.getObjectType().getID();
var isCCAttributeModified = false;
var isCCDateModified = false;
var ccStartDateModified = false;
var ccEndDateModified = false;


var childPublishAttributesGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID('ag_ChildPublishAttributes');
var childPublishAttributesList = childPublishAttributesGroup.getAttributes().toArray();

if (objectType == "CustomerChoice") {
	for (var i = 0; i < childPublishAttributesList.length; i++) {
		try {
			//Check if Attribute is Valid on CC
			if (checkAttributeObjectValidity(node, childPublishAttributesList[i])) {

				var childPublishAttribute = childPublishAttributesList[i].getID();
				var oldChildPublishAttribute = 'a_Old_' + childPublishAttribute.substring(2)

				var updatedAttributeValue = node.getValue(childPublishAttribute).getSimpleValue();
				var oldAttributeValue = node.getValue(oldChildPublishAttribute).getSimpleValue();

				if (oldAttributeValue != updatedAttributeValue) {
					//PPIM-8959 - Additional check for Attribute :a_CC_Start_Date
					if (childPublishAttribute.contains('Start_Date') || childPublishAttribute.contains('End_Date')) {
						isCCAttributeModified = true;
						isCCDateModified = true;
					} else {
						//ensure parent value updates publish all children
						isCCAttributeModified = true;
						node.getValue(oldChildPublishAttribute).setSimpleValue(updatedAttributeValue);
					}
				}
			}
		} catch (e) {
			log.info('Error occurred in BR: br_updateChildAttributeFromParent_CC : ' + e)
		}
	}

}
skus = "";
var logArray = new Array();
var count = node.getChildren().size();
if (isCCAttributeModified) {

	var childSKUList = node.getChildren();
	for (var j = 0; j < childSKUList.size(); j++) {
		var SKU = childSKUList.get(j);
		//ensure SKU dates are updated according to change at CC and published to downstream
		if (isCCDateModified) {
			updateChildDates(node, SKU, "CC", "SKU");
		} else {
			SKU.getValue("a_main_last_modified_date").setSimpleValue(iso.format(today));
		}
	}
	if (count == 0) {
		if (childSKUList.size() > 0) {
			webui.showAlert("Warning", "", "Reactivation is not possible as all the child SKU's Size Codes are not present under Style's Size Model");
		}
		node.getValue("a_CC_End_Date").setSimpleValue(node.getValue("a_Old_CC_End_Date").getSimpleValue());
		node.getValue("a_CC_Deactivation_Reason").setSimpleValue(node.getValue("a_Old_CC_Deactivation_Reason").getSimpleValue());
	}
	else if (count < childSKUList.size() && node.getValue("a_Old_CC_Start_Date").getSimpleValue() != "") {
		webui.showAlert("Warning", "Reactivation of SKU's : " + skus + " is not possible", "as their Size Code is not present under Style's Size Model");
	}

	if (logArray.length > 0) {
		webui.showAlert("WARNING", "Deactivation dates for the following SKUs were not updated because they differ from the CC's date: ", logArray.toString());
	}
	if (ccStartDateModified) {
		node.getValue("a_Old_CC_Start_Date").setSimpleValue(node.getValue("a_CC_Start_Date").getSimpleValue());
	}
	if (count = childSKUList.size() && ccEndDateModified) {
		node.getValue("a_Old_CC_End_Date").setSimpleValue(node.getValue("a_CC_End_Date").getSimpleValue());
	}

	var oldDeactivationReason = node.getValue("a_Old_CC_Deactivation_Reason").getSimpleValue();
	var currentDeactivationReason = node.getValue("a_CC_Deactivation_Reason").getSimpleValue();
	if (count = childSKUList.size() && oldDeactivationReason != currentDeactivationReason) {
		node.getValue("a_Old_CC_Deactivation_Reason").setSimpleValue(currentDeactivationReason);
	}
}
}