/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Trigger Translation EventBulk",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TEST Trigger Translation Event WH Bulk",
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
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);

var urgencyValue = node.getValue("a_Cat_Translation_Urgency").getSimpleValue();
if (urgencyValue == null) {
    node.getValue("a_Cat_Translation_Urgency").setSimpleValue("1. Standard");
    urgencyValue = node.getValue("a_Cat_Translation_Urgency").getSimpleValue();
}
var urgencyID = node.getValue("a_Cat_Translation_Urgency").getLOVValue().getID();

var queue = "DGL" + urgencyID + currentMarket;
node.getValue("a_Cat_Translation_Status").setSimpleValue("Submitted");
globalHelper.setTranslationDueDate(node, step, currentContext);
eval(queue).queueDerivedEvent(translationEvent, node);


}