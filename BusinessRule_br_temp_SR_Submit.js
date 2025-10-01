/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_temp_SR_Submit",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Temp SR Submit",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "REFTYPE",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
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
    "value" : "ShotRequestSubmit",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,REFTYPE,LKT,manager,assethubqueueUS,assethubqueueCA,assethubqueueJP,eventType) {

assethubqueueUS.queueDerivedEvent(eventType, node);

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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "REFTYPE",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,REFTYPE,LKT,manager) {
// set up log array
var logArray = new Array();

// get a_Change_or_Switch_Placement_1 && a_Change_or_Switch_Placement_2 from CC
var SitePlacement_from = node.getValue("a_Change_or_Switch_Placement_1").getSimpleValue();
logArray.push("\nCC's a_Change_or_Switch_Placement_1 is: " + SitePlacement_from);

var SitePlacement_to = node.getValue("a_Change_or_Switch_Placement_2").getSimpleValue();
logArray.push("\nCC's a_Change_or_Switch_Placement_2 is: " + SitePlacement_to);

// get shot requests referenced by CC
var CCRefs = node.getReferences(REFTYPE);
var CCRefsIter = CCRefs.iterator();

// counter
var count = 0;

while (CCRefsIter.hasNext()) {
	// current ref
	var ref = CCRefsIter.next();

	// current shot request
	var shotRequest = ref.getTarget();
	logArray.push("\nCurrent Shot Request is: " + shotRequest.getID());

	// get Shot Request's site placement value
	var shotSitePlacement = shotRequest.getValue("a_Site_Placement").getLOVValue().getValue();
	logArray.push("\nCurrent Shot Request's site placement is: " + shotSitePlacement);

	// if shotSitePlacement matches SitePlacement_from
	if (shotSitePlacement == SitePlacement_from) {
		count++;
	}
}

if (count > 1) {
	throw "<b>Found more than one Shot Request on " + node.getValue("a_CC_Number").getSimpleValue() + " with Site Placement of " + SitePlacement_from + ". Please navigate to the CC in the WebUI to modify Shot Placement.</b>";	
}
else {
	return true;	
}

// show log array. comment this out when not in development
//log.info(logArray);
}