/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Switch_Site_Placement",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request - Switch Site Placement",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "REFTYPE",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,LKT,assethubqueueUS,assethubqueueCA,assethubqueueJP,eventType,REFTYPE) {
// create log array
var logArray = new Array();

// get a_Change_or_Switch_Placement_1 && a_Change_or_Switch_Placement_2 from CC
var SitePlacement_from = node.getValue("a_Change_or_Switch_Placement_1").getSimpleValue();
logArray.push("\nCC a_Change_or_Switch_Placement_1 is: " + SitePlacement_from);
var SitePlacement_to = node.getValue("a_Change_or_Switch_Placement_2").getSimpleValue();
logArray.push("\nCC a_Change_or_Switch_Placement_2 is: " + SitePlacement_to);

if (!SitePlacement_from && !SitePlacement_to) {
	throw "no values for change site placement entered"	
}

// get Shot Requests from CC
var CCRefs = node.getReferences(REFTYPE);
var CCRefsIter = CCRefs.iterator();

var swap1 = null;
var swap2 = null;

while (CCRefsIter.hasNext()) {
	// current ref
	var ref = CCRefsIter.next();

	// current Shot Request
	var shotRequest = ref.getTarget();
	logArray.push("\nCurrent Shot Request is: " + shotRequest.getID());

	// get Shot Request's site placement value
	var shotSitePlacement = shotRequest.getValue("a_Site_Placement").getLOVValue().getValue();
	logArray.push("\nCurrent Shot Request's Site Placement is: " + shotSitePlacement);

	// if Shot Request's site placement matches SitePlacement_from
	// then record the shot request
	if (shotSitePlacement == SitePlacement_from) {
		logArray.push("\n -- Setting Swap 1");
		swap1 = shotRequest;
	}
	//else if Shot Request's site placement matches SitePlacement_to
	// then record the shot request
	else if (shotSitePlacement == SitePlacement_to) {
		logArray.push("\n -- Setting Swap 2");
		swap2 = shotRequest;
	}
}

// if matches for both site placements from spreadsheet are found
if (swap1 && swap2) {
	// then swap the values
	swap1.getValue("a_Site_Placement").setValue(SitePlacement_to);
	logArray.push("\nSetting site placement on " + swap1.getID() + " to " + SitePlacement_to);
	swap2.getValue("a_Site_Placement").setValue(SitePlacement_from);
	logArray.push("\nSetting site placement on " + swap2.getID() + " to " + SitePlacement_from);

	// republish
	var shotPublishArray = new Array();
	shotPublishArray.push(swap1, swap2);

	shotPublishArray.forEach(function (publishShot) {
		// get shared markets from Shot Request
		var markets = publishShot.getValue("a_Shared_Markets").getSimpleValue();

		if (markets != null) {
			// republish to corresponding event queue
			if (markets.contains("US")) {
				assethubqueueUS.queueDerivedEvent(eventType, publishShot);
				logArray.push("\nRepublishing " + publishShot.getID() + " to assethubUS");
			}
			else if (markets.contains("CAN")) {
				assethubqueueCA.queueDerivedEvent(eventType, publishShot);
				logArray.push("\nRepublishing " + publishShot.getID() + " to assethubCA");
			}
			else if (markets.contains("JPN")) {
				assethubqueueJP.queueDerivedEvent(eventType, publishShot);
				logArray.push("\nRepublishing " + publishShot.getID() + " to assethubJP");
			}
		}
	});
}
else {
	throw "One or More Shot Request with provided Site Placement values do not exist, therefore switch cannot happen";
}

// clear values when done
logArray.push("\nClearing change site placement attributes");
node.getValue("a_Change_or_Switch_Placement_1").setValue(null);
node.getValue("a_Change_or_Switch_Placement_2").setValue(null);

var SitePlacement_from = node.getValue("a_Change_or_Switch_Placement_1").getSimpleValue();
logArray.push("\n -- CC a_Change_or_Switch_Placement_1 is: " + SitePlacement_from);
var SitePlacement_to = node.getValue("a_Change_or_Switch_Placement_2").getSimpleValue();
logArray.push("\n -- CC a_Change_or_Switch_Placement_2 is: " + SitePlacement_to);

// show log array. comment this out when not in development
//log.info(logArray);
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
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,REFTYPE) {
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
var count1 = 0;
var count2 = 0;

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
		count1++;
	}
	// if shotSitePlacement matches SitePlacement_to
	if (shotSitePlacement == SitePlacement_to) {
		count2++;
	}
}

if (count1 > 1 || count2 > 1) {
	//return false;
	throw "<b>Found more than one Shot Request on " + node.getValue("a_CC_Number").getSimpleValue() + " with Site Placement of " + SitePlacement_from + "/" + SitePlacement_to + ". Please navigate to the CC in the WebUI to modify Shot Placement.</b>";	
}
else {
	return true;	
}

// show log array. comment this out when not in development
//log.info(logArray);
}