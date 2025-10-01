/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerCCNameManualChange",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger CC Name Manual Change Event",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLStandardQueueCAN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLRushQueueCAN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsRush",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLMediumQueueCAN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsMedium",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLStandardQueueJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard_EN_JP",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLRushQueueJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsRush_EN_JP",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLMediumQueueJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsMedium_EN_JP",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,translationEvent,manager,DGLStandardQueueCAN,DGLRushQueueCAN,DGLMediumQueueCAN,DGLStandardQueueJPN,DGLRushQueueJPN,DGLMediumQueueJPN,helper) {

function triggerTranslationCAN(node, manager) {
	manager.executeInContext("EN_CA", function (otherManager) {
		var enCaNode = otherManager.getProductHome().getProductByID(node.getID());
		var style = enCaNode.getParent();
		var urgency = style.getValue("a_Translation_Urgency").getSimpleValue();

		//log.info(urgency);
		if (urgency != null) {

			if (urgency.indexOf("Urgent") >= 0) {
				//Removal of Non-DGL Outbound
				//rushQueue.queueDerivedEvent(translationEvent, node);
				DGLRushQueueCAN.queueDerivedEvent(translationEvent, enCaNode);
			}
			else if (urgency.indexOf("Standard") >= 0) {
				//Removal of Non-DGL Outbound
				//standardQueue.queueDerivedEvent(translationEvent, node);
				DGLStandardQueueCAN.queueDerivedEvent(translationEvent, enCaNode);
			}
			else if (urgency.indexOf("Medium") >= 0) {
				//Removal of Non-DGL Outbound
				//mediumQueue.queueDerivedEvent(translationEvent, node);
				DGLMediumQueueCAN.queueDerivedEvent(translationEvent, enCaNode);
			}
		}
		else {
			DGLStandardQueueCAN.queueDerivedEvent(translationEvent, enCaNode);
		}
	});
}

function triggerTranslationJPN(node, manager) {
	manager.executeInContext("EN_JP", function (otherManager) {
		var enJpNode = otherManager.getProductHome().getProductByID(node.getID());
		var style = enJpNode.getParent();
		var urgency = style.getValue("a_Translation_Urgency").getSimpleValue();

		//log.info(urgency);
		if (urgency != null) {

			if (urgency.indexOf("Urgent") >= 0) {
				//Removal of Non-DGL Outbound
				//rushQueue.queueDerivedEvent(translationEvent, node);
				DGLRushQueueJPN.queueDerivedEvent(translationEvent, enJpNode);
			}
			else if (urgency.indexOf("Standard") >= 0) {
				//Removal of Non-DGL Outbound
				//standardQueue.queueDerivedEvent(translationEvent, node);
				DGLStandardQueueJPN.queueDerivedEvent(translationEvent, enJpNode);
			}
			else if (urgency.indexOf("Medium") >= 0) {
				//Removal of Non-DGL Outbound
				//mediumQueue.queueDerivedEvent(translationEvent, node);
				DGLMediumQueueJPN.queueDerivedEvent(translationEvent, enJpNode);
			}
		}
		else {
			DGLStandardQueueJPN.queueDerivedEvent(translationEvent, enJpNode);
		}
	});
}


	//Defining below variable before the execute in context as in case the if condition at line 71 fails, the variable not defined error is thrown - Defect id PPIM-8084 - Unnat Sinha
	var canTranslationNeeded = 0;
	var jpnTranslationNeeded = 0;
manager.executeInContext("EN_US", function (otherManager) {
	var enUsNode = otherManager.getProductHome().getProductByID(node.getID());
	var ccOldName = enUsNode.getValue('a_CC_Old_Name').getSimpleValue();
	if (ccOldName != enUsNode.getName()) {
		var market = enUsNode.getValue('a_Market_Designation').getSimpleValue();
		//var canTranslationNeeded = 0;
		//var jpnTranslationNeeded = 0;

		enUsNode.getValue('a_CC_Old_Name').setSimpleValue(enUsNode.getName());

		if (market.indexOf("CAN") >= 0) {
			canTranslationNeeded++;
		}
		if (market.indexOf("JPN") >= 0) {
			jpnTranslationNeeded++;
		}
	}
});
//log.info(canTranslationNeeded);
//log.info(jpnTranslationNeeded);
if (canTranslationNeeded > 0) {
	triggerTranslationCAN(node, manager);
}
if (jpnTranslationNeeded > 0) {
	triggerTranslationJPN(node, manager);
}

}