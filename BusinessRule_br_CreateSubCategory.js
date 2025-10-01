/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CreateSubCategory",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_CreateSubCategory",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "subCategoryName",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">Name</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,web,subCategoryName) {
var CategoryDisplayType = node.getValue("a_Category_Display_Type").getSimpleValue();
//var subCategoryName="test";
if (CategoryDisplayType == "Standard: Content") {
    web.showAlert("ERROR", "The SubCategory cannot be created as Category Display Type is Standard: Content");
} else if (subCategoryName != null) {
    var todayDate = new java.util.Date();
    var dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");
    var endDate = node.getValue("a_WebCategory_End_Date").getSimpleValue();
    if (typeof endDate == "string" || endDate instanceof java.lang.String) {
        try {
            endDate = dateFormat.parse(endDate);
        } catch (e) {
           throw "Date Parsing error. Please contact Dev team";
        }
    }

    if (endDate != null && !endDate.after(todayDate)){
    	web.showAlert("ERROR", "Cannot create SubCategory for an expired Category!");
    	return;
    }
    var subcategory = node.createClassification(null, "WebSubCategory");
    subcategory.setName(subCategoryName);
    web.navigate("WebSubCategory_Details_Screen", subcategory);
    node.getValue("a_Image_Placement").setSimpleValue("Main P1");
}
}