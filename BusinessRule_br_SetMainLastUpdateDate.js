/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetMainLastUpdateDate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_SetMainLastUpdateDate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision" ],
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
exports.operation0 = function (web) {
var selection = web.getSelection().iterator();
while (selection.hasNext())
{
	var node = selection.next();
     var time = new java.util.Date();
     var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
     node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
     log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
     }
}