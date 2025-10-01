/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Remove",
  "type" : "BusinessAction",
  "setupGroups" : [ "Test_Business_Rules" ],
  "name" : "TEST RemoveStyleFromPG",
  "description" : "Runs behind the button labelled 'Remove Style' on the screen with ID “DuplicateStyleGroups_Details_Screen”",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ProductGroupLibrary",
    "libraryAlias" : "pgLibrary"
  } ]
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
    "contract" : "WebUiContextBind",
    "alias" : "webui",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,webui,step,RefType,pgLibrary) {
var context = step.getCurrentContext().getID();
var Market = node.getValue("a_SuperPDP_Market").getSimpleValue();
var delete_RefArray = [];
var selection = webui.getSelection();
var selectionCount = selection.size();
var primaryStyleID = node.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
var primaryStyle = step.getProductHome().getProductByID(primaryStyleID);
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

if (selectionCount == 0) {
    webui.showAlert("ERROR", "<b>Please select any Style to perform this action</b>");
} else {
    var selectionIter = selection.iterator();
    while (selectionIter.hasNext()) {
        var curr_style = selectionIter.next();
        var curr_styleID = curr_style.getID();
        var isPrimaryStyle = 'No';

        if (context == "EN_CA" && (Market.contains("multisep"))) {
            webui.showAlert("WARNING", "<b>ALERT: " + "This a shared item between US and Canada, Kindly perform this action is EN_US context" + "</b>");
        }
        else {
            if (curr_styleID == primaryStyleID) {
                webui.showAlert("WARNING", "<b>ALERT: " + "You are attempting to remove the Primary Style for this group. Please indicate which Style is the new Primary Style and save prior to removing this Style from the group" + "</b>");
            }
            else {
                var dsg_refs = node.getReferences(RefType);
                removeStyleFromGroup(dsg_refs, curr_styleID);

                if (context == "EN_US" && (Market.contains("multisep"))) {
                    step.executeInContext("EN_CA", function (caContextManager) {
                        var caNode = caContextManager.getProductHome().getProductByID(node.getID());
                        var dsg_refsCA = caNode.getReferences(RefType);
                        removeStyleFromGroup(dsg_refsCA, curr_styleID);
                    });
                }
            }
            var primaryStyleID = node.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
            var primaryStyle = step.getProductHome().getProductByID(primaryStyleID);
            primaryStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        }
    }
}

function removeStyleFromGroup(groupRefs, curr_styleID) {
    for (var i = 0; i < groupRefs.size(); i++) {
        var refStyle = groupRefs.get(i).getTarget();
        if (curr_styleID == refStyle.getID()) {
            var flag = groupRefs.get(i).getValue("a_Primary_Selling_Style").getSimpleValue();
            if (flag == 'No') {
                pgLibrary.clearStyleData(refStyle);
                groupRefs.get(i).delete();
                refStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
            }
        }
    }
}

}