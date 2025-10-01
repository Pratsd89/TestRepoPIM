/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "STIBO_TC_GAPNC622_LastUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Maintenance Last Update Date(2)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Class", "CustomerChoice", "Department", "Division", "SKU", "SizeFacetCategory", "SizeFacetCode", "SizeFacetValue", "Style", "SubClass", "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "STIBO_TC_GAPNC622_FlagPosition"
  } ],
  "pluginType" : "Operation"
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node,stepManager) {
logger.info("hey second");
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
	var time1 = new java.util.Date();
	var iso1 = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	//logger.info(iso.format(time));
	node.getValue("a_main_last_modified_date").setSimpleValue(iso1.format(time1));
	log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
	//iso.format(time)
}
logger.info("hey second end");
}