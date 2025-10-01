/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Non_Product_BU_Approval_Code",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Non Product BU Approval Code",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "NonProductBusinessUnit" ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,portal) {
if(stepManager.getCurrentWorkspace().getID() == "Main"){
//checking mandatory attributes
var marketNumber = node.getValue('a_Market_Number').getSimpleValue();
if(marketNumber == null || marketNumber == ''){
	portal.showAlert("ERROR", "Missing Required Attribute");
}
    
 node.approve();
} else if (stepManager.getCurrentWorkspace().getID() == "Approved") {
	portal.showAlert("Warning", "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}