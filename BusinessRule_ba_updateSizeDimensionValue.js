/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_updateSizeDimensionValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ba_updateSizeDimensionValue",
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
var objType = manager.getObjectTypeHome().getObjectTypeByID("Dimension_Value");
var dimValueName = node.getValue("a_PacmanCategoryName").getSimpleValue();
if (dimValueName == null) {
    webUI.showAlert("ERROR", null, "Please provide Dimension Value \"Name\".");
} else if (dimValueName == node.getName()) {
    webUI.showAlert("ACKNOWLEDGMENT", null, "Size Dimension Value is updated successfully.");
} else {
    var query = qh.queryFor(com.stibo.core.domain.Classification).where(c.objectType(objType).and(c.name().ignoreCase().eq(dimValueName)));
    var resList = query.execute().asList(100000);
    var resSize = resList.size();
    if (resSize == 0) {
        var dimID = node.getID();
        var dimLOV = manager.getListOfValuesHome().getListOfValuesByID("LoV_Dimension_Values");
        var dimLOVValue = dimLOV.getListOfValuesValueByID(dimID.substring(4));
        if (dimLOVValue != null) {
            dimLOVValue.setValue(dimValueName, null);
            node.setName(dimValueName);
            node.approve();
            var time = new java.util.Date();
            var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
            webUI.showAlert("ACKNOWLEDGMENT", null, "Size Dimension Value is updated successfully.");
        }
    } else {
        var oldName = node.getName();
        oldName = oldName == null ? "" : oldName;
        node.getValue("a_PacmanCategoryName").setSimpleValue(oldName);
        webUI.showAlert("ERROR", null, "Reverting Name Change as <b>\"" + dimValueName + "\"</b> already present. Size Dimension Value is case-insensitive.");
    }
}
}