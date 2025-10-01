/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DQ_SKU_MissingMandatoryAttributes",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DQ_SKU_MissingMandatoryAttributes",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
if(node.getValue("a_Brand_Number").getSimpleValue() == null || node.getValue("a_Brand_Number").getSimpleValue() == " " ||
node.getValue("a_Class_Number").getSimpleValue() == null || node.getValue("a_Class_Number").getSimpleValue() == " " ||
node.getValue("a_Department_Number").getSimpleValue() == null || node.getValue("a_Department_Number").getSimpleValue() == " " ||
node.getValue("a_Division_Number").getSimpleValue() == null || node.getValue("a_Division_Number").getSimpleValue() == " " ||
node.getValue("a_Gap_Inc._UPC").getSimpleValue() == null || node.getValue("a_Gap_Inc._UPC").getSimpleValue() == " " ||
node.getValue("a_product_merch_type").getSimpleValue() == null || node.getValue("a_product_merch_type").getSimpleValue() == " " ||
node.getValue("a_Size_Code").getSimpleValue() == null || node.getValue("a_Size_Code").getSimpleValue() == " " ||
node.getValue("a_SKU_Number").getSimpleValue() == null || node.getValue("a_SKU_Number").getSimpleValue() == " " ||
node.getValue("a_SubClass_Number").getSimpleValue() == null || node.getValue("a_SubClass_Number").getSimpleValue() == " " ||
node.getValue("a_Tax_Code").getSimpleValue() == null || node.getValue("a_Tax_Code").getSimpleValue() == " " )
{
	return true;
}
else
{
	return false;
}
}