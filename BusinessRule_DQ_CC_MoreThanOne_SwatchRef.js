/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DQ_CC_MoreThanOne_SwatchRef",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DQ_CC_MoreThanOne_SwatchRef",
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "swatchReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Swatch",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,swatchReference) {
var ccSwatchRef = new java.util.ArrayList();
ccSwatchRef.addAll(node.getReferences(swatchReference));
if(parseInt(ccSwatchRef.size()) > 1)
{
	return true;
}
else
{
	return false;
}
}