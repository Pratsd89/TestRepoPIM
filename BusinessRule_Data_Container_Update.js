/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Data_Container_Update",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Data Container Update",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,log,manager,ATG) {
var approvedValue;

function approvedAttrCheckByDataContainer(attr, idf) {
	//log.info("attr : " + attr +", idf : " + idf);
	var apprStatus = node.getApprovalStatus().toString();

	if (apprStatus != "Not in Approved workspace") {
		manager.executeInWorkspace("Approved", function (approvedManager) {
			var approvedNode = approvedManager.getObjectFromOtherManager(node);
			var approvedDataContainer = approvedNode.getDataContainerByTypeID(idf).getDataContainerObject();
			if (approvedDataContainer != null) {
				approvedValue = approvedDataContainer.getValue(attr);
			}
		});
		if (approvedValue != null) {
			return approvedValue.getSimpleValue();
		}
		else {
			approvedValue = null;
		}
	}
}

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

//get marketing flag IDs from attribute group
var mktFlags = ATG.getDataContainerTypes().toArray();

var mktFlagIDs = new Array();

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
					var ptrn = new RegExp("^a_(Style|CC)_Marketing_Flag_" + brandNum + "$");

					if (ptrn.test(valID)) {
						//log.info("found mkt flag name: " + valID);
						//name value found, check if null
						var mfName = dataContainerObject.getValue(valID).getSimpleValue();
						var mfNameApproved = approvedAttrCheckByDataContainer(valID, idf);
						var endDate = dataContainerObject.getValue('a_marketing_flag_end_date').getSimpleValue();
						var endDateApproved = approvedAttrCheckByDataContainer('a_marketing_flag_end_date', idf);
						var startDate = dataContainerObject.getValue('a_marketing_flag_start_date').getSimpleValue();
						var startDateApproved = approvedAttrCheckByDataContainer('a_marketing_flag_start_date', idf);

						if (endDate != endDateApproved || startDate != startDateApproved || mfName != mfNameApproved || endDateApproved == null && mfName != null && startDate != null && endDate != null || startDateApproved == null && mfName != null && startDate != null && endDate != null || mfNameApproved == null && mfName != null && startDate != null && endDate != null) {
							if (valID == new RegExp("^a_Style_Marketing_Flag")) {
								node.getValue('a_Style_MF_Maintainance_Last_Update_Date').setSimpleValue(iso.format(time));
							}
							if (valID == new RegExp("^a_CC_Marketing_Flag")) {
								node.getValue('a_CC_MF_Maintainance_Last_Update_Date').setSimpleValue(iso.format(time));
							}
						}
					}
				});
			}
		}
	}
});
}