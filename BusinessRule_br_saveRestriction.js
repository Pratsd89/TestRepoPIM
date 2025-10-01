/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_saveRestriction",
  "type" : "BusinessAction",
  "setupGroups" : [ "GlobalBusinessRulesRoot" ],
  "name" : "br_saveRestriction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Restriction" ],
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Restriction_Product_Ref",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,web,refType) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var parent = node.getParent();
parent.queryReferencedBy(refType).forEach(function (ref) {
    var sourceObject = ref.getSource();
    sourceObject.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    if (sourceObject.getObjectType().getID() == "Style") {
        var ccs = sourceObject.getChildren();
        ccs.forEach(function (cc) {
            cc.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        });
    }
    return true;
});
web.navigate("Event_Details_Screen", parent);
}