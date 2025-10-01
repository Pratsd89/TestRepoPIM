/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Save_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Marketing_Flag_Brand_Validation"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Populating_Marketing_Flag_Position"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "ValidateDeactivationDateAndReason"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_updateChildAttributeFromParent_CC"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_getSeasonCodes"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "Set_NewColor_NewStyle_WebUI"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_setMaintLastUpdateDate"
  } ],
  "pluginType" : "Operation"
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
    "contract" : "AttributeGroupBindContract",
    "alias" : "badgingGroup",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_badge_details",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "EventProcessor",
    "parameterClass" : "com.stibo.core.domain.impl.eventprocessor.EventProcessorImpl",
    "value" : "step://eventprocessor?id=EP_BadgingPublish",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation7 = function (node,badgingGroup,manager,EventProcessor) {
var logArray = new Array();
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var badgingFlags = badgingGroup.getDataContainerTypes().toArray();
var badgingFlagIDs = new Array();
badgingFlags.forEach(function (flag) {
	badgingFlagIDs.push(flag.getID());
});
var currentContext = manager.getCurrentContext().getID();
const [currLang, currMkt] = currentContext.split("_");
var pattern = new RegExp(currMkt);
var loop = 0;
for (var x = 0; x <= badgingFlagIDs.length - 1; x++) {
	if (!pattern.test(badgingFlagIDs[x])) {
		badgingFlagIDs.splice(x, 1);
		x--
	}
	loop++
	if (loop > 100) {
		break;
	}
}


log.info(badgingFlagIDs);
badgingFlagIDs.forEach(function (idf) {
	if (idf.indexOf("Badges") != -1) {
		var dataContainer = node.getDataContainerByTypeID(idf).getDataContainers().toArray();
		if (dataContainer.length > 1) {
			var error = "\tMultiple badges have been applied to the ";
			error = error.concat(idf);
			error = error.concat(" position, but only one badge is permitted per product. To resolve this, use the Reset button to remove the invalid badges before saving.");
			throw error;
		}
		else if (dataContainer.length == 1) {
			var correctBrand = "a_badge_" + brandNum;
			var dataContainerObj = dataContainer[0].getDataContainerObject();
			var brandValue = dataContainerObj.getValue(correctBrand).getSimpleValue();
			//if (brandValue != null) {
				var allBrands = ["GO", "AT", "BR", "ON", "BRFS", "GAP"];
				for (var i = 0; i < allBrands.length; i++) {
					if (allBrands[i] != brandNum) {
						var eachBrandValue = "a_badge_" + allBrands[i];
						var currentValue = dataContainerObj.getValue(eachBrandValue).getSimpleValue();
						if (currentValue != null) {
							var error = "\tThe badge for the ";
							error = error.concat(idf);
							error = error.concat(" position has been assigned to the incorrect brand. Please use the Reset button to correct this before saving.");
							throw error;
						}
					}
				}
				if(brandValue == null) {
			//}
			//else {
				var error = "\tThe badge for the ";
				error = error.concat(idf);
				error = error.concat(" position has been not been assigned. Please use the Reset button to correct this before saving.");
				throw error;
				}
				if( brandValue =="All Dynamic" || brandValue =="All Static") {
					//log.info(idf)
					var error = "\tThe badge for the ";
					error = error.concat(idf);
					error = error.concat(" position cannot be ").concat(brandValue).concat(",Please use the Reset button to correct this before saving.");
					throw error;
					
				}
			//}

		}
	}
});


EventProcessor.republish(node);
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Inherit_Values_To_SA_Market"
  } ],
  "pluginType" : "Operation"
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
    "contract" : "AttributeGroupBindContract",
    "alias" : "ATG",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_badge_details",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation9 = function (node,manager,ATG) {
//br_validate_Badge_StartEndDates

var logArray = new Array();

//get the Brand Number for the node
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

//get badge IDs from attribute group
var badgeFlags = ATG.getDataContainerTypes().toArray();
var badgeFlagIDs = new Array();

badgeFlags.forEach(function (badge) {
	badgeFlagIDs.push(badge.getID());
});

// filter badge array based on currnet context
var currentContext = manager.getCurrentContext().getID();
const [currLang, currMkt] = currentContext.split("_");

var pattern = new RegExp(currMkt);

var flagsFiltered = new Array();

badgeFlagIDs.forEach(function (id) {
	if (pattern.test(id)) {
		flagsFiltered.push(id);
	}
}); 

//infinite loop protection
var loop = 0;

// filter out other markets
for (var x = 0; x <= flagsFiltered.length - 1; x++) {	
	if (!pattern.test(flagsFiltered[x])) {
		flagsFiltered.splice(x, 1);
		x--
	}	
	
	loop++
	if (loop > 100) {break;}
}

//for each badge ID left in array, get that badge's data from the node
flagsFiltered.forEach(function (idf) {
	log.info(idf);
	//get badge from node by ID
	var dataContainer = node.getDataContainerByTypeID(idf).getDataContainers().toArray();
log.info(dataContainer.length);
	 if (dataContainer.length>0 && idf.indexOf("Badges")!= -1) {
		//get data container object so we can get the values
		var dataContainerObject = dataContainer[0].getDataContainerObject();

		if (dataContainerObject != null) {
			//ensure data container is not inherited
			if (dataContainerObject.getOwnerObject().getID() == node.getID()) {
				//get values from data container object
				var values = dataContainerObject.getValues().toArray();
				

				//get badge start and end date from data container object
				values.forEach(function (val) {
					var valID = val.getAttribute().getID();
					var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
					var ptrn = new RegExp("^a_badge_" + brandNum + "$");

					if (ptrn.test(valID)) {
						//date value found, check if null
						var badgeName = dataContainerObject.getValue(valID).getSimpleValue();
						var startDate = dataContainerObject.getValue("a_badge_start_date").getSimpleValue();
						var endDate = dataContainerObject.getValue("a_badge_end_date").getSimpleValue();
						//var badgeType = dataContainerObject.getValue("a_badge_type").getSimpleValue();

						/*if(badgeName != null && badgeType == null){
							logArray.push("\n<b>Missing a value for Badge Type</b>");
						}*/

						//logic to not allow Start Date>End Date

						if ( startDate > endDate) {

                                logArray.push("\n<b>\"Badge Start Date\" should not be greater than \"Badge End Date\" .</b>");
					}
						
					}
				});
			}
		}
	}
});

var type = node.getObjectType().getName();

if (logArray.length > 0) {
	if(type == "CC"){
		var error = "\tThe Badge update rejected for CC ";
				error = error.concat(node.getValue("a_CC_Number").getSimpleValue());
				error = error.concat(" due to the following reasons: ");
				error = error.concat(logArray);
				throw error;
	}
	else if(type == "Style"){
		var error = "\tThe Badge update rejected for Style ";
				error = error.concat(node.getValue("a_Style_Number").getSimpleValue());
				error = error.concat(" due to the following reasons: ");
				error = error.concat(logArray);
				throw error;
		
	}
}




}