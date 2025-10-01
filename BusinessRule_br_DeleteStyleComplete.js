/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DeleteStyleComplete",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeleteStyleComplete",
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToPhotoShotRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "PrimaryProductImageRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV1RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV1",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV2RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV2",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV3RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV3",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV4RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV4",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV5RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV5",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV6RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV6",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV7RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV7",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV8RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV8",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV9RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV9",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "SwatchRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Swatch",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "VideoRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Video",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestSwatchRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestSwatchRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestToExternalAssetType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToExternalAsset",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestVideoRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestVideoRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestPrimaryImageRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestPrimaryImageRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV10RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV10",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV11RefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV11",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,logger,CCToPhotoShotRefType,PrimaryProductImageRefType,AV1RefType,AV2RefType,AV3RefType,AV4RefType,AV5RefType,AV6RefType,AV7RefType,AV8RefType,AV9RefType,SwatchRefType,VideoRefType,ShotRequestSwatchRefType,ShotRequestToExternalAssetType,ShotRequestVideoRefType,ShotRequestPrimaryImageRefType,AV10RefType,AV11RefType) {
/*
 * check if the object type
 * if node is style 
 * 	get all child CCs and repeatedly process delete CC block
 * 	delete style
 * if node is CC
 * 	get all child SKUs and repeatedly process delete sku block
 * 	get all referenced shot requests and process delete shot request block
 * 	delete CC
 * if node is sku
 * 	delete sku
 * if node is shot request
 * 	get all associated external assets and process delete external asset block
 * 	delete shot request
 * if node is external ref. asset
 * 	delete external ref. asset
 */

var hsRefTargetNodes = new java.util.HashSet();
var objType = node.getObjectType().getName();
if(objType == "Style")
{
	deleteStyle(node);
}
else if(objType = "CustomerChoice")
{
	deleteCC(node);
}
else if(objType = "SKU")
{
	deleteSKU(node);
}
else if(objType = "ProductShotRequest")
{
	deleteShotRequest(node);
}
else if(objType = "ExternalStoredDAMAsset")
{
	deleteReferenceTarget(node);
}

function deleteNodeFromWorkflowInAllContexts(node, wfID)
{
	var contextHome = manager.getContextHome();
	var contexts = contextHome.getContexts();
	var itr = contexts.iterator();
	while(itr.hasNext())
	{
		var ctx = itr.next().getID();
		//logger.info("Running for " + ctx + " Context");
		manager.executeInContext(ctx, function(manager)
		{
			var curContextNode;
			if(node.getObjectType().isProductType())
			{
				curContextNode = manager.getProductHome().getProductByID(node.getID());
			}
			if(node.getObjectType().isEntityType())
			{
				curContextNode = manager.getEntityHome().getEntityByID(node.getID());
			}
			if(!((curContextNode.getWorkflowInstanceByID(wfID)) == null))
			{
				curContextNode.getWorkflowInstanceByID(wfID).delete("");
			}
		});
	}
}

function deleteAllRefInAllContexts(node, refObjType)
{
	logger.info("deleteAllRefInAllContexts invoked for " + node.getObjectType().getName() + " " + node.getID() + " for referencetype " + refObjType.getName());
	var contextHome = manager.getContextHome();
	var contexts = contextHome.getContexts();
	var itr = contexts.iterator();
	while(itr.hasNext())
	{
		var ctx = itr.next().getID();
		logger.info("Running for " + ctx + " Context");
		manager.executeInContext(ctx, function(manager){
			logger.info("deleteAllRef invoked for " + node.getObjectType().getName() + " " + node.getID() + " for referencetype " + refObjType.getName() + " in context " + manager.getCurrentContext().getName());
			var curContextNode;
			if(node.getObjectType().isProductType())
			{
				curContextNode = manager.getProductHome().getProductByID(node.getID());
			}
			if(node.getObjectType().isEntityType())
			{
				curContextNode = manager.getEntityHome().getEntityByID(node.getID());
			}
			var allRefs = curContextNode.getReferences(refObjType);
			logger.info("Total refs " + allRefs.size());
			for (var iRefCounter = 0; iRefCounter < allRefs.size(); iRefCounter++) 
			{
				hsRefTargetNodes.add(allRefs.get(iRefCounter).getTarget());
				allRefs.get(iRefCounter).delete();	 
			}
		});
	}
}

function deleteReferenceTarget(targetRefNode)
{
	logger.info("deleteReferenceTarget invoked for target " + targetRefNode.getID());
	var contextHome = manager.getContextHome();
	var contexts = contextHome.getContexts();
	var itr = contexts.iterator();
	while(itr.hasNext())
	{
		var ctx = itr.next().getID();
		//logger.info("Running for " + ctx + " Context");
		manager.executeInContext(ctx, function(manager){
			var curContextNode;
			if(targetRefNode.getObjectType().isProductType())
			{
				curContextNode = manager.getProductHome().getProductByID(targetRefNode.getID());
			}
			if(targetRefNode.getObjectType().isEntityType())
			{
				curContextNode = manager.getEntityHome().getEntityByID(targetRefNode.getID());
			}
			
			var refBy = targetRefNode.getReferencedBy();
			var refByItrtr = refBy.iterator();
			while(refByItrtr.hasNext())
			{
				var refByObj = refByItrtr.next();
				logger.info("deleting reference with source " + refByObj.getSource().getID() + " target " + refByObj.getTarget().getID());
				refByObj.delete();
			}
		});
	}
	targetRefNode.delete();
}

//this is dup for deleteAllRefInAllContexts(node, refObjType)
function deleteAllRefExternalRefDAMAssets(node, refObjType)
{
	logger.info("deleteAllRefExternalRefDAMAssets invoked for "+ node.getObjectType().getName() + 
			" node " + node.getID() + " asset referene type " + refObjType.getName());
	deleteAllRefInAllContexts(node, refObjType); 
	/*var nodeExtRefDAMAssetRefs = node.getReferences(refObjType);
	for (var iExtRefDAMAssetCounter = 0; iExtRefDAMAssetCounter < nodeExtRefDAMAssetRefs.size(); iExtRefDAMAssetCounter++) 
	{
		hsRefTargetNodes.add(nodeExtRefDAMAssetRefs.get(iExtRefDAMAssetCounter).getTarget());
		nodeExtRefDAMAssetRefs.get(iExtRefDAMAssetCounter).delete();
		
	}*/
}

function deleteSKU(skuNode)
{
	logger.info("deleteSKU invoked for SKU " + skuNode.getID());
	deleteNodeFromWorkflowInAllContexts(skuNode, "wf_NewSKUEnrichment");
	deleteNodeFromWorkflowInAllContexts(skuNode, "wf_NewSKUEnrichmentCanada");
	deleteNodeFromWorkflowInAllContexts(skuNode, "wf_StyleMaintenanceWorkflow");
	skuNode.delete();
	//should this be var deletedNode = skuNode.delete();
	//deletedNode.approve();
}

function deleteShotRequestInAllContext(ccNodeForShotReq)
{
	logger.info("deleteShotRequestInAllContext invoked for CC " + ccNodeForShotReq.getID());
	var contextHome = manager.getContextHome();
	var contexts = contextHome.getContexts();
	var itr = contexts.iterator();
	while(itr.hasNext())
	{
		var ctx = itr.next().getID();
		//logger.info("Running for " + ctx + " Context");
		manager.executeInContext(ctx, function(manager){
			var curContextNode = manager.getProductHome().getProductByID(ccNodeForShotReq.getID());
			var allShotReqRefs = curContextNode.getReferences(CCToPhotoShotRefType);
			logger.info("Total refs " + allShotReqRefs.size());
			for (var iRefCounter = 0; iRefCounter < allShotReqRefs.size(); iRefCounter++) 
			{
				deleteShotRequest(allShotReqRefs.get(iRefCounter).getTarget());	 
			}
		});
	}
}

function deleteShotRequest(shotRequestNode)
{
	logger.info("deleteShotRequest invoked for ShotRequest " + shotRequestNode.getID());
	deleteNodeFromWorkflowInAllContexts(shotRequestNode, "wf_ShortRequestLifeCycle");
	deleteAllRefExternalRefDAMAssets(shotRequestNode, ShotRequestPrimaryImageRefType);
	deleteAllRefExternalRefDAMAssets(shotRequestNode, ShotRequestSwatchRefType);
	deleteAllRefExternalRefDAMAssets(shotRequestNode, ShotRequestVideoRefType);
	deleteAllRefExternalRefDAMAssets(shotRequestNode, ShotRequestToExternalAssetType);
}
function deleteCC(ccNode)
{
	logger.info("deleteCC invoked for CC " + ccNode.getID());
	deleteShotRequestInAllContext(ccNode);
	deleteAllRefInAllContexts(ccNode,CCToPhotoShotRefType ); 
	
	
	
	var childSKUs = ccNode.getChildren();
	for (var iSKUCounter = 0; iSKUCounter < childSKUs.size(); iSKUCounter++) 
	{
		deleteSKU(childSKUs.get(iSKUCounter));	 
	}
	deleteNodeFromWorkflowInAllContexts(ccNode, "wf_CCEnrichment");
	deleteNodeFromWorkflowInAllContexts(ccNode, "wf_CCEnrichmentCanada");
	deleteNodeFromWorkflowInAllContexts(ccNode, "wf_StyleMaintenanceWorkflow");
	deleteAllRefExternalRefDAMAssets(ccNode, PrimaryProductImageRefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV1RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV2RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV3RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV4RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV5RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV6RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV7RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV8RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV9RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV10RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, AV11RefType);
	deleteAllRefExternalRefDAMAssets(ccNode, SwatchRefType);
	deleteAllRefExternalRefDAMAssets(ccNode, VideoRefType);
	deleteAllRefExternalRefDAMAssets(ccNode, VideoRefType);
	
	ccNode.delete();
	//should this be var deletedNode = ccNode.delete();
	//deletedNode.approve();
	
}
function deleteStyle(styleNode)
{
	logger.info("deleteStyle invoked for Style " + styleNode.getID());
	var childCCs = styleNode.getChildren();
	for(var iCCCounter = 0; iCCCounter < childCCs.size();iCCCounter++)
	{
		deleteCC(childCCs.get(iCCCounter));
	}
	deleteNodeFromWorkflowInAllContexts(styleNode, "wf_NewStyleEnrichment");
	deleteNodeFromWorkflowInAllContexts(styleNode, "wf_NewStyleEnrichmentCanada");
	deleteNodeFromWorkflowInAllContexts(styleNode, "wf_StyleMaintenanceWorkflow");
	deleteAllRefExternalRefDAMAssets(styleNode, PrimaryProductImageRefType);
	var extRefItrtr = hsRefTargetNodes.iterator();
	while(extRefItrtr.hasNext())
	{
		deleteReferenceTarget(extRefItrtr.next());
	}
	styleNode.delete();
	//should this be var deletedNode = styleNode.delete();
	//deletedNode.approve();
}


}