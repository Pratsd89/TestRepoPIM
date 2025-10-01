/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_breakSSGInheritance",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_breakSSGInheritance",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,web) {
var context = manager.getCurrentContext().getID();
if (context == "EN_CA" || context == "FR_CA") {
    var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_styles");
    var refList = node.getReferences(refType);
    if (refList.size() > 0) {
        for (var i = 0; i < refList.size(); i++) {
            var ref = refList.get(i);
            var refTarget = ref.getTarget();
            refTarget.getValue("a_Primary_Selling_Style_ID").setSimpleValue(null);
            refTarget.getValue("a_Primary_Selling_Style").setSimpleValue(null);
            refTarget.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
            refTarget.getValue("a_Supporting_Styles").setSimpleValue(null);
            ref.delete();
        }
        node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(null);
        node.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
        node.getValue("a_IsInheritanceBroken").setSimpleValue("Yes");
        node.getValue("a_SuperPDP_Market").setSimpleValue("US");
    } else {
        web.showAlert("ERROR", null, "Similar Style Group is empty.");
    }
} else {
    web.showAlert("ERROR", null, "Not allowed to break inheritance in this context.");
}
}