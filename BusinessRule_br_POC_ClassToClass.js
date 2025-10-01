/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_POC_ClassToClass",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_POC_ClassToClass",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "poc_Classification_Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "POC_Classification_Ref",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,poc_Classification_Ref) {
var nodeBrandValue = node.getValue("a_Brand_Number").getSimpleValue();
var nodeRef = manager.getReferenceTypeHome().getReferenceTypeByID("POC_ClassToClass");
node.queryReferences(nodeRef).forEach(
	function(referenceInstance)
	{
		var refNode = referenceInstance.getTarget();
		var brandValue = refNode.getParent().getName();
		logger.warning(brandValue);
		if (nodeBrandValue != brandValue)
		{
			referenceInstance.delete();
		}
		return true;
	}
	);
	

}