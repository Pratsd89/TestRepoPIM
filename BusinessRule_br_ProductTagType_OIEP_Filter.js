/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ProductTagType_OIEP_Filter",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_ProductTagType_OIEP_Filter",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
var objType = node.getObjectType().getID();
var prdtTagTypeDescription = node.getValue("a_Product_Tag_Type").getSimpleValue();
if("Product_Tag_Type".equals(objType) && prdtTagTypeDescription != null){
	return true;
}
else{
	return false;
}

}