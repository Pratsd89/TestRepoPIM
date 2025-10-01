/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestCancelledValidation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Cancel shotRequest",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,assethubqueueUS,assethubqueueCA,assethubqueueJP,eventType) {
var result = true;
var stat = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
var site = node.getValue('a_Site_Placement').getID();
var shotPrimaryMkt = node.getValue("a_Shot_Primary_Market").getSimpleValue();
log.info('stat' + stat);

if (site == 5) {
    //webUI.showAlert("ERROR",  "we cant Cancel Main P1 Shot");
    result = " Main P1 Shots can't be cancelled" ;
} else if (stat == "Submitted" && node.isInState("wf_ShortRequestLifeCycle", "Submitted") == true){
        node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Submitted").triggerByID("Cancel", "Web UI Based Shot Request Cancel");   
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
  return result;
  
}