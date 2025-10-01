/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_updateSizeVariantValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ba_updateSizeVariantValue",
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
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,webUI,qh) {
var c = com.stibo.query.condition.Conditions;
var objType = manager.getObjectTypeHome().getObjectTypeByID("Size_Variant");
var sizeVarName = node.getValue("a_PacmanCategoryName").getSimpleValue();
if (sizeVarName == null) {
    webUI.showAlert("ERROR", null, "Please provide Size Variant \"Name\".");
} else if (sizeVarName == node.getName()) {
    webUI.showAlert("ACKNOWLEDGMENT", null, "Size Variant is updated successfully.");
} else {
    var query = qh.queryFor(com.stibo.core.domain.Classification).where(c.objectType(objType).and(c.name().ignoreCase().eq(sizeVarName)));
    var resList = query.execute().asList(100000);
    var resSize = resList.size();
    if (resSize == 0) {
        var sizeVarID = node.getID();
        var sizeVarLOV = manager.getListOfValuesHome().getListOfValuesByID("Size_Variant");
        var sizeVarLOVValue = sizeVarLOV.getListOfValuesValueByID(sizeVarID.substring(3));
        if (sizeVarLOVValue != null) {
            sizeVarLOVValue.setValue(sizeVarName, null);
            node.setName(sizeVarName);
            node.approve();
            var time = new java.util.Date();
            var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
            webUI.showAlert("ACKNOWLEDGMENT", null, "Size Variant is updated successfully.");
        }
    } else {
        var oldName = node.getName();
        oldName = oldName == null ? "" : oldName;
        node.getValue("a_PacmanCategoryName").setSimpleValue(oldName);
        webUI.showAlert("ERROR", null, "Reverting Name Change as <b>\"" + sizeVarName + "\"</b> already present. Size Variant is case-insensitive.");
    }
}
}