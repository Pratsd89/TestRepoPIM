/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "MultiVariantGroup",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "MultiVariant Group",
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
  "pluginId" : "JavaScriptBusinessFunctionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (step,node) {

var brand = node.getValue("a_Brand_Number").getSimpleValue();
var context = step.getCurrentContext().getID();
var nodeID = node.getID();
var mvgDivID = nodeID.split("_")[0]+"_"+nodeID.split("_")[1];

var Url = "https://stibo-ui.aks.stage.azeus.gaptech.com/groups/multi-variant-merge?divisionID="+mvgDivID+"&brand="+brand+"&context="+context;

return "<html><div style=\"width: 98%; height: 82vh; \"><iframe id=\"approve\" frameborder=\"0\" style=\"width: 100%; height: 100%;\" src=\"" + Url + "\"></iframe></div></html>"
}