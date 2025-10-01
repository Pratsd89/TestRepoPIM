/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerCCNameChange_JPN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger CC Name Change Event Japan",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_AutoTriggerWorkflowInCAN",
    "libraryAlias" : "autoTriggerWorkflowCANLibrary"
  }, {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
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
    "contract" : "DerivedEventTypeBinding",
    "alias" : "translationEvent",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "Translation",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLRushQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsRush_EN_JP",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLMediumQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsMedium_EN_JP",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLStandardQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard_EN_JP",
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
exports.operation0 = function (node,translationEvent,DGLRushQueue,DGLMediumQueue,DGLStandardQueue,manager,autoTriggerWorkflowCANLibrary,helper) {
manager.executeInContext("EN_JP", function (otherManager) {
	var enJpNode = otherManager.getProductHome().getProductByID(node.getID());
	var style = enJpNode.getParent();
	var urgency = style.getValue("a_Translation_Urgency").getSimpleValue();

	//log.info(urgency);
	if (urgency != null) {

		if (urgency.indexOf("Urgent") >= 0) {
			//Removal of Non-DGL Outbound
			//rushQueue.queueDerivedEvent(translationEvent, node);
			DGLRushQueue.queueDerivedEvent(translationEvent, enJpNode);
		}
		else if (urgency.indexOf("Standard") >= 0) {
			//Removal of Non-DGL Outbound
			//standardQueue.queueDerivedEvent(translationEvent, node);
			DGLStandardQueue.queueDerivedEvent(translationEvent, enJpNode);
		}
		else if (urgency.indexOf("Medium") >= 0) {
			//Removal of Non-DGL Outbound
			//mediumQueue.queueDerivedEvent(translationEvent, node);
			DGLMediumQueue.queueDerivedEvent(translationEvent, enJpNode);
		}
	}
	else {
		DGLStandardQueue.queueDerivedEvent(translationEvent, enJpNode);
	}
});
}