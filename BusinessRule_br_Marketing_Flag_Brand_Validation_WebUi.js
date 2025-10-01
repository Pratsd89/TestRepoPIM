/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Marketing_Flag_Brand_Validation_WebUi",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Marketing Flag Brand Validation Web UI",
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,ATG,log,webui) {
// get brand number from the node
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

// get object type of node
var type = node.getObjectType().getID();

if (type == "CustomerChoice") {
	type = "CC";	
}

var attrID = "a_"+type+"_Marketing_Flag_"+brandNum;
var startDateID = "a_marketing_flag_start_date";
var endDateID = "a_marketing_flag_end_date";

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
				//get values from data container object
				var values = dataContainerObject.getValues().toArray();
				var startDate = null;
                	var endDate = null;

				// for each data container attribute
				values.forEach(function (val) {
					var valID = val.getAttribute().getID();
					var valName = val.getAttribute().getName();

					if (valID == startDateID) {
                        		startDate = dataContainerObject.getValue(valID).getSimpleValue();
                    	} else if (valID == endDateID) {
                        		endDate = dataContainerObject.getValue(valID).getSimpleValue();
                    	}
					var ptrn = new RegExp("^a_(Style|CC)_Marketing_Flag_(BR|AT|ON|BRFS|GO|GAP)$");

					//look for the marketing flag attributes
					if (ptrn.test(valID)) {
						//log.info(valID);
						var valIDValue = dataContainerObject.getValue(valID).getSimpleValue();
						//Check if Marketing Flag Value of inappropriate Brand are entered
						if (valID!= attrID && valIDValue != null) {
							if(dataContainerObject.getValue(attrID).getSimpleValue()==null)//if brand MF does not have a value, wipe off entire data container row
							{
								dataContainer.deleteLocal();	
							}
							else{
								dataContainerObject.getValue(valID).setSimpleValue(null);
							}
							webui.showAlert("ERROR",  "<b>This Product has a Brand Number of '" + brandNum + "'. Please enter a Marketing Flag Value only for "+brandNum+" - Marketing Flag.</b>");
							
						}
						//Check if Marketing Flag Value of appropriate Brand is not entered
						 else if( valID == attrID && valIDValue == null ){
						 	dataContainer.deleteLocal();	
						 	webui.showAlert("ERROR",  "<b>This Product has a Brand Number of '" + brandNum +"'. Please enter a Marketing Flag Value for "+valName+".</b>");
						 }
					}
				});
				if (startDate != null && endDate != null && startDate > endDate) {
					dataContainer.deleteLocal();	
                    	webui.showAlert("ERROR",  "<b>Start Date must be less than End Date for the Marketing Flag.</b>");
                }
			}
		}	
	}
});
}