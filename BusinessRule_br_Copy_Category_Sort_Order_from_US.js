/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Copy_Category_Sort_Order_from_US",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Copy Category Sort Order from US",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
exports.operation0 = function (node,stepManager) {
var inheritValue = node.getValue('a_WebCategory_Inherit_US').getSimpleValue();
if(inheritValue=='Yes'){
	stepManager.executeInContext('EN_US', function (enContextManager) {
		var enClassification = enContextManager.getClassificationHome().getClassificationByID(node.getID());
		var sortOrder=enClassification.getValue('a_WebCategory_Sort_Order').getSimpleValue();
		node.getValue('a_WebCategory_Sort_Order').setSimpleValue(sortOrder);
		var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	})
}
}