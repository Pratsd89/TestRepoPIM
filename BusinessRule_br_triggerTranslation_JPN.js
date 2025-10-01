/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerTranslation_JPN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger Translation Event Japan",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
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
    "contract" : "DerivedEventTypeBinding",
    "alias" : "translationEvent",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "Translation",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLStandardQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard_EN_JP",
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
exports.operation0 = function (node,translationEvent,DGLStandardQueue,DGLRushQueue,DGLMediumQueue,manager,globalHelper) {
manager.executeInContext("EN_JP", function (otherManager) {
	var enJpNode = otherManager.getProductHome().getProductByID(node.getID());
	var status = enJpNode.getValue("a_Translation_Status").getSimpleValue();

	if (status != "Complete") {
		//var primaryStyle = enJpNode.getValue("a_Primary_Selling_Style").getSimpleValue();
		
		//if (primaryStyle != "No"){
		     var urgency = enJpNode.getValue("a_Translation_Urgency").getSimpleValue();

		     if (urgency == null) {
			     enJpNode.getValue("a_Translation_Urgency").setSimpleValue("1. Standard");
			     urgency = enJpNode.getValue("a_Translation_Urgency").getSimpleValue();
		 }

		 globalHelper.setTranslationDueDate(enJpNode, manager, "EN_JP");

		 if (urgency == "3. Urgent") {
			//Remove Non-DGL Outbound
			//rushQueue.queueDerivedEvent(translationEvent, node);
			DGLRushQueue.queueDerivedEvent(translationEvent, enJpNode);
		 }
		 else if (urgency == "1. Standard") {
			//Remove Non-DGL Outbound
			//standardQueue.queueDerivedEvent(translationEvent, node);
			DGLStandardQueue.queueDerivedEvent(translationEvent, enJpNode);
		 }
		 else if (urgency == "2. Medium") {
			//Remove Non-DGL Outbound
			//mediumQueue.queueDerivedEvent(translationEvent, node);
			DGLMediumQueue.queueDerivedEvent(translationEvent, enJpNode);
		 }
		enJpNode.getValue("a_Translation_Status").setSimpleValue("Submitted");
	   //}	
	}
});
}