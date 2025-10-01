/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_Delete_Button_Condition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Delete Button Condition",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
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
exports.operation0 = function (step) {
var context = step.getCurrentContext().getID();
var Market = node.getValue("a_SuperPDP_Market").getSimpleValue();
//&& (Market.contains("multisep")
if(context =='EN_CA' && (Market.contains("multisep")){
	return true;

}
else{
	return true;
	}
}