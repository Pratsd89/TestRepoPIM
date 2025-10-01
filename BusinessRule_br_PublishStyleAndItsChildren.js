/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PublishStyleAndItsChildren",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_PublishStyleAndItsChildren",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var CCs = node.getChildren();

for(var i=0; i < CCs.size(); i++) {
	CCs.get(i).getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	//log.info(CCs.get(i).getID())
	var Skus = CCs.get(i).getChildren();
	for(var j=0; j < Skus.size(); j++) {
		//log.info(Skus.get(j).getID())
		Skus.get(j).getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	}
}

node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}