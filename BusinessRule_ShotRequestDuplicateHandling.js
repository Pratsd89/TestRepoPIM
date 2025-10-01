/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestDuplicateHandling",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Shot Request Duplicate Handling",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,log,step,shot,assethubqueueUS,assethubqueueCA,assethubqueueJP,lookupTable) {
try{
	//var valShotReqType = node.getValue('a_Shot_Request_Type').getSimpleValue();
	var valShotCode = node.getValue('a_Shot_Code').getSimpleValue();
	var valShotType = node.getValue('a_Shot_Type').getSimpleValue();
	var valSharedMarket = node.getValue('a_Shared_Markets').getSimpleValue();
	var valSitePlacement = node.getValue('a_Site_Placement').getSimpleValue();
	
	/*if(valShotReqType == null || valShotReqType == '')
	{
		throw "<Mandatory Attribute Shot Request Type is Missing>";
	}
	else */
	if (valShotCode == null || valShotCode == '')
	{
		throw "<Mandatory Attribute Shot Code is Missing>";
	}
	else if (valShotType == null || valShotType == '')
	{
		throw "<Mandatory Attribute Shot Type is Missing>";
	}
	else if (valSharedMarket == null || valSharedMarket == '')
	{
		throw "<Mandatory Attribute Shared Markets is Missing>";
	}
	else if (valSitePlacement == null || valSitePlacement == '')
	{
		throw "<Mandatory Attribute Site Placement is Missing>";
	}
	// //Assigning lgeacy CC Number to Styling Pieces CC ref
	// var ar_shotToStylingReferences = node.getReferences().asList();
	// 							for(var a_count1=0;a_count1<ar_shotToStylingReferences.size();a_count1++){
	// 							var ar_referenceTypeID = ar_shotToStylingReferences.get(a_count1).getReferenceType().getID();
	// 							if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
	// 								var a_oCC1 = ar_shotToStylingReferences.get(a_count1).getTarget();
	// 								var ccNum = a_oCC1.getValue("a_CC_Number").getSimpleValue();
	// 								if(ccNum != null || ccNum !=''){
	// 								ar_shotToStylingReferences.get(a_count1).getValue("a_Styling_Piece_CC_Number").setSimpleValue(ccNum);
	// 								}
	// 								}
	// 							}
	
	
	//-----StartofOldValueAdditionBlock-----
	var valOldSharedMarket = node.getValue('a_Shared_Markets').getSimpleValue();
	var valOldSharedMarketcurr = node.getValue('a_Old_Shared_Markets').getSimpleValue();
	if(valOldSharedMarketcurr != null && valOldSharedMarketcurr != ''){
	node.getValue('a_Old_Shared_Markets').deleteCurrent();
	node.getValue('a_Old_Shared_Markets').setSimpleValue(valOldSharedMarket);
	}
	else{
	node.getValue('a_Old_Shared_Markets').setSimpleValue(valOldSharedMarket);
	}
	//--------------------
	var valOldShotIns = node.getValue('a_Shot_Instructions').getSimpleValue();
	var valOldShotInscurr = node.getValue('a_Old_Shot_Instructions').getSimpleValue();
	if(valOldShotInscurr != null || valOldShotInscurr != ''){
	node.getValue('a_Old_Shot_Instructions').deleteCurrent();
	node.getValue('a_Old_Shot_Instructions').setSimpleValue(valOldShotIns);
	}
	else{
	node.getValue('a_Old_Shot_Instructions').setSimpleValue(valOldShotIns);
	}
	//--------------------
	var valOldShotType = node.getValue('a_Shot_Type').getSimpleValue();
	var valOldShotTypecurr = node.getValue('a_Old_Shot_Type').getSimpleValue();
	if(valOldShotTypecurr != null || valOldShotTypecurr != ''){
	node.getValue('a_Old_Shot_Type').deleteCurrent();
	node.getValue('a_Old_Shot_Type').setSimpleValue(valOldShotType);
	}
	else{
	node.getValue('a_Old_Shot_Type').setSimpleValue(valOldShotType);
	}
	//--------------------
	var valOldSitePlac = node.getValue('a_Site_Placement').getSimpleValue();
	var valOldSitePlaccurr = node.getValue('a_Old_Site_Placement').getSimpleValue();
	if(valOldSitePlaccurr != null || valOldSitePlaccurr != ''){
	node.getValue('a_Old_Site_Placement').deleteCurrent();
	node.getValue('a_Old_Site_Placement').setSimpleValue(valOldSitePlac);
	}
	else{
	node.getValue('a_Old_Site_Placement').setSimpleValue(valOldSitePlac);
	}
	//-----------------------
	var valOldShotCode = node.getValue('a_Shot_Code').getSimpleValue();
	var valOldShotCodecurr = node.getValue('a_Old_Shot_Code').getSimpleValue();
	if(valOldShotCodecurr != null || valOldShotCodecurr != ''){
	node.getValue('a_Old_Shot_Code').deleteCurrent();
	node.getValue('a_Old_Shot_Code').setSimpleValue(valOldShotCode);
	}
	else{
	node.getValue('a_Old_Shot_Code').setSimpleValue(valOldShotCode);
	}
	
	
	updateSharedMarketBasedOnBrand()
	
	
	//--------------------EndOfOldValueadditionblock--
	//to copy the attributes of the current context to the other context
	var currentContext= step.getCurrentContext().getID();
    //PPIM-7238 - Edit BR to accomodate Japan
	if(currentContext == 'EN_US'){
		otherContext = ['EN_CA','EN_JP'];
	}
	else if(currentContext == 'EN_CA' || currentContext == 'FR_CA'){
		otherContext = ['EN_US','EN_JP'];
	}
    else if(currentContext == 'EN_JP' || currentContext == 'JA_JP'){
		otherContext = ['EN_US','EN_CA'];
	}
	
for(var p = 0 ;p<otherContext.length;p++){
	step.executeInContext(currentContext,function(enContextManager) {	
			var enCurrentProduct = enContextManager.getEntityHome().getEntityByID(node.getID());
			
			var attributeList = ['a_Shot_Code','a_Shot_Type','a_Site_Placement'];
			for(var i = 0 ;i<attributeList.length;i++){
				var enAttributeValue = enCurrentProduct.getValue(attributeList[i]).getSimpleValue();
				step.executeInContext(otherContext[p],function(caContextManager) {
					var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(node.getID());
					caCurrentProduct.getValue(attributeList[i]).setSimpleValue(enAttributeValue);
				})			
			}
			step.executeInContext(otherContext[p],function(caContextManager) {
				var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(node.getID());
				var shotMet1 = caCurrentProduct.getValue('a_Shot_Request_Method').getSimpleValue();
				if (shotMet1!="ASLR" && shotMet1!="Bulk"){
				caCurrentProduct.getValue('a_Shot_Request_Method').setSimpleValue('Manual');
				}
			})	
	})
}
	
	//end of copying attributes code, now checking for duplicate reference code
	
	log.info("Now executing Main Block");
	
	var curr_shotCode = node.getValue('a_Shot_Code').getSimpleValue();
	var curr_shared_market = node.getValue('a_Shared_Markets').getSimpleValue();
	var sReferencingCCs = new java.util.ArrayList();
	var isDuplicate = false;
	
	var referencesArray = [];
	var shotMet2 = node.getValue('a_Shot_Request_Method').getSimpleValue();
		logger.info(shotMet2);
	//This will run only in US & CA contexts. If more contexts are introduced, then this needs to be modified accordingly.
	
	if(node.getReferencedBy().size() == 0 ){
	//PPIM-7238 - Edit BR to accomodate Japan
		if(currentContext == "EN_US"){
			setVisibility("EN_CA");
            setVisibility("EN_JP");
		}else if(currentContext == "EN_CA" || currentContext == "FR_CA"){
			setVisibility("EN_US");
            setVisibility("EN_JP");
		}
        else if(currentContext == "EN_JP" || currentContext == "JA_JP"){
			setVisibility("EN_US");
            setVisibility("EN_CA");
		}
	}else{
		//log.info("In Else Block With Context " + currentContext);
		setVisibility(currentContext);
	}
	
	step.executeInContext("EN_CA",function(caContextManager) {
		var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(node.getID());
		var ar_shotToCCReferencesNew = caCurrentProduct.getReferences().asList();
		for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
			var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
			if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
				var a_shotToCCReferencesNew = caCurrentProduct.getReferences().asList();
				for(var a_count=0;a_count<a_shotToCCReferencesNew.size();a_count++){
					var a_referenceTypeID = a_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
					if(a_referenceTypeID == 'OldShotRequestToStylingPieceCCRef'){
						a_shotToCCReferencesNew.get(a_count).delete();             
					}
				}
				break;
			}
		}
		
		var ar_shotToCCReferencesNew = caCurrentProduct.getReferences().asList();
		for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
			var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
			if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){		
				var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();			
				var a_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
				var a_cc_num_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_CC_Number").getSimpleValue();
				var a_newRef = caCurrentProduct.createReference(a_oCC, "OldShotRequestToStylingPieceCCRef");
				a_newRef.getValue('a_Styling_Piece_Instructions').setSimpleValue(a_val);							
				a_newRef.getValue('a_Styling_Piece_CC_Number').setSimpleValue(a_cc_num_val);							
				
			}
		}
	});
	
	step.executeInContext("EN_US",function(enContextManager) {
		var enCurrentProduct = enContextManager.getEntityHome().getEntityByID(node.getID());
		var ar_shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
		for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
			var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
			if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
				var a_shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
				for(var a_count=0;a_count<a_shotToCCReferencesNew.size();a_count++){
					var a_referenceTypeID = a_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
					if(a_referenceTypeID == 'OldShotRequestToStylingPieceCCRef'){
						a_shotToCCReferencesNew.get(a_count).delete();             
					}
				}
				break;
			}
		}
		var ar_shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
		for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
			var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
			if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
				
				var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
				var a_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
				var a_cc_num_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_CC_Number").getSimpleValue();
				var a_newRef = enCurrentProduct.createReference(a_oCC, "OldShotRequestToStylingPieceCCRef");	
				a_newRef.getValue('a_Styling_Piece_Instructions').setSimpleValue(a_val);							
				a_newRef.getValue('a_Styling_Piece_CC_Number').setSimpleValue(a_cc_num_val);							
				
			}
		}
	});

    //PPIM-7238 - Edit BR to accomodate Japan
	step.executeInContext("EN_JP",function(enContextManager) {
		var enCurrentProduct = enContextManager.getEntityHome().getEntityByID(node.getID());
		var ar_shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
		for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
			var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
			if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
				var a_shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
				for(var a_count=0;a_count<a_shotToCCReferencesNew.size();a_count++){
					var a_referenceTypeID = a_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
					if(a_referenceTypeID == 'OldShotRequestToStylingPieceCCRef'){
						a_shotToCCReferencesNew.get(a_count).delete();             
					}
				}
				break;
			}
		}
		var ar_shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
		for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
			var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
			if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
				
				var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
				var a_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
				var a_cc_num_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_CC_Number").getSimpleValue();
				var a_newRef = enCurrentProduct.createReference(a_oCC, "OldShotRequestToStylingPieceCCRef");	
				a_newRef.getValue('a_Styling_Piece_Instructions').setSimpleValue(a_val);							
				a_newRef.getValue('a_Styling_Piece_CC_Number').setSimpleValue(a_cc_num_val);							
				
			}
		}
	});
		
	
	if(curr_shared_market == 'US'){
	    getReferencesByContext('EN_US',node);
	}
	else if (curr_shared_market == 'CAN'){
	    getReferencesByContext('EN_CA',node);
	}
    //PPIM-7238 - Edit BR to accomodate Japan
    else if (curr_shared_market == 'JPN'){
	    getReferencesByContext('EN_JP',node);
	}
	else if(curr_shared_market.indexOf("US") >= 0 && curr_shared_market.indexOf("CAN") >= 0 && curr_shared_market.indexOf("JPN") >= 0){
	    getReferencesByContext('EN_US',node);
	    getReferencesByContext('EN_CA',node);
        getReferencesByContext('EN_JP',node);
	}
    else if(curr_shared_market.indexOf("US") >= 0 && curr_shared_market.indexOf("CAN") >= 0){
	    getReferencesByContext('EN_US',node);
        getReferencesByContext('EN_CA',node);
	}
    else if(curr_shared_market.indexOf("US") >= 0 && curr_shared_market.indexOf("JPN") >= 0){
	    getReferencesByContext('EN_US',node);
        getReferencesByContext('EN_JP',node);
	}
    else if(curr_shared_market.indexOf("CAN") >= 0 && curr_shared_market.indexOf("JPN") >= 0){
	    getReferencesByContext('EN_CA',node);
        getReferencesByContext('EN_JP',node);
	}
	productReferences = referencesArray;
	for(var j = 0 ;j<productReferences.length;j++){				
		var oldTarget =productReferences[j].getTarget();
		//To Use oldSource at last step of this exercise for CC enrichment workflow transition
		//var oldSource =productReferences.get(j).getSource();
		/*if(oldTarget.getID() == node.getID()){
			log.info("Going To Continue");
			continue;
		}*/
		
		if(oldTarget.getID() != node.getID())
		{
			var old_shotCode = oldTarget.getValue('a_Shot_Code').getSimpleValue();
			var old_lifecycle_status = oldTarget.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
			var old_shared_market = oldTarget.getValue('a_Shared_Markets').getSimpleValue();
			var cc=productReferences[j].getSource();
			
			log.info("Going to check if it's a duplicate node");
			if(old_shotCode == curr_shotCode && old_lifecycle_status == "Submitted" && (curr_shared_market == old_shared_market || (curr_shared_market.contains("US") && old_shared_market.contains("US")) || (curr_shared_market.contains("CAN") && old_shared_market.contains("CAN")) || (curr_shared_market.contains("JPN") && old_shared_market.contains("JPN"))))
			{
				var oldShot=findOldShotAmongDuplicates(oldTarget,node);
				if(oldShot.getID()==node.getID()){
					node=oldTarget
					oldTarget=oldShot
				}

				isDuplicate = true;
				var dupShot = oldTarget;
				
				if(curr_shared_market != old_shared_market){
					oldTarget.getValue('a_Shared_Markets').setSimpleValue(null);
                    	if(curr_shared_market.contains('US') || old_shared_market.contains('US'))
						oldTarget.getValue('a_Shared_Markets').addValue("US");
					if(curr_shared_market.contains('CAN') || old_shared_market.contains('CAN'))
						oldTarget.getValue('a_Shared_Markets').addValue("CAN");
					if(curr_shared_market.contains('JPN') || old_shared_market.contains('JPN'))
						oldTarget.getValue('a_Shared_Markets').addValue("JPN");
					
					var updSharedMarkets = oldTarget.getValue("a_Shared_Markets").getValues().toArray();
					if(updSharedMarkets.length==2)
						createCCToPhotoShotRefAgainstUpdatedSharedMarket(oldTarget,cc);
				}
				var attributes = ['a_Shot_Type','a_Shot_Instructions','a_Site_Placement'];
				var shotMet = oldTarget.getValue('a_Shot_Request_Method').getSimpleValue();
				if (shotMet!="ASLR" && shotMet!="Bulk"){
				oldTarget.getValue('a_Shot_Request_Method').setSimpleValue("Manual");
				}
				//oldTarget.getValue('a_Shot_Request_Status').setSimpleValue("Submitted");
				//oldTarget.getValue('a_Market_PhotoShot_Requested_In').setSimpleValue("US");
			
				log.info("Matched | Updating Attributes")
				for(var  k = 0 ;k<attributes.length;k++){
					var temp = node.getValue(attributes[k]).getSimpleValue();
					oldTarget.getValue(attributes[k]).deleteCurrent();
					oldTarget.getValue(attributes[k]).setSimpleValue(temp);
				}
				
				//Logic to delete 'ShotRequestToStylingPieceCCRef' link on old object and copy the links from new object
				log.info("Matched | Updating Links")
				step.executeInContext("EN_US",function(enContextManager) {	
					var enCurrentProduct = enContextManager.getEntityHome().getEntityByID(node.getID());
					var enOldProduct = enContextManager.getEntityHome().getEntityByID(oldTarget.getID());
					//Delete old links
					var ar_shotToCCReferencesNew = enOldProduct.getReferences().asList();
					for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
						var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
						if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
							
							var a_shotToCCReferencesNew = enOldProduct.getReferences().asList();
							for(var a_count=0;a_count<a_shotToCCReferencesNew.size();a_count++){
								var a_referenceTypeID = a_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
								if(a_referenceTypeID == 'OldShotRequestToStylingPieceCCRef'){
									a_shotToCCReferencesNew.get(a_count).delete();             
								}
							}
							break;
						}
					}
					var shotToCCReferencesOld = enOldProduct.getReferences().asList();
					for(var count=0;count<shotToCCReferencesOld.size();count++){
						var referenceTypeID = shotToCCReferencesOld.get(count).getReferenceType().getID();
						if(referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
							var a_oCC = shotToCCReferencesOld.get(count).getTarget();
							var a_val = shotToCCReferencesOld.get(count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
							var a_cc_num_val = shotToCCReferencesOld.get(count).getValue("a_Styling_Piece_CC_Number").getSimpleValue();
							var a_newRef = enOldProduct.createReference(a_oCC, "OldShotRequestToStylingPieceCCRef");	
							a_newRef.getValue('a_Styling_Piece_Instructions').setSimpleValue(a_val);							
							a_newRef.getValue('a_Styling_Piece_CC_Number').setSimpleValue(a_cc_num_val);
							shotToCCReferencesOld.get(count).delete();             
						}
					}
					
					//Create new links
					//var shotToCCReferencesNew = enOldProduct.getReferences().asList();
					var shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
					for(var count=0;count<shotToCCReferencesNew.size();count++){
						var referenceTypeID = shotToCCReferencesNew.get(count).getReferenceType().getID();
						if(referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
							var oCC = shotToCCReferencesNew.get(count).getTarget();
							var val = shotToCCReferencesNew.get(count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
							var setOfDimensionPoints = shotToCCReferencesNew.get(count).getDimensionPoints();
							
							var newRef = enOldProduct.createReference(oCC, "ShotRequestToStylingPieceCCRef");
							newRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(val);
							//add legacy CC number to styling pieces 
							var ccNum = oCC.getValue("a_CC_Number").getSimpleValue();
							if(ccNum != null || ccNum != ''){
								newRef.getValue("a_Styling_Piece_CC_Number").setSimpleValue(ccNum);
								}
							
						}
					}
				});
				
				step.executeInContext("EN_CA",function(caContextManager) {	
					var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(node.getID());
					var caOldProduct = caContextManager.getEntityHome().getEntityByID(oldTarget.getID());
					//Delete old links
					var ar_shotToCCReferencesNew = caOldProduct.getReferences().asList();
					for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
						var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
						if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
							
							var a_shotToCCReferencesNew = caOldProduct.getReferences().asList();
							for(var a_count=0;a_count<a_shotToCCReferencesNew.size();a_count++){
								var a_referenceTypeID = a_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
								if(a_referenceTypeID == 'OldShotRequestToStylingPieceCCRef'){
									a_shotToCCReferencesNew.get(a_count).delete();             
								}
							}
							break;
						}
					}
					var shotToCCReferencesOld = caOldProduct.getReferences().asList();
					for(var count=0;count<shotToCCReferencesOld.size();count++){
						var referenceTypeID = shotToCCReferencesOld.get(count).getReferenceType().getID();
						if(referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
							var a_oCC = shotToCCReferencesOld.get(count).getTarget();
							var a_val = shotToCCReferencesOld.get(count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
							var a_cc_num_val = shotToCCReferencesOld.get(count).getValue("a_Styling_Piece_CC_Number").getSimpleValue();
							var a_newRef = caOldProduct.createReference(a_oCC, "OldShotRequestToStylingPieceCCRef");	
							a_newRef.getValue('a_Styling_Piece_Instructions').setSimpleValue(a_val);							
							a_newRef.getValue('a_Styling_Piece_CC_Number').setSimpleValue(a_cc_num_val);
							shotToCCReferencesOld.get(count).delete();             
						}
					}
					
					//Create new links
					//var shotToCCReferencesNew = caOldProduct.getReferences().asList();
					var shotToCCReferencesNew = caCurrentProduct.getReferences().asList();
					for(var count=0;count<shotToCCReferencesNew.size();count++){
						var referenceTypeID = shotToCCReferencesNew.get(count).getReferenceType().getID();
						if(referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
							var oCC = shotToCCReferencesNew.get(count).getTarget();
							var val = shotToCCReferencesNew.get(count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
							var setOfDimensionPoints = shotToCCReferencesNew.get(count).getDimensionPoints();
							
							var newRef = caOldProduct.createReference(oCC, "ShotRequestToStylingPieceCCRef");
							newRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(val);
							//add legacy CC number to styling pieces 
							var ccNum = oCC.getValue("a_CC_Number").getSimpleValue();
							if(ccNum != null || ccNum != ''){
								newRef.getValue("a_Styling_Piece_CC_Number").setSimpleValue(ccNum);
								}
							
						}
					}
				});

                step.executeInContext("EN_JP",function(caContextManager) {	
					var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(node.getID());
					var caOldProduct = caContextManager.getEntityHome().getEntityByID(oldTarget.getID());
					//Delete old links
					var ar_shotToCCReferencesNew = caOldProduct.getReferences().asList();
					for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
						var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
						if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
							
							var a_shotToCCReferencesNew = caOldProduct.getReferences().asList();
							for(var a_count=0;a_count<a_shotToCCReferencesNew.size();a_count++){
								var a_referenceTypeID = a_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
								if(a_referenceTypeID == 'OldShotRequestToStylingPieceCCRef'){
									a_shotToCCReferencesNew.get(a_count).delete();             
								}
							}
							break;
						}
					}
					var shotToCCReferencesOld = caOldProduct.getReferences().asList();
					for(var count=0;count<shotToCCReferencesOld.size();count++){
						var referenceTypeID = shotToCCReferencesOld.get(count).getReferenceType().getID();
						if(referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
							var a_oCC = shotToCCReferencesOld.get(count).getTarget();
							var a_val = shotToCCReferencesOld.get(count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
							var a_cc_num_val = shotToCCReferencesOld.get(count).getValue("a_Styling_Piece_CC_Number").getSimpleValue();
							var a_newRef = caOldProduct.createReference(a_oCC, "OldShotRequestToStylingPieceCCRef");	
							a_newRef.getValue('a_Styling_Piece_Instructions').setSimpleValue(a_val);							
							a_newRef.getValue('a_Styling_Piece_CC_Number').setSimpleValue(a_cc_num_val);
							shotToCCReferencesOld.get(count).delete();             
						}
					}
					
					//Create new links
					//var shotToCCReferencesNew = caOldProduct.getReferences().asList();
					var shotToCCReferencesNew = caCurrentProduct.getReferences().asList();
					for(var count=0;count<shotToCCReferencesNew.size();count++){
						var referenceTypeID = shotToCCReferencesNew.get(count).getReferenceType().getID();
						if(referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
							var oCC = shotToCCReferencesNew.get(count).getTarget();
							var val = shotToCCReferencesNew.get(count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
							var setOfDimensionPoints = shotToCCReferencesNew.get(count).getDimensionPoints();
							
							var newRef = caOldProduct.createReference(oCC, "ShotRequestToStylingPieceCCRef");
							newRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(val);
							//add legacy CC number to styling pieces 
							var ccNum = oCC.getValue("a_CC_Number").getSimpleValue();
							if(ccNum != null || ccNum != ''){
								newRef.getValue("a_Styling_Piece_CC_Number").setSimpleValue(ccNum);
								}
						}
					}
				});
				updateCCToShotRequestAttributes(oldTarget,cc)
				break;
			}	
		}
	}
	//Code to delete the current node if it's found to be a duplicate
	if(isDuplicate){
	
		log.info("Deleting Workflow Instance");
		if(!((node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle")) == null)){
			node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").delete("");
		}
		//Below code to delete referencedStylingCC links from current node
		log.info("Deleting References");
		var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");
		var sShotReqToCCRefs = node.getReferences(sReferenceType);
		if (!sShotReqToCCRefs.isEmpty()) {
	        for (var p = 0; p < sShotReqToCCRefs.size(); p++) {
	        	sShotReqToCCRefs.get(p).delete();
	        }
	    }
		//Below code to delete referencedBy links
		log.info("Deleting Referenced Links");
		var sReferencingCCs = new java.util.ArrayList();
		
		var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
        //PPIM-7238 - Edit BR to accomodate Japan
		if(sharedMarkets.indexOf("US")>=0 && sharedMarkets.indexOf("CA")>=0 && sharedMarkets.indexOf("JPN")>=0){
			step.executeInContext(currentContext,function(enContextManager) {
				enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
				sReferencingCCs.addAll(enShotRequest.getReferencedByProducts());
				if (!sReferencingCCs.isEmpty()) {
					for (var num = 0; num < sReferencingCCs.size(); num++) {
						sReferencingCCs.get(num).delete();				
					}
				}
			});
			for(var p = 0 ;p<otherContext.length;p++){
				var sReferencingCCsTwo = new java.util.ArrayList();
				step.executeInContext(otherContext[p],function(enContextManager) {
					enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
					sReferencingCCsTwo.addAll(enShotRequest.getReferencedByProducts());
					if (!sReferencingCCsTwo.isEmpty()) {
						for (var num = 0; num < sReferencingCCsTwo.size(); num++) {
							sReferencingCCsTwo.get(num).delete();				
						}
					}
				});
			
			}	
		}
		else if(sharedMarkets.indexOf("US")>=0 && sharedMarkets.indexOf("CA")>=0){
			step.executeInContext(currentContext,function(enContextManager) {
				enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
				sReferencingCCs.addAll(enShotRequest.getReferencedByProducts());
				if (!sReferencingCCs.isEmpty()) {
					for (var num = 0; num < sReferencingCCs.size(); num++) {
						sReferencingCCs.get(num).delete();				
					}
				}
			});
			for(var p = 0 ;p<otherContext.length;p++){
				var sReferencingCCsTwo = new java.util.ArrayList();
				step.executeInContext(otherContext[p],function(enContextManager) {
					enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
					sReferencingCCsTwo.addAll(enShotRequest.getReferencedByProducts());
					if (!sReferencingCCsTwo.isEmpty()) {
						for (var num = 0; num < sReferencingCCsTwo.size(); num++) {
							sReferencingCCsTwo.get(num).delete();				
						}
					}
				});
			
			}	
		}
		else if(sharedMarkets.indexOf("US")>=0 && sharedMarkets.indexOf("JPN")>=0){
			step.executeInContext(currentContext,function(enContextManager) {
				enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
				sReferencingCCs.addAll(enShotRequest.getReferencedByProducts());
				if (!sReferencingCCs.isEmpty()) {
					for (var num = 0; num < sReferencingCCs.size(); num++) {
						sReferencingCCs.get(num).delete();				
					}
				}
			});
			for(var p = 0 ;p<otherContext.length;p++){
				var sReferencingCCsTwo = new java.util.ArrayList();
				step.executeInContext(otherContext[p],function(enContextManager) {
					enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
					sReferencingCCsTwo.addAll(enShotRequest.getReferencedByProducts());
					if (!sReferencingCCsTwo.isEmpty()) {
						for (var num = 0; num < sReferencingCCsTwo.size(); num++) {
							sReferencingCCsTwo.get(num).delete();				
						}
					}
				});
			
			}	
		}else if(sharedMarkets.indexOf("CAN")>=0 && sharedMarkets.indexOf("JPN")>=0){
			step.executeInContext(currentContext,function(enContextManager) {
				enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
				sReferencingCCs.addAll(enShotRequest.getReferencedByProducts());
				if (!sReferencingCCs.isEmpty()) {
					for (var num = 0; num < sReferencingCCs.size(); num++) {
						sReferencingCCs.get(num).delete();				
					}
				}
			});
			for(var p = 0 ;p<otherContext.length;p++){
				var sReferencingCCsTwo = new java.util.ArrayList();
				step.executeInContext(otherContext[p],function(enContextManager) {
					enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
					sReferencingCCsTwo.addAll(enShotRequest.getReferencedByProducts());
					if (!sReferencingCCsTwo.isEmpty()) {
						for (var num = 0; num < sReferencingCCsTwo.size(); num++) {
							sReferencingCCsTwo.get(num).delete();				
						}
					}
				});
			
			}	
		}
		else if(sharedMarkets.indexOf("CA")>=0){
			step.executeInContext("EN_CA",function(enContextManager) {
				enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
				sReferencingCCs.addAll(enShotRequest.getReferencedByProducts());
				if (!sReferencingCCs.isEmpty()) {
					for (var num = 0; num < sReferencingCCs.size(); num++) {
						sReferencingCCs.get(num).delete();				
					}
				}
			});
			
		}
		else if(sharedMarkets.indexOf("US")>=0){
			step.executeInContext("EN_US",function(enContextManager) {
				enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
				sReferencingCCs.addAll(enShotRequest.getReferencedByProducts());
				if (!sReferencingCCs.isEmpty()) {
					for (var num = 0; num < sReferencingCCs.size(); num++) {
						sReferencingCCs.get(num).delete();				
					}
				}
			});
		}
        //PPIM-7238 - Edit BR to accomodate Japan
        else if(sharedMarkets.indexOf("JPN")>=0){
			step.executeInContext("EN_JP",function(enContextManager) {
				enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
				sReferencingCCs.addAll(enShotRequest.getReferencedByProducts());
				if (!sReferencingCCs.isEmpty()) {
					for (var num = 0; num < sReferencingCCs.size(); num++) {
						sReferencingCCs.get(num).delete();				
					}
				}
			});
		}
	    
		//Finally delete the node
		log.info("Delete Node");
		node.delete();
	
		//code for visibility of new shot which is replacing duplicate one:
		var currentContext1 = step.getCurrentContext().getID();
		var context = null;
		if(dupShot.getReferencedBy().size() == 0){
			
			if(currentContext1 == "EN_US"){
				setVisibility("EN_CA");
                setVisibility("EN_JP");
			}else if(currentContext1 == "EN_CA" || currentContext1 == "FR_CA"){
				setVisibility("EN_US");
                setVisibility("EN_JP");
			}
            else if(currentContext1 == "EN_JP" || currentContext1 == "JA_JP"){
				setVisibility("EN_US");
                setVisibility("EN_CA");
			}
        }
            else{   
			/* Commented as part of PPIM-8810
			 *  log.info("In Else Block With Context " + currentContext);
			if(shotMet2 != 'Bulk'){
				setVisibility("EN_US");
				setVisibility("EN_CA");
                setVisibility("EN_JP");
			}
			else{
				if(dupShot.getValue('a_Shared_Markets').getSimpleValue()=="US" || dupShot.getValue('a_Shared_Markets').getSimpleValue()=="CAN" || dupShot.getValue('a_Shared_Markets').getSimpleValue()=="JPN"){
					setVisibility(currentContext1);
				}
			}*/
			var oldSharedMarkets = dupShot.getValue("a_Old_Shared_Markets").getValues().toArray();
			if (oldSharedMarkets != null) {
				oldSharedMarkets.forEach(function (market) {
			    		var contextId = lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", market.getValue());
					setVisibility(contextId);
				})
			}
	    }
	    deleteDuplicateCCToShotRefs(dupShot);
	    
	    step.executeInContext("EN_US",function(enContextManager) {	
			var enCurrentProduct = enContextManager.getEntityHome().getEntityByID(dupShot.getID());
	        var ar_shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
	        for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
	            var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
	            var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
	            var stylePieceCCNumber = a_oCC.getValue('a_CC_Number').getSimpleValue();
	            //logger.info(stylePieceCCNumber + "duplicate US");
	            ar_shotToCCReferencesNew.get(a_count).getValue('a_Styling_Piece_CC_Number').setSimpleValue(stylePieceCCNumber);              
	            
	        }  
	    });
	
	    step.executeInContext("EN_CA",function(caContextManager) {	
			var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(dupShot.getID());
	        var ar_shotToCCReferencesNew = caCurrentProduct.getReferences().asList();
	        for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
	            var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
	            var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
	            var stylePieceCCNumber = a_oCC.getValue('a_CC_Number').getSimpleValue();
	            //logger.info(stylePieceCCNumber + "duplicate CA");
	            ar_shotToCCReferencesNew.get(a_count).getValue('a_Styling_Piece_CC_Number').setSimpleValue(stylePieceCCNumber);                
	            
	        }  
		})

        step.executeInContext("EN_JP",function(caContextManager) {	
			var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(dupShot.getID());
	        var ar_shotToCCReferencesNew = caCurrentProduct.getReferences().asList();
	        for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
	            var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
	            var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
	            var stylePieceCCNumber = a_oCC.getValue('a_CC_Number').getSimpleValue();
	            //logger.info(stylePieceCCNumber + "duplicate CA");
	            ar_shotToCCReferencesNew.get(a_count).getValue('a_Styling_Piece_CC_Number').setSimpleValue(stylePieceCCNumber);                
	            
	        }  
		})
		
		var sharedMarkets = dupShot.getValue("a_Shared_Markets").getSimpleValue();
			if(sharedMarkets != null) {
					// if shared market has US, run US context
                    //PPIM-7238 - Edit BR to accomodate Japan - If shared Market contain US then outbound will only be triggered from US and not any other context. 
                    //Else for standalone CAN or JPN market or both of these, the outbounds will respectively be triggered.
				if(sharedMarkets.indexOf("US") >= 0) {
					//queueUS.queueDerivedEvent(shot,oldTarget);
					assethubqueueUS.queueDerivedEvent(shot,oldTarget);
				} else if(sharedMarkets.indexOf("CAN") >= 0) {
                        //queueCA.queueDerivedEvent(shot,node);
                        assethubqueueCA.queueDerivedEvent(shot,oldTarget);
                    } else if(sharedMarkets.indexOf("JPN") >= 0) {
                        //queueCA.queueDerivedEvent(shot,node);
                        assethubqueueJP.queueDerivedEvent(shot,oldTarget);
                    }
			}
	}else{
		var shotMet2 = node.getValue('a_Shot_Request_Method').getSimpleValue();
		if (shotMet2!="ASLR" && shotMet2!="Bulk"){	
		node.getValue('a_Shot_Request_Method').setSimpleValue("Manual");
		}
		//node.getValue('a_Shot_Request_Status').setSimpleValue("Submitted");
		//node.getValue('a_Market_PhotoShot_Requested_In').setSimpleValue("US");
	
		var currentContext = step.getCurrentContext().getID();
		var context = null;
	
		log.info("Current Context = " + currentContext);
		//This will run only in US & CA contexts. If more contexts are introduced, then this needs to be modified accordingly.
		if(node.getReferencedBy().size() == 0){
			if(currentContext == "EN_US"){
				setVisibility("EN_CA");
                setVisibility("EN_JP");
			}else if(currentContext == "EN_CA" || currentContext == "FR_CA"){
				setVisibility("EN_US");
                setVisibility("EN_JP");
			}
            else if(currentContext == "EN_JP" || currentContext == "JA_JP"){
				setVisibility("EN_US");
                setVisibility("EN_CA");
			}
		}else{
			log.info("In Else Block With Context " + currentContext);
			setVisibility("EN_US");
			// setVisibility("EN_CA");
	    }
	    
	
	
	
	    step.executeInContext("EN_US",function(enContextManager) {	
			var enCurrentProduct = enContextManager.getEntityHome().getEntityByID(node.getID());
	        var ar_shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
	        for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
	            var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
	            var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
	            var stylePieceCCNumber = a_oCC.getValue('a_CC_Number').getSimpleValue();
	            logger.info(stylePieceCCNumber + "US");
	            ar_shotToCCReferencesNew.get(a_count).getValue('a_Styling_Piece_CC_Number').setSimpleValue(stylePieceCCNumber);              
	            
	        }  
	    });
	
	    step.executeInContext("EN_CA",function(caContextManager) {	
			var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(node.getID());
	        var ar_shotToCCReferencesNew = caCurrentProduct.getReferences().asList();
	        for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
	            var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
	            var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
	            var stylePieceCCNumber = a_oCC.getValue('a_CC_Number').getSimpleValue();
	            ar_shotToCCReferencesNew.get(a_count).getValue('a_Styling_Piece_CC_Number').setSimpleValue(stylePieceCCNumber);                
	            
	        }  
	    })

        step.executeInContext("EN_JP",function(caContextManager) {	
			var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(node.getID());
	        var ar_shotToCCReferencesNew = caCurrentProduct.getReferences().asList();
	        for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
	            var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
	            var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
	            var stylePieceCCNumber = a_oCC.getValue('a_CC_Number').getSimpleValue();
	            ar_shotToCCReferencesNew.get(a_count).getValue('a_Styling_Piece_CC_Number').setSimpleValue(stylePieceCCNumber);                
	            
	        }  
	    })
	    
		//Below code is to push the shot request object to next state (Submitted) in workflow.
		/*if (node.isInState("wf_ShortRequestLifeCycle", "Draft")) {
			node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Moved to 'Submitted' state");
		}else{
			queue.queueDerivedEvent(shot,node);
		}*/
		
		//if (oldSource.isInState("wf_CCEnrichment", "NewCCEnrich_Photo1")) {
			//oldSource.getWorkflowInstanceByID("wf_CCEnrichment").getTaskByID("NewCCEnrich_Photo1").triggerByID("Submit", "Moved to 'Modify or Create Alt Shots' state");
		//}
	
		//generating the outbound for the shot request
        //PPIM-7238 - Edit BR to accomodate Japan - If shared market contains US, only US outbound willbe triggered. else respective market outbound will be triggered.
		var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
		if(sharedMarkets != null) {
			// if shared market has US, run US context
			if(sharedMarkets.indexOf("US") >= 0) {
				//Removal of Non-DGL Outbound
				//queueUS.queueDerivedEvent(shot,node);
				assethubqueueUS.queueDerivedEvent(shot,node);
			}
            if(sharedMarkets.indexOf("CAN") >= 0 && (!(sharedMarkets.indexOf("US") >= 0))) {
				//queueCA.queueDerivedEvent(shot,node);
				assethubqueueCA.queueDerivedEvent(shot,node);
			}
            if(sharedMarkets.indexOf("JPN") >= 0 && (!(sharedMarkets.indexOf("US") >= 0))) {
				//queueCA.queueDerivedEvent(shot,node);
				assethubqueueJP.queueDerivedEvent(shot,node);
			}
		}
	}
}
catch(e){
	log.info(e)
	logger.info("The Duplicate Check Event Processor Failed for ID: " + node.getID());
}


//Below function is to handle PPIM-801 (Context specific reference link visibility requirement based on the selected shared markets)

function setVisibility(ctx){

	step.executeInContext(ctx, function(step)
	{
		//code to get correct shot id based on duplicate or not
		if(isDuplicate){
		var prd = dupShot;
		}
		else{
		var prd = node;
		}
		//updated prdID against node id
		var oEntity = step.getEntityHome().getEntityByID(prd.getID());
		var shotMet3 = oEntity.getValue('a_Shot_Request_Method').getSimpleValue();
		/*Commented as part of PPIM-8810
		 * if(shotMet3 != 'ASLR'){
		 */
		var dimensionPoint;
		var ref = null;
		var marketRoot;
		var parentDimPoint;
		var setofReferences = oEntity.getReferencedByProducts();
		var itr = setofReferences.iterator();

		if(setofReferences != null){
			while (itr.hasNext()) {
				ref = itr.next();
				log.info("Target id = " + ref.getTarget().getID());
				log.info("Source id = " + ref.getSource().getID());
				break;
			}
			if(ref != null){
				var setOfDimensionPoints = ref.getDimensionPoints();
				var setOfDimensionPointsBkp = ref.getDimensionPoints();
				var itr2 = setOfDimensionPoints.iterator();

				while(itr2.hasNext()){
					dimensionPoint = itr2.next();
					log.info(" MJ dimensionPoint id --> " + dimensionPoint.getID());
					break;
				}

				if(dimensionPoint.getID() == "MarketRoot"){
					parentDimPoint = dimensionPoint;
					log.info("This is set on Market root");
				}else{
					log.info("This is set on --> " + dimensionPoint.getID());
					parentDimPoint = dimensionPoint.getParent();
				}

				//Clear the existing visibility
				
				setOfDimensionPoints.clear();
				/* Commented as part of PPIM-8810
				 * if(shotMet3=='Bulk'){
					if(ctx=="EN_US"){
						var currentDimensionPoint = step.getHome(com.stibo.core.domain.DimensionPointHome).getDimensionPointByID('USA');
						setOfDimensionPoints.add(currentDimensionPoint);
						ref.setDimensionPoints(setOfDimensionPoints);
					}
					else if(ctx=="EN_CA" || ctx=="FR_CA"){
						var currentDimensionPoint = step.getHome(com.stibo.core.domain.DimensionPointHome).getDimensionPointByID('Canada');
						setOfDimensionPoints.add(currentDimensionPoint);
						ref.setDimensionPoints(setOfDimensionPoints);
					}
                    //PPIM-7238 - Edit BR to accomodate Japan
                    else if(ctx=="EN_JP" || ctx=="JA_JP"){
						var currentDimensionPoint = step.getHome(com.stibo.core.domain.DimensionPointHome).getDimensionPointByID('Japan');
						setOfDimensionPoints.add(currentDimensionPoint);
						ref.setDimensionPoints(setOfDimensionPoints);
					}
					setOfDimensionPoints.clear();
				}*/
				
				
				var setOfAllDimPoints = parentDimPoint.getChildren();
				var itrAllDimPoints = setOfAllDimPoints.iterator();
                var sharedMarkets = prd.getValue("a_Shared_Markets").getSimpleValue();
				if(prd.getValue("a_Shared_Markets").getSimpleValue() == null){
					//Do Nothing
				}else if(prd.getValue("a_Shared_Markets").getSimpleValue() == "US"){
					while(itrAllDimPoints.hasNext()){
						var currentDimPoint = itrAllDimPoints.next();
						if(currentDimPoint.getID() == "USA"){
							setOfDimensionPoints.add(currentDimPoint);
						}
					}
				}else if(prd.getValue("a_Shared_Markets").getSimpleValue() == "CAN"){
					while(itrAllDimPoints.hasNext()){
						var currentDimPoint = itrAllDimPoints.next();
						if(currentDimPoint.getID() == "Canada"){
							setOfDimensionPoints.add(currentDimPoint);
						}
					}
				}
                ////PPIM-7238 - Edit BR to accomodate Japan
                else if(prd.getValue("a_Shared_Markets").getSimpleValue() == "JPN"){
					while(itrAllDimPoints.hasNext()){
						var currentDimPoint = itrAllDimPoints.next();
						if(currentDimPoint.getID() == "Japan"){
							setOfDimensionPoints.add(currentDimPoint);
						}
					}
				}
               else if (prd.getValue("a_Shared_Markets").getSimpleValue().indexOf("US") >= 0 && prd.getValue("a_Shared_Markets").getSimpleValue().indexOf("CAN") >= 0 && prd.getValue("a_Shared_Markets").getSimpleValue().indexOf("JPN") >= 0){
					setOfDimensionPoints.add(parentDimPoint);
				}
				
				//log.info("setOfDimensionPoints = "+ setOfDimensionPoints);
				//log.info("setOfDimensionPointsBkp =" + setOfDimensionPointsBkp);
				if(setOfDimensionPoints.size()>0&&!setOfDimensionPointsBkp.equals(setOfDimensionPoints)){
					log.info("Old and New Dimension Points are not equal, so updating");
					ref.setDimensionPoints(setOfDimensionPoints);			
				}
			}
        }
        if(!isDuplicate){
        	shotRequestStylingRefVisibility(oEntity);
        }
       // }
        
        
	});
}

function shotRequestStylingRefVisibility(prd){
    var ref = null;
    var dimensionPoint;
    var ref = null;
    var marketRoot;
    var parentDimPoint;
    var oEntity = prd;
    var shotMet3 = oEntity.getValue('a_Shot_Request_Method').getSimpleValue();
    var setofReferences = oEntity.getReferences().asList();
    var itr = setofReferences.iterator();
    
    if(setofReferences != null){

        while (itr.hasNext()) {
            ref = itr.next();      
		  if(ref.getReferenceType().getID() == 'ShotRequestToStylingPieceCCRef')
		  {	  
		  	  logger.info(ref.getReferenceType().getID());
	            var setOfDimensionPoints = ref.getDimensionPoints();
	            logger.info(setOfDimensionPoints+' hi');
	            var setOfDimensionPointsBkp = ref.getDimensionPoints();
	            var itr2 = setOfDimensionPoints.iterator();
	
	            while(itr2.hasNext()){
	                dimensionPoint = itr2.next();
	                log.info("dimensionPoint id --> " + dimensionPoint.getID());
	                break;
	            }
	
	            if(dimensionPoint.getID() == "MarketRoot"){
	                parentDimPoint = dimensionPoint;
	                log.info("This is set on Market root");
	            }else{
	                log.info("This is set on --> " + dimensionPoint.getID());
	                parentDimPoint = dimensionPoint.getParent();
	            }
	
				//Clear the existing visibility
				setOfDimensionPoints.clear();
				
	
	            var setOfAllDimPoints = parentDimPoint.getChildren();
	            var itrAllDimPoints = setOfAllDimPoints.iterator();
                var sharedMarkets = prd.getValue("a_Shared_Markets").getSimpleValue();
	            if(prd.getValue("a_Shared_Markets").getSimpleValue() == null){
	                //Do Nothing
	            }else if(prd.getValue("a_Shared_Markets").getSimpleValue() == "US"){
	                while(itrAllDimPoints.hasNext()){
	                    var currentDimPoint = itrAllDimPoints.next();
	                    if(currentDimPoint.getID() == "USA"){
	                        setOfDimensionPoints.add(currentDimPoint);
	                    }
	                }
	            }else if(prd.getValue("a_Shared_Markets").getSimpleValue() == "CAN"){
	                while(itrAllDimPoints.hasNext()){
	                    var currentDimPoint = itrAllDimPoints.next();
	                    if(currentDimPoint.getID() == "Canada"){
	                        setOfDimensionPoints.add(currentDimPoint);
	                    }
	                }
	            }
                //PPIM-7238 - Edit BR to accomodate Japan
                else if(prd.getValue("a_Shared_Markets").getSimpleValue() == "JPN"){
	                while(itrAllDimPoints.hasNext()){
	                    var currentDimPoint = itrAllDimPoints.next();
	                    if(currentDimPoint.getID() == "Japan"){
	                        setOfDimensionPoints.add(currentDimPoint);
	                    }
	                }
	            }
                else if (prd.getValue("a_Shared_Markets").getSimpleValue().indexOf("US") >= 0 && prd.getValue("a_Shared_Markets").getSimpleValue().indexOf("CAN") >= 0 && prd.getValue("a_Shared_Markets").getSimpleValue().indexOf("JPN") >= 0){
	                setOfDimensionPoints.add(parentDimPoint);
	            }
	
	            log.info("setOfDimensionPoints = "+ setOfDimensionPoints);
	            log.info("setOfDimensionPointsBkp =" + setOfDimensionPointsBkp);
	            if(setOfDimensionPoints.size()>0){
	            ref.setDimensionPoints(setOfDimensionPoints);			
			  }
		  }
        }
    }
}


function getReferencesByContext(context,photoshot){
    step.executeInContext(context,function(contextManager) {
        var contextNode= contextManager.getEntityHome().getEntityByID(photoshot.getID());
        sReferencingCCs.addAll(contextNode.getReferencedByProducts());
        if (!sReferencingCCs.isEmpty()) {            
            for (var i = 0; i < sReferencingCCs.size(); i++) {                
                var refCC = sReferencingCCs.get(i);
                var oStyleCC = refCC.getSource();
                var productReferences = oStyleCC.getReferences().asList();            
                for(var j=0;j<productReferences.size();j++){
                    
                    var referenceTypeID = productReferences.get(j).getReferenceType().getID();
                    
                    if(referenceTypeID == 'CCToPhotoShotRef'){
                        referencesArray.push(productReferences.get(j));
                    }
                }
            }
        }
    });
}

function createCCToPhotoShotRefAgainstUpdatedSharedMarket(updatedShot,cc){
var updatedSharedMarkets = updatedShot.getValue("a_Shared_Markets").getValues().toArray();
var contexts = new Array();

  	updatedSharedMarkets.forEach(function (market) {
    		contexts.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket",market.getSimpleValue()));
  	});
  	contexts.forEach(function (context) {
  		
	    step.executeInContext(context,function(contextManager) {
	     	var otherShotRequest = contextManager.getEntityHome().getEntityByID(updatedShot.getID());
	     	var otherCC = contextManager.getProductHome().getProductByID(cc.getID());
	     	var sReferencingCCs = new java.util.ArrayList();	
     		sReferencingCCs.addAll(otherShotRequest.getReferencedByProducts());
     		if (sReferencingCCs.isEmpty()) {
     			try{	
		                otherCC.createReference(otherShotRequest,'CCToPhotoShotRef');
		              }
		          catch(e){
			                if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException){
			                 	log.info("Shot Request Link already exist for "+otherCC.getID());
			                }
					}
     		}else{
     			
     			for (var num = 0; num < sReferencingCCs.size(); num++) {
			         var currentCC = sReferencingCCs.get(num).getSource();
			         log.info(currentCC.getID())
			         log.info(cc.getID())
			         if(currentCC.getID()!=cc.getID()){	
				         var otherCC = otherContextManager.getProductHome().getProductByID(cc.getID());
				         try{
				               otherCC.createReference(otherShotRequest,'CCToPhotoShotRef');
				            }
				         catch(e){
				                  if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException){
				                  	log.info("Shot Request Link already exist for "+otherCC.getID());
				                  }
							}
					}
				}
			}
		});			
 	});
}

function updateCCToShotRequestAttributes(updatedShot,cc){
	var updatedSharedMarkets = updatedShot.getValue("a_Shared_Markets").getValues().toArray();
	
	if (updatedSharedMarkets != null && updatedSharedMarkets.length >1) {
	  	updatedSharedMarkets.forEach(function (market) {
	    		var context = lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", market.getValue());
			step.executeInContext(context,function(contextManager) {
			     	var otherShotRequest = contextManager.getEntityHome().getEntityByID(updatedShot.getID());
			     	var otherCC = contextManager.getProductHome().getProductByID(cc.getID());
			     	var ccNumber=otherCC.getValue('a_CC_Number').getSimpleValue();
			     	otherShotRequest.getValue('a_Shot_CC_Number').setSimpleValue(ccNumber);
			     	otherShotRequest.getValue('a_Shot_Market_Number').setSimpleValue(market.getID() +' : '+ market.getValue());
			})
		})
	}
}

function deleteDuplicateCCToShotRefs(shot) {

	var sharedMarkets = shot.getValue("a_Shared_Markets").getValues().toArray();
	if (sharedMarkets != null && sharedMarkets.length ==3) {
		
		sharedMarkets.forEach(function (market) {
		    		var contextId = lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", market.getValue());
				step.executeInContext(contextId, function (shotContextManager) {
					var shotCurrentProduct = shotContextManager.getEntityHome().getEntityByID(shot.getID());
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
		})
	}
}


function updateSharedMarketBasedOnBrand(){
	var referencingCCs = new java.util.ArrayList();
	referencingCCs.addAll(node.getReferencedByProducts());
	var brandNumber=null
	for (var num = 0; num < referencingCCs.size(); num++) {
		var cc = referencingCCs.get(num).getSource();
		brandNumber=cc.getValue('a_Brand_Number').getSimpleValue();
		break;
	}
	var sharedMarket=node.getValue('a_Shared_Markets').getSimpleValue()
	if(brandNumber=='ON' && sharedMarket.contains('JPN') && sharedMarket.contains('US') && sharedMarket.contains('CAN')){
		node.getValue('a_Shared_Markets').setSimpleValue(null);
		node.getValue('a_Shared_Markets').addValue('US');
		node.getValue('a_Shared_Markets').addValue('CAN');
	}
	else if(brandNumber=='ON' && sharedMarket.contains('JPN') && sharedMarket.contains('US')){
		node.getValue('a_Shared_Markets').setSimpleValue(null);
		node.getValue('a_Shared_Markets').addValue('US');
	}

	else if(brandNumber=='ON' && sharedMarket.contains('JPN') && sharedMarket.contains('CAN')){
		node.getValue('a_Shared_Markets').setSimpleValue(null);
		node.getValue('a_Shared_Markets').addValue('CAN');
	} else if((brandNumber=='GO' && sharedMarket.contains('JPN')) || (brandNumber=='GO' && sharedMarket.contains('CAN'))){
		node.getValue('a_Shared_Markets').setSimpleValue(null);
		node.getValue('a_Shared_Markets').addValue('US');
	}

}

function findOldShotAmongDuplicates(existingShot,currentShot){
	var existingShotNumericId=Number(existingShot.getID().substring(3,existingShot.getID().length()))
	var currentShotNumericId=Number(currentShot.getID().substring(3,currentShot.getID().length()))
	if(existingShotNumericId>currentShotNumericId)
		return currentShot
	else 
		return existingShot
}
}