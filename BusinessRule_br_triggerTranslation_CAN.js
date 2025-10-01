/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerTranslation_CAN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger Translation Event Canada",
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
exports.operation0 = function (node,translationEvent,DGLStandardQueue,DGLRushQueue,DGLMediumQueue,manager,globalHelper) {
var markets = node.getValue("a_Style_Market_Designation").getSimpleValue();

manager.executeInContext("EN_CA", function (otherManager) {
	var enCaNode = otherManager.getProductHome().getProductByID(node.getID());
	var status = enCaNode.getValue("a_Translation_Status").getSimpleValue();

	if (status != "Complete") {
		//var primaryStyle = enCaNode.getValue("a_Primary_Selling_Style").getSimpleValue();
		
		//if (primaryStyle != "No"){
			var urgency = enCaNode.getValue("a_Translation_Urgency").getSimpleValue();

			if (urgency == null) {
				enCaNode.getValue("a_Translation_Urgency").setSimpleValue("1. Standard");
				urgency = enCaNode.getValue("a_Translation_Urgency").getSimpleValue();
			}

			globalHelper.setTranslationDueDate(enCaNode, manager, "EN_CA");

			if (urgency == "3. Urgent") {
				//Remove Non-DGL Outbound
				//rushQueue.queueDerivedEvent(translationEvent, node);
				DGLRushQueue.queueDerivedEvent(translationEvent, enCaNode);
			} 
			else if (urgency == "1. Standard") {
				//Remove Non-DGL Outbound
				//standardQueue.queueDerivedEvent(translationEvent, node);
				DGLStandardQueue.queueDerivedEvent(translationEvent, enCaNode);
			} 
			else if (urgency == "2. Medium") {
				//Remove Non-DGL Outbound
				//mediumQueue.queueDerivedEvent(translationEvent, node);
				DGLMediumQueue.queueDerivedEvent(translationEvent, enCaNode);
			}
			enCaNode.getValue("a_Translation_Status").setSimpleValue("Submitted");
        var dueDate = enCaNode.getValue("a_Translation_Due_Date").getSimpleValue();
        var xtmTime = enCaNode.getValue("a_File_XTM_TimeStamp").getSimpleValue();

        if (markets.contains("US") && markets.contains("CAN")) {
            manager.executeInContext("EN_US", function (usManager) {
                var usNode = usManager.getProductHome().getProductByID(node.getID());
                usNode.getValue("a_Translation_Urgency").setSimpleValue(urgency);
                usNode.getValue("a_Translation_Due_Date").setSimpleValue(dueDate);
                usNode.getValue("a_Translation_Status").setSimpleValue("Submitted");
                usNode.getValue("a_File_XTM_TimeStamp").setSimpleValue(xtmTime);
            });
        }
	}
});
}