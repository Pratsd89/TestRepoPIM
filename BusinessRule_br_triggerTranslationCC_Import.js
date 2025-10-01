/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerTranslationCC_Import",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger Translation Import - CC",
  "description" : "PPIM-13730- To trigger translation from import",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,DGLStandardCAN,DGLMediumCAN,DGLUrgentCAN,DGLStandardJPN,DGLMediumJPN,DGLUrgentJPN,translationEvent,LKT,globalHelper) {
//PPIM-13730
var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
var markets = node.getValue('a_Market_Designation').getValues().toArray();
var urgencyValue = node.getValue("a_CC_Translation_Urgency").getSimpleValue();

if (urgencyValue == null) {
    node.getValue("a_CC_Translation_Urgency").setSimpleValue("1. Standard");
    urgencyValue = node.getValue("a_CC_Translation_Urgency").getSimpleValue();
}
else {
    var urgencyID = node.getValue("a_CC_Translation_Urgency").getLOVValue().getID();
    if (currentMarket == "US") {
        var dueDate = null;
        var status = null;
        var xtmTime = null;

        markets.forEach(function (mkt) {
            if (mkt.getValue() == "CAN" || mkt.getValue() == "JPN") {
                var queue = "DGL" + urgencyID + mkt.getValue();
                var cntxt = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());

                step.executeInContext(cntxt, function (cntxtManager) {
                    var cntxtNode = cntxtManager.getProductHome().getProductByID(node.getID());

                    //set urgency from US value
                    cntxtNode.getValue("a_CC_Translation_Urgency").setSimpleValue(urgencyValue);
                    cntxtNode.getValue("a_CC_Translation_Status").setSimpleValue("Submitted");

                    globalHelper.setTranslationDueDate(cntxtNode, cntxtManager, cntxt);
                    eval(queue).queueDerivedEvent(translationEvent, node);

                    dueDate = cntxtNode.getValue("a_CC_Translation_Due_Date").getSimpleValue();
                    status = cntxtNode.getValue("a_CC_Translation_Status").getSimpleValue();
                    xtmTime = cntxtNode.getValue("a_File_XTM_TimeStamp").getSimpleValue();
                });
            }
        });

        //set values in us market
        node.getValue("a_CC_Translation_Due_Date").setSimpleValue(dueDate);
        node.getValue("a_CC_Translation_Status").setSimpleValue(status);
        node.getValue("a_File_XTM_TimeStamp").setSimpleValue(xtmTime);
    }
    else if (currentMarket == "CAN") {
        var queue = "DGL" + urgencyID + currentMarket;
        globalHelper.setTranslationDueDate(node, step, currentContext);
        node.getValue("a_CC_Translation_Status").setSimpleValue("Submitted");
        eval(queue).queueDerivedEvent(translationEvent, node);

        //PPIM-13150
        var marketDesg = node.getValue('a_Market_Designation').getSimpleValue();
        if (marketDesg != null && marketDesg.contains("US")) {
            var dueDate = node.getValue("a_CC_Translation_Due_Date").getSimpleValue();
            var status = node.getValue("a_CC_Translation_Status").getSimpleValue();
            var xtmTime = node.getValue("a_File_XTM_TimeStamp").getSimpleValue();

            step.executeInContext("EN_US", function (usManager) {
                var usNode = usManager.getProductHome().getProductByID(node.getID());
                usNode.getValue("a_CC_Translation_Urgency").setSimpleValue(urgencyValue);
                usNode.getValue("a_CC_Translation_Due_Date").setSimpleValue(dueDate);
                usNode.getValue("a_CC_Translation_Status").setSimpleValue(status);
                usNode.getValue("a_File_XTM_TimeStamp").setSimpleValue(xtmTime);
            });
        }
    }
    else if (currentMarket == "JPN") {
        var queue = "DGL" + urgencyID + currentMarket;
        globalHelper.setTranslationDueDate(node, step, currentContext);
        node.getValue("a_CC_Translation_Status").setSimpleValue("Submitted");
        eval(queue).queueDerivedEvent(translationEvent, node);
    }
}

node.getValue("a_reTrigger_Translation").setSimpleValue(null);
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
var triggerTranslation = node.getValue("a_reTrigger_Translation").getSimpleValue();
if (triggerTranslation == "Yes"){
	return true;
}
return false;

}