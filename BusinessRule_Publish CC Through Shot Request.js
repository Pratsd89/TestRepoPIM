/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Publish CC Through Shot Request",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Publish CC Through Shot Request",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_PhotoShot",
    "libraryAlias" : "photoLib"
  } ]
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "CCDGLOutboundUSQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishCCToDGL_Main_EN_US",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "CCDGLOutboundCAQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishCCToDGL_Main_EN_CA",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "CCDGLOutboundUS",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_SR_US_PCC",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "CCDGLOutboundCA",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_SR_CA_PCC",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "CCDGLOutboundJPQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishCCToDGL_Main_EN_JP",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "CCDGLOutboundJP",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_SR_JP_PCC",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,CCDGLOutboundUSQueue,CCDGLOutboundCAQueue,CCDGLOutboundUS,CCDGLOutboundCA,CCDGLOutboundJPQueue,CCDGLOutboundJP,photoLib) {

var shotRequestLifeCycleStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();

if (shotRequestLifeCycleStatus == "Ready for Review") {
 
logger.info("Ready For Review");
	var refByList = node.getReferencedByProducts();
	var sharedMarket = node.getValue("a_Shared_Markets").getSimpleValue();
	
	if ((refByList != null) && (sharedMarket!=null) ) {
			var refByListIterator = refByList.iterator();
			while (refByListIterator.hasNext()) {
				logger.info("Ready For Review1");
				var ref = refByListIterator.next();
				if (ref.getReferenceTypeString() == "CCToPhotoShotRef") {
					logger.info("Ready For Review3");
					
						//Trigger DGL Outbound for reference CC
						if (sharedMarket.contains("US")) 
						{
						
							logger.info("Triggered US");
							//Removal of Non-DGL Outbound
							//DGLOutboundUSQueue.queueDerivedEvent(DGLOutboundUS,ref.getSource());
							CCDGLOutboundUSQueue.queueDerivedEvent(CCDGLOutboundUS,ref.getSource());
						}
						if (sharedMarket.contains("CAN")) {
							
						logger.info("Triggered CA || FR");
						//DGLOutboundCAQueue.queueDerivedEvent(DGLOutboundCA,ref.getSource());
						CCDGLOutboundCAQueue.queueDerivedEvent(CCDGLOutboundCA,ref.getSource());
						//DGLOutboundFRQueue.queueDerivedEvent(DGLOutboundFR,ref.getSource());
						//Removal of FR_CA DGL Outbound
						//CCDGLOutboundFRQueue.queueDerivedEvent(CCDGLOutboundFR,ref.getSource());
	
						}
						
						//Below code is implemented as part of Japan Context requirements
						if (sharedMarket.contains("JPN")) {							
						CCDGLOutboundJPQueue.queueDerivedEvent(CCDGLOutboundJP,ref.getSource());         
						}
						//JP requirements end here
					
						logger.info("Triggered JP");
				
				}

			}
	}
}
}