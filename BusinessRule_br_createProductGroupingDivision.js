/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_createProductGroupingDivision",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Create Product Grouping Division",
  "description" : "Create ProductGroupingDivision object from a Division object.",
  "scope" : "Global",
  "validObjectTypes" : [ "Division" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log) {
//br_createProductGroupingDivision
var newObjName = node.getName();
var newObjID = node.getID();
var divisionBrandNumber = node.getValue("a_Brand_Number").getSimpleValue();
var divisionDescription = node.getValue("a_Division_Description").getSimpleValue();
var divisionNumber = node.getValue("a_Division_Number").getSimpleValue();
var productGroupingBrandID = divisionBrandNumber + "_ProductGroup";
//get the ProductGroupingBrand object by using the above ID
var productGroupingBrand = manager.getProductHome().getProductByID(productGroupingBrandID);
//create a child ProductGroupingDivision object under productGroupingBrand and fill details
var newDivisionID = divisionBrandNumber + "_" + divisionNumber + "_productGroups";
if (productGroupingBrand != null) {
    var newDivision = productGroupingBrand.createProduct(newDivisionID, "ProductGroupingsDivision");
    newDivision.setName(newObjName);
    newDivision.getValue("a_Brand_Number").setSimpleValue(divisionBrandNumber);
    newDivision.getValue("a_Corresponding_Division_ID").setSimpleValue(newObjID);
    newDivision.getValue("a_Division_Description").setSimpleValue(divisionDescription);
}

var MVGBrandID = divisionBrandNumber + "_MultiVariantGroup";
var MVGBrand = manager.getProductHome().getProductByID(MVGBrandID);
var newMVGDivisionID = divisionBrandNumber + "_" + divisionNumber + "_MultiVariantGroups";

if (MVGBrand != null){
    var newMVGDivision = MVGBrand.createProduct(newMVGDivisionID, "MultiVariantGroupingsDivision");
    newMVGDivision.setName(newObjName);
}

}