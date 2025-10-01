/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_createDimToSizeFacetLink",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_createDimToSizeFacetLink",
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
var selectedNodes = webui.getSelectedSetOfNodes().toArray();
var errMsg = "";
for (var i = 0; i < selectedNodes.length; i++) {
    var selectedNode = selectedNodes[i];
    if (selectedNode.getID() == node.getID()) {
        errMsg += "Cannot be linked to itself.\n";
    } else if (selectedNode.getObjectType().getID() != "SizeFacetValue") {
        errMsg += "Selected Object is not a Size Facet.\n";
    } else {
        try {
            var newRef = node.createReference(selectedNode, "SizeModelDimToSizeFacetValueRef");
        } catch (err) {
            errMsg += "Reference with " + selectedNode.getID() + " cannot be created.\n";
        }
        if (newRef != null) {
            var time = new java.util.Date();
            var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        }
    }
}
if (errMsg != "") {
    webui.showAlert("ERROR", "", errMsg);
} else {
    webui.showAlert("ACKNOWLEDGMENT",  "Reference created successfully.");
}
}