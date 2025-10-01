/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MarkForDeletion",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Mark For Deletion",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Slot" ],
  "allObjectTypesValid" : true,
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
var currentContext = step.getCurrentContext().getID();
var selectedIter = webUI.getSelection().iterator();
var warnMsgFlag = false;
var logArray = new Array();
var logArray1 = new Array();
var logArray2 = new Array();
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

while (selectedIter.hasNext()) {
    var result = true;
    var currSelected = selectedIter.next();
    var inheritToCAN = currSelected.getValue("a_Content_Group_Can_InheritOption").getSimpleValue();
    if (inheritToCAN == "CAN" && currentContext != "EN_US") {
        logArray.push(currSelected.getID());
        continue;
    }

    var today = new java.util.Date();
    today.setDate(today.getDate() + 0);

    var d = new Date(today),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    newEndDate = year + "-" + month + "-" + day;
    var startDate = currSelected.getValue("a_WebCategory_Start_Date").getSimpleValue();

    if (newEndDate < startDate) {
        logArray1.push(currSelected.getID());
        continue;
    }

    var sortOrder = currSelected.getValue("a_WebCategory_Sort_Order").getSimpleValue();
    if (startDate != null && sortOrder != null && sortOrder != "9999") {
        currSelected.getValue("a_WebCategory_End_Date").setSimpleValue(newEndDate);
        if (inheritToCAN == "CAN" && currentContext == "EN_US") {
            step.executeInContext("EN_CA", function (ctxManager) {
                var canCG = ctxManager.getObjectFromOtherManager(currSelected);
                canCG.getValue("a_WebCategory_End_Date").setSimpleValue(newEndDate);
            });
        }
        currSelected.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    } else {
    		logArray2.push(currSelected.getID());
    }
}

if (logArray.length > 0) {
    webUI.showAlert("WARNING", "The following content groups are inherited from US. Please switch to EN_US and Mark them For Deletion.", logArray.toString());
}
else if (logArray1.length > 0) {
    webUI.showAlert("WARNING", "The following content groups have start date in future - can't Mark them For Deletion.", logArray1.toString());
}
else if (logArray2.length > 0) {
    webUI.showAlert("WARNING", "The following content groups are not active in current market - can't Mark them For Deletion.", logArray2.toString());
}
else {
    webUI.showAlert("SUCCESS", "Marked for Deletion", "Successfully marked all selected content groups for deletion.");
}

}