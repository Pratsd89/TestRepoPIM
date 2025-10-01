/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CA Mkt Flag Trigger CC event DGL",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CA Marketing Flag Trigger CC event DGL",
  "description" : "ApproveStyle",
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
    "contract" : "EventQueueBinding",
    "alias" : "OutboundQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishMFCCToDGL_Main_EN_CA",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "Outbound",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_CA_CC",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,OutboundQueue,Outbound,queryHome,manager) {
function triggerUpdatesForObjectType(pphNode, triggerObjectType) {
			var c = com.stibo.query.condition.Conditions;
			var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
				c.objectType(manager.getObjectTypeHome().getObjectTypeByID(triggerObjectType))
				.and(c.hierarchy().simpleBelow(pphNode))
			);
			var res = querySpecification.execute();
			res.forEach(function(resNode) {
			//logger.info("res node = " + resNode.getID());
			//logger.info("res node = " + resNode.getObjectType().getID());
			if(resNode.getObjectType().getID() == "CustomerChoice")
			{
				triggerEvent(resNode);
			}
			return true;
			});
			}



triggerUpdatesForObjectType (node, "CustomerChoice");

function triggerEvent(CC)
{
	var CC_ID = CC.getID();
	var lifecycle_US;
	var lifecycle_CA;
	var lifecycle_FR;
		manager.executeInContext('EN_US',function(enContextManager) 
	  {	
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(CC_ID);
	      lifecycle_US = enCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
	   })
	  manager.executeInContext('EN_CA',function(caContextManager) 
	  {	
		var caCurrentProduct = caContextManager.getProductHome().getProductByID(CC_ID);
	     lifecycle_CA = caCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
	   })
	   manager.executeInContext('FR_CA',function(frContextManager) 
	  {	
		var frCurrentProduct = frContextManager.getProductHome().getProductByID(CC_ID);
	     lifecycle_FR = frCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
	   })
	if(lifecycle_US == "DRAFT" || lifecycle_US == "Draft"||lifecycle_CA == "DRAFT" || lifecycle_CA == "Draft"
		|| lifecycle_FR == "DRAFT" || lifecycle_FR == "Draft")
	{
	// no outbound required
	}
	else
		{
			//Triggering CC
			OutboundQueue.queueDerivedEvent(Outbound,CC);
		}
	
}
			

}