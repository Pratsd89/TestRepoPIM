/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ProductGroupLibrary",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Product Group Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
function generateSequenceNumber(manager) {
	var Entity = manager.getEntityHome().getEntityByID("ProductGroupIDGenerator");
	var IDCounter = Entity.getValue('a_Last_ID_Value').getSimpleValue();
	var IDCounter = parseFloat(IDCounter);
	var ID = IDCounter + 1;
	Entity.getValue('a_Last_ID_Value').setSimpleValue(ID);
	return ID;
}


function clearStyleData(style) {
	style.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
	style.getValue("a_Product_Grouping_Start_date").setSimpleValue(null);
	style.getValue("a_Product_Grouping_End_Date").setSimpleValue(null);
}


function clearRefs(group, step, refType) {
	for (var i = 0; i < group.length; i++) {
		var currentStyle = group[i].getTarget();
		clearStyleData(currentStyle);
		removeFromMVGIfPresent(currentStyle, step, refType);
		publishSingleStyle(currentStyle);
		group[i].delete();
	}
}


function publishSingleStyle(style) {
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	style.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}


function removeReferences(node, RefType) {
	var References = node.getReferences(RefType).toArray();
	for (var i in References) {
		var refToDelete = References[i];
		refToDelete.delete();
	}
}


function checkReferencedBy(node) {
	var refBy = node.getReferencedBy().toArray();
	for (var i = 0; i < refBy.length; i++) {
		if (refBy[i].getReferenceType().getID() == "rt_ProductGroups") {
			return true;
		}
	}
	return false;
}


function getPrimaryStyleID(primaryStyleNum) {
	var dsgPrimaryStyleID = null;
	if (primaryStyleNum.length() == 6) {
		dsgPrimaryStyleID = "000" + primaryStyleNum;
	} else if (primaryStyleNum.length() == 7) {
		dsgPrimaryStyleID = "00" + primaryStyleNum;
	}

	if (dsgPrimaryStyleID.length > 9) {
		dsgPrimaryStyleID = dsgPrimaryStyleID.slice(-9);
	}
	return dsgPrimaryStyleID;
}


function validateTags(currStyle, primaryStyle, primaryMVG, step) {
	var allMatch = true;
	var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
	var refType = classificationTypeHome.getLinkTypeByID('PPHToMVGTemplate');
	var templateRefs = primaryMVG.queryClassificationProductLinks(refType).asList(100);
	var template = templateRefs.get(0).getClassification();
	var variantObjects = template.getChildren();
	var variantValuesByType = new java.util.HashMap();
	var variantTypes = new java.util.HashSet();
	for (var i = 0; i < variantObjects.size(); i++) {
		var variantNode = variantObjects.get(i);
		if (variantNode.getObjectType().getName() == "VariantObject") {
			var variantTypeId = variantNode.getValue("a_Variant_Type_ID").getSimpleValue();
			variantTypes.add(variantTypeId);
			var VariantValueId = variantNode.getValue("a_Variant_Value_ID").getSimpleValue();
			if (variantValuesByType.containsKey(variantTypeId)) {
				variantValuesByType.get(variantTypeId).add(VariantValueId);
			} else {
				var valueIds = new java.util.ArrayList();
				valueIds.add(VariantValueId);
				variantValuesByType.put(variantTypeId, valueIds);
			}
		}
	}

	variantTypes.forEach(function (variantTypeId) {
		var tagType = step.getClassificationHome().getClassificationByID(variantTypeId);
		var attributeId = tagType.getValue("a_ProductTagLov_AttributeID").getSimpleValue();
		var primaryStyleValue = primaryStyle.getValue(attributeId).getSimpleValue();
		var currStyleValue = currStyle.getValue(attributeId).getSimpleValue();
		var tagValues = variantValuesByType.get(variantTypeId);
		var matchFound = false;
		for (var j = 0; j < tagValues.size(); j++) {
			var eachTagValue = step.getClassificationHome().getClassificationByID(tagValues.get(j)).getName();
			if (currStyleValue != null && (currStyleValue == eachTagValue) && (currStyleValue == primaryStyleValue)) {
				matchFound = true;
				break;
			}
		}

		if (!matchFound) {
			allMatch = false;
		}
	});
	return allMatch;
}


function addToMVGIfRequired(styleNode, primaryStyle, context, refType, step) {
	step.executeInContext(context, function (ctxManager) {
		var ctxPrimaryStyle = ctxManager.getObjectFromOtherManager(primaryStyle);
		var primaryMVG = getMVGNode(ctxPrimaryStyle, refType);
		if (primaryMVG != null) {
			var ctxCurrStyle = ctxManager.getObjectFromOtherManager(styleNode);
			var currStyleMVG = getMVGNode(ctxCurrStyle, refType);
			if (currStyleMVG == null) {
				var lifecycleStatus = ctxCurrStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
				if (lifecycleStatus != null && lifecycleStatus != "Draft" && lifecycleStatus != "Purged") {
					if (validateTags(ctxCurrStyle, ctxPrimaryStyle, primaryMVG, step)) {
						primaryMVG.createReference(ctxCurrStyle, refType);
					} else {
						throw (ctxCurrStyle.getValue("a_Style_Number").getSimpleValue() + " Style doesn't have valid Variant/Tag value.");
					}
				}
			} else if (currStyleMVG.getID() != primaryMVG.getID()) {
				throw ("Style merge group styles cannot be present in multiple MVGs.");
			}
		}
	});
}


function removeFromMVGIfPresent(styleNode, step, refType) {
	var currStyleMVG = getMVGNode(styleNode, refType);
	if (currStyleMVG != null) {
		var referenceList = currStyleMVG.getReferences(refType);
		referenceList.forEach(function (reference) {
			if (reference.getTarget().getID() == styleNode.getID()) {
				reference.delete();
				return false;
			}
		});
	}
}


function getMVGNode(style, refType) {
	var styleRefs = style.queryReferencedBy(refType).asList(100);
	if (styleRefs.size() > 0) {
		return styleRefs.get(0).getSource();
	}
	return null;
}


function createGroup(primaryStyle, marketSPDP, contextid, step) {
	var time = new java.util.Date();
	var pgDateFormatter = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var manager = "";
	step.executeInContext(contextid, function (contextManager) {
		manager = contextManager;
	});
	var contextCurrentStyle = manager.getObjectFromOtherManager(primaryStyle);
	var primaryStyleDivisionID = contextCurrentStyle.getParent().getParent().getParent().getParent().getID();
	var primaryStyleID = contextCurrentStyle.getID();
	var primaryStyleName = contextCurrentStyle.getName();
	var primaryStyleNumber = contextCurrentStyle.getValue("a_Style_Number").getSimpleValue();
	var primaryStyleBrandNumber = contextCurrentStyle.getValue("a_Brand_Number").getSimpleValue();
	var primaryStyleDeptDesc = contextCurrentStyle.getValue("a_Department_Description").getSimpleValue();
	var primaryStyleClassDesc = contextCurrentStyle.getValue("a_Class_Description").getSimpleValue();
	var primaryStyleSubClassDesc = contextCurrentStyle.getValue("a_SubClass_Description").getSimpleValue();
	var productGroupingDivisionObj = step.getNodeHome().getObjectByKey("PG_Division_Key", primaryStyleDivisionID);

	if (productGroupingDivisionObj != null) {
		// Generate a unique product group ID using the brand number and a sequence number.
		var newProductGroupID = contextCurrentStyle.getValue("a_Brand_Number").getSimpleValue() + '-' + 'PG' + '-' + generateSequenceNumber(step);
		var newProductGroup = productGroupingDivisionObj.createProduct(newProductGroupID, "Product_Group");
		var contextGroup = manager.getObjectFromOtherManager(newProductGroup);
		contextGroup.setName(newProductGroupID);
		contextGroup.getValue("a_Brand_Number").setSimpleValue(primaryStyleBrandNumber);
		contextGroup.getValue("a_Department_Description").setSimpleValue(primaryStyleDeptDesc);
		contextGroup.getValue("a_Class_Description").setSimpleValue(primaryStyleClassDesc);
		contextGroup.getValue("a_SubClass_Description").setSimpleValue(primaryStyleSubClassDesc);
		contextGroup.getValue("a_Product_Grouping_Start_date").setSimpleValue(pgDateFormatter.format(time));
		contextGroup.getValue("a_Product_Grouping_End_Date").setSimpleValue("2400-01-01");
		//contextGroup.getValue("a_Origin_Merge_Type").setSimpleValue("SIZE_VARIANT"); //temporary needs to be removed
		return contextGroup;
	}
}


function createDSGStyleReference(contextid, step, currentStyle, primarySellingStyle, pgNode, createProductGroups) {
	var time = new java.util.Date();
	var pgDateFormatter = new java.text.SimpleDateFormat("yyyy-MM-dd");
	var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
	var manager = "";
	step.executeInContext(contextid, function (contextManager) {
		manager = contextManager;
	});
	var contextNode = manager.getObjectFromOtherManager(pgNode);

	if (contextid == 'EN_CA' && (pgNode.getValue("a_Product_Grouping_Start_date").getSimpleValue() != null || pgNode.getValue("a_Product_Grouping_End_Date").getSimpleValue() != null)) {
		if (pgNode.getValue("a_Product_Grouping_Start_date").getSimpleValue() != null) {
			contextNode.getValue("a_Product_Grouping_Start_date").setSimpleValue(pgNode.getValue("a_Product_Grouping_Start_date").getSimpleValue());
		}
		if (pgNode.getValue("a_Product_Grouping_End_Date").getSimpleValue() != null) {
			contextNode.getValue("a_Product_Grouping_End_Date").setSimpleValue(pgNode.getValue("a_Product_Grouping_End_Date").getSimpleValue());
		}
	}

	var contextCurrentStyle = manager.getObjectFromOtherManager(currentStyle);
	var contextNode = manager.getObjectFromOtherManager(pgNode);
	var sellingStyleID = contextNode.getValue("a_Primary_Product").getSimpleValue();
	if (sellingStyleID == null) {
		primarySellingStyle = 'Yes';
	}

	var reference = contextNode.createReference(contextCurrentStyle, createProductGroups);
	var PG_startDate = contextNode.getValue("a_Product_Grouping_Start_date").getSimpleValue();
	var PG_endDate = contextNode.getValue("a_Product_Grouping_End_Date").getSimpleValue();

	if (PG_startDate == pgDateFormatter.format(time) && PG_endDate == "2400-01-01" && (currentStyle.getValue("a_Product_Grouping_Start_date").getSimpleValue() != null || currentStyle.getValue("a_Product_Grouping_End_Date").getSimpleValue() != null)) {
		var currentStyleStartDate = currentStyle.getValue("a_Product_Grouping_Start_date").getSimpleValue();
		var currentStyleEndDate = currentStyle.getValue("a_Product_Grouping_End_Date").getSimpleValue();

		if (currentStyleStartDate != null) {
			currentStyleStartDate = java.time.LocalDate.parse(currentStyleStartDate, formatter);
		}
		if (currentStyleEndDate != null) {
			currentStyleEndDate = java.time.LocalDate.parse(currentStyleEndDate, formatter);
		}

		//Start Date should not be greater than End Date
		if (currentStyleStartDate <= currentStyleEndDate) {
			if (currentStyleStartDate != null) {
				contextNode.getValue("a_Product_Grouping_Start_date").setSimpleValue(currentStyleStartDate.toString());
			}
			if (currentStyleEndDate != null) {
				contextNode.getValue("a_Product_Grouping_End_Date").setSimpleValue(currentStyleEndDate.toString());
			}
		}
	}
	PG_startDate = contextNode.getValue("a_Product_Grouping_Start_date").getSimpleValue();
	PG_endDate = contextNode.getValue("a_Product_Grouping_End_Date").getSimpleValue();

	if (primarySellingStyle == 'Yes') {
		reference.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
		contextNode.setName(contextCurrentStyle.getName());
		contextNode.getValue("a_Product_Group_Name").setSimpleValue(contextCurrentStyle.getName());
		setProductGroupStartDateAndEndDate(contextCurrentStyle, contextNode, PG_startDate, PG_endDate, createProductGroups, step);
	} else {
		reference.getValue("a_Primary_Selling_Style").setSimpleValue("No");
		setProductGroupStartDateAndEndDate(contextCurrentStyle, contextNode, PG_startDate, PG_endDate, createProductGroups, step);
	}
	publishSingleStyle(currentStyle);
}


function setProductGroupStartDateAndEndDate(contextCurrentStyle, contextNode, oldestStartDate, oldestEndDate, createProductGroups, step) {
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
	oldestStartDate = java.time.LocalDate.parse(oldestStartDate, formatter);
	oldestEndDate = java.time.LocalDate.parse(oldestEndDate, formatter);
	var startDate = null;
	var endDate = null;

	var startDateStr = contextCurrentStyle.getValue("a_Product_Grouping_Start_date").getSimpleValue();
	var endDateStr = contextCurrentStyle.getValue("a_Product_Grouping_End_Date").getSimpleValue();

	if (startDateStr != null) {
		startDate = java.time.LocalDate.parse(startDateStr, formatter);
	}

	if (endDateStr != null) {
		endDate = java.time.LocalDate.parse(endDateStr, formatter);
	}

	if (startDate <= endDate) {
		// Compare and set the oldest start date found.
		if (startDate != null && startDate.compareTo(oldestStartDate) < 0) {
			oldestStartDate = startDate;
		}
		// Compare and set the oldest end date found.
		if (endDate != null && endDate.compareTo(oldestEndDate) < 0) {
			oldestEndDate = endDate;
		}
	}
	contextNode.getValue("a_Product_Grouping_Start_date").setSimpleValue(oldestStartDate.toString());
	contextNode.getValue("a_Product_Grouping_End_Date").setSimpleValue(oldestEndDate.toString());
	//PPIM-14167
	if (contextNode.getValue("a_Start_Time").getSimpleValue() == null) {
		contextNode.getValue("a_Start_Time").setSimpleValue("12:00 AM");
	}
	setStyleDatesFromGroupDate(contextNode, createProductGroups, step);
}


function setStyleDatesFromGroupDate(dateNode, createProductGroups, step) {
	var primaryStyleNumber = '';
	var dsgUpdateRefs = dateNode.getReferences(createProductGroups).toArray();
	var groupPrimaryStyleID = getPrimaryStyleID(dateNode.getValue("a_Primary_Product").getSimpleValue());
	var groupPrimaryStyleObject = step.getProductHome().getProductByID(groupPrimaryStyleID);
	if (groupPrimaryStyleObject != null) {
		primaryStyleNumber = groupPrimaryStyleObject.getValue("a_Style_Number").getSimpleValue();
	}
	var groupStartDate = dateNode.getValue("a_Product_Grouping_Start_date").getSimpleValue();
	var groupEndDate = dateNode.getValue("a_Product_Grouping_End_Date").getSimpleValue()
	for (var i in dsgUpdateRefs) {
		var currentStyle = dsgUpdateRefs[i].getTarget();
		currentStyle.getValue("a_Product_Grouping_Start_date").setSimpleValue(groupStartDate);
		currentStyle.getValue("a_Product_Grouping_End_Date").setSimpleValue(groupEndDate);
		if (currentStyle.getValue("a_SuperPDP_Program_ID").getSimpleValue() == null) {
			currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
		}
		publishSingleStyle(currentStyle);
	}
}


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


function publishStyles(productGroup, productGroupReference, manager) {
	var publishStyles = productGroup.getReferences(productGroupReference).toArray();
	var primaryStyleNumber = '';
	var groupPrimaryStyleID = getPrimaryStyleID(productGroup.getValue("a_Primary_Product").getSimpleValue());
	var groupPrimaryStyleObject = manager.getProductHome().getProductByID(groupPrimaryStyleID);
	if (groupPrimaryStyleObject != null) {
		primaryStyleNumber = groupPrimaryStyleObject.getValue("a_Style_Number").getSimpleValue();
	}
	for (var i = 0; i < publishStyles.length; i++) {
		var currentStyle = publishStyles[i].getTarget();
		currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
		publishSingleStyle(currentStyle);
	}
}


function revertValues(context, node, primaryStyle, canadaManager, productGroupReference) {
	var contextNode = canadaManager.getObjectFromOtherManager(node);
	var dsg_refs = contextNode.getReferences(productGroupReference);
	setPrimaryStyle(dsg_refs, primaryStyle);
	var refs = node.getReferences(productGroupReference);
	setPrimaryStyle(refs, primaryStyle);

}

function setPrimaryStyle(dsg_refs, primaryStyle) {
	for (var i = 0; i < dsg_refs.size(); i++) {
		var ref = dsg_refs.get(i);
		var curID = ref.getTarget().getID();
		if (curID == primaryStyle) {
			ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
		} else {
			ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");
		}
	}
}

function setDatesFromUS(node, step) {
	var contextNodeDateSetter = step.executeInContext('EN_US', function (cmmanager) {
		return cmmanager.getObjectFromOtherManager(node);
	});
	node.getValue("a_Product_Grouping_Start_date").setSimpleValue(contextNodeDateSetter.getValue("a_Product_Grouping_Start_date").getSimpleValue());
	node.getValue("a_Product_Grouping_End_Date").setSimpleValue(contextNodeDateSetter.getValue("a_Product_Grouping_End_Date").getSimpleValue());
}


function setCCPublicationDate(node, manager) {
	var ObjectType = node.getObjectType().getID();
	var Brand = node.getValue("a_Brand_Number").getSimpleValue();
	var LifeCycleStatus = node.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
	if (ObjectType == "CustomerChoice" && Brand == "ON" && LifeCycleStatus == "In Progress") {
		var ColorSellingSeasonCode = node.getValue("a_Source_CC_Selling_Season_Code").getSimpleValue();
		ColorSellingSeasonCode = ColorSellingSeasonCode.slice(0, 1);
		var Compstring = ["J", "F", "M", "A", "Y", "U", "L", "G", "S", "O", "N", "D"];
		for (var i in Compstring) {
			if (ColorSellingSeasonCode === Compstring[i]) {
				var CCPublicationDate = node.getValue("a_CC_Start_Date").getSimpleValue();
				// log.info(CCPublicationDate);
				if (CCPublicationDate == null) {
					node.getValue("a_CC_Start_Date").setSimpleValue("9999-12-31");

				}
			}
		}
	}
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.generateSequenceNumber = generateSequenceNumber
exports.clearStyleData = clearStyleData
exports.clearRefs = clearRefs
exports.publishSingleStyle = publishSingleStyle
exports.removeReferences = removeReferences
exports.checkReferencedBy = checkReferencedBy
exports.getPrimaryStyleID = getPrimaryStyleID
exports.validateTags = validateTags
exports.addToMVGIfRequired = addToMVGIfRequired
exports.removeFromMVGIfPresent = removeFromMVGIfPresent
exports.getMVGNode = getMVGNode
exports.createGroup = createGroup
exports.createDSGStyleReference = createDSGStyleReference
exports.setProductGroupStartDateAndEndDate = setProductGroupStartDateAndEndDate
exports.setStyleDatesFromGroupDate = setStyleDatesFromGroupDate
exports.getDuplicateStyleGroup = getDuplicateStyleGroup
exports.revertValues = revertValues
exports.setPrimaryStyle = setPrimaryStyle
exports.setDatesFromUS = setDatesFromUS
exports.setCCPublicationDate = setCCPublicationDate