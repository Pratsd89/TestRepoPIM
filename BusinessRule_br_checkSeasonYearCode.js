/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_checkSeasonYearCode",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Validation",
  "description" : "PPIM-13753",
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
//PPIM-13753
var productType = "a_WebCategory_Product_Type";  // Web Category Product Type
var assortmentType = "a_WebCategory_Assortment_Type";  // Web Category Assortment Type
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

if (brandNum != "GPS") {
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
        throw ("'Selling Season Year Code' cannot be provided as the 'Web Category Product Type' is 'Style'. Please change it to 'CC' or remove the 'Selling Season Year Code' value.");
    }

    //  If Web Category Assortment Type is "Manual", clear Selling Season Year Code and show validation error
    if (assortmentTypeValue == "Manual" && hasSellingSeasonCode) {
        throw ("'Selling Season Year Code' cannot be provided as the 'Web Category Assortment Type' is 'Manual'. Please change it to 'Autopop' or remove the 'Selling Season Year Code' value.")
    }
}




}