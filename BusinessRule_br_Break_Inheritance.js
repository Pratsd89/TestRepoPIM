/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Break_Inheritance",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Break DSG Inheritance",
  "description" : "PIM-11282",
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
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,webui) {
var reftType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_mergeDuplicateStyles");
var refList = node.getReferences(reftType);
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var ctx = manager.getCurrentContext().getID();
if ("EN_CA".equals(ctx) || "FR_CA".equals(ctx)) {
    if (refList.size() > 0) {
        manager.executeInContext(ctx, function(ctxmanager) {
            for (var i = 0; i < refList.size(); i++) {
                var ref = refList.get(i);
                var styleTarget = ref.getTarget();
                styleTarget.getValue("a_Primary_Selling_Style_ID").setSimpleValue("");
                styleTarget.getValue("a_Primary_Selling_Style").setSimpleValue("");
                styleTarget.getValue("a_Supporting_Styles").setSimpleValue("");
                styleTarget.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                styleTarget.getValue("a_SuperPDP_Program_ID").setSimpleValue("");
                styleTarget.getValue("a_Style_Group_Type").setSimpleValue("");
                ref.delete();
            }
            node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(null);
            node.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
            node.getValue("a_IsInheritanceBroken").setSimpleValue("Yes");
			node.getValue("a_SuperPDP_Market").setSimpleValue("US");
        });
    } else {
        web.showAlert("ERROR",  "Duplicate Style Group is empty.");
    }
} else {
    webui.showAlert("ERROR",  "Break inheritance allowed only in Canada context.");
}
}