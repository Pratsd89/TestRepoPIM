/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Dropship_Shots_Trigger_To_AssetHub",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Dropship Shots Trigger To AssetHub",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "shot",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "ShotRequestSubmit",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueUS",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_US",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,shot,assethubqueueUS,helper) {
try{
var ccList = helper.getCCsFromShot(node)
var cc = ccList.get(0);
var ccLifeCycleStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
var draft = 'DRAFT';
log.info("CC Life Cycle Status: " + ccLifeCycleStatus);
if (ccLifeCycleStatus != null && ccLifeCycleStatus != "" && draft != ccLifeCycleStatus.toUpperCase()) {
log.info("Executing as the CC Life Cycle Status is not in Draft");



   if (node.isInState("wf_ShortRequestLifeCycle", "Draft")) {
        //node.getValue('a_Shot_Request_Method').setSimpleValue("Manual");



       var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
        if (sharedMarkets != null) {
            if (sharedMarkets.indexOf("US") >= 0) {
                assethubqueueUS.queueDerivedEvent(shot, node);
            }
        }
        node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Moved to 'Submitted' state");



   }

}
}
catch(e){
	log.info(e)
	}


}