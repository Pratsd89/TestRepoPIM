/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Check",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Test_Check",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
var productType = "a_WebCategory_Product_Type";  // Web Category Product Type
var assortmentType = "a_WebCategory_Assortment_Type";  // Web Category Assortment Type
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var seasonYrCode = "a_" + brandNum + "_Selling_Season_Year_Code";

// Get the selected value of Web Category Product Type (current value)
var productTypeValue = node.getValue(productType).getSimpleValue();

// Get the selected value of Web Category Assortment Type (current value)
var assortmentTypeValue = node.getValue(assortmentType).getSimpleValue();

// Check if any Selling Season Year Code has a value
var hasSellingSeasonCode = false;
var seasonValue = node.getValue(seasonYrCode).getSimpleValue();
if (seasonValue != null) {
    hasSellingSeasonCode = true;
}

//  If Web Category Product Type is "Style", clear Selling Season Year Code and show validation error
if (productTypeValue == "Style" && hasSellingSeasonCode) {
    return "Selling Season Year Code cannot be given as Web Category Product Type is 'Style'.";
}

//  If Web Category Assortment Type is "Manual", clear Selling Season Year Code and show validation error
if (assortmentTypeValue == "Manual" && hasSellingSeasonCode) {
    return "Selling Season Year Code cannot be given as Web Category Assortment Type is 'Manual'.";
}

return true;

}