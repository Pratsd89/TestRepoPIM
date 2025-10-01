/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ValidateWebCategory_Assortment",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_ValidateWebCategory_Assortment",
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var productType = "a_WebCategory_Product_Type";  // Web Category Product Type
var assortmentType = "a_WebCategory_Assortment_Type";  // Web Category Assortment Type
var brandNum= node.getValue("a_Brand_Number").getSimpleValue();
var seasonYrCode = null;
// Array of brand-specific Selling Season Year Code attributes
var sellingSeasonCodes = [
    "a_AT_Selling_Season_Year_Code",
    "a_BRFS_Selling_Season_Year_Code",
    "a_BR_Selling_Season_Year_Code",
    "a_GAP_Selling_Season_Year_Code",
    "a_GO_Selling_Season_Year_Code",
    "a_ON_Selling_Season_Year_Code"
];

if (brandNum == "BR"){
	seasonYrCode = "a_BR_Selling_Season_Year_Code";
}
if (brandNum == "AT"){
	seasonYrCode= "a_AT_Selling_Season_Year_Code";
}
if (brandNum == "BRFS"){
	seasonYrCode = "a_BRFS_Selling_Season_Year_Code";
}
if (brandNum == "GAP"){
	seasonYrCode = "a_GAP_Selling_Season_Year_Code";
}
if (brandNum == "GO"){
	seasonYrCode = "a_GO_Selling_Season_Year_Code";	
}
if (brandNum == "ON"){
	seasonYrCode = "a_ON_Selling_Season_Year_Code";	
}	

// Get the selected value of Web Category Product Type (current value)
var productTypeValue = node.getValue(productType).getSimpleValue();
log.info("Product Type Value: " + productTypeValue);

// Get the selected value of Web Category Assortment Type (current value)
var assortmentTypeValue = node.getValue(assortmentType).getSimpleValue();
log.info("Assortment Type Value: " + assortmentTypeValue);

// Check if any Selling Season Year Code has a value
var hasSellingSeasonCode = false;
for (var i = 0; i < sellingSeasonCodes.length; i++) {
    var seasonValue = node.getValue(sellingSeasonCodes[i]).getSimpleValue();
    log.info("Checking Selling Season Code: " + sellingSeasonCodes[i] + " = " + seasonValue);

    if (seasonValue !== "") {
        hasSellingSeasonCode = true;
        log.info("Selling Season Code Found: " + sellingSeasonCodes[i]);
        break;
    }
}
log.info("Has Selling Season Code: " + hasSellingSeasonCode);

//  If Web Category Product Type is "Style", clear Selling Season Year Code and show validation error
if (productTypeValue == "Style" && hasSellingSeasonCode) {
    log.info("Clearing Selling Season Year Code because Product Type is 'Style'...");

    for (var j = 0; j < sellingSeasonCodes.length; j++) {
        log.info("Clearing: " + sellingSeasonCodes[j]);
        node.getValue(seasonYrCode).setSimpleValue("");
       // node.setValue(sellingSeasonCodes[j], "");  // Clears all Selling Season Year Code fieldsCHEk and update
    }

    errorMessage = "Selling Season Year Code has been cleared because Web Category Product Type is 'Style'.";
}

//  Prevent changing Web Category Product Type to "Style" if Selling Season Year Code exists
if (productTypeValue == "Style" && hasSellingSeasonCode) {
    errorMessage = "Please remove all Selling Season Year Code values before changing Web Category Product Type to 'Style'.";
    log.info("ERROR: " + errorMessage);
}
log.info("brandNum"+brandNum);
log.info("assortmentTypeValue"+assortmentTypeValue);
log.info("hasSellingSeasonCode"+hasSellingSeasonCode);
log.info("sssSellingSeasonyrCode"+node.getValue("a_BR_Selling_Season_Year_Code").getSimpleValue());
//  If Web Category Assortment Type is "Manual", clear Selling Season Year Code and show validation error
if (assortmentTypeValue == "Manual" && hasSellingSeasonCode) {
    log.info("Clearing Selling Season Year Code because Assortment Type is 'Manual'...");

    for (var k = 0; k < sellingSeasonCodes.length; k++) {
        log.info("Clearing: " + sellingSeasonCodes[k]);
        //if (brandNum == "BR"){
        	node.getValue(seasonYrCode).setSimpleValue("");
        //}
    }
    log.info("sssSellingSeasonyrCode"+node.getValue("a_BR_Selling_Season_Year_Code").getSimpleValue());
    errorMessage = "Selling Season Year Code has been cleared because Web Category Assortment Type is 'Manual'.";
}

//  Prevent changing Web Category Assortment Type to "Manual" if Selling Season Code exists
if (assortmentTypeValue == "Manual" && hasSellingSeasonCode) {
    errorMessage = "Please remove all Selling Season Year Code values before changing Web Category Assortment Type to 'Manual'.";
    log.info("ERROR: " + errorMessage);
}

}