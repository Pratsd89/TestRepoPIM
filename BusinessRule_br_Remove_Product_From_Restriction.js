/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Remove_Product_From_Restriction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Remove Product From Restriction",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Restriction_Product_Ref",
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
exports.operation0 = function (node,step,refType,web) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var selectedNodes = web.getSelection().iterator();
while (selectedNodes.hasNext()) {
    var selectNode = selectedNodes.next();
    selectNode.queryReferences(refType).forEach(function (ref) {
        var targetID = ref.getTarget().getID();
        if (targetID == node.getID()) {
            ref.delete();
            selectNode.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
            if (selectNode.getObjectType().getID() == "Style") {
                var ccs = selectNode.getChildren();
                ccs.forEach(function (cc) {
                    cc.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                });
            }
        }
        return true;
    });
}

}