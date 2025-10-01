/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test_br_ppim-10882_style",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "test br ppim-10882 STYLE",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
	
	var marketingFlagDataContainer1 = node.getDataContainerByTypeID('StyleMarketingFlag1');
	var marketingFlagDataContainer2 = node.getDataContainerByTypeID('StyleMarketingFlag2');
	var marketingFlagDataContainer3 = node.getDataContainerByTypeID('StyleMarketingFlag3');
	var marketingFlagDataContainer4 = node.getDataContainerByTypeID('StyleMarketingFlag4');
	var marketingFlagDataContainer5 = node.getDataContainerByTypeID('StyleMarketingFlag5');
	var marketingFlagDataContainer6 = node.getDataContainerByTypeID('StyleMarketingFlag6');
	var marketingFlagDataContainer7 = node.getDataContainerByTypeID('StyleMarketingFlag7');
	var marketingFlagDataContainer8 = node.getDataContainerByTypeID('StyleMarketingFlag8');
	var marketingFlagDataContainer9 = node.getDataContainerByTypeID('StyleMarketingFlag9');
	var marketingFlagDataContainer10 = node.getDataContainerByTypeID('StyleMarketingFlag10');

	var dataContainerArray = [marketingFlagDataContainer1,marketingFlagDataContainer2,marketingFlagDataContainer3,marketingFlagDataContainer4,marketingFlagDataContainer5,marketingFlagDataContainer6,marketingFlagDataContainer7,marketingFlagDataContainer8,marketingFlagDataContainer9,marketingFlagDataContainer10];

	for(var i = 0;i<dataContainerArray.length;i++){
		var dataContainerObject = dataContainerArray[i].getDataContainerObject();
		if(dataContainerObject != null){
			var currentValue = dataContainerObject.getValue('a_Style_Marketing_Flag_BRFS').getSimpleValue();
			log.info(currentValue);
			dataContainerObject.getValue('zz_Style_Marketing_Flag_BRFS').setSimpleValue(currentValue);
			log.info(dataContainerObject.getValue('zz_Style_Marketing_Flag_BRFS').getSimpleValue());
		}
	}
}