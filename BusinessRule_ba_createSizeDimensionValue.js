/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_createSizeDimensionValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ba_createSizeDimensionValue",
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
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "dimValueName",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_PacmanCategoryName</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
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
exports.operation0 = function (node,manager,log,dimValueName,webUI,qh) {
if (dimValueName == null) {
    webUI.showAlert("ERROR", null, "Please provide Dimension Value \"Name\".");
} else {
    var c = com.stibo.query.condition.Conditions;
    var objType = manager.getObjectTypeHome().getObjectTypeByID("Dimension_Value");
    var query = qh.queryFor(com.stibo.core.domain.Classification).where(c.objectType(objType).and(c.name().ignoreCase().eq(dimValueName)));
    var resList = query.execute().asList(100000);
    var resSize = resList.size();
    if (resSize == 0) {
        var dimRoot = manager.getClassificationHome().getClassificationByID("Size_Dimension_Values");
        var IDCounter = dimRoot.getValue("a_Last_ID_Value").getSimpleValue();
        IDCounter++;
        var newID = "SDV-" + IDCounter;
        //Create new dimension Value classification and populate the values
        var newDimValue = dimRoot.createClassification(newID, "Dimension_Value");
        newDimValue.getValue("a_PacmanCategoryName").setSimpleValue(dimValueName);
        newDimValue.setName(dimValueName);
        newDimValue.approve();
        dimRoot.getValue("a_Last_ID_Value").setSimpleValue(IDCounter);
        //updating the actual LOV
        var dimLOV = manager.getListOfValuesHome().getListOfValuesByID("LoV_Dimension_Values");
        try {
            dimLOV.createListOfValuesValue(dimValueName, null, IDCounter);
        } catch (e) {
            if (e.javaException instanceof com.stibo.core.domain.validatorexception.NonUniqueValuelDValidatorException) {
                throw "ID ALready EXISTS";
            }
        }
        //Sending events of LOV, once the classification is created
        var time = new java.util.Date();
        var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        newDimValue.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        webUI.showAlert("ACKNOWLEDGMENT", null, "Size Dimension Value is created successfully.");
    } else {
        webUI.showAlert("ERROR", null, "<b>" + dimValueName + "</b> already present. Size Dimension Value is case-insensitive.");
    }
}
}