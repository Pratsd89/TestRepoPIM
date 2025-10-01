/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "STIBO_TC_GAPNC622_FlagPosition",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Populating Marketing Flag Position Value(2)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
logger.info("hey second first - strat");
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
if(node.getObjectType().getID() == 'Style')
{
	
	var marketingFlagDataContainer1 = node.getDataContainerByTypeID('StyleMarketingFlag1');
	var marketingFlagDataContainer2 = node.getDataContainerByTypeID('StyleMarketingFlag2');
	var marketingFlagDataContainer3 = node.getDataContainerByTypeID('StyleMarketingFlag3');
	var marketingFlagDataContainer4 = node.getDataContainerByTypeID('StyleMarketingFlag4');
	var marketingFlagDataContainer5 = node.getDataContainerByTypeID('StyleMarketingFlag5');
	//extra marketing flag added
	var marketingFlagDataContainer6 = node.getDataContainerByTypeID('StyleMarketingFlag6');
	var marketingFlagDataContainer7 = node.getDataContainerByTypeID('StyleMarketingFlag7');
	var marketingFlagDataContainer8 = node.getDataContainerByTypeID('StyleMarketingFlag8');
	var marketingFlagDataContainer9 = node.getDataContainerByTypeID('StyleMarketingFlag9');
	var marketingFlagDataContainer10 = node.getDataContainerByTypeID('StyleMarketingFlag10');
	// CA marketing flag added
	var marketingFlagDataContainerCA1 = node.getDataContainerByTypeID('StyleMarketingFlagCA1');
	var marketingFlagDataContainerCA2 = node.getDataContainerByTypeID('StyleMarketingFlagCA2');
	var marketingFlagDataContainerCA3 = node.getDataContainerByTypeID('StyleMarketingFlagCA3');
	var marketingFlagDataContainerCA4 = node.getDataContainerByTypeID('StyleMarketingFlagCA4');
	var marketingFlagDataContainerCA5 = node.getDataContainerByTypeID('StyleMarketingFlagCA5');
	var marketingFlagDataContainerCA6 = node.getDataContainerByTypeID('StyleMarketingFlagCA6');
	var marketingFlagDataContainerCA7 = node.getDataContainerByTypeID('StyleMarketingFlagCA7');
	var marketingFlagDataContainerCA8 = node.getDataContainerByTypeID('StyleMarketingFlagCA8');
	var marketingFlagDataContainerCA9 = node.getDataContainerByTypeID('StyleMarketingFlagCA9');
	var marketingFlagDataContainerCA10 = node.getDataContainerByTypeID('StyleMarketingFlagCA10');
	var dataContainerArray = [marketingFlagDataContainer1,marketingFlagDataContainer2,marketingFlagDataContainer3,marketingFlagDataContainer4,marketingFlagDataContainer5,marketingFlagDataContainer6,marketingFlagDataContainer7,marketingFlagDataContainer8,marketingFlagDataContainer9,marketingFlagDataContainer10];
	var dataContainerArrayCA = [marketingFlagDataContainerCA1,marketingFlagDataContainerCA2,marketingFlagDataContainerCA3,marketingFlagDataContainerCA4,marketingFlagDataContainerCA5,marketingFlagDataContainerCA6,marketingFlagDataContainerCA7,marketingFlagDataContainerCA8,marketingFlagDataContainerCA9,marketingFlagDataContainerCA10];
	
	for(var i = 0;i<dataContainerArray.length;i++){
		var dataContainerObject = dataContainerArray[i].getDataContainerObject();
		if(dataContainerObject != null){
			dataContainerObject.getValue('a_marketing_flag_position').setSimpleValue(i+1);
		}
	}
	for(var j = 0;j<dataContainerArrayCA.length;j++){
		var dataContainerObjectCA = dataContainerArrayCA[j].getDataContainerObject();
		if(dataContainerObjectCA != null){
			dataContainerObjectCA.getValue('a_marketing_flag_position').setSimpleValue(j+1);
		}
	}
}
else if(node.getObjectType().getID() == 'CustomerChoice')
{
	
	var marketingFlagDataContainer1 = node.getDataContainerByTypeID('CCMarketingFlag1');
	var marketingFlagDataContainer2 = node.getDataContainerByTypeID('CCMarketingFlag2');
	var marketingFlagDataContainer3 = node.getDataContainerByTypeID('CCMarketingFlag3');
	var marketingFlagDataContainer4 = node.getDataContainerByTypeID('CCMarketingFlag4');
	var marketingFlagDataContainer5 = node.getDataContainerByTypeID('CCMarketingFlag5');
	//extra marketing flag added
	var marketingFlagDataContainer6 = node.getDataContainerByTypeID('CCMarketingFlag6');
	var marketingFlagDataContainer7 = node.getDataContainerByTypeID('CCMarketingFlag7');
	var marketingFlagDataContainer8 = node.getDataContainerByTypeID('CCMarketingFlag8');
	var marketingFlagDataContainer9 = node.getDataContainerByTypeID('CCMarketingFlag9');
	var marketingFlagDataContainer10 = node.getDataContainerByTypeID('CCMarketingFlag10');
	//CA marketing flag added
	var marketingFlagDataContainerCA1 = node.getDataContainerByTypeID('CCMarketingFlagCA1');
	var marketingFlagDataContainerCA2 = node.getDataContainerByTypeID('CCMarketingFlagCA2');
	var marketingFlagDataContainerCA3 = node.getDataContainerByTypeID('CCMarketingFlagCA3');
	var marketingFlagDataContainerCA4 = node.getDataContainerByTypeID('CCMarketingFlagCA4');
	var marketingFlagDataContainerCA5 = node.getDataContainerByTypeID('CCMarketingFlagCA5');
	var marketingFlagDataContainerCA6 = node.getDataContainerByTypeID('CCMarketingFlagCA6');
	var marketingFlagDataContainerCA7 = node.getDataContainerByTypeID('CCMarketingFlagCA7');
	var marketingFlagDataContainerCA8 = node.getDataContainerByTypeID('CCMarketingFlagCA8');
	var marketingFlagDataContainerCA9 = node.getDataContainerByTypeID('CCMarketingFlagCA9');
	var marketingFlagDataContainerCA10 = node.getDataContainerByTypeID('CCMarketingFlagCA10');
	var dataContainerArray = [marketingFlagDataContainer1,marketingFlagDataContainer2,marketingFlagDataContainer3,marketingFlagDataContainer4,marketingFlagDataContainer5,marketingFlagDataContainer6,marketingFlagDataContainer7,marketingFlagDataContainer8,marketingFlagDataContainer9,marketingFlagDataContainer10];
	var dataContainerArrayCA = [marketingFlagDataContainerCA1,marketingFlagDataContainerCA2,marketingFlagDataContainerCA3,marketingFlagDataContainerCA4,marketingFlagDataContainerCA5,marketingFlagDataContainerCA6,marketingFlagDataContainerCA7,marketingFlagDataContainerCA8,marketingFlagDataContainerCA9,marketingFlagDataContainerCA10];
	
	for(var i = 0;i<dataContainerArray.length;i++){
		var dataContainerObject = dataContainerArray[i].getDataContainerObject();
		if(dataContainerObject != null){
			dataContainerObject.getValue('a_marketing_flag_position').setSimpleValue(i+1);
		}
	}
	for(var j = 0;j<dataContainerArrayCA.length;j++){
		var dataContainerObjectCA = dataContainerArrayCA[j].getDataContainerObject();
		if(dataContainerObjectCA != null){
			dataContainerObjectCA.getValue('a_marketing_flag_position').setSimpleValue(j+1);
		}
	}
	
}
}
logger.info("hey second first - end");
/*else if (stepManager.getCurrentWorkspace().getID() == "Approved")
{
	portal.showAlert("Warning", null , "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}*/
}