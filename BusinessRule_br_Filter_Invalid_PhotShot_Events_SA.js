/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Filter_Invalid_PhotShot_Events_SA",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_Filter_Invalid_PhotShot_Events_SA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
    "contract" : "CurrentEventTypeBinding",
    "alias" : "currentEvent",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currentEvent,logger) {
// Trigger OIEP only for Valid Shots
if (currentEvent.getID() == "Create"){
	return false;	
	}
else{   	
	return true;
	}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node,step,log) {
//PPIM-7078
var result = true;
//PPIM-8552
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var objType = node.getObjectType().getID();
if (objType == "ProductShotRequest"){
step.executeInContext('EN_SA', function (usContextManager) {
	var usCurrentEntity = usContextManager.getEntityHome().getEntityByID(node.getID());
	//log.info(usCurrentEntity);
	//log.info(usCurrentEntity.getValue("a_Site_Placement").getSimpleValue()+usCurrentEntity.getValue("a_Shared_Markets").getSimpleValue()+usCurrentEntity.getValue("a_Shot_Code").getSimpleValue()+usCurrentEntity.getValue("a_Shot_CC_Number").getSimpleValue());
	if (usCurrentEntity.getValue("a_Site_Placement").getSimpleValue() == null || usCurrentEntity.getValue("a_Shared_Markets").getSimpleValue() == null || usCurrentEntity.getValue("a_Shot_Code").getSimpleValue() == null || usCurrentEntity.getValue("a_Shot_CC_Number").getSimpleValue() == null) {
		result = false;
	}
});
}
else {
	result = false;
}

if (result == true) {
	node.getValue("a_File_AssetHub_TimeStamp").setSimpleValue(iso.format(time));
}
return result;
}