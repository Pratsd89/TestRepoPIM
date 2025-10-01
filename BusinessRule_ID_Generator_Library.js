/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ID_Generator_Library",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "ID Generator Library",
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
function setIDValue(node,stepManager,entityID,attributeID){

	var CIDEntity = stepManager.getEntityHome().getEntityByID(entityID);
    var currentValue = CIDEntity.getValue('a_Last_ID_Value').getSimpleValue();
    var idDistance = CIDEntity.getValue('a_ID_Distance').getSimpleValue();
	var nextValue = parseInt(currentValue) + parseInt(idDistance);
	settingValue(node,CIDEntity,nextValue,attributeID);

	
}


function settingValue(node,CIDEntity,nextValue,attributeID){

    node.getValue(attributeID).setSimpleValue(nextValue);
    CIDEntity.getValue('a_Last_ID_Value').setSimpleValue(nextValue);
}

/*===== business library exports - this part will not be imported to STEP =====*/
exports.setIDValue = setIDValue
exports.settingValue = settingValue