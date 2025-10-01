/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test_ars",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "test_ars",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
exports.operation0 = function (webUI,manager,node) {
var selected = webUI.getSelection().iterator();
var BusinessRuleHome = manager.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
//BusinessRuleHome.getBusinessActionByID("test_ars2").execute(node);
while(selected.hasNext()){
	var flag = true;
	var current = selected.next();
	BusinessRuleHome.getBusinessActionByID("test_ars2").execute(current);
}

}