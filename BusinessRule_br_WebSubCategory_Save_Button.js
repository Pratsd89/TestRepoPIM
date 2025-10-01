/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_WebSubCategory_Save_Button",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_WebSubCategory_Save_Button",
  "description" : "Logic for the WebSubCategory screen save button: PPIM-6178",
  "scope" : "Global",
  "validObjectTypes" : [ "WebSubCategory" ],
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
    "alias" : "SaveSubCategory",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Save_Web_SubCategory",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "SaveSubCategorySansAutopop",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "Save_Web_SubCategory_sans_Autopop",
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
exports.operation0 = function (node,SaveSubCategory,SaveSubCategorySansAutopop,webUI) {
//get current time
var now = new java.util.Date();
var fmt = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//format current time
now = fmt.format(now);

//get revision history of node
var rev = node.getRevision().getEditedDate();
//format revision time
rev = fmt.format(rev);

//if WebCategory recent revision matches current time then save with autopop
if (now == rev) {
	//webUI.showAlert("INFO", "Saving with Autopop", "Saving node with Autopop");
	SaveSubCategory;
}
//else save without autopop
else {
	//webUI.showAlert("INFO", "Skipping Autopop", "Saving node without Autopop");
	SaveSubCategorySansAutopop;
}
}