/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetMainLastUpdateDateforNPCategory",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Set MainLastUpdateDate for NP Category",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "NonProductCategory" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,stepManager) {
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
}
}