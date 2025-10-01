/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CreateEntity",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_CreateEntity",
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
var testValue = node.getValue("POC_Classification_Attribute").getSimpleValue();
var testValueStartDate = node.getValue("POC_Classification_Start_Date").getSimpleValue();
var testValueEndDate = node.getValue("POC_Classification_End_Date").getSimpleValue();
if(testValue != null)
{
	var EntityObj = manager.getEntityHome().getEntityByID(testValue);
	if (EntityObj != null)
		{
			try{
		node.createReference(EntityObj,"POC_Classification_Ref");
			} catch (e) {
				
			}
		}


node.queryReferences(poc_Classification_Ref).forEach(
	function(instance)
	{
		 instance.getValue("POC_Classification_Attribute").setSimpleValue(testValue);
		 instance.getValue("POC_Classification_Start_Date").setSimpleValue(testValueStartDate);
		 instance.getValue("POC_Classification_End_Date").setSimpleValue(testValueEndDate);
		 return true;
	}
	);
}

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
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "Save_Category"
  } ],
  "pluginType" : "Operation"
}
*/
