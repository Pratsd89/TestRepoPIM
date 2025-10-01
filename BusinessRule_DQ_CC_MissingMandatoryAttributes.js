/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DQ_CC_MissingMandatoryAttributes",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DQ_CC_MissingMandatoryAttributes",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
node.getValue("a_CC_Number").getSimpleValue() == null || node.getValue("a_CC_Number").getSimpleValue() == " " ||
node.getValue("a_CC_Source_in_DC_Date").getSimpleValue() == null || node.getValue("a_CC_Source_in_DC_Date").getSimpleValue() == " " ||
node.getValue("a_Class_Number").getSimpleValue() == null || node.getValue("a_Class_Number").getSimpleValue() == " " ||
node.getValue("a_Department_Number").getSimpleValue() == null || node.getValue("a_Department_Number").getSimpleValue() == " " ||
node.getValue("a_Division_Number").getSimpleValue() == null || node.getValue("a_Division_Number").getSimpleValue() == " " ||
node.getValue("a_product_merch_type").getSimpleValue() == null || node.getValue("a_product_merch_type").getSimpleValue() == " " ||
node.getValue("a_Source_CC_Description").getSimpleValue() == null || node.getValue("a_Source_CC_Description").getSimpleValue() == " " ||
node.getValue("a_Source_Color_Palette_Code").getSimpleValue() == null || node.getValue("a_Source_Color_Palette_Code").getSimpleValue() == " " ||
node.getValue("a_Source_Color_Palette_Name").getSimpleValue() == null || node.getValue("a_Source_Color_Palette_Name").getSimpleValue() == " " ||
node.getValue("a_Source_Color_Palette_Season_Code").getSimpleValue() == null || node.getValue("a_Source_Color_Palette_Season_Code").getSimpleValue() == " " ||
node.getValue("a_Source_Color_Palette_Season_Year").getSimpleValue() == null || node.getValue("a_Source_Color_Palette_Season_Year").getSimpleValue() == " " ||
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