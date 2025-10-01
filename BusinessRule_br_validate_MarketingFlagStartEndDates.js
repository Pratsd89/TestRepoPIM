/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_validate_MarketingFlagStartEndDates",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_validate_MarketingFlagStartEndDates",
  "description" : "Used by Style and CC Marketing Flag Import Configurations. Make sure every marketing flag on node has start and end date",
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
    "value" : "ag_ASLR_Attributes",
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
var logArray = new Array();

//get the Brand Number for the node
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

//get marketing flag IDs from attribute group
var mktFlags = ATG.getDataContainerTypes().toArray();

var mktFlagIDs = new Array();

mktFlags.forEach(function (flag) {
	mktFlagIDs.push(flag.getID());
});

//get current node's type
var type = node.getObjectType().getName();

//fliter marketing flag array based on object type
var pattern = new RegExp(type);

var mktFlagsFiltered = new Array();

mktFlagIDs.forEach(function (id) {
	if (pattern.test(id)) {
		mktFlagsFiltered.push(id);
	}
});

var currentContext = manager.getCurrentContext().getID();

const [currLang, currMkt] = currentContext.split("_");

// filter marketing flag array based on currnet context
if (currMkt == "US") {
	pattern = new RegExp("MarketingFlag(?=[0-9]|([1][0-9])$)");
}
else {
	pattern = new RegExp(currMkt);
}

//infinite loop protection
var loop = 0;

// filter out other markets
for (var x = 0; x <= mktFlagsFiltered.length - 1; x++) {	
	if (!pattern.test(mktFlagsFiltered[x])) {
		mktFlagsFiltered.splice(x, 1);
		x--
	}	
	
	loop++
	if (loop > 100) {break;}
}

//for each marketing flag ID left in array, get that flag's data from the node
mktFlagsFiltered.forEach(function (idf) {
	//get marketing flag from node by ID
	var dataContainer = node.getDataContainerByTypeID(idf);

	if (dataContainer != null  && idf.contains("MarketingFlag")) {
		//get data container object so we can get the values
		var dataContainerObject = dataContainer.getDataContainerObject();

		if (dataContainerObject != null) {
			//ensure data container is not inherited
			if (dataContainerObject.getOwnerObject().getID() == node.getID()) {
				//get values from data container object
				var values = dataContainerObject.getValues().toArray();

				//get marketing flag start and end date from data container object
				values.forEach(function (val) {
					var valID = val.getAttribute().getID();
					var ptrn = new RegExp("^a_(Style|CC)_Marketing_Flag_" + brandNum + "$");

					if (ptrn.test(valID)) {
						//date value found, check if null
						var mfName = dataContainerObject.getValue(valID).getSimpleValue();
						var startDate = dataContainerObject.getValue("a_marketing_flag_start_date").getSimpleValue();
						var endDate = dataContainerObject.getValue("a_marketing_flag_end_date").getSimpleValue();

						if (mfName != null && startDate == null) {
							//if null value return false
							logArray.push("\n<b>Missing a value for Start Date.</b>");
						}
						if (mfName != null && endDate == null) {
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
		return "<b>Marketing Flag update rejected for CC " + node.getValue("a_CC_Number").getSimpleValue() + " due to the following reasons: </b>" + logArray; 
	}
	else if(type == "Style"){
		return "<b>Marketing Flag update rejected for Style " + node.getValue("a_Style_Number").getSimpleValue() + " due to the following reasons: </b>" + logArray; 
	}
	
}
else {
	return true;
}
}