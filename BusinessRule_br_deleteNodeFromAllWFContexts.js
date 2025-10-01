/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_deleteNodeFromAllWFContexts",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeleteNodeFromAllWFContexts",
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,logger) {
function deleteNodeFromWorkflowInAllContexts(node, wfID)
{
	logger.info("deleteNodeFromWorkflowInAllContexts() invoked with " + node.getID());
	var contextHome = manager.getContextHome();
	var contexts = contextHome.getContexts();
	var itr = contexts.iterator();
	while(itr.hasNext())
	{
		var ctx = itr.next().getID();
		//logger.info("Running for " + ctx + " Context");
		manager.executeInContext(ctx, function(manager)
		{
			var curContextNode;
			if(node.getObjectType().isProductType())
			{
				curContextNode = manager.getProductHome().getProductByID(node.getID());
			}
			if(node.getObjectType().isEntityType())
			{
				curContextNode = manager.getEntityHome().getEntityByID(node.getID());
			}
			if(!((curContextNode.getWorkflowInstanceByID(wfID)) == null))
			{
				curContextNode.getWorkflowInstanceByID(wfID).delete("");
			}
		});
	}
}

function deleteStyleFromWorkflowInAllContexts(styleNode)
{
	logger.info("deleteStyleFromWorkflowInAllContexts() invoked with " + styleNode.getID());
	deleteNodeFromWorkflowInAllContexts(node, "wf_NewStyleEnrichment");
	deleteNodeFromWorkflowInAllContexts(node, "wf_NewStyleEnrichmentCanada");
	deleteNodeFromWorkflowInAllContexts(node, "wf_StyleMaintenanceWorkflow");
	var childCCs = styleNode.getChildren();
	for(var iCCCounter = 0; iCCCounter < childCCs.size();iCCCounter++)
	{
		deleteCCFromWorkflowInAllContexts(childCCs.get(iCCCounter));
	}
}

function deleteCCFromWorkflowInAllContexts(ccNode)
{
	logger.info("deleteCCFromWorkflowInAllContexts() invoked with " + ccNode.getID());
	deleteNodeFromWorkflowInAllContexts(ccNode, "wf_CCEnrichment");
	deleteNodeFromWorkflowInAllContexts(ccNode, "wf_CCEnrichmentCanada");
	deleteNodeFromWorkflowInAllContexts(ccNode, "wf_StyleMaintenanceWorkflow");
}

var objType = node.getObjectType().getName();
if(objType == "Style")
{
	deleteStyleFromWorkflowInAllContexts(node);
}
else if(objType = "CustomerChoice")
{
	deleteCCFromWorkflowInAllContexts(node);	
}
}