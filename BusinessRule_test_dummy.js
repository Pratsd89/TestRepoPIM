/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test_dummy",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "test_dummy",
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,web) {
/*
var classification = step.getClassificationHome().getClassificationByID("VB50-0004-Dim1");
var objectType = classification.getObjectType().getID();
log.info(objectType);
*/
var temp = com.stibo.webui.bindaction.server.context.WebUiContext

//webUI.navigate(screenID,null);
//temp.navigate("Style_Details_Screen", null);
web.navigateUrl("https://www.google.com", true);
}