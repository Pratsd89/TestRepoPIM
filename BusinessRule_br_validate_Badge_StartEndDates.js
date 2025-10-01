/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_validate_Badge_StartEndDates",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Badges" ],
  "name" : "Validate Badge Start_End Dates",
  "description" : "To make sure that the madatory attributes are filled while importing badges",
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
    "contract" : "AttributeGroupBindContract",
    "alias" : "ATG",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_badge_details",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,ATG,manager) {
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
						if (badgeName != null && startDate == null) {
							//if null value return false
							logArray.push("\n<b>Missing a value for Start Date.</b>");
						}
						if (badgeName != null && endDate == null) {
							//if null value return false
							logArray.push("\n<b>Missing a value for End Date.</b>");
						}

						//logic to not allow Start Date>End Date

						if ( startDate >= endDate) {

                                logArray.push("\n<b>Badge End Date should be greater than Badge Start Date, always .</b>");
					}
				});
			}
		}
	}
});

var type = node.getObjectType().getName();

if (logArray.length > 0) {
	if(type == "CC"){
		return "<b>Badge update rejected for CC " + node.getValue("a_CC_Number").getSimpleValue() + " due to the following reasons: </b>" + logArray; 
	}
	else if(type == "Style"){
		return "<b>Badge update rejected for Style " + node.getValue("a_Style_Number").getSimpleValue() + " due to the following reasons: </b>" + logArray; 
	}
	
}
else {
	return true;
}

}