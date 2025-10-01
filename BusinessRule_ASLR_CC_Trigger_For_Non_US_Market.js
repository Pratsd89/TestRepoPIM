/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ASLR_CC_Trigger_For_Non_US_Market",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ASLR CC Trigger For Non-US Market",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRequestToExternalAsset",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToExternalAsset",
    "description" : null
  }, {
    "contract" : "CurrentWorkflowBindContract",
    "alias" : "workflow",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "eventType",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "ShotRequestSubmit",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueUS",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.FrontEventQueueImpl",
    "value" : "step://eventqueue?id=PublishShotRequestToAssethub_EN_US",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueCA",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.FrontEventQueueImpl",
    "value" : "step://eventqueue?id=PublishShotRequestToAssethub_EN_CA",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "assethubqueueJP",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.FrontEventQueueImpl",
    "value" : "step://eventqueue?id=PublishShotRequestToAssethub_EN_JP",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
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
exports.operation0 = function (node,stepManager,CCToPhotoShotRef,shotRequestToExternalAsset,workflow,eventType,assethubqueueUS,assethubqueueCA,assethubqueueJP,lookupTable,assethubqueueSA) {
/*
 * This rule works as follows:
 * -If Non-USA ASLR Code Already Triggered flag is false, go through each market
 * -Confirm Shot Request method is ASLR and depending on Shot Request life cycle status trigger reference generation
 * -Flip Non-USA ASLR Code Already Trigger flag to true
 */

function sendToAssetHub(shotRequest) {
  var shotMethod = shotRequest.getValue("a_Shot_Request_Method").getSimpleValue();

  // publish changes to shot request
  if (shotMethod == 'ASLR') {
    var shotPrimaryMkt = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();
    var shotMarkets = shotRequest.getValue("a_Shared_Markets").getSimpleValue();

    if (shotPrimaryMkt == null) {

      if (shotMarkets.contains("US")) {
        shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("US");
      }
      else if (shotMarkets.contains("CAN")) {
        shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
      }
      else if (shotMarkets.contains("JPN")) {
        shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
      }
    //PPIM-10533 Set Primary Market to SA when no other markets exists	  
	  else if (shotMarkets.contains("SA")){
        shotRequest.getValue("a_Shot_Primary_Market").setSimpleValue("SA");		
	  }
	  
      shotPrimaryMkt = shotRequest.getValue("a_Shot_Primary_Market").getSimpleValue();
    }

    if (shotPrimaryMkt != null) {
      if (shotPrimaryMkt == "US") {
        assethubqueueUS.queueDerivedEvent(eventType, shotRequest);
      }
      else if (shotPrimaryMkt == "CAN") {
        assethubqueueCA.queueDerivedEvent(eventType, shotRequest);
      }
      else if (shotPrimaryMkt == "JPN") {
        assethubqueueJP.queueDerivedEvent(eventType, shotRequest);
      }
	  //PPIM-10533 send to EN_SA Shot Request OIEP when the Primary Market = "SA"
	  else if (shotPrimaryMkt == "SA"){
        assethubqueueSA.queueDerivedEvent(eventType, shotRequest);	  
	  }
    }
  }
}

var isNonUSASLRCodeTriggeredFlag = node.getWorkflowInstance(workflow).getSimpleVariable("NonUSASLRCodeAlreadyTriggeredFlag");

//If Non-USA ASLR Code is NOT triggered
if (isNonUSASLRCodeTriggeredFlag != "true") {
  var marketCode = node.getValue("a_Market_Designation").getSimpleValue();
  var shotRequestReferences;

  //If market code is NOT NULL
  if (marketCode != null) {
    //Getting values of Market from Market Designation
    var marketCodeValues = node.getValue("a_Market_Designation").getValues().toArray();
	 //PPIM-10533 making this as context agnostic
    for(var itr = 0; itr < marketCodeValues.length; itr++){
    	var value = marketCodeValues[itr].getSimpleValue();
    	if(!"US".equals(value)){
		  var contextId = lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket",value);
          stepManager.executeInContext("EN_US", function (enContextManager) {
            var enNode = enContextManager.getProductHome().getProductByID(node.getID());
    
            shotRequestReferences = enNode.getReferences(CCToPhotoShotRef).toArray();
    
            //For each Shot Request reference
            for (var i = 0; i < shotRequestReferences.length; i++) {
              var shotRequest = shotRequestReferences[i].getTarget();
              var shotRequestMethod = shotRequest.getValue("a_Shot_Request_Method").getSimpleValue();
              var shotRequestLifeCycleStatus = shotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
    
              //If Shot Request method equals ASLR AND Shot Request life cycle status equals submitted
              if (shotRequestMethod == "ASLR" && shotRequestLifeCycleStatus == "Submitted") {
    
                stepManager.executeInContext(contextId, function (contextManager) {
                  var contextShotRequest = contextManager.getEntityHome().getEntityByID(shotRequest.getID());
                  var contextShotMarkets = contextShotRequest.getValue("a_Shared_Markets").getSimpleValue();
                  var contextNode = contextManager.getProductHome().getProductByID(node.getID());
    
                  contextShotRequest.getValue('a_Old_Shared_Markets').setSimpleValue(contextShotMarkets);
                  contextShotRequest.getValue("a_Shared_Markets").setSimpleValue(marketCode);
                  shotRequestReferencedBy = contextShotRequest.getReferencedBy().toArray();
    
                  //If Shot Request referenced by is NOT empty
                  if (shotRequestReferencedBy.length != 0) {
                    //For each Shot Request referenced by
                    for (var n = 0; n < shotRequestReferencedBy.length; n++) {
                      var CC = shotRequestReferencedBy[n].getSource();
    
                      //If referenced by CC ID is NOT equal to CAN node ID
                      if (CC.getID() != contextNode.getID()) {
                        try{
                        contextNode.createReference(contextShotRequest, CCToPhotoShotRef);
                        }
                        catch(e){
                        	if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
    									log.info("Shot Request Link already exists for " + contextNode.getID());
                             }
                        }
                      }
                    }
                  }
    
                  sendToAssetHub(contextShotRequest);
                });
    
                //Else if Shot Request Method equals ASLR AND Shot Request life cycle status equals Ready for Review OR Complete OR Approved
              }
              else if (shotRequestMethod == "ASLR" && (shotRequestLifeCycleStatus == "Ready for Review" || shotRequestLifeCycleStatus == "Complete" || shotRequestLifeCycleStatus == "Approved")) {
    
                stepManager.executeInContext(contextId, function (contextManager) {
                  var contextShotRequest = contextManager.getEntityHome().getEntityByID(shotRequest.getID());
                  var contextShotMarkets = contextShotRequest.getValue("a_Shared_Markets").getSimpleValue();
                  var contextNode = contextManager.getProductHome().getProductByID(node.getID());
    
                  contextShotRequest.getValue('a_Old_Shared_Markets').setSimpleValue(contextShotMarkets);
                  contextShotRequest.getValue("a_Shared_Markets").setSimpleValue(marketCode);
                  shotRequestReferencedBy = contextShotRequest.getReferencedBy().toArray();
    
                  //If Shot Request referenced by is NOT empty
                  if (shotRequestReferencedBy.length != 0) {
                    //For each Shot Request referenced by
                    for (var n = 0; n < shotRequestReferencedBy.length; n++) {
                      var CC = shotRequestReferencedBy[n].getSource();
    
                      //If referenced by CC ID is NOT equal to CAN node ID
                      if (CC.getID() != contextNode.getID()) {
                      	try{
                        contextNode.createReference(contextShotRequest, CCToPhotoShotRef);
                        }
                        catch(e){
                        	if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
    									log.info("Shot Request Link already exists for " + contextNode.getID());
                             }
                        }
                      }
                    }
                  }
    
                  sendToAssetHub(contextShotRequest);
                });
                var externalAssetRef = shotRequest.getReferences(shotRequestToExternalAsset).toArray();
    
                //If External Asset references exist
                if (externalAssetRef.length != 0) {
                  //For each External Asset reference
                  for (var k = 0; k < externalAssetRef.length; k++) {
                    var externalAsset = externalAssetRef[k].getTarget();
    
                    externalAssetToCCRef = externalAsset.getReferencedBy().toArray();
    
                    //If External Asset to CC references exist
                    if (externalAssetToCCRef.length != 0) {
                      //For each External Asset to CC reference
                      for (var n = 0; n < externalAssetToCCRef.length; n++) {
                        var sourceId = externalAssetToCCRef[n].getSource().getID();
                        var referenceType = externalAssetToCCRef[n].getReferenceType();
    
                        //If source ID equals enNode ID
                        if (sourceId == enNode.getID()) {
    
                          stepManager.executeInContext(contextId, function (contextManager) {
                            var caExternalAsset = contextManager.getAssetHome().getAssetByID(externalAsset.getID());
                            var contextNode = contextManager.getProductHome().getProductByID(node.getID());
                            var asset_reference = contextNode.getReferences(referenceType).toArray();
    
                            //For each Asset Reference on contextNode
                            for (var x = 0; x < asset_reference.length; x++) {
                              var assetalreadyref = asset_reference[x].getTarget().getID();
    
                              //If ID of CAN External Asset does NOT equal Asset Already Ref ID
                              if (caExternalAsset.getID() != assetalreadyref) {
    
                                contextNode.createReference(caExternalAsset, referenceType);
                              }
                            }
                          });
                        }
    
                        //If source ID equals enNode parent's ID
                        if (sourceId == enNode.getParent().getID()) {
    
                          stepManager.executeInContext(contextId, function (contextManager) {
                            var caExternalAsset = contextManager.getAssetHome().getAssetByID(externalAsset.getID());
                            var contextNode = contextManager.getProductHome().getProductByID(node.getParent().getID());
                            var asset_reference = contextNode.getReferences(referenceType).toArray();
    
                            //For each Asset Reference on contextNode
                            for (var x = 0; x < asset_reference.length; x++) {
                              var assetalreadyref = asset_reference[x].getTarget().getID();
    
                              //If ID of CAN External Asset does NOT equal Asset Already Ref ID
                              if (caExternalAsset.getID() != assetalreadyref) {
    
                                contextNode.createReference(caExternalAsset, referenceType);
                              }
                            }
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          });
      }   	    		
  	}

	
    //Set Non-USA ASLR Code Triggered flag equal to TRUE
    node.getWorkflowInstance(workflow).setSimpleVariable("NonUSASLRCodeAlreadyTriggeredFlag", "true");
  }
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_CheckCatSyncUserUpdate"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
