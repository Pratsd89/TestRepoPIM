/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_AddSeasonYearCode",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Add Season Year Code",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
//PPIM-13554
var brand = node.getValue("a_Brand_Number").getSimpleValue();
var seasonYear = node.getValue("a_Source_CC_Selling_Season_Year").getSimpleValue();
var seasonCode = node.getValue("a_Source_CC_Selling_Season_Code").getSimpleValue();
if (brand != null && seasonYear != null && seasonCode != null) {
    var seasonYearCodeValue = seasonYear + " - " + seasonCode;
    var lovID = "LoV_Selling_Season_Year_Code_" + brand;
    var brandLov = step.getListOfValuesHome().getListOfValuesByID(lovID);
    var validValues = brandLov.queryValidValues();
    var count = 0;
    var flag = false;
    validValues.forEach(function (val) {
        if (val.getValue() == seasonYearCodeValue) {
            flag = true;
        }
        count++;
        return true;
    });

    var maxValueID = count + 101;
    if (flag == false) {
        brandLov.createListOfValuesValue(seasonYearCodeValue, null, maxValueID);
    }
}

}