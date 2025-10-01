/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerCCNameChange_CAN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger CC Name Change Event Canada",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_AutoTriggerWorkflowInJPN",
    "libraryAlias" : "autoTriggerWorkflowJPNLibrary"
  }, {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "globalHelper"
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,translationEvent,DGLStandardQueue,DGLRushQueue,DGLMediumQueue,manager,autoTriggerWorkflowJPNLibrary,globalHelper,helper) {
var ccTranslationStatus = node.getValue("a_CC_Translation_Status").getSimpleValue();

if (ccTranslationStatus == "Needed") {
    var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
    var dueDate = null;
    var status = null;
    var xtmTime = null;
     var urgency = null;

manager.executeInContext("EN_CA", function (otherManager) {
	var enCaNode = otherManager.getProductHome().getProductByID(node.getID());
	var style = enCaNode.getParent();
        var styleUrgency = style.getValue("a_Translation_Urgency").getSimpleValue();
        var ccUrgency = enCaNode.getValue("a_CC_Translation_Urgency").getSimpleValue();

        //PPIM-13151
        if (ccUrgency != null) {
            if ((ccUrgency == "1. Standard" && (styleUrgency == "2. Medium" || styleUrgency == "3. Urgent")) || (ccUrgency == "2. Medium" && styleUrgency == "3. Urgent")) {
                urgency = styleUrgency;
            }
            else {
                urgency = ccUrgency;
            }
        }
        else {
            urgency = (styleUrgency != null) ? styleUrgency : "1. Standard";
        }


		if (urgency.indexOf("Urgent") >= 0) {
			//Removal of Non-DGL Outbound
			//rushQueue.queueDerivedEvent(translationEvent, node);
			DGLRushQueue.queueDerivedEvent(translationEvent, enCaNode);
		}
		else if (urgency.indexOf("Standard") >= 0) {
			//Removal of Non-DGL Outbound
			//standardQueue.queueDerivedEvent(translationEvent, node);
			DGLStandardQueue.queueDerivedEvent(translationEvent, enCaNode);
		}
		else if (urgency.indexOf("Medium") >= 0) {
			//Removal of Non-DGL Outbound
			//mediumQueue.queueDerivedEvent(translationEvent, node);
			DGLMediumQueue.queueDerivedEvent(translationEvent, enCaNode);
		}

        enCaNode.getValue("a_CC_Translation_Status").setSimpleValue("Submitted");
        globalHelper.setTranslationDueDate(enCaNode, otherManager, "EN_CA");

        dueDate = enCaNode.getValue("a_CC_Translation_Due_Date").getSimpleValue();
        status = enCaNode.getValue("a_CC_Translation_Status").getSimpleValue();
        xtmTime = enCaNode.getValue("a_File_XTM_TimeStamp").getSimpleValue();
    });


    //PPIM-13150
    if (marketDesignation != null && marketDesignation.contains("US")) {
        manager.executeInContext("EN_US", function (usManager) {
            var usNode = usManager.getProductHome().getProductByID(node.getID());
            usNode.getValue("a_CC_Translation_Urgency").setSimpleValue(urgency);
            usNode.getValue("a_CC_Translation_Due_Date").setSimpleValue(dueDate);
            usNode.getValue("a_CC_Translation_Status").setSimpleValue(status);
            usNode.getValue("a_File_XTM_TimeStamp").setSimpleValue(xtmTime);
        });
    }
}

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
exports.operation1 = function (node,manager,autoTriggerWorkflowJPNLibrary,globalHelper,helper) {
autoTriggerWorkflowJPNLibrary.triggerJPNTransitionForCC(node,manager,'NewCCEnrich_Copy1','CCNameComplete');
}