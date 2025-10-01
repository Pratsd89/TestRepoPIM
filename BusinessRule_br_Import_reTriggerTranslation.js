/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Import_reTriggerTranslation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Re-Trigger Translation Import Event",
  "description" : "Logic for the re-trigger translation button in the webUI. PPIM-972",
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "BusinessActionBindContract",
    "alias" : "inheritUSCopy",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Inherit_US_Copy_Actions",
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
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLMediumCAN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsMedium",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLUrgentCAN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsRush",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLStandardJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsStandard_EN_JP",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLMediumJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsMedium_EN_JP",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "DGLUrgentJPN",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=DGLTranslationRequestsRush_EN_JP",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,inheritUSCopy,step,DGLStandardCAN,DGLMediumCAN,DGLUrgentCAN,DGLStandardJPN,DGLMediumJPN,DGLUrgentJPN,translationEvent,LKT,globalHelper) {
var markets = node.getValue('a_Style_Market_Designation').getSimpleValue();
var inheritOption = node.getValue('a_Inherit_US_Copy_Option').getSimpleValue();
var urgencyValue = node.getValue("a_Translation_Urgency").getSimpleValue();
var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);

if (urgencyValue == null) {

	node.getValue("a_Translation_Urgency").setSimpleValue("1. Standard");
	urgencyValue = node.getValue("a_Translation_Urgency").getSimpleValue();
}
var urgencyID = node.getValue("a_Translation_Urgency").getLOVValue().getID();

if (inheritOption != null) {

	if (currentMarket == "US") {
		var inheritCopyMkts = node.getValue("a_Inherit_US_Copy_Option").getValues().toArray();
		var dueDate = null;
		var status = null;
		var xtmTime = null;

		inheritCopyMkts.forEach(function (mkt) {
			if (mkt.getValue() != "SA"){
				var queue = "DGL" + urgencyID + mkt.getValue();
				var cntxt = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());

				step.executeInContext(cntxt, function (cntxtManager) {
					var cntxtNode = cntxtManager.getProductHome().getProductByID(node.getID());

					//set urgency from US value
					cntxtNode.getValue("a_Translation_Urgency").setSimpleValue(urgencyValue);
					cntxtNode.getValue("a_Translation_Status").setSimpleValue("Submitted");

					globalHelper.setTranslationDueDate(cntxtNode, cntxtManager, cntxt);
					eval(queue).queueDerivedEvent(translationEvent, node);

					dueDate = cntxtNode.getValue("a_Translation_Due_Date").getSimpleValue();
					status = cntxtNode.getValue("a_Translation_Status").getSimpleValue();
					xtmTime = cntxtNode.getValue("a_File_XTM_TimeStamp").getSimpleValue();
				});
			}
		});
		//set values in us market
		node.getValue("a_Translation_Due_Date").setSimpleValue(dueDate);
		node.getValue("a_Translation_Status").setSimpleValue(status);
		node.getValue("a_File_XTM_TimeStamp").setSimpleValue(xtmTime);
	}
	else {
		var queue = "DGL" + urgencyID + currentMarket;

		globalHelper.setTranslationDueDate(node, step, currentContext);
        node.getValue("a_Translation_Status").setSimpleValue("Submitted");
		eval(queue).queueDerivedEvent(translationEvent, node);
	}
}
else {

	if (currentMarket == "US") {

		//clear urgency in US market
		node.getValue("a_Translation_Due_Date").setSimpleValue(null);
		node.getValue("a_Translation_Status").setSimpleValue(null);
		node.getValue("a_File_XTM_TimeStamp").setSimpleValue(null);
	}
	else {
		var queue = "DGL" + urgencyID + currentMarket;

		globalHelper.setTranslationDueDate(node, step, currentContext);
        node.getValue("a_Translation_Status").setSimpleValue("Submitted");
		eval(queue).queueDerivedEvent(translationEvent, node);
	}
}

//PPIM-13150
if (markets.contains("US") && markets.contains("CAN")) {
    var dueDate = node.getValue("a_Translation_Due_Date").getSimpleValue();
    var status = node.getValue("a_Translation_Status").getSimpleValue();
    var xtmTime = node.getValue("a_File_XTM_TimeStamp").getSimpleValue();
    
    if (currentMarket == "CAN" && status == "Submitted") {
        step.executeInContext("EN_US", function (usManager) {
            var usNode = usManager.getProductHome().getProductByID(node.getID());
            usNode.getValue("a_Translation_Urgency").setSimpleValue(urgencyValue);
            usNode.getValue("a_Translation_Due_Date").setSimpleValue(dueDate);
            usNode.getValue("a_Translation_Status").setSimpleValue(status);
            usNode.getValue("a_File_XTM_TimeStamp").setSimpleValue(xtmTime);
        });
    }
}

node.getValue("a_reTrigger_Translation").setSimpleValue(null);
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,globalHelper) {
var reTriggerTranslation = node.getValue("a_reTrigger_Translation").getSimpleValue();

if (reTriggerTranslation == "Yes") {

	return true;
}
else {
    
    return false;
}

}