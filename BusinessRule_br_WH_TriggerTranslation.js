/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_WH_TriggerTranslation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger Translation Event WH",
  "description" : "Logic for Trigger Translations button in the webUI. PPIM-10284",
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "globalHelper"
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLStandardCAN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard_WH",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLMediumCAN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsMedium_WH",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLUrgentCAN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsRush_WH",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLStandardJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard_EN_JP_WH",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLMediumJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsMedium_EN_JP_WH",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLUrgentJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsRush_EN_JP_WH",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "translationEvent",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "Translation",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,DGLStandardCAN,DGLMediumCAN,DGLUrgentCAN,DGLStandardJPN,DGLMediumJPN,DGLUrgentJPN,translationEvent,LKT,webUI,globalHelper) {
var currentContext = step.getCurrentContext().getID();

if (currentContext.contains("EN_")) {

	var urgencyValue = node.getValue("a_Cat_Translation_Urgency").getSimpleValue();

	if (urgencyValue == null) {
		node.getValue("a_Cat_Translation_Urgency").setSimpleValue("1. Standard");
		urgencyValue = node.getValue("a_Cat_Translation_Urgency").getSimpleValue();
	}
		var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
		var urgencyID = node.getValue("a_Cat_Translation_Urgency").getLOVValue().getID();

		if (currentMarket == "US") {

			var inheritToCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
			var inheritToJPN = node.getValue("a_JPN_Inherit_Option").getSimpleValue();
			var dueDate = null;
			var status = null;
			var xtmTime = null;

			if (inheritToCAN != null || inheritToJPN != null) {

				if (inheritToCAN != null) {
					var queue = "DGL" + urgencyID + "CAN";

					step.executeInContext("EN_CA", function (cntxtManager) {
						var cntxtNode = cntxtManager.getClassificationHome().getClassificationByID(node.getID());

						//set urgency from US value
						cntxtNode.getValue("a_Cat_Translation_Urgency").setSimpleValue(urgencyValue);
						cntxtNode.getValue("a_Cat_Translation_Status").setSimpleValue("Submitted");

						globalHelper.setTranslationDueDate(cntxtNode, cntxtManager, "EN_CA");
						eval(queue).queueDerivedEvent(translationEvent, node);

						dueDate = cntxtNode.getValue("a_Cat_Translation_Due_Date").getSimpleValue();
						status = cntxtNode.getValue("a_Cat_Translation_Status").getSimpleValue();
						xtmTime = cntxtNode.getValue("a_File_XTM_TimeStamp").getSimpleValue();

					});
				}
				if (inheritToJPN != null) {
					var queue = "DGL" + urgencyID + "JPN";

					step.executeInContext("EN_JP", function (cntxtManager) {
						var cntxtNode = cntxtManager.getClassificationHome().getClassificationByID(node.getID());

						//set urgency from US value
						cntxtNode.getValue("a_Cat_Translation_Urgency").setSimpleValue(urgencyValue);
						cntxtNode.getValue("a_Cat_Translation_Status").setSimpleValue("Submitted");

						globalHelper.setTranslationDueDate(cntxtNode, cntxtManager, "EN_JP");
						eval(queue).queueDerivedEvent(translationEvent, node);

						dueDate = cntxtNode.getValue("a_Cat_Translation_Due_Date").getSimpleValue();
						status = cntxtNode.getValue("a_Cat_Translation_Status").getSimpleValue();
						xtmTime = cntxtNode.getValue("a_File_XTM_TimeStamp").getSimpleValue();

					});
				}
				//set values in us market
				node.getValue("a_Cat_Translation_Due_Date").setSimpleValue(dueDate);
				node.getValue("a_Cat_Translation_Status").setSimpleValue(status);
				node.getValue("a_File_XTM_TimeStamp").setSimpleValue(xtmTime);
			}
			else {
				webUI.showAlert("Error", "Incorrect Context", "You cannot trigger translation from current market. Please switch to EN_CA or EN_JP to trigger translations");
			}
		}
		else {
			var queue = "DGL" + urgencyID + currentMarket;
			node.getValue("a_Cat_Translation_Status").setSimpleValue("Submitted");
			globalHelper.setTranslationDueDate(node, step, currentContext);
			eval(queue).queueDerivedEvent(translationEvent, node);
		}
	
}
else {
	webUI.showAlert("Error", "Incorrect Context", "You cannot trigger translation from current context. Please switch to English market/context");
}
}