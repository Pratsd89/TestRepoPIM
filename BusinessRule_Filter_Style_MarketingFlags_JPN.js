/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Filter_Style_MarketingFlags_JPN",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Filter_Style_MarketingFlags_JPN",
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (logger,manager,node) {
//this business condition has been implemented as part of the requirement for PPIM-6490. This business rule will be added to the Import Configuration for Japan Style Marketing Flag Widget

var temp = node;
if (temp != null) {
	var dataContainerObject1 = node.getDataContainerByTypeID('StyleMarketingFlagJP1').getDataContainerObject();
	var dataContainerObject2 = node.getDataContainerByTypeID('StyleMarketingFlagJP2').getDataContainerObject();
	var dataContainerObject3 = node.getDataContainerByTypeID('StyleMarketingFlagJP3').getDataContainerObject();
	var dataContainerObject4 = node.getDataContainerByTypeID('StyleMarketingFlagJP4').getDataContainerObject();
	var dataContainerObject5 = node.getDataContainerByTypeID('StyleMarketingFlagJP5').getDataContainerObject();
	var dataContainerObject6 = node.getDataContainerByTypeID('StyleMarketingFlagJP6').getDataContainerObject();
	var dataContainerObject7 = node.getDataContainerByTypeID('StyleMarketingFlagJP7').getDataContainerObject();
	var dataContainerObject8 = node.getDataContainerByTypeID('StyleMarketingFlagJP8').getDataContainerObject();
	var dataContainerObject9 = node.getDataContainerByTypeID('StyleMarketingFlagJP9').getDataContainerObject();
	var dataContainerObject10 = node.getDataContainerByTypeID('StyleMarketingFlagJP10').getDataContainerObject();

	var finalStatus = checkStatus(dataContainerObject1, dataContainerObject2, dataContainerObject3, dataContainerObject4, dataContainerObject5, dataContainerObject6, dataContainerObject7, dataContainerObject8, dataContainerObject9, dataContainerObject10);

	if (!finalStatus) {
		return false;
	}
	else {
		return true;
	}
}
else {

	return false;
}


function checkStatus(dataContainerObject1, dataContainerObject2, dataContainerObject3, dataContainerObject4, dataContainerObject5, dataContainerObject6, dataContainerObject7, dataContainerObject8, dataContainerObject9, dataContainerObject10) {

	var status1 = false;
	var status2 = false;
	var status3 = false;
	var status4 = false;
	var status5 = false;
	var status6 = false;
	var status7 = false;
	var status8 = false;
	var status9 = false;
	var status10 = false;

	status1 = filter(dataContainerObject1);
	status2 = filter(dataContainerObject2);
	status3 = filter(dataContainerObject3);
	status4 = filter(dataContainerObject4);
	status5 = filter(dataContainerObject5);
	status6 = filter(dataContainerObject6);
	status7 = filter(dataContainerObject7);
	status8 = filter(dataContainerObject8);
	status9 = filter(dataContainerObject9);
	status10 = filter(dataContainerObject10);
	logger.info(status1 + " " + status2 + " " + status3 + " " + status4 + " " + status5 + " " + status6 + " " + status7 + " " + status8 + " " + status9 + " " + status10);

	if (status1 == true && status2 == true && status3 == true && status4 == true && status5 == true && status6 == true && status7 == true && status8 == true && status9 == true && status10 == true) {

		return true;
	}
	else {

		return false;

	}
}


function filter(dataContainerObject) {

	var flag = null;
	var startDate = null;
	var endDate = null;

	if (dataContainerObject == null) {
		return true;
	}

	if (dataContainerObject != null) {

		flag = dataContainerObject.getValue('a_style_marketing_flag_JP').getSimpleValue();
		startDate = dataContainerObject.getValue('a_marketing_flag_start_date').getSimpleValue();
		endDate = dataContainerObject.getValue('a_marketing_flag_end_date').getSimpleValue();
	}

	if (flag != null) {

		if (startDate != null && endDate != null) {

			return true;
		}
		else {
			return false;
		}
	}
	return false;

}


}