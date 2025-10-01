/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_shotRequestCancelLogicImport",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_shotRequestCancelLogicImport",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueUS",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_US",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueCA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_CA",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueJP",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_JP",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "eventType",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "ShotRequestCancel",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueSA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishShotRequestToAssethub_EN_SA",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,assethubqueueUS,assethubqueueCA,assethubqueueJP,eventType,assethubqueueSA) {
var CancelShotRequest = node.getValue('a_CancelShotRequest').getSimpleValue();
if(CancelShotRequest!=null && CancelShotRequest != ''){
CancelShotRequest = CancelShotRequest.toUpperCase();
if(CancelShotRequest == "YES"||CancelShotRequest == "Y" ){
var result = true;
var stat = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
var site = node.getValue('a_Site_Placement').getID();
var shotPrimaryMkt = node.getValue("a_Shot_Primary_Market").getSimpleValue();


if (site == 5) {
    //webUI.showAlert("ERROR",  "we cant Cancel Main P1 Shot");
    result = " Main P1 Shots can't be cancelled" ;
    throw  ("<b style='color:red;'>Main P1 Shots can't be cancelled.</b>");
} else if (stat == "Submitted" && node.isInState("wf_ShortRequestLifeCycle", "Submitted") == true){
        node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Submitted").triggerByID("Cancel", "Bulk Update Based Shot Request Cancel");   
}
else {
	result = "This Shot Request cannot be cancelled";
}


   //Publish shotRequest

    
    if (result == true ) {
        
        if (shotPrimaryMkt == "US") {
            
            assethubqueueUS.queueDerivedEvent(eventType, node);
        }
        else if (shotPrimaryMkt == "CAN") {
           
            assethubqueueCA.queueDerivedEvent(eventType, node);
        }
        else if (shotPrimaryMkt == "JPN") {
            
            assethubqueueJP.queueDerivedEvent(eventType, node);
        }
        else if (shotPrimaryMkt == "SA") {
           
            assethubqueueSA.queueDerivedEvent(eventType, node);
        }
  }
}
}
}