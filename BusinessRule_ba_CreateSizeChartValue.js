/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_CreateSizeChartValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Size Chart Value",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ID_Generator_Library",
    "libraryAlias" : "IDGeneratorLibrary"
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
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
    "alias" : "sizeChartName",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Size_Chart_Name</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
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
exports.operation0 = function (node,step,log,sizeChartName,webUI,IDGeneratorLibrary) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
IDGeneratorLibrary.setIDValue(node, step, 'SizeChartIDGenerator', 'SizeChartIDCounter');
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var lovID = "LoV_Size_Charts_" + brandNum;

if (sizeChartName == null) {
    webUI.showAlert("ERROR", "Please provide Size Chart \"Name\".");
} else {
    //Children of SizeChart Types object
    var childSizeChart = node.getChildren().toArray();
    var size = childSizeChart.length;
    childSizeChart.sort();
    var isUniqueName = true
    childSizeChart.forEach(function(sizechart) {
        var existingName = sizechart.getValue('a_Size_Chart_Name').getSimpleValue();
        if (existingName != null) {
            if (existingName.trim().toUpperCase().split(" ").join("") == sizeChartName.trim().toUpperCase().split(" ").join("")) {
                isUniqueName = false
            }
        }
    })
    if (isUniqueName) {
        //Create new Size Chart classification and populate the values
        var fetchLov = step.getListOfValuesHome().getListOfValuesByID(lovID);
        if (fetchLov != null) {
            var sizeChartClass = step.getClassificationHome().getClassificationByID(node.getID());
            var newID = "SZ-" + sizeChartClass.getValue("SizeChartIDCounter").getSimpleValue();
            var newSZChartClassification = sizeChartClass.createClassification(newID, "SizeChart");
            newSZChartClassification.getValue("a_Size_Chart_Name").setSimpleValue(sizeChartName);
            newSZChartClassification.setName(sizeChartName);
            newSZChartClassification.getValue("a_Brand_Number").setSimpleValue(brandNum);
            //Add new SizeChart value with ID generated to the respective LOV
            fetchLov.createListOfValuesValue(sizeChartName, null, sizeChartClass.getValue("SizeChartIDCounter").getSimpleValue());
  
            newSZChartClassification.approve();
            newSZChartClassification.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
            webUI.showAlert("SUCCESS", null, "Size Chart is created successfully");
        }
    } else {
        webUI.showAlert("ERROR", " Size Chart Value is case-insensitive. Found <b>" + sizeChartName + "</b> already present");
    }
}
}