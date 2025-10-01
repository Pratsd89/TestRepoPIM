/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_UpdateSizeChartValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Update Size Chart Value",
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
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ListOfValuesBindContract",
    "alias" : "lovat",
    "parameterClass" : "com.stibo.core.domain.impl.ListOfValuesImpl",
    "value" : "LoV_Size_Charts_AT",
    "description" : null
  }, {
    "contract" : "ListOfValuesBindContract",
    "alias" : "lovbr",
    "parameterClass" : "com.stibo.core.domain.impl.ListOfValuesImpl",
    "value" : "LoV_Size_Charts_BR",
    "description" : null
  }, {
    "contract" : "ListOfValuesBindContract",
    "alias" : "lovbrfs",
    "parameterClass" : "com.stibo.core.domain.impl.ListOfValuesImpl",
    "value" : "LoV_Size_Charts_BRFS",
    "description" : null
  }, {
    "contract" : "ListOfValuesBindContract",
    "alias" : "lovgap",
    "parameterClass" : "com.stibo.core.domain.impl.ListOfValuesImpl",
    "value" : "LoV_Size_Charts_GAP",
    "description" : null
  }, {
    "contract" : "ListOfValuesBindContract",
    "alias" : "lovgo",
    "parameterClass" : "com.stibo.core.domain.impl.ListOfValuesImpl",
    "value" : "LoV_Style_Marketing_Flags_GO",
    "description" : null
  }, {
    "contract" : "ListOfValuesBindContract",
    "alias" : "lovon",
    "parameterClass" : "com.stibo.core.domain.impl.ListOfValuesImpl",
    "value" : "LoV_Size_Charts_ON",
    "description" : null
  }, {
    "contract" : "ListOfValuesBindContract",
    "alias" : "lovgps",
    "parameterClass" : "com.stibo.core.domain.impl.ListOfValuesImpl",
    "value" : "LoV_Size_Charts_GPS",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,webUI,lovat,lovbr,lovbrfs,lovgap,lovgo,lovon,lovgps,IDGeneratorLibrary) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var brandNum = node.getParent().getValue("a_Brand_Number").getSimpleValue();
var lovID = "LoV_Size_Charts_" + brandNum;

var updatedSizeChartName = node.getValue("a_Size_Chart_Name").getSimpleValue();
//Children of SizeChart Types object
var updatedName = node.getName();
var childSizeChart = node.getParent().getChildren().toArray();
var size = childSizeChart.length;
childSizeChart.sort();
var isUniqueName = true
childSizeChart.forEach(function(sizechart) {
    var existingName = sizechart.getValue('a_Size_Chart_Name').getSimpleValue();
    if (existingName != null) {
        if (existingName.trim().toUpperCase().split(" ").join("") == updatedName.trim().toUpperCase().split(" ").join("")) {
            isUniqueName = false
        }
    }
})
if (isUniqueName) {

    //Update Size Chart classification and populate the values
    var fetchLov = step.getListOfValuesHome().getListOfValuesByID(lovID);
    if (fetchLov != null) {
        var sizeChartClass = step.getClassificationHome().getClassificationByID(node.getID());
        var updatedName = node.getName();
        node.getValue("a_Size_Chart_Name").setSimpleValue(updatedName);
        node.setName(updatedName);
        //Add new SizeChart value with ID generated to the respective LOV
        var updatedSizeChartName = node.getValue("a_Size_Chart_Name").getSimpleValue();
        var id = node.getID();
        var idarray = id.split("-");
        var lovValue = idarray[1];
        if (brandNum.equals("AT")) {
            lovat.getListOfValuesValueByID(lovValue).setValue(updatedSizeChartName, null);
        } else if (brandNum.equals("ON")) {
            lovon.getListOfValuesValueByID(lovValue).setValue(updatedSizeChartName, null);
        } else if (brandNum.equals("BR")) {
            lovbr.getListOfValuesValueByID(lovValue).setValue(updatedSizeChartName, null);
        } else if (brandNum.equals("BRFS")) {
            lovbrfs.getListOfValuesValueByID(lovValue).setValue(updatedSizeChartName, null);
        } else if (brandNum.equals("GO")) {
            lovgo.getListOfValuesValueByID(lovValue).setValue(updatedSizeChartName, null);
        } else if (brandNum.equals("GAP")) {
            lovgap.getListOfValuesValueByID(lovValue).setValue(updatedSizeChartName, null);
        } else if (brandNum.equals("GPS")) {
            lovgps.getListOfValuesValueByID(lovValue).setValue(updatedSizeChartName, null);
        }

        node.approve();
        node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        webUI.showAlert("SUCCESS", "Size Chart is updated successfully");
    }
} else {
    webUI.showAlert("ERROR", " Size Chart Value is case-insensitive. Found <b>" + updatedSizeChartName + "</b> already present");
}

}