/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_WebCategory_Save_Button",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_WebCategory_Save_Button",
  "description" : "Logic for the WebCategory screen save button: PPIM-6178",
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
    "contract" : "BusinessActionBindContract",
    "alias" : "SaveCategory",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "Save_Category",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "SaveCategorySansAutopop",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "Save_Category_sans_Autopop",
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
exports.operation0 = function (node,SaveCategory,SaveCategorySansAutopop,webUI) {
//get current time
var now = new java.util.Date();
var fmt = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm");
//format current time
now = fmt.format(now);

//get revision history of node
var rev = node.getRevision().getCreatedDate();
//format revision time
rev = fmt.format(rev);

//if WebCategory recent revision matches current time then save with autopop
if (now == rev) {
	//webUI.showAlert("INFO", "Saving with Autopop", "Saving node with Autopop");
	SaveCategory;
}
//else save without autopop
else {
	//webUI.showAlert("INFO", "Skipping Autopop", "Saving node without Autopop");
	SaveCategorySansAutopop;
}
}