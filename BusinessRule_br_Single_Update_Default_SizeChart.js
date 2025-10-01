/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Single_Update_Default_SizeChart",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Single_Update_Default_SizeChart",
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
    "alias" : "currObj",
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
    "alias" : "aSizeChart",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Size_Chart",
    "description" : null
  }, {
    "contract" : "ListOfValuesBindContract",
    "alias" : "lovSizeChart",
    "parameterClass" : "com.stibo.core.domain.impl.ListOfValuesImpl",
    "value" : "Size_Chart",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currObj,logger,aSizeChart,lovSizeChart) {
currObj.getValue(aSizeChart.getID()).setSimpleValue("No Size Chart");
logger.info("VALUE: " + currObj.getValue(aSizeChart.getID()).getSimpleValue());
}