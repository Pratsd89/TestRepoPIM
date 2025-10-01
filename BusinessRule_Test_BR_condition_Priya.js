/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_BR_condition_Priya",
  "type" : "BusinessCondition",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "Test_BR_condition_Priya",
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

badgeFlags.forEach(function (flag) {
	badgeFlagIDs.push(flag.getID());
});

//get current node's type-- (whether cc or style)?
var type = node.getObjectType().getName();


//filter badge array based on object type
var pattern = new RegExp(type);

var flagsFiltered = new Array();

badgeFlagIDs.forEach(function (id) {
	if (pattern.test(id)) {
		flagsFiltered.push(id);
	}
});

var currentContext = manager.getCurrentContext().getID();

const [currLang, currMkt] = currentContext.split("_");

// filter badge array based on currnet context
if (currMkt == "US") {
	pattern = new RegExp("BadgesUS(?=[0-9]|([1][0-9])$)");
}
else {
	pattern = new RegExp(currMkt);
}

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
	//get badge from node by ID
	var dataContainer = node.getDataContainerByTypeID(idf);

	if (dataContainer != null  && idf.contains("Badges")) {
		//get data container object so we can get the values
		var dataContainerObject = dataContainer.getDataContainerObject();

		if (dataContainerObject != null) {
			//ensure data container is not inherited
			if (dataContainerObject.getOwnerObject().getID() == node.getID()) {
				//get values from data container object
				var values = dataContainerObject.getValues().toArray();

				//get badge start and end date from data container object
				values.forEach(function (val) {
					var valID = val.getAttribute().getID();
					var ptrn = new RegExp("^a_badge" + brandNum + "$");

					if (ptrn.test(valID)) {
						//date value found, check if null
						var badgeName = dataContainerObject.getValue(valID).getSimpleValue();
						var startDate = dataContainerObject.getValue("a_badge_start_date").getSimpleValue();
						var endDate = dataContainerObject.getValue("a_badge_end_date").getSimpleValue();

						if (badgeName != null && startDate == null) {
							//if null value return false
							logArray.push("\n<b>Missing a value for Start Date.</b>");
						}
						if (badgeName != null && endDate == null) {
							//if null value return false
							logArray.push("\n<b>Missing a value for End Date.</b>");
						}
					}
				});
			}
		}
	}
});

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