/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SetContentObjectToImageReferences",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Content Object To Image References",
  "description" : "This rule will run on Enty to Ready to Review state of Shot Request workflow",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,logger,lookupTable) {
// function to add a reference
function createLink(source, target, refType, contextID) {
	manager.executeInContext(contextID, function(otherManager) {
		var targetNode = otherManager.getObjectFromOtherManager(target);
		var sourceNode = otherManager.getObjectFromOtherManager(source);
//		if(refType == 'ShotRequestPrimaryImageRef'){
			// first delete link if there is link to target
			var refBy = targetNode.getReferencedBy();
			if(refBy != null){
				var iterator = refBy.iterator(); 
				while(iterator.hasNext()){
					var reference = iterator.next();
					if((reference.getReferenceTypeString() == refType && refType !='PrimaryProductImage' && refType !='VirtualMerchImage') || (reference.getReferenceTypeString() == refType && refType =='PrimaryProductImage' && sourceNode.getObjectType() == 'Style')
					|| (refType =='VirtualMerchImage' && sourceNode.getObjectType() == 'Style')) {
						reference.delete();
					}
				}
		     }
	
		     // now delete link if there is one from source
			var refs = sourceNode.getReferences(manager.getReferenceTypeHome().getReferenceTypeByID(refType));
			if(refs.size() > 0) {
				var refToDelete = refs.get(0);
				refToDelete.delete();
			}
//		}
		// at this point both source and target should not have a reference for the given ref type so build the link
		sourceNode.createReference(targetNode,refType);
	});
}


// function that executes in given context and builds the references
function updateCCRefs(shot, contextID) {
	manager.executeInContext(contextID, function(otherManager) {
        var otherNode = otherManager.getObjectFromOtherManager(shot);
        if (otherNode) {
             //get Content reference
             var contentList = new java.util.ArrayList();
             // get CC
             var ccList = new java.util.ArrayList();
		   var refByList = otherNode.getReferencedByProducts();
		   if (refByList != null) {
		   	var refByListIterator = refByList.iterator();
		   	while(refByListIterator.hasNext()) {
				var ref = refByListIterator.next();
				if(ref.getReferenceTypeString() == "CCToPhotoShotRef") {
					ccList.add(ref.getSource());
				}
				
			}

       		var references = node.getReferences().asList().toArray();
	            for (var j =0 ; j< references.length;j++){
	                var referenceTypeID = references[j].getReferenceType().getID();
	                if(referenceTypeID == 'ShotRequestToExternalAsset'){
	                   contentList.add(references[j].getTarget());
	                }
	            }
		   }
		   
		   for (i = 0; i < ccList.size(); i++) {
            	var cc = ccList.get(i); 
            	// now loop through all Content objects and build reference to CC

            	for (j = 0; j < contentList.size(); j++) {
            		var content = contentList.get(j);
            		var contentType = content.getValue("a_Content_Type_ID").getSimpleValue();
            		if (contentType == "216") {
            			//Create a reference of the Primary Image to the Shot Request object - 
            			// need to discuss because ref type PrimaryImage 
            			// if used to link to CC then it can't be used for Shot request because Shot request is entity and CC is product
					// created new ref type - ContentToPhotoShotPrimaryImageRef
					// check if shot request has primary image and remove it if it does
					//createLink(otherNode,content , "ShotRequestPrimaryImageRef", contextID);
            			
//					var placementValues = otherNode.getValue("a_Site_Placement").getValues();
//					var placementValuesList = "--,";
//					
//				     if(placementValues != null) {
//				     	var placementIterator = placementValues.iterator();
//				     	
//				     	while(placementIterator.hasNext()) {
//				     		placementValuesList = placementValuesList + placementIterator.next().getLOVValue().getID() + ",";
//				     	}
//				     }
					var placementValues = otherNode.getValue("a_Site_Placement").getValue();
					if(placementValues!=null){
						var placementValue = otherNode.getValue('a_Site_Placement').getLOVValue().getID();
					     // check if shot placement contains 5
					     if(placementValue == '5') {
					     	// build link between content and CC
					     	createLink(cc, content, "PrimaryProductImage", contextID);
	
							var virtualMerchCtnt = null;
					     	for (k = 0; k < contentList.size(); k++) {
	                                  var localContent = contentList.get(k);
	                                  var localContentType = localContent.getValue("a_Content_Type_ID").getSimpleValue();
	                                  if (localContentType == "275") {
	                                         virtualMerchCtnt = localContent;
	                                         break;
	                                   }
	  						}
	
					     	// If this Customer Choice has value = 1 for the attribute a_CC_Sort_Order, 
					     	// then set the primary image reference to the parent style object
					     	
	
					     		//logger.info("ELSE BLOCK IF SORT ORDER IS NOT 1");
					     		
					     		/* 2.2.2: If the style has no primary image reference set, create reference of Primary Image to Style
	
								   2.2.3 If this Customer Choice does not have value = 1 for the attribute a_CC_Sort_Order AND Style 
								   has Primary Image, evaluate whether CC has a_CC_Sort_Order value higher than the CC that had 
								   it's Primary Image set to the style. (higher means closer to 1) If the value is higher, 
								   set the reference of Primary Image to the style.
								*/
	
								var styleRefBy = cc.getParent().getReferences().asList();
								var styleHasPrimary = false;
								var primaryImageContent;
								if(styleRefBy != null){
									var itr = styleRefBy.iterator(); 
									while(itr.hasNext()){
										var ref = itr.next();
										if(ref.getReferenceTypeString() == "PrimaryProductImage" && ref.getTarget() != null) {
											styleHasPrimary = true;
											primaryImageContent = ref.getTarget();
											//logger.info("primaryImageContent "+primaryImageContent);
										}
									}
									if(styleHasPrimary) {
										// evaluate and compare sort order
										//var otherCC = primaryImageContent.getReferencedBy(manager.getReferenceTypeHome().getReferenceTypeByID("PrimaryProductImage"));
										var reference = primaryImageContent.getReferencedBy().toArray();
										var otherCC;									
										for(var m = 0 ; m < reference.length; m++){
											referenceTypeId = reference[m].getReferenceType().getID();
											var tempCC = reference[m].getSource();
											//log.info("tempCC "+tempCC);
											referenceTypeObject = tempCC.getObjectType().getID();										
											if(referenceTypeId == 'PrimaryProductImage' && referenceTypeObject == 'CustomerChoice'){
												otherCC = reference[m].getSource();	
												//log.info("otherCC "+otherCC);										
											}
										}
										if(otherCC != null) {
											
											var otherSortOrder = parseInt(otherCC.getValue("a_CC_Sort_Order").getSimpleValue());
											var currSortOrder = parseInt(cc.getValue("a_CC_Sort_Order").getSimpleValue());
											if(currSortOrder < otherSortOrder) {
												
												createLink(cc.getParent(),content, "PrimaryProductImage", contextID);
												if(virtualMerchCtnt!=null){
													createLink(cc.getParent(), virtualMerchCtnt, "VirtualMerchImage", contextID);
												}
											}
										}
										else{
											//If there is no CC referenced to Style's previous asset then add the PrimaryProductImage same as of CC.
											if(virtualMerchCtnt!=null){
												createLink(cc.getParent(),virtualMerchCtnt, "VirtualMerchImage", contextID);
											}
											createLink(cc.getParent(),content, "PrimaryProductImage", contextID);
											
										}
									} 
									else {
										if(virtualMerchCtnt!=null){
											createLink(cc.getParent(),virtualMerchCtnt, "VirtualMerchImage", contextID);
										}
										createLink(cc.getParent(),content,"PrimaryProductImage", contextID);
									}	
							   }
					    }
					     //if the site Placement is different
					     if(placementValue == '220') {
				     		createLink(cc,content,  "AV1", contextID);
				     	}
				     	if(placementValue == '221') {
				     		createLink(cc,content,  "AV2", contextID);
				     	}
				     	if(placementValue == '222') {
				     		createLink(cc,content,  "AV3", contextID);
				     	}
				     	if(placementValue == '223') {
				     		createLink(cc,content,  "AV4", contextID);
				     	}
				     	if(placementValue == '224') {
				     		createLink(cc,content,  "AV5", contextID);
				     	}
				     	if(placementValue == '225') {
				     		createLink(cc,content,  "AV6", contextID);
				     	}
				     	if(placementValue == '226') {
				     		createLink(cc,content,  "AV7", contextID);
				     	}
				     	if(placementValue == '227') {
				     		createLink(cc,content,  "AV8", contextID);
				     	}
				     	if(placementValue == '228') {
				     		createLink(cc,content,  "AV9", contextID);
				     	}
				     	if(placementValue == '229') {
				     		createLink(cc,content,  "AV10", contextID);
				     	}
				     	if(placementValue == '230') {
				     		createLink(cc,content,  "AV11", contextID);
				     	}
				    } 
            		}
            		//if content type is 12 
            		else if (contentType == "12") {
            			// Create a "Swatch" reference to the Shot Request object
					// Create  a "Swatch" reference to the Customer Choice object (that the Shot Request was on)
            			createLink(otherNode,content, "ShotRequestSwatchRef", contextID);
            			createLink(cc,content, "Swatch", contextID);
            			
            		} 
            		//if content type is 277
            		else if (contentType == "277") {
            			// Create a "Video" reference to the  Shot Request Object
					// Create a "Video" reference to  the Customer Choice object (that the Shot Request was on)
					createLink(otherNode,content, "ShotRequestVideoRef", contextID);
            			createLink(cc,content, "Video", contextID);
            		}
            		else if (contentType == "275") {
            			createLink(cc, content, "VirtualMerchImage", contextID);
            		}
            	}
		   }
         }
    });
}

// first grab shared markets to see which contexts to run this in
//As part of 7564 - Made below changes as Context Agnostic with help of lookupTable LKT_MarketDesignationToMarket
var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();
var contexts = new Array();
if (sharedMarkets != null) {
	//get context ID for each market from lookup table
  	sharedMarkets.forEach(function (market) {
    		contexts.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket",market.getSimpleValue()));
  	});
  	contexts.forEach(function (context) {
		updateCCRefs(node, context);
 	});
}
}