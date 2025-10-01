/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_createSizeVariantValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ba_createSizeVariantValue",
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
    "alias" : "sizeVarName",
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
exports.operation0 = function (node,manager,log,sizeVarName,webUI,qh) {
if (sizeVarName == null) {
    webUI.showAlert("ERROR", null, "Please provide Size Variant \"Name\".");
} else {
    var c = com.stibo.query.condition.Conditions;
    var objType = manager.getObjectTypeHome().getObjectTypeByID("Size_Variant");
    var query = qh.queryFor(com.stibo.core.domain.Classification).where(c.objectType(objType).and(c.name().ignoreCase().eq(sizeVarName)));
    var resList = query.execute().asList(100000);
    var resSize = resList.size();
    if (resSize == 0) {
    	   var sizeVarRoot = manager.getClassificationHome().getClassificationByID("Size_Variants");
        var IDCounter = sizeVarRoot.getValue("a_Last_ID_Value").getSimpleValue();
        IDCounter++;
        var newID = "SV-" + IDCounter;
        //Create new size variant classification and populate the values
        var newSizeVar = sizeVarRoot.createClassification(newID, "Size_Variant");
        newSizeVar.getValue("a_PacmanCategoryName").setSimpleValue(sizeVarName);
        newSizeVar.setName(sizeVarName);
        newSizeVar.approve();
        sizeVarRoot.getValue("a_Last_ID_Value").setSimpleValue(IDCounter);
        //updating the actual LOV
        var sizeVarLOV = manager.getListOfValuesHome().getListOfValuesByID("Size_Variant");
        try {
            sizeVarLOV.createListOfValuesValue(sizeVarName, null, IDCounter);
        } catch (e) {
            if (e.javaException instanceof com.stibo.core.domain.validatorexception.NonUniqueValuelDValidatorException) {
                log.warning("Unique Value Exception");
            }
        }
        //Sending events of LOV, once the classification is created
        var time = new java.util.Date();
        var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        newSizeVar.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        webUI.showAlert("ACKNOWLEDGMENT", null, "Size Variant is created successfully.");
    } else {
        webUI.showAlert("ERROR", null, "<b>" + sizeVarName + "</b> already present. Size Variant is case-insensitive.");
    }
}
}