/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_set_old_marketing_flag",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Set Old Marketing Flag",
  "description" : "(Deprecated) Temporary rule to facilitate go-live after brand specific marketing flag changes",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
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
exports.operation0 = function (node,manager,ATG) {
// get brand number from the node
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

// get object type of node
var type = node.getObjectType().getID();

if (type == "CustomerChoice") {
	type = "CC";	
}

// get current context
var currentCtxt = manager.getCurrentContext().getID();

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
					var ptrn = new RegExp("^a_(Style|CC)_Marketing_Flag_" + brandNum);

					//look for the brand specific marketing flag attribute
					if (ptrn.test(valID)) {
						// get value of MF attribute
						var mfAttribute = val.getSimpleValue();
					
						// if current context = EN_CA || FR_CA, set a_(TYPE)_marketing_flag_CA to attributeString value in current context
						if (mf.contains("CA")) {
							if (valID.contains("Style")) {
								dataContainerObject.getValue("a_style_marketing_flag_CA").setValue(mfAttribute);
							}
							if (valID.contains("CC")) {
								dataContainerObject.getValue("a_CC_marketing_flag_CA").setValue(mfAttribute);
							}
						}
						// if current context = EN_JP || JA_JP, set a_(TYPE)_marketing_flag_JP to attributeString value in current context
						else if (mf.contains("JP")) {
							if (valID.contains("Style")) {
								dataContainerObject.getValue("a_style_marketing_flag_JP").setValue(mfAttribute);
							}
							if (valID.contains("CC")) {
								dataContainerObject.getValue("a_CC_marketing_flag_JP").setValue(mfAttribute);
							}
						}
						// if current context = EN_US, set a_(TYPE)_marketing_flag_US to attributeString value in current context
						else {
							if (valID.contains("Style")) {
								dataContainerObject.getValue("a_style_marketing_flag").setValue(mfAttribute);
							}
							if (valID.contains("CC")) {
								dataContainerObject.getValue("a_CC_Marketing_Flag").setValue(mfAttribute);
							}
						}
					}
				});
			}
		}	
	}
});
}