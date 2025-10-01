/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_badgesRefresh",
  "type" : "BusinessAction",
  "setupGroups" : [ "Badges" ],
  "name" : "Badges Refresh",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,webUI) {
var screenID = webUI.getScreenId();
//webUI.navigate(screenID, null);
//webUI.navigate("homepage", null);
//var temp = com.stibo.webui.bindaction.server.context.WebUiContext

webUI.navigate(screenID,null);
//temp.navigate("Style_Details_Screen", null);
//temp.navigateUrl​("https://www.google.com", true);



}