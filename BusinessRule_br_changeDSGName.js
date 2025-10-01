/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_changeDSGName",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Primary Style and DSG Name SyncUp",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log) {
var styleName = node.getName();
styleName = styleName == null ? "" : styleName;
var refBy = node.getReferencedBy().toArray();
for (var i = 0; i < refBy.length; i++) {
    if (refBy[i].getReferenceType().getID() == "rt_ProductGroups") {
        var isPrimaryStyle = refBy[i].getValue("a_Primary_Selling_Style").getSimpleValue();
        if (isPrimaryStyle == "Yes") {
            var DSG = refBy[i].getSource();
            DSG.setName(styleName);
        }
    }
}
}