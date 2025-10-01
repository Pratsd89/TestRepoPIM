/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bf_MergedStyle_group",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "bf_MergedStyle_group",
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
  "messages" : [ {
    "variable" : "msg",
    "message" : "Very nice",
    "translations" : [ {
      "language" : "hi",
      "message" : "Bahut ache"
    } ]
  } ],
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
exports.operation0 = function (step,node,msg) {

var brand = node.getValue("a_Brand_Number").getSimpleValue();
var context = step.getCurrentContext().getID();
var nodeID = node.getID();
var parentID = node.getParent().getID();
var mergeStyleID = parentID.split("_")[0]+"_"+parentID.split("_")[1];

var Url = "https://stibo-ui.aks.stage.azeus.gaptech.com/groups/style-merge/create-styles?brand="+brand+"&context="+context+"&divisionID="+mergeStyleID+"&groupID="+nodeID ;

 return "<html><div style=\"width: 98%; height: 82vh; \"><iframe id=\"approve\" frameborder=\"0\" style=\"width: 100%; height: 100%;\" src=\"" + Url + "\"></iframe></div></html>"
}