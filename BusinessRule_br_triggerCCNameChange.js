/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerCCNameChange",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger CC Name Change Event",
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
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLStandardQueueJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard_EN_JP",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,translationEvent,DGLStandardQueue,DGLRushQueue,DGLMediumQueue,DGLRushQueueJPN,DGLMediumQueueJPN,DGLStandardQueueJPN,helper) {
var style = node.getParent();
var market = style.getValue('a_Style_Market_Designation').getSimpleValue();
node.getValue('a_CC_Old_Name').setSimpleValue(node.getName());

//PPIM-7554 : Corrected fetching the urgency value by LOV ID
var urgency =null;
if(style.getValue("a_Translation_Urgency").getLOVValue() != null)
	urgency = style.getValue("a_Translation_Urgency").getLOVValue().getID();

//if Style has CAN as market, we need to translate EN_CA to FR_CA
if (market.indexOf("CAN") >= 0) {

	if(urgency != null){
		if(urgency == "Urgent") {
			DGLRushQueue.queueDerivedEvent(translationEvent, node);
		} 
		else if (urgency == "Standard") {
		     DGLStandardQueue.queueDerivedEvent(translationEvent, node);
		} 
		else if (urgency == "Medium") {		
			DGLMediumQueue.queueDerivedEvent(translationEvent, node);
		}
	}
}


//Below code is implemented as part of Japan Context requirements
//PPIM-7554 : Included JP related DGL queues as part of PPIM-7554
if (market.indexOf("JPN") >= 0) {
	
	if(urgency != null){
		if(urgency == "Urgent") {
			DGLRushQueueJPN.queueDerivedEvent(translationEvent, node);
		} 
		else if (urgency == "Standard") {
		     DGLStandardQueueJPN.queueDerivedEvent(translationEvent, node);
		} 
		else if (urgency == "Medium") {									
			DGLMediumQueueJPN.queueDerivedEvent(translationEvent, node);
		}
	}
}
//JP requirements ends here
}