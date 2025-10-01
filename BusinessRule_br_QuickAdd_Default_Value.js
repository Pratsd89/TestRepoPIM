/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_QuickAdd_Default_Value",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_QuickAdd_Default_Value",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
//var quickAdd = "";

/*var parentNode = node.getParent();
var superParentName = parentNode.getParent().getName();

if(superParentName =="ATHLETA" || superParentName =="BANANA REPUBLIC")
{
	node.getValue("a_Quick_Add").setSimpleValue("Yes");
	} else
	{
		node.getValue("a_Quick_Add").setSimpleValue("No");
		}*/

var quickAdd = node.getValue("a_Quick_Add").getSimpleValue();

if (quickAdd == null) {
node.getValue("a_Quick_Add").setSimpleValue("No");
}
//logic to copy "Quick Add" value to EN_CA in Case Inherit to CA is there 

/*var context = step.getCurrentContext().getID();
logger.info ("Current Context ID is: " + context);*/

var canadaManager ="null";
var isCanInherit = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
var targetContextID = "EN_CA";
 step.executeInContext(targetContextID, function (contextManager) {
 canadaManager = contextManager;
 });
 
var WC_CAN = canadaManager.getObjectFromOtherManager(node);

if (isCanInherit != null) {
	WC_CAN.getValue("a_Quick_Add").setSimpleValue(quickAdd);
	}


}