/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Update_CC_Name_With_Color_Palette",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Update CC Name With Color Palette",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ColorPalette" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
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
    "contract" : "EventQueueBinding",
    "alias" : "DGLStandardQueue_JP",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard_EN_JP",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLRushQueue_JP",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsRush_EN_JP",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLMediumQueue_JP",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsMedium_EN_JP",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,translationEvent,DGLStandardQueue,DGLRushQueue,DGLMediumQueue,DGLStandardQueue_JP,DGLRushQueue_JP,DGLMediumQueue_JP) {
var templateClassification = manager.getClassificationHome().getClassificationByID(node.getID());
var links = templateClassification.getClassificationProductLinks();

for (var i = 0; i < links.size(); i++) {
	var CC = links.get(i).getProduct();
	var overrideCCNameFlag = CC.getValue('a_Override_CC_Name').getSimpleValue();

	if (overrideCCNameFlag == 'No') {
		var colorPaletteName = node.getName();
		var CCName = CC.getName();

		//Below condition added so that event get triggers only if cc name and colorpalette name differs
		if (CCName != colorPaletteName) {
			if(colorPaletteName!=null)
			CC.setName(colorPaletteName);
			CC.getValue('a_CC_Old_Name').setSimpleValue(CC.getName());

			var style = CC.getParent();
			var market = style.getValue('a_Style_Market_Designation').getSimpleValue();

			if (market.indexOf("CAN") > -1) {
				var urgency = style.getValue("a_Translation_Urgency").getSimpleValue();
				if (urgency == "Urgent") {
					//Removal of Non-DGL Outbound
					//rushQueue.queueDerivedEvent(translationEvent, CC);
					DGLRushQueue.queueDerivedEvent(translationEvent, CC);
				} else if (urgency == "Standard") {
					//Removal of Non-DGL Outbound	
					//standardQueue.queueDerivedEvent(translationEvent, CC);
					DGLStandardQueue.queueDerivedEvent(translationEvent, CC);
				} else if (urgency == "Medium") {
					//Removal of Non-DGL Outbound	
					//mediumQueue.queueDerivedEvent(translationEvent, CC);
					DGLMediumQueue.queueDerivedEvent(translationEvent, CC);
				}
			}
			if (market.indexOf("JPN") > -1) {
				var urgency = style.getValue("a_Translation_Urgency").getSimpleValue();

				if (urgency == "Urgent") {
					//Removal of Non-DGL Outbound
					//rushQueue.queueDerivedEvent(translationEvent, CC);
					DGLRushQueue_JP.queueDerivedEvent(translationEvent, CC);
				} else if (urgency == "Standard") {
					//Removal of Non-DGL Outbound	
					//standardQueue.queueDerivedEvent(translationEvent, CC);
					DGLStandardQueue_JP.queueDerivedEvent(translationEvent, CC);
				} else if (urgency == "Medium") {
					//Removal of Non-DGL Outbound	
					//mediumQueue.queueDerivedEvent(translationEvent, CC);
					DGLMediumQueue_JP.queueDerivedEvent(translationEvent, CC);
				}
			}


		}

		// now set the Last Maintenance update date on CC
		var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//logger.info(iso.format(time));
		//CC.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	}
}
}