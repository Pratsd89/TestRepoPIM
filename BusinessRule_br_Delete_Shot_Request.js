/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Delete_Shot_Request",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Delete_Shot_Request",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "primaryImageRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestPrimaryImageRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "swatchRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestSwatchRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "extAssetRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToExternalAsset",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "videoRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestVideoRef",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
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
exports.operation0 = function (node,primaryImageRef,swatchRef,extAssetRef,videoRef,step,LKT) {
/*PPIM_10535 - Adding the Context Agnostic changes with help of LKT : LKT_MarketDesignationToMarket based on applicable ShotRequest's Shared Market
 * 		   - Persisting the functional behaviour
 */
 
function removeRefsForShot(node, contextID) {
    step.executeInContext(contextID, function(otherManager) {
        var otherEntity = otherManager.getEntityHome().getEntityByID(node.getID());
        var ref = [primaryImageRef, swatchRef, extAssetRef, videoRef];
        for (var i = 0; i < ref.length; i++) {
            var shotRef = new java.util.ArrayList();
            shotRef.addAll(otherEntity.getReferences(ref[i]));
            for (var j = 0; j < shotRef.size(); j++) {
                shotRef.get(j).delete();
            }
        }

        var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");
        var sShotReqToCCRefs = otherEntity.getReferences(sReferenceType);

        if (!sShotReqToCCRefs.isEmpty()) {
            for (var p = 0; p < sShotReqToCCRefs.size(); p++) {
                if (sShotReqToCCRefs.get(p)) {
                    sShotReqToCCRefs.get(p).delete();
                }
            }
        }

        if (!((otherEntity.getWorkflowInstanceByID("wf_ShortRequestLifeCycle")) == null)) {
            otherEntity.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").delete("");
        }

        var sReferencingCCs = new java.util.ArrayList();
        sReferencingCCs.addAll(otherEntity.getReferencedByProducts());
        if (!sReferencingCCs.isEmpty()) {
            for (var i = 0; i < sReferencingCCs.size(); i++) {
                var refCC = sReferencingCCs.get(i);
                var oStyleCC = refCC.getSource();
                var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef");
                var sCCToShotReqRefs = oStyleCC.getReferences(sReferenceType);

                if (!sCCToShotReqRefs.isEmpty()) {
                    for (var j = 0; j < sCCToShotReqRefs.size(); j++) {
                        if (sCCToShotReqRefs.get(j)) {
                            if (sCCToShotReqRefs.get(j).getTarget().getID() == otherEntity.getID()) {
                                sCCToShotReqRefs.get(j).delete();
                                oStyleCC.approve();
                            }
                        }
                    }
                }
            }
        }
    });
}

//Run the reference removal logic for all applicable markets of a particular ShotRequest
var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();
var contexts = new Array();
if (sharedMarkets != null) {
	//get context ID for each market from lookup table
  	sharedMarkets.forEach(function (market) {
    		contexts.push(LKT.getLookupTableValue("LKT_MarketDesignationToMarket",market.getSimpleValue()));
  	});
  	contexts.forEach(function (context) {
		removeRefsForShot(node, context);
 	});
}

// Delete the Shot Request after all the references were removed
node.delete();

}