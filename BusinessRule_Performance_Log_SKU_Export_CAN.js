/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Performance_Log_SKU_Export_CAN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Performance_Log_SKU_Export_CAN",
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
    "alias" : "myObj",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "myAtt",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "Publish_Output_Debug_Att_Can",
    "description" : null
  }, {
    "contract" : "ProductBindContract",
    "alias" : "myProd",
    "parameterClass" : "com.stibo.core.domain.impl.FrontProductImpl",
    "value" : "WebHierarchyUS",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (myObj,logger,myAtt,myProd) {
logger.info("OBJ " + myObj.getID() + " TYPE " + myObj.getObjectType() + " exported");
var currVal = myProd.getValue(myAtt.getID()).getSimpleValue();
if (currVal == null) {
	currVal = "";
}
myProd.getValue(myAtt.getID()).setSimpleValue(currVal + myObj.getID() + ",");

}