/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ShotRequestPublish_ON_Q4",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_ShotRequestPublish",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
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
    "contract" : "DerivedEventTypeBinding",
    "alias" : "shot",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "ShotRequestSubmit",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueUS",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_US",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueCA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_CA",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueJP",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.FrontEventQueueImpl",
    "value" : "step://eventqueue?id=PublishShotRequestToAssethub_EN_JP",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueSA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_SA",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,shot,assethubqueueUS,assethubqueueCA,assethubqueueJP,assethubqueueSA) {
var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
			if(sharedMarkets != null) 
			{
				if(sharedMarkets.indexOf("US") >= 0) 
					{
						assethubqueueUS.queueDerivedEvent(shot,node);
					} 
				else if(sharedMarkets.indexOf("CAN") >= 0) 
					{
						assethubqueueCA.queueDerivedEvent(shot,node);
					} 
				else if(sharedMarkets.indexOf("JPN") >= 0) 
					{
						assethubqueueJP.queueDerivedEvent(shot,node);
					} 
			     else if(sharedMarkets.indexOf("SA") >= 0) 
					{
						assethubqueueSA.queueDerivedEvent(shot,node);
					}
			}
}