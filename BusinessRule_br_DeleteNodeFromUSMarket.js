/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DeleteNodeFromUSMarket",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeleteNodeFromUSMarket",
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
function deleteNodeFromWorkflowInGivenContext(node, wfID, contextID)
{
	logger.info("deleteNodeFromWorkflowInGivenContext() invoked with " + node.getID());
	var contextHome = manager.getContextHome();
	var contexts = contextHome.getContexts();
	var itr = contexts.iterator();
	while(itr.hasNext())
	{
		var ctx = itr.next().getID();
		//logger.info("Running for " + ctx + " Context");
		if(ctx == contextID)
		{
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
}

function deleteStyleFromWorkflowInGivenContext(styleNode, contextID)
{
	logger.info("deleteStyleFromWorkflowInGivenContext() invoked with " + styleNode.getID());
	deleteNodeFromWorkflowInGivenContext(node, "wf_NewStyleEnrichment", contextID);
	deleteNodeFromWorkflowInGivenContext(node, "wf_NewStyleEnrichmentCanada", contextID);
	deleteNodeFromWorkflowInGivenContext(node, "wf_StyleMaintenanceWorkflow", contextID);
	var childCCs = styleNode.getChildren();
	for(var iCCCounter = 0; iCCCounter < childCCs.size();iCCCounter++)
	{
		deleteCCFromWorkflowInGivenContext(childCCs.get(iCCCounter), contextID);
	}
}

function deleteCCFromWorkflowInGivenContext(ccNode, contextID)
{
	logger.info("deleteCCFromWorkflowInGivenContext() invoked with " + ccNode.getID());
	deleteNodeFromWorkflowInGivenContext(ccNode, "wf_CCEnrichment", contextID);
	deleteNodeFromWorkflowInGivenContext(ccNode, "wf_CCEnrichmentCanada", contextID);
	deleteNodeFromWorkflowInGivenContext(ccNode, "wf_StyleMaintenanceWorkflow", contextID);
}

var objType = node.getObjectType().getName();
if(objType == "Style")
{
	deleteStyleFromWorkflowInGivenContext(node, "EN_US");
}
else if(objType = "CustomerChoice")
{
	deleteCCFromWorkflowInGivenContext(node, "EN_US");	
}
}