/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TriggerCCTestLanre",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger CC Name Change Event Canada(2)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_AutoTriggerWorkflowInJPN",
    "libraryAlias" : "autoTriggerWorkflowJPNLibrary"
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
    "alias" : "DGLStandardQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLRushQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsRush",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLMediumQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsMedium",
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
exports.operation0 = function (node,translationEvent,DGLStandardQueue,DGLRushQueue,DGLMediumQueue,manager,logger,autoTriggerWorkflowJPNLibrary,helper) {
manager.executeInContext("EN_CA", function (otherManager) {
    var enCaNode = otherManager.getProductHome().getProductByID(node.getID());
    var style = enCaNode.getParent(); // Fetch the parent style node
    var urgency = style.getValue("a_Translation_Urgency").getSimpleValue();

    logger.info("Processing style-level urgency for node ID: " + style.getID());
    logger.info("Style-level urgency: " + urgency);

    // Get all nodes under the style with ID CC
    var CC = node.getChildren(); //
    // Process urgency at the style level
    if (urgency != null) {
        if (urgency.indexOf("Urgent") >= 0) {
            logger.info("Style-level urgency is 'Urgent'. Triggering DGLRushQueue.");
            DGLRushQueue.queueDerivedEvent(translationEvent, enCaNode);
        } else if (urgency.indexOf("Standard") >= 0) {
            logger.info("Style-level urgency is 'Standard'. Triggering DGLStandardQueue.");
            DGLStandardQueue.queueDerivedEvent(translationEvent, enCaNode);
        } else if (urgency.indexOf("Medium") >= 0) {
            logger.info("Style-level urgency is 'Medium'. Triggering DGLMediumQueue.");
            DGLMediumQueue.queueDerivedEvent(translationEvent, enCaNode);
        } else {
            logger.info("Style-level urgency is undefined. Triggering default DGLStandardQueue.");
            DGLStandardQueue.queueDerivedEvent(translationEvent, enCaNode);
        }
    } else {
        logger.info("Style-level urgency is null. No action taken.");
    }

    // Process urgency for "CC" nodes under the style
    CC.forEach(function (ccNode) {
        var ccUrgency = ccNode.getValue("a_Translation_Urgency").getSimpleValue();
        logger.info("Processing CC-level urgency for node ID: " + ccNode.getID());
        logger.info("CC-level urgency: " + ccUrgency);

        if (ccUrgency != null) {
            if (ccUrgency.indexOf("Urgent") >= 0) {
                logger.info("CC-level urgency is 'Urgent'. Triggering DGLRushQueue.");
                DGLRushQueue.queueDerivedEvent(translationEvent, ccNode);
            } else if (ccUrgency.indexOf("Standard") >= 0) {
                logger.info("CC-level urgency is 'Standard'. Triggering DGLStandardQueue.");
                DGLStandardQueue.queueDerivedEvent(translationEvent, ccNode);
            } else if (ccUrgency.indexOf("Medium") >= 0) {
                logger.info("CC-level urgency is 'Medium'. Triggering DGLMediumQueue.");
                DGLMediumQueue.queueDerivedEvent(translationEvent, ccNode);
            } else {
                logger.info("CC-level urgency is undefined. Triggering default DGLStandardQueue.");
                DGLStandardQueue.queueDerivedEvent(translationEvent, ccNode);
            }
        } else {
            logger.info("CC-level urgency is null. No action taken for this node.");
        }
    });
});
}
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node,manager,autoTriggerWorkflowJPNLibrary,helper) {
autoTriggerWorkflowJPNLibrary.triggerJPNTransitionForCC(node,manager,'NewCCEnrich_Copy1','CCNameComplete');
}