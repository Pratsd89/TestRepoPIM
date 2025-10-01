/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "POC_ClassificationToClassificationRef",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "POC_ClassificationToClassificationRef",
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
    "alias" : "step",
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
exports.operation0 = function (node,step,log) {
var GetRefMetaData = setRefMetaData(node,step);
var GetRefMetaData = getRefMetaData(node,step);


function getRefMetaData(node,manager) 
{
	var linkType = manager.getReferenceTypeHome().getReferenceTypeByID("WebHierarchyToBrandTag");
	node.queryReferences(linkType).forEach
	(
		function (referenceInstance){
		var metadata1 = referenceInstance.getValue("a_Tag_Sequence").getSimpleValue();
		log.info(metadata1);
		var metadata2 = referenceInstance.getValue("a_TagValue_Sequence").getSimpleValue();
		log.info(metadata2);
		return true;
		}
		);
 
    }

function setRefMetaData(node,manager) 
{
	var linkType = manager.getReferenceTypeHome().getReferenceTypeByID("WebHierarchyToBrandTag");
	var constant = 121123;
	node.queryReferences(linkType).forEach
	(
		function (referenceInstance){
			referenceInstance.getValue("a_Tag_Sequence").setSimpleValue(constant);
			referenceInstance.getValue("a_TagValue_Sequence").setSimpleValue(constant);
				return true;
		
		}
		);
 
    }

}