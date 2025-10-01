/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SuperPDP_Save_Style_Validations",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SuperPDP Save Style Validations",
  "description" : "PPIM-10706",
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,webUI) {
/*var referencedBy = node.getReferencedByProducts().toArray();
for (var i = 0; i < referencedBy.length; i++) {
    var referenceTypeID = referencedBy[i].getReferenceType().getID();
    if (referenceTypeID == "rt_mergeDuplicateStyles") {
        var currentReference = referencedBy[i];
        if (currentReference.getValue("a_Primary_Selling_Style").getSimpleValue() == "Yes") {
            var endDate = node.getValue("a_Style_End_Date").getSimpleValue();
            if (endDate != null) {
                node.getValue("a_Style_End_Date").setSimpleValue(null);
                node.getValue("a_Style_Deactivation_Reason").setSimpleValue(null);
                webUI.showAlert("Error", "This Style is the Primary Style on a DuplicateStyleGroup and cannot be ended. You will need to delete the DuplicateStyleGroup in order to end this Style");
            }
        } else if (currentReference.getValue("a_Primary_Selling_Style").getSimpleValue() == "No") {
            webUI.showAlert("WARNING", "You are modifying a Supporting Style for Duplicate Style Group. These changes will not be reflected on the website");
        }
    }
}*/

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
                webUI.showAlert("Error",  "This Style is the Primary Product on a Product Group and cannot be ended. You will need to delete the Product Group in order to end this Style");
            }
        } /*else if (currentReference.getValue("a_Primary_Selling_Style").getSimpleValue() == "No") {
            webUI.showAlert("WARNING",  "You are modifying a Supporting Style for Duplicate Style Group. These changes will not be reflected on the website");
        }*/
    }
}
}