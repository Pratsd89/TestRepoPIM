/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_BreakInheritance_2.0",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Break Inheritance 2.0",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "DuplicateStyleGroup", "SimilarStyleGroup" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {

manager.executeInContext("EN_US", function (currentContextManager) {
	var EN_US_Node = currentContextManager.getProductHome().getProductByID(node.getID());
	//var Market = EN_US_Node.getValue("a_SuperPDP_Market 2.0").getSimpleValue();
		EN_US_Node.getValue("a_SuperPDP_Market").deleteCurrent();
		EN_US_Node.getValue("a_SuperPDP_Market").setSimpleValue("US");
});

manager.executeInContext("EN_CA", function (currentContextManager) {
	var EN_CA_Node = currentContextManager.getProductHome().getProductByID(node.getID());
	//var Market = EN_CA_Node.getValue("a_SuperPDP_Market 2.0").getSimpleValue();
		EN_CA_Node.getValue("a_SuperPDP_Market").deleteCurrent();
		EN_CA_Node.getValue("a_SuperPDP_Market").setSimpleValue("CAN");
});

}