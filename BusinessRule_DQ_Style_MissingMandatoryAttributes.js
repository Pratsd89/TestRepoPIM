/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DQ_Style_MissingMandatoryAttributes",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DQ_Style_MissingMandatoryAttributes",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
node.getValue("a_product_merch_type").getSimpleValue() == null || node.getValue("a_product_merch_type").getSimpleValue() == " " ||
node.getValue("a_Source_Size_Model").getSimpleValue() == null || node.getValue("a_Source_Size_Model").getSimpleValue() == " " ||
node.getValue("a_Source_Style_Name").getSimpleValue() == null || node.getValue("a_Source_Style_Name").getSimpleValue() == " " ||
node.getValue("a_Source_Style_Status_Code").getSimpleValue() == null || node.getValue("a_Source_Style_Status_Code").getSimpleValue() == " " ||
node.getValue("a_Style_IN_DC_Date").getSimpleValue() == null || node.getValue("a_Style_IN_DC_Date").getSimpleValue() == " " ||
node.getValue("a_Style_Source_System").getSimpleValue() == null || node.getValue("a_Style_Source_System").getSimpleValue() == " " ||
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