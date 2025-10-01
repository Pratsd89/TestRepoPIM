/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_copyShotRequestToSecondaryStyle",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Merge Shot Request",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_removeBidirectionalReferences"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_createBidirectionalReference"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "LOG",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "SR_REF",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MRG_STYLE",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MergedStylesRef",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "MANAGER",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "PP_REF",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (NODE,LOG,SR_REF,MRG_STYLE,MANAGER,PP_REF) {
//commenting this code as merged style refernce is no longer maintained PPIM-15199

// Assets reference types
/*var references    = NODE.getReferences(MRG_STYLE);
var isPrimary     = isPrimaryStyle(NODE);
var hasReferences = hasStyleReferences(NODE);*/


/**
 * PPIM-4123: Merging shot request. 
 * ------------------------------------
 * 1.- Checks if mergin shot reques is needed
 * 2.- Set primary and secondary style
 * 3.- Copy references from CC under primary Style to CC under secondary Style. 
 * 4.- Existing secondary shot request will remain, but shared photos will be replaced by primary Style shot request. 
 * 5.- If primary shot request is removed, it should remove the secondary one. 
 */
/* if(hasReferences && isPrimary){ 	  	
 
 	// 1.- Check if shot requests will be shared
	if(needToMergeShotRequest(NODE)){	
		
		for (var k = 0; k < references.size(); k++){
					
			var ccShotMap = new java.util.HashMap(); 			// Map => [CC Name : {Shot Request IDs}]
			var assetMap  = new java.util.HashMap();			// Map => [Position : {Photo Shot Reference}]
			var oldAssetsMap = new java.util.LinkedHashMap();		// Map => [Position : {Photo Shot Reference}] 
			var newAssetsMap = new java.util.LinkedHashMap();	
			
			var assetRefs = references.get(k).getTarget().getAssetReferences().keySet().toArray();
				
			// 2.- Identify primary and secondary style	
			var secondaryStyleID; 
			var primaryStyleID  ;
			var primaryStyle;
			var secondaryStyle;	
			
	
			primaryStyle 	  = NODE;
			primaryStyleID   = NODE.getID();
			secondaryStyleID = references.get(k).getTarget().getID();			
			secondaryStyle   = getSecondaryStyle(references.get(k), MANAGER);	
							
						
			
			// Change primary photo for style
			setPrimaryPhotoToSecondaryStyle(primaryStyle, secondaryStyle, PP_REF);

			// Get all CC Shot Request from primary Style
			var primaryCCs = primaryStyle.getChildren().toArray();
			var secondaryCCs = secondaryStyle.getChildren().toArray();			
			

			// Loop over all CC under the primary Styles to get populated asset
			for(cc in primaryCCs){		
				var cc = primaryCCs[cc];		
				var asset = getPopulatedAsset(cc);
				newAssetsMap.putAll(asset);
				var childRef = cc.getReferences(SR_REF).toArray();
				var primaryShots = new java.util.ArrayList();
				for(ind in childRef){
					primaryShots.add(childRef[ind].getTarget());
				}
				ccShotMap.put(cc.getName(),primaryShots);		
			}
			
			for(var cc in secondaryCCs){
				var asset = getPopulatedAsset(secondaryCCs[cc]);
				oldAssetsMap.putAll(asset);
				
				if(!ccShotMap.containsKey(secondaryCCs[cc].getName())){	
					continue;				
				}
				// Get shot request from map
				var primaryShots  = ccShotMap.get(secondaryCCs[cc].getName());	
		
				// Create a new reference for each shot request
				for(var i = 0; i<primaryShots.size(); i++){		
					try{	
						secondaryCCs[cc].createReference(primaryShots.get(i),SR_REF);
					}catch(e){
						// Ref repeated, do not create. 
					}
				}		
			}	
	
			var secondaryReferences = secondaryStyle.getReferences(SR_REF).toArray();
			for (var i in secondaryReferences){
				if((secondaryReferences[i].getTarget()).equalsIgnoreCase(primaryStyleID)){		
					secondaryStyle.createReference(secondaryReferences[i].getTarget(),MRG_STYLE);
					
				}
			}
		
			
			// Before replacingprimaryCCs
			for(var cc in primaryCCs){	
				for(var j in secondaryCCs){	
					var primaryCCName = primaryCCs[cc].getName();
					var secondaryCCName = secondaryCCs[j].getName();
					if(primaryCCName!= null && secondaryCCName !=null && (primaryCCName.equalsIgnoreCase(secondaryCCName))){					
						replaceAsset(newAssetsMap,oldAssetsMap, secondaryCCs[j], primaryCCs[cc], secondaryCCs[j]);
					}
				}		
			}		
		}
	
	
	
	
	}
}else{
	if(!hasReferences){
		NODE.getValue('a_isPrimaryStyle').setSimpleValue('');
		NODE.getValue('a_needToMerge').setSimpleValue('');
	}
}

*/

/**
 * @return // Map => [CC Name : {Shot Request Target}]
 */
function getPopulatedAsset(cc){	
	var assetMap = new java.util.LinkedHashMap();
	var assetRefs = cc.getAssetReferences().keySet().toArray();
				
	for(var i in assetRefs){			
		var ref = assetRefs[i];	
		if(cc.getReferences(ref).toArray()[0]!= null){			
			var k = ref.getName();
		 	var v = cc.getReferences(ref).toArray()[0].getTarget();			 
		 	assetMap.put(k,v);
		}		
	}
	return assetMap;
}

/**
 * Loop over populated secondary assets, if it is present in primary assets
 * it will be replaced. 
 */
function replaceAsset(primaryAssets, secondaryAssets,cc, primaryCC,secondaryCC){
	var primaryKeys = primaryAssets.keySet().toArray();	
	var secondaryKeys = primaryAssets.keySet().toArray();	
	var assetRefs = primaryCC.getAssetReferences().keySet().toArray();

	for(var i in primaryKeys){
		for(var j in assetRefs){				
				if(assetRefs[j].getName().equalsIgnoreCase(primaryKeys[i])){	
					if(cc.getReferences(assetRefs[j]).toArray()[0] == null){
						cc.createReference(primaryAssets.get(secondaryKeys[i]), assetRefs[j])		
					}else{
						cc.getReferences(assetRefs[j]).toArray()[0].setTarget(primaryAssets.get(secondaryKeys[i]));	
					}
				}
			}
	}	

	var assetRefs2 = secondaryCC.getAssetReferences().entrySet();
	var assetRefs1 = primaryCC.getAssetReferences().entrySet().iterator();
	while(assetRefs1.hasNext()){
		var item1 = assetRefs1.next();
		if(item1.getValue().size()>0){	
			var target1 = item1.getValue().get(0).getTarget();
			var key1 = item1.getKey();
			if(secondaryCC.getReferences(key1).get(0)>0){
				secondaryCC.createReference(target1, key1)		
			}else{
			
				secondaryCC.getReferences(key1).get(0).setTarget(target1);	
			}
		}
	}
	
}

/**
 * Check if the style node has references to other Styles. 
 */
function hasStyleReferences(styleNode){
	return styleNode.getReferences(MRG_STYLE).toArray()[0] != null;
}

/**
 * Check if this style has to merge shot request
 */
function needToMergeShotRequest(NODE){
	return (NODE.getValue('a_needToMerge') != null && NODE.getValue('a_needToMerge').getSimpleValue()!=null && NODE.getValue('a_needToMerge').getSimpleValue().equalsIgnoreCase('Yes'))?true:false;
}

/**
 * Check if this style is the primary style for shot request
 */
function isPrimaryStyle(styleNode){

	return  (styleNode.getValue('a_isPrimaryStyle').getSimpleValue() != null && styleNode.getValue('a_isPrimaryStyle').getSimpleValue().equalsIgnoreCase("Yes"))?true:false;
}

function getSecondaryStyle(reference, MANAGER){
	var secondaryStyleID = reference.getTarget().getID();		
	return MANAGER.getProductHome().getProductByID(secondaryStyleID);		
}
/**
 * Gets primary photo target from primary style
 */
 
function setPrimaryPhotoToSecondaryStyle(primaryStyle,secondaryStyle, PP_REF){

	var primaryPhotoTarget = primaryStyle.getAssetReferences().getByTypeID(PP_REF).get(0).getTarget();
	var secondaryPhotoTarget = secondaryStyle.getAssetReferences().getByTypeID(PP_REF);
	if(secondaryPhotoTarget.size()>0){
		secondaryPhotoTarget = secondaryPhotoTarget.get(0);	
		if (secondaryPhotoTarget.getTarget() == null){
			secondaryStyle.createReference(primaryPhotoTarget,PP_REF)	
		}else{
			secondaryPhotoTarget.setTarget(primaryPhotoTarget);		
		}
	
	
	
	}
	
}


}