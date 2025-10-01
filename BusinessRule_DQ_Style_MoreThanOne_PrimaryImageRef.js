/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DQ_Style_MoreThanOne_PrimaryImageRef",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DQ_Style_MoreThanOne_PrimaryImageRef",
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "primaryImage",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,primaryImage) {
var styleImg = new java.util.ArrayList();
styleImg.addAll(node.getReferences(primaryImage));
if(parseInt(styleImg.size()) > 1)
{
	return true;
}
else
{
	return false;
}
}