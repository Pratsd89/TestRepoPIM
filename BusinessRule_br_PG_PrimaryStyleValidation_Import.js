/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PG_PrimaryStyleValidation_Import",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Product Group Primary Style Import Validation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
var referencedBy = node.getReferencedByProducts().toArray();

for (var i = 0; i < referencedBy.length; i++) {
    var referenceTypeID = referencedBy[i].getReferenceType().getID();
    if (referenceTypeID == "rt_ProductGroups") {
        var currentReference = referencedBy[i];
        if (currentReference.getValue("a_Primary_Selling_Style").getSimpleValue() == "Yes") {
            var endDate = node.getValue("a_Style_End_Date").getSimpleValue();
            if (endDate != null) {
                node.getValue("a_Style_End_Date").setSimpleValue(null);
                node.getValue("a_Style_Deactivation_Reason").setSimpleValue(null);
                return "This Style is the Primary Style on a Product Group and cannot be ended. You will need to delete the Product Group in order to end this Style.";
            }
        }
    }
}
return true;
}