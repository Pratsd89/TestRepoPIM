/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_updateLinkedDSGName",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_updateLinkedDSGName",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var styleName = node.getName();
var refBy = node.getReferencedBy().toArray();
for (var i = 0; i < refBy.length; i++) {
    if (refBy[i].getReferenceType().getID() == "rt_ProductGroups") {
        var isPrimaryStyle = refBy[i].getValue("a_Primary_Selling_Style").getSimpleValue();
        if (isPrimaryStyle == "Yes") {
            var DSG = refBy[i].getSource();
            if (DSG.getName() != styleName) {
                styleName = styleName == null ? "" : styleName;
                DSG.setName(styleName);
            }
        }
    }
}
}