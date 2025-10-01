/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_delete_MarketingFlagsOnImport",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Delete Marketing Flags On Import",
  "description" : "Delete marketing flags with null values during import",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
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

	if (dataContainer != null && idf.contains("MarketingFlag")) {
		//get data container object so we can get the values
		var dataContainerObject = dataContainer.getDataContainerObject();

		if (dataContainerObject != null) {
			//ensure data container is not inherited
			if (dataContainerObject.getOwnerObject().getID() == node.getID()) {
				//log.info("dataContainerObject: " + dataContainerObject);
				//get values from data container object
				var values = dataContainerObject.getValues().toArray();

				//look for the marketing flag name value from the data container
				values.forEach(function (val) {
					var valID = val.getAttribute().getID();
					var ptrn = new RegExp("^a_(Style|CC)_Marketing_Flag_" + brandNum + "$");

					if (ptrn.test(valID)) {
						//log.info("found mkt flag name: " + valID);
						//name value found, check if null
						var mfName = dataContainerObject.getValue(valID).getSimpleValue();
						//log.info("mfName: " + mfName);

						if (mfName == null) {
							//if null value delete the date container
							//log.info("deleting " + dataContainer);
							dataContainer.deleteLocal();
						}
					}
				});
			}
		}
	}
});
}