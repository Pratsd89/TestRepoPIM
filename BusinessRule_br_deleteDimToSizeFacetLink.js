/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_deleteDimToSizeFacetLink",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_deleteDimToSizeFacetLink",
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,webui) {
var selection = webui.getSelection();
var RefType = manager.getReferenceTypeHome().getReferenceTypeByID("SizeModelDimToSizeFacetValueRef");
var ref_List = node.getReferences(RefType);
var selectionIter = selection.iterator();
var refDeleted = false;
while (selectionIter.hasNext()) {
    var curr_facet = selectionIter.next();
    var curr_facetID = curr_facet.getID();
    for (var i = 0; i < ref_List.size(); i++) {
        var ref_facet = ref_List.get(i).getTarget();
        if (curr_facetID == ref_facet.getID()) {
            refDeleted = true;
            ref_List.get(i).delete();
        }
    }
}
if (refDeleted) {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    webui.showAlert("ACKNOWLEDGMENT", "", "Reference removed successfully.");
} else {
    webui.showAlert("ERROR",  "Cannot delete the reference.");
}
}