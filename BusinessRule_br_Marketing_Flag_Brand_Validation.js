/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Marketing_Flag_Brand_Validation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Marketing Flag Brand Validation",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,ATG) {
// get brand number from the node
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

// get object type of node
var type = node.getObjectType().getID();

if (type == "CustomerChoice") {
	type = "CC";	
}

//get marketing flag IDs from attribute group
var mktFlags = ATG.getDataContainerTypes().toArray();

var mktFlagIDs = new Array();

mktFlags.forEach(function (flag) {
	//log.info("flag ID from ATG: " + flag.getID());	
	mktFlagIDs.push(flag.getID());
});

/*
	for each marketing flag data container in ATG
*/

mktFlagIDs.forEach(function (mf) {
	//get marketing flag from node by ID
	var dataContainer = node.getDataContainerByTypeID(mf);
		
	// if container != null
	if (dataContainer != null && mf.contains("MarketingFlag")) {
		//get data container object so we can get the values
		var dataContainerObject = dataContainer.getDataContainerObject();

		if (dataContainerObject != null) {
			// make sure data container isin't inherited
			if (dataContainerObject.getOwnerObject().getID() == node.getID()) {
				//log.info("dataContainerObject: " + dataContainerObject);
				//get values from data container object
				var values = dataContainerObject.getValues().toArray();

				// for each data container attribute
				values.forEach(function (val) {
					var valID = val.getAttribute().getID();
					var valName = val.getAttribute().getName();
					var ptrn = new RegExp("^a_(Style|CC)_Marketing_Flag_" + brandNum + "$");

					//look for the brand specific marketing flag attribute
					if (ptrn.test(valID)) {
						var valIDValue = dataContainerObject.getValue(valID).getSimpleValue();
						//Ensure Marketing Flag Value set matches the Brand Number on the Product
						if (!(valID.contains(brandNum)) && valIDValue != null) {
							//Throw error when no match
							throw ("Marketing Flag value was applied to '" + valName + "' for Product with ID '" + node.getID() + "'. This Product has a Brand Number of '" + brandNum + "'. Please remove value from '" + valName + "' and set appropriate value.")
						}
					}
				});
			}
		}	
	}
});
}