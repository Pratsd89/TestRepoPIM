/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SetVisibilityAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetVisibilityAction",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "stylingRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToStylingPieceCCRef",
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
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,stylingRef,shot,assethubqueueUS,assethubqueueCA,assethubqueueJP,qh) {
/**
 * Refactored as a part JP changes PPIM-7403
 */
function setStylePieceCCNumber(contextID) {

	step.executeInContext(contextID, function (contextManager) {
		var currentProduct = contextManager.getEntityHome().getEntityByID(node.getID());
		var ar_shotToCCReferencesNew = currentProduct.getReferences().asList();
		for (var a_count = 0; a_count < ar_shotToCCReferencesNew.size(); a_count++) {
			var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
			var stylePieceCCNumber = a_oCC.getValue('a_CC_Number').getSimpleValue();
			log.info(contextID + " stylePieceCCNumber " + stylePieceCCNumber);
			ar_shotToCCReferencesNew.get(a_count).getValue('a_Styling_Piece_CC_Number').setSimpleValue(stylePieceCCNumber);
		}
	});

}

function deleteReferencingShotRequestToStylingPieceCCRef() {
	var contextListItr = step.getListOfValuesHome().getListOfValuesByID("All_Contexts_LoV").queryValidValues().asList(10).iterator();
	while (contextListItr.hasNext()) {
		var contextId = contextListItr.next().getID()
		if (contextId.startsWith("EN_")) {
			step.executeInContext(contextId, function (otherManager) {
				var otherShot = otherManager.getEntityHome().getEntityByID(node.getID());
				var ar_shotToCCReferencesNew = otherShot.getReferences().asList();
				for (var a_count = 0; a_count < ar_shotToCCReferencesNew.size(); a_count++) {
					var refType = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID()
					if (refType == "ShotRequestToStylingPieceCCRef") {
						var dimensionItr = ar_shotToCCReferencesNew.get(a_count).getDimensionPoints().iterator();
						while (dimensionItr.hasNext()) {
							var dimensionPointS = dimensionItr.next();
							var dimID = dimensionPointS.getID();
							if (dimID != "MarketRoot") {
								ar_shotToCCReferencesNew.get(a_count).delete()
							}
						}
					}
				}
			});
		}
	}

}
function deleteReferencingCC(contextId) {
	step.executeInContext(contextId, function (shotContextManager) {
		var shotCurrentProduct = shotContextManager.getEntityHome().getEntityByID(node.getID());
		var referencingCCs = new java.util.ArrayList();
		referencingCCs.addAll(shotCurrentProduct.getReferencedByProducts());
		if (!referencingCCs.isEmpty()) {
			for (var num = 0; num < referencingCCs.size(); num++) {
				var oCC = referencingCCs.get(num).getSource().getID();
				var dimPS = referencingCCs.get(num).getDimensionPoints();
				var itr2S = referencingCCs.get(num).getDimensionPoints().iterator();
				while (itr2S.hasNext()) {
					dimensionPointS = itr2S.next();
					var dimID = dimensionPointS.getID();
					if (dimID != "MarketRoot" && referencingCCs.size() != 1) {
						referencingCCs.get(num).delete();
					}
				}
			}
		}
	});
}

var shared = node.getValue("a_Shared_Markets").getSimpleValue();

if ((shared.contains("US") && shared.contains("CAN")) || (shared.contains("US") && shared.contains("JPN")) || (shared.contains("US") && shared.contains("CAN") && shared.contains("JPN"))) {
	deleteReferencingCC("EN_US")
}

if ((shared.contains("US") && shared.contains("CAN")) || (shared.contains("CAN") && shared.contains("JPN")) || (shared.contains("US") && shared.contains("CAN") && shared.contains("JPN"))) {
	deleteReferencingCC("EN_CA")
}

if ((shared.contains("JPN") && shared.contains("US")) || (shared.contains("JPN") && shared.contains("CAN")) || (shared.contains("US") && shared.contains("CAN") && shared.contains("JPN"))) {
	deleteReferencingCC("EN_JP")
}



var currentContext = step.getCurrentContext().getID();
var sReferencingCCs = new java.util.ArrayList();
sReferencingCCs.addAll(node.getReferences(stylingRef));
for (var i = 0; i < sReferencingCCs.size(); i++) {
	var dimP = sReferencingCCs.get(i).getDimensionPoints()
	var itr2 = sReferencingCCs.get(i).getDimensionPoints().iterator();
	while (itr2.hasNext()) {
		dimensionPoint = itr2.next();
		var dimID = dimensionPoint.getID();
		log.info(dimID)
		var parent = dimensionPoint.getParent();
		if (shared.contains("US") && shared.contains("CAN") && shared.contains("JPN")) {
			if (dimID != "MarketRoot") {
				dimP.clear();
				dimP.add(parent);
				sReferencingCCs.get(i).setDimensionPoints(dimP);
				//add styling piece CC Num
				deleteReferencingShotRequestToStylingPieceCCRef()
				setStylePieceCCNumber("EN_US");
				setStylePieceCCNumber("EN_CA");
				setStylePieceCCNumber("EN_JP");
			}
		} else if (shared.contains("US") && shared.contains("CAN")) {
			setStylePieceCCNumber("EN_US");
			setStylePieceCCNumber("EN_CA");
		} else if (shared.contains("US") && shared.contains("JP")) {
			setStylePieceCCNumber("EN_US");
			setStylePieceCCNumber("EN_JP");
		} else if (shared.contains("JP") && shared.contains("CAN")) {
			setStylePieceCCNumber("EN_JP");
			setStylePieceCCNumber("EN_CA");
		}
	}
}

// trigger shot request workflow transition

if (node.isInState("wf_ShortRequestLifeCycle", "Draft")) {
	node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Shot Request submitted via Bulk Upload");
}
else if (!(node.isInWorkflow("wf_ShortRequestLifeCycle"))) {
	node.startWorkflowByID("wf_ShortRequestLifeCycle", "Shot Request workflow initiated via Bulk Upload");
	if (node.isInState("wf_ShortRequestLifeCycle", "Draft")) {
		node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Shot Request submitted via Bulk Upload");
	}
}

/*var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
var lifeCycleStatus = node.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();

if (sharedMarkets != null && lifeCycleStatus == 'Submitted') {
	// if shared market has US, run US context
	if (sharedMarkets.contains("US")) {
		//Removal of Non-DGL Outbound
		//queueUS.queueDerivedEvent(shot,node);
		assethubqueueUS.queueDerivedEvent(shot, node);
	} else if (sharedMarkets.contains("CAN")) {
		//Removal of Non-DGL Outbound
		//queueCA.queueDerivedEvent(shot,node);
		assethubqueueCA.queueDerivedEvent(shot, node);
	} else if (sharedMarkets.contains("JPN")) {
		assethubqueueJP.queueDerivedEvent(shot, node);
	}
}*/

}