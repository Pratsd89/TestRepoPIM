/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setLocal_BO_RLT_CC_IfInherited",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Local BO RLT CC If Inherited",
  "description" : "Bulk Update BR - Need to run before updating the validity on BO attributes",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "alias" : "step",
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
exports.operation0 = function (node,step,log) {
/* Use this BR for Bulk Update only if CC have Backorderable Value (Include Inherit Value)
	- Localise the Backorderable, Old_Backorderable attributes Value at CC level if Value is inherited from Parent.
*/

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var isInheritedBO= false;

if (node.getValue('a_Backorderable').isInherited() == true || node.getValue('a_Old_Backorderable').isInherited() == true ) {
	isInheritedBO = true;
	var inheritedBO = node.getValue('a_Backorderable').getSimpleValue();
	node.getValue('a_Backorderable').setSimpleValue(inheritedBO);
	node.getValue('a_Old_Backorderable').setSimpleValue(inheritedBO);

}

/*if(isInheritedBO) {
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}*/

}