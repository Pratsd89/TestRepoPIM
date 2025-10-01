/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CustomerServiceCategoryDetailsPortalMSG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CustomerServiceCategoryDetailsPortalMSG",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerServiceCategory" ],
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
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,portal,lookupTable) {
currentContext = manager.getCurrentContext().getID();
var brandObj = node.getParent().getParent();
var brandNumber = brandObj.getValue("a_Brand_Number").getSimpleValue();
var contextList = lookupTable.getLookupTableValue("LKT_Brand_Number_to_Context", brandNumber);
var approvalStatus;
var completelyApprovedContexts = "";
var partiallyApprovedContexts = "";
if (manager.getCurrentWorkspace().getID() == "Main") {
    if (!(contextList == null || contextList == "" || contextList == "undefined")) {
        var otherContext = contextList.split(";");
        for (i = 0; i < otherContext.length; i++) {
            if (otherContext[i] != currentContext) {
                manager.executeInContext(otherContext[i], function (otherManager) {
                    var othernode = otherManager.getClassificationHome().getClassificationByID(node.getID());
                    approvalStatus = othernode.getApprovalStatus().toString();
                })
                if (approvalStatus == "Completely Approved") {
                    completelyApprovedContexts += otherContext[i] + " ";
                } 
                else if (approvalStatus == "Partly approved" || approvalStatus == "Context approved") {
                    partiallyApprovedContexts += otherContext[i] + " ";
                }
            }
        }
    }
}
if (partiallyApprovedContexts == "" && completelyApprovedContexts != "") {
    portal.showAlert("Green", "Business condition CustomerServiceCategoryApproval completed successfully ");
} 
else if (partiallyApprovedContexts != "") {
    portal.showAlert("warning", "Business condition CustomerServiceCategoryApproval completed successfully in context " + currentContext + ", and not approved in contexts " + partiallyApprovedContexts + ". Please approve the category in other contexts to be published in all Market contexts.");
}
}