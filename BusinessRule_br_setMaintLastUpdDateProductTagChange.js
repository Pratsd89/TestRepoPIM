/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setMaintLastUpdDateProductTagChange",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Maintenance Last Update Date via Product Tag Change",
  "description" : "After PPH object is updated, updating Maintenance Last Update date for Style, CC and SKU via Event Processor for performance reasons",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,webui) {
selectedNodes = webui.getSelection().iterator();
while (selectedNodes.hasNext()) {
  	var selectNode = selectedNodes.next();
	var obj = selectNode.getObjectType().getID(); 
	if(obj == "Style" || obj == "CustomerChoice" || obj == "SKU")
	{
		var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//logger.info(iso.format(time));
		selectNode.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	}
}
}