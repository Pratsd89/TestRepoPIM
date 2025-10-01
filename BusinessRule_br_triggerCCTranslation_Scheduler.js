/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerCCTranslation_Scheduler",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger CC Translation Scheduler",
  "description" : "PPIM-13151",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "colorPaletteRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "CCToColorPaletteRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,DGLStandardCAN,DGLMediumCAN,DGLUrgentCAN,DGLStandardJPN,DGLMediumJPN,DGLUrgentJPN,translationEvent,LKT,webUI,colorPaletteRef,globalHelper) {
//PPIM-14028
var cpRefs = node.getClassificationProductLinks(colorPaletteRef).toArray();
if (cpRefs.length > 0) {
    if (cpRefs[0].getClassification().getName() != node.getName()) {
        var currentContext = step.getCurrentContext().getID();
        var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
        var markets = node.getValue('a_Market_Designation').getSimpleValue();

        if (currentMarket == "CAN" && markets != null && markets.contains("CAN")) {
        	  node.getValue("a_CC_Translation_Urgency").setSimpleValue("1. Standard");
        	  var urgencyID = node.getValue("a_CC_Translation_Urgency").getLOVValue().getID();
            var queue = "DGL" + urgencyID + currentMarket;
            globalHelper.setTranslationDueDate(node, step, currentContext);
            node.getValue("a_CC_Translation_Status").setSimpleValue("Submitted");
            eval(queue).queueDerivedEvent(translationEvent, node);

            if (markets.contains("US")) {
                var dueDate = node.getValue("a_CC_Translation_Due_Date").getSimpleValue();
                var status = node.getValue("a_CC_Translation_Status").getSimpleValue();
                var xtmTime = node.getValue("a_File_XTM_TimeStamp").getSimpleValue();

                step.executeInContext("EN_US", function (usManager) {
                    var usNode = usManager.getProductHome().getProductByID(node.getID());
                    usNode.getValue("a_CC_Translation_Urgency").setSimpleValue("1. Standard");
                    usNode.getValue("a_CC_Translation_Due_Date").setSimpleValue(dueDate);
                    usNode.getValue("a_CC_Translation_Status").setSimpleValue(status);
                    usNode.getValue("a_File_XTM_TimeStamp").setSimpleValue(xtmTime);
                });
            }
        }
        else if (currentMarket == "JPN") {
        	  node.getValue("a_CC_Translation_Urgency").setSimpleValue("1. Standard");
        	  var urgencyID = node.getValue("a_CC_Translation_Urgency").getLOVValue().getID();
            var queue = "DGL" + urgencyID + currentMarket;
            globalHelper.setTranslationDueDate(node, step, currentContext);
            node.getValue("a_CC_Translation_Status").setSimpleValue("Submitted");
            eval(queue).queueDerivedEvent(translationEvent, node);
        }
    }
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_setMaintLastUpdateDate"
  } ],
  "pluginType" : "Operation"
}
*/
