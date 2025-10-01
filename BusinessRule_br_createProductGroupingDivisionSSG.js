/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_createProductGroupingDivisionSSG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Product Grouping Division SSG",
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
var productGroupingBrandID =  divisionBrandNumber + "_ProductGroupings";
//get the ProductGroupingBrand object by using the above ID
var productGroupingBrand = manager.getProductHome().getProductByID(productGroupingBrandID);
//create a child ProductGroupingDivision object under productGroupingBrand and fill details
var newDivisionID = divisionBrandNumber + divisionNumber + "_ProductGroupings";
if(productGroupingBrand != null){
	var newDivision = productGroupingBrand.createProduct(newDivisionID, "ProductGroupingDivision");
	newDivision.setName(newObjName);
	newDivision.getValue("a_Brand_Number").setSimpleValue(divisionBrandNumber);
	newDivision.getValue("a_Corresponding_Division_ID").setSimpleValue(newObjID);
	newDivision.getValue("a_Division_Description").setSimpleValue(divisionDescription);
	//create a child ProductGroupingType object under new division
	var childProductGroupingTypeID = divisionBrandNumber + divisionNumber + "_SSGs";
	var childProductGroupingType = newDivision.createProduct(childProductGroupingTypeID, "ProductGroupingType");
	childProductGroupingType.setName("Similar Style Groups");
	childProductGroupingType.getValue("a_Brand_Number").setSimpleValue(divisionBrandNumber);
}
}