/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_shotRequestInbound",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request Inbound Business Action",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_PhotoShot",
    "libraryAlias" : "photoLib"
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
    "alias" : "stepManager",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotReqXternalAsset",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToExternalAsset",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,LKT,ShotReqXternalAsset,photoLib) {
/* PPIM-10466  - Refactored the Code to implement the Context Agnostic Logic based on a_Shared_Markets using LKT : LKT_MarketDesignationToMarket
   			- Removed the CC outbound binds and updating the attribute "a_main_last_modified_date" at CC level to publish to Downstream.
 			- Existing functionality not altered.	*/		

// PPIM-3741 - CC outbound notification should be triggered for every response from AssetHub
function publishCC(node, stepManager) {
	
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
    	var refByList = node.getReferencedByProducts();
    	var sharedMarket = node.getValue("a_Shared_Markets").getSimpleValue();

    	if ((refByList != null) && (sharedMarket != null)) {
        	var refByListIterator = refByList.iterator();
        	while (refByListIterator.hasNext()) {
            	var ref = refByListIterator.next();
            	if (ref.getReferenceTypeString() == "CCToPhotoShotRef") {
                	//Trigger DGL Outbound for reference CC
                	ref.getSource().getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
            	}
        	}
    	}
}
//
//function updateDamUrl(node){
//	var DAMassetAttr = node.getValue("a_DAM_Asset_Paths");
//	var DAMassetRaw = DAMassetAttr ? DAMassetAttr.getSimpleValue() : null;
//	var DAMasset = DAMassetRaw ? DAMassetRaw.replace("<multisep/>", ";") : "";
//	var [contentTypeID, assetLink] = DAMasset.split(";");
//
//	var refs = node.queryReferences(ShotReqXternalAsset).asList(50);
//	refs.forEach(function(ref){
//		var asset = ref.getTarget();
//		assetContentTypeID = asset.getValue("a_Content_Type_ID").getSimpleValue();
//		if (assetContentTypeID == contentTypeID){
//			asset.getValue("a_DAM_Asset_URL").setSimpleValue(assetLink);
//			return;
//		}
//	});
//	return;
//}

function updateDamUrl(node) {
    var DAMassetAttr = node.getValue("a_DAM_Asset_Paths");
    var DAMassetRaw = DAMassetAttr ? DAMassetAttr.getSimpleValue() : null;
    var DAMasset = DAMassetRaw ? DAMassetRaw.replace("<multisep/>", ";") : "";

    var assetMap = {};
    DAMasset.split(";").forEach(function(pair) {
        var [contentTypeID, assetLink] = pair.split("-");
        if (contentTypeID && assetLink) {
            assetMap[contentTypeID] = assetLink;
        }
    });

    var refs = node.queryReferences(ShotReqXternalAsset).asList(50);
    refs.forEach(function(ref) {
        var asset = ref.getTarget();
        var assetContentTypeID = asset.getValue("a_Content_Type_ID").getSimpleValue();
        if (assetMap.hasOwnProperty(assetContentTypeID)) {
            asset.getValue("a_DAM_Asset_URL").setSimpleValue(assetMap[assetContentTypeID]);
            log.info("hi");
        }
    });
    log.info("success");
    return;
}


var shotRequestLifeCycleStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
var shotRequestLifeCycleWorkflow = "wf_ShortRequestLifeCycle"

if (node.isInState(shotRequestLifeCycleWorkflow, "Submitted")) {
    var wf = node.getWorkflowInstanceByID(shotRequestLifeCycleWorkflow);
    wf.getTaskByID("Submitted").triggerByID("Ready_to_Review", "Photoshot Inbound Based Ready to Review Invocation");
} else if (node.isInState(shotRequestLifeCycleWorkflow, "Rejected")) {
    var wf = node.getWorkflowInstanceByID(shotRequestLifeCycleWorkflow);
    wf.getTaskByID("Rejected").triggerByID("Rejected_Needs_Approval", "Photoshot Inbound Based Rejected Needs Approval Invocation");
} else if (node.isInState(shotRequestLifeCycleWorkflow, "Ready_to_Review")) {
    /* PPIM-1799
     If shot request has ShotRequestVideoRef, remove it and also remove Video reference on the CC referenced in CCtoPhotoShotRef
     If that shot request has ShotRequestSwatchRef, remove it and also remove Swatch reference on the CC referenced in CCtoPhotoShotRef.
     Then the rest of the logic in the inbound should run, creating ShotRequestToExternalAsset from shot request to the new Assets. 
     Run the SetContentObjectToImageReferences rule to rebuild the references between CC & Assets

    Removal of old links and rebuilding new are being handled by the updateContentReferencesForShotAndCC function in library so just calling that here.
     */

    var shotApproved = false;
    var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();
    if (sharedMarkets != null) {

        sharedMarkets.forEach(function(market) {
            var marketfromShotSharedMarket = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", market.getSimpleValue());
            photoLib.updateContentReferencesForShotAndCC(node, stepManager, marketfromShotSharedMarket, shotApproved);
        })
        updateDamUrl(node);
        // PPIM-3741 - CC outbound notification should be triggered for every response from AssetHub
        publishCC(node, stepManager);
    }

} else if (shotRequestLifeCycleStatus == "Approved" || shotRequestLifeCycleStatus == "Complete") {
    /* PPIM-1799
     If shot request has a_Shot_Request_Lifecycle_Status = Approved or Complete.
    Check if the CC referenced in CCtoPhotoShotRef is Approved.
    Same steps 1- 4 should happen.
    Auto approve the shot request and the new assets
    Run the SetContentObjectToImageReferences rule to rebuild the references between CC & Assets
    If the CC was approved from step 1, then approve the asset references impacted by step 4. If not, the CC should not be approved then do nothing.
     */
    var shotApproved = true;
    var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();

    if (sharedMarkets != null) {

        sharedMarkets.forEach(function(market) {
            var marketfromShotSharedMarket = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", market.getSimpleValue());
            photoLib.updateContentReferencesForShotAndCC(node, stepManager, marketfromShotSharedMarket, shotApproved);
        })
        updateDamUrl(node);
        // PPIM-3741 - CC outbound notification should be triggered for every response from AssetHub
        publishCC(node, stepManager);
    }
}
}