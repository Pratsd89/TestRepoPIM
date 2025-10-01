/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TagtoLinkChild",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TagtoLinkChild",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "alias" : "webHierarchytoProductTag",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "ProductToTag",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager,webHierarchytoProductTag,webUI,ProductToTag) {
var webHierarchytoProductTag = manager.getReferenceTypeHome().getReferenceTypeByID("WebHierarchytoProductTag");
var parent = node.getParent();
var  parentRef= parent.getReferences(webHierarchytoProductTag).toArray();
var  nodeRef= node.getReferences(webHierarchytoProductTag).toArray();
var flag;
	for (var k = 0; k < nodeRef.length; k++) {
	var nodeRefID = nodeRef[k].getTarget().getID();
		for (var i = 0; i < parentRef.length; i++) {
		var parentRefID = parentRef[i].getTarget().getID();
		if(parentRefID == nodeRefID)
		{
			logger.warning("Exist");
		}
		else
		{
		flag = true;
		break;
		
		}
	}
}

if (flag)
{
	for (var k = 0; k < parentRef.length; k++) 
	{
		var productToTaglinkID = parentRef[k].getTarget();
		node.createReference(productToTaglinkID,webHierarchytoProductTag);
	}
}


}