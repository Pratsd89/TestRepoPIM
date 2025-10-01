/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_fix_Marketing_Flag_Values",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Fix Marketing Flag Values",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,ATG,step) {
//get marketing flag IDs from attribute group
var mktFlags = ATG.getDataContainerTypes().toArray();

var mktFlagIDs = new Array();

var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

mktFlags.forEach(function (flag) {
	//log.info("flag ID from ATG: " + flag.getID());	
	mktFlagIDs.push(flag.getID());
});

//for each marketing flag ID left in array, get that flag's data from the node
mktFlagIDs.forEach(function (idf) {
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
					var ptrn = new RegExp("^a_(style|CC)_(m|M)arketing_(f|F)lag");

					if (ptrn.test(valID)) {
						//log.info("found mkt flag name: " + valID);
						var currentContext = step.getCurrentContext().getID();
						//name value found, check if null
						var mfName = dataContainerObject.getValue(valID).getSimpleValue();
						//log.info("mfName: " + mfName);

						if (valID.contains("CA") && currentContext == "EN_CA") {

							if (mfName != null && brandNum == "ON" && valID.contains("style")) {

								dataContainerObject.getValue("a_Style_Marketing_Flag_ON").setValue(mfName)
							}
							if (mfName != null && brandNum == "GAP" && valID.contains("style")) {

								dataContainerObject.getValue("a_Style_Marketing_Flag_GAP").setValue(mfName)
							}
							if (mfName != null && brandNum == "BR" && valID.contains("style")) {

								dataContainerObject.getValue("a_Style_Marketing_Flag_BR").setValue(mfName)
							}
							if (mfName != null && brandNum == "ON" && valID.contains("CC")) {

								dataContainerObject.getValue("a_CC_Marketing_Flag_ON").setValue(mfName)
							}
							if (mfName != null && brandNum == "GAP" && valID.contains("CC")) {

								dataContainerObject.getValue("a_CC_Marketing_Flag_GAP").setValue(mfName)
							}
							if (mfName != null && brandNum == "BR" && valID.contains("CC")) {

								dataContainerObject.getValue("a_CC_Marketing_Flag_BR").setValue(mfName)
							}
						}
						if (valID.contains("JP") && currentContext == "EN_JP") {

							if (mfName != null && brandNum == "GAP" && valID.contains("style")) {

								dataContainerObject.getValue("a_Style_Marketing_Flag_GAP").setValue(mfName)
							}
							if (mfName != null && brandNum == "BR" && valID.contains("style")) {

								dataContainerObject.getValue("a_Style_Marketing_Flag_BR").setValue(mfName)
							}
							if (mfName != null && brandNum == "GAP" && valID.contains("CC")) {

								dataContainerObject.getValue("a_CC_Marketing_Flag_GAP").setValue(mfName)
							}
							if (mfName != null && brandNum == "BR" && valID.contains("CC")) {

								dataContainerObject.getValue("a_CC_Marketing_Flag_BR").setValue(mfName)
							}
						}
						if (!(valID.contains("CA")) && currentContext == "EN_US" || !(valID.contains("JP")) && currentContext == "EN_US") {

							if (mfName != null && brandNum == "ON" && valID.contains("style")) {

								dataContainerObject.getValue("a_Style_Marketing_Flag_ON").setValue(mfName)
							}
							if (mfName != null && brandNum == "GO" && valID.contains("style")) {

								dataContainerObject.getValue("a_Style_Marketing_Flag_GO").setValue(mfName)
							}
							if (mfName != null && brandNum == "GAP" && valID.contains("style")) {

								dataContainerObject.getValue("a_Style_Marketing_Flag_GAP").setValue(mfName)
							}
							if (mfName != null && brandNum == "BR" && valID.contains("style")) {

								dataContainerObject.getValue("a_Style_Marketing_Flag_BR").setValue(mfName)
							}
							if (mfName != null && brandNum == "ON" && valID.contains("CC")) {

								dataContainerObject.getValue("a_CC_Marketing_Flag_ON").setValue(mfName)
							}
							if (mfName != null && brandNum == "GO" && valID.contains("CC")) {

								dataContainerObject.getValue("a_CC_Marketing_Flag_GO").setValue(mfName)
							}
							if (mfName != null && brandNum == "GAP" && valID.contains("CC")) {

								dataContainerObject.getValue("a_CC_Marketing_Flag_GAP").setValue(mfName)
							}
							if (mfName != null && brandNum == "BR" && valID.contains("CC")) {

								dataContainerObject.getValue("a_CC_Marketing_Flag_BR").setValue(mfName)
							}
						}
					}
				});
			}
		}
	}
});
}