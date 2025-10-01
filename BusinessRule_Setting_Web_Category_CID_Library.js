/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Setting_Web_Category_CID_Library",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Setting Web Category CID Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
function setWebCategoryCIDValue(node,stepManager){

	var CIDEntity = stepManager.getEntityHome().getEntityByID('300740');
	var currentValue = CIDEntity.getValue('a_Current_Number').getSimpleValue();
	var nextValue = parseInt(currentValue) + 1;
	var maxValue = parseInt(currentValue) + 100;
	settingValue(node,CIDEntity,nextValue,maxValue);

	
}


function settingValue(node,CIDEntity,nextValue,maxValue){
	try{
		node.getValue('a_WebCategory_CID').setSimpleValue(nextValue);
		CIDEntity.getValue('a_Current_Number').setSimpleValue(nextValue);
		
	}
	catch(e){
		if(nextValue == maxValue){
			throw 'The Web Category CID Value could not be set. Please add it manually and try again.';
		}
		nextValue = nextValue + 1;
		settingValue(node,CIDEntity,nextValue,maxValue);
		
	}
}

/*===== business library exports - this part will not be imported to STEP =====*/
exports.setWebCategoryCIDValue = setWebCategoryCIDValue
exports.settingValue = settingValue