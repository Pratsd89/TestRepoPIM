/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Info_Date_Test",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Info_Date_Test",
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
exports.operation0 = function (node,log) {
var simpleDateFormat = new java.text.SimpleDateFormat("dd-MMM-yyyy kk:mm");
var currTime = simpleDateFormat.format(java.lang.System.currentTimeMillis());
var newTime = simpleDateFormat.format(java.lang.System.currentTimeMillis() + 200000);
var finalTime = new Date(java.lang.System.currentTimeMillis() + 200000);

log.info("currTime: " + currTime + "\nnewTime: " + newTime + "\nfinalTime: " + finalTime);


}