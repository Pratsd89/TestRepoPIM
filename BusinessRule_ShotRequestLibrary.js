/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestLibrary",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Shot Request Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
//ShotRequestLibrary

/* PPIM-9164 DEPRECATED FUNCTION
function shotRequestStylingRefVisibility(prd, logger) {
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
		  if(ref.getReferenceType().getID() == 'ShotRequestToStylingPieceCCRef') {
		  	  logger.info(ref.getReferenceType().getID());
	            var setOfDimensionPoints = ref.getDimensionPoints();
	            logger.info(setOfDimensionPoints+' hi');
	            var setOfDimensionPointsBkp = ref.getDimensionPoints();
	            var itr2 = setOfDimensionPoints.iterator();
	
	            while(itr2.hasNext()){
	                dimensionPoint = itr2.next();
	                logger.info("dimensionPoint id --> " + dimensionPoint.getID());
	                break;
	            }
	
	            if(dimensionPoint.getID() == "MarketRoot"){
	                parentDimPoint = dimensionPoint;
	                logger.info("This is set on Market root");
	            }else{
	                logger.info("This is set on --> " + dimensionPoint.getID());
	                parentDimPoint = dimensionPoint.getParent();
	            }
				//Clear the existing visibility
				setOfDimensionPoints.clear();
	      var setOfAllDimPoints = parentDimPoint.getChildren();
	      var itrAllDimPoints = setOfAllDimPoints.iterator();
	
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
	      }else{
	          setOfDimensionPoints.add(parentDimPoint);
	      }
	
	      logger.info("setOfDimensionPoints = "+ setOfDimensionPoints);
	      logger.info("setOfDimensionPointsBkp =" + setOfDimensionPointsBkp);
	      
	      ref.setDimensionPoints(setOfDimensionPoints);			
		  }
    }
  }
} */

//Below function is to handle PPIM-801 (Context specific reference link visibility requirement based on the selected shared markets)

/* PPIM-9160 The function out in the library it is no longer used.
function setVisibility(node, ctx, isDuplicate, logger,dupShot) {
	var step = node.getManager();
	step.executeInContext(ctx, function(step) {
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
		var dimensionPoint;
		var ref = null;
		var marketRoot;
		var parentDimPoint;
		var setofReferences = oEntity.getReferencedByProducts();
		var itr = setofReferences.iterator();

		if(setofReferences != null){
			while (itr.hasNext()) {
				ref = itr.next();
				logger.info("Target id = " + ref.getTarget().getID());
				logger.info("Source id = " + ref.getSource().getID());
				break;
			}
			if(ref != null){
				var setOfDimensionPoints = ref.getDimensionPoints();
				var setOfDimensionPointsBkp = ref.getDimensionPoints();
				var itr2 = setOfDimensionPoints.iterator();

				while(itr2.hasNext()){
					dimensionPoint = itr2.next();
					logger.info(" MJ dimensionPoint id --> " + dimensionPoint.getID());
					break;
				}

				if(dimensionPoint.getID() == "MarketRoot"){
					parentDimPoint = dimensionPoint;
					logger.info("This is set on Market root");
				}else{
					logger.info("This is set on --> " + dimensionPoint.getID());
					parentDimPoint = dimensionPoint.getParent();
				}

				//Clear the existing visibility
				
				setOfDimensionPoints.clear();
				if(shotMet3=='Bulk'){
					if(ctx=="EN_US"){
						var currentDimensionPoint = step.getHome(com.stibo.core.domain.DimensionPointHome).getDimensionPointByID('USA');
						setOfDimensionPoints.add(currentDimensionPoint);
						ref.setDimensionPoints(setOfDimensionPoints);
					}
					else if(ctx=="EN_CA"){
						var currentDimensionPoint = step.getHome(com.stibo.core.domain.DimensionPointHome).getDimensionPointByID('Canada');
						setOfDimensionPoints.add(currentDimensionPoint);
						ref.setDimensionPoints(setOfDimensionPoints);
					}
					else{
						var currentDimensionPoint = step.getHome(com.stibo.core.domain.DimensionPointHome).getDimensionPointByID('Canada');
						setOfDimensionPoints.add(currentDimensionPoint);
						ref.setDimensionPoints(setOfDimensionPoints);
					}
					setOfDimensionPoints.clear();
				}
				
				
				var setOfAllDimPoints = parentDimPoint.getChildren();
				var itrAllDimPoints = setOfAllDimPoints.iterator();

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
				}else{
					setOfDimensionPoints.add(parentDimPoint);
				}

				logger.info("setOfDimensionPoints = "+ setOfDimensionPoints);
				logger.info("setOfDimensionPointsBkp =" + setOfDimensionPointsBkp);
				if(!setOfDimensionPointsBkp.equals(setOfDimensionPoints)){
					logger.info("Old and New Dimension Points are not equal, so updating");
					ref.setDimensionPoints(setOfDimensionPoints);			
				}
			}
        }
        if(!isDuplicate){
        	shotRequestStylingRefVisibility(oEntity, logger);
        }
	});
}*/

/* PPIM-9164 DEPRECATED FUNCTION
function shotRequestSubmitActionPart1(node, logger) {
	var step = node.getManager();
	var shotLifeCycleStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
	if(shotLifeCycleStatus=='Submitted'){
		//var valShotReqType = node.getValue('a_Shot_Request_Type').getSimpleValue();
		var valShotCode = node.getValue('a_Shot_Code').getSimpleValue();
		var valShotType = node.getValue('a_Shot_Type').getSimpleValue();
		var valSharedMarket = node.getValue('a_Shared_Markets').getSimpleValue();
		var valSitePlacement = node.getValue('a_Site_Placement').getSimpleValue();
		
		/*if(valShotReqType == null || valShotReqType == '')
		{
			throw "<Mandatory Attribute Shot Request Type is Missing>";
		}
		else 
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
		
		
		//--------------------EndOfOldValueadditionblock--
		//to copy the attributes of the current context to the other context
		var currentContext= step.getCurrentContext().getID();
		if(currentContext == 'EN_US'){
			otherContext = 'EN_CA';
		}
		else{
			otherContext = 'EN_US';
		}
		
		step.executeInContext(currentContext,function(enContextManager) {	
				var enCurrentProduct = enContextManager.getEntityHome().getEntityByID(node.getID());
				
				var attributeList = ['a_Shot_Code','a_Shot_Type','a_Site_Placement'];
				for(var i = 0 ;i<attributeList.length;i++){
					var enAttributeValue = enCurrentProduct.getValue(attributeList[i]).getSimpleValue();
					step.executeInContext(otherContext,function(caContextManager) {
						var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(node.getID());
						caCurrentProduct.getValue(attributeList[i]).setSimpleValue(enAttributeValue);
					})			
				}
				step.executeInContext(otherContext,function(caContextManager) {
					var caCurrentProduct = caContextManager.getEntityHome().getEntityByID(node.getID());
					var shotMet1 = caCurrentProduct.getValue('a_Shot_Request_Method').getSimpleValue();
					if (shotMet1!="ASLR" && shotMet1!="Bulk"){
					caCurrentProduct.getValue('a_Shot_Request_Method').setSimpleValue('Manual');
					}
				})	
		})
		
		//end of copying attributes code, now checking for duplicate reference code
		
		logger.info("Now executing Main Block");
		
		var curr_shotCode = node.getValue('a_Shot_Code').getSimpleValue();
		var curr_shared_market = node.getValue('a_Shared_Markets').getSimpleValue();
		var sReferencingCCs = new java.util.ArrayList();
		var isDuplicate = false;
		
		var referencesArray = [];
		var shotMet2 = node.getValue('a_Shot_Request_Method').getSimpleValue();
			logger.info(shotMet2);
		//This will run only in US & CA contexts. If more contexts are introduced, then this needs to be modified accordingly.
		
		if(node.getReferencedBy().size() == 0 ){
				
			if(currentContext == "EN_US"){
				setVisibility(node, "EN_CA", isDuplicate, logger,null);
			}else{
				setVisibility(node, "EN_US", isDuplicate, logger,null);
			}
		}else{
		
			logger.info("In Else Block With Context " + currentContext);
			setVisibility(node, currentContext, isDuplicate, logger,null);
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
			
		
		if(curr_shared_market == 'US'){
		    getReferencesByContext('EN_US',node);
		}
		else if (curr_shared_market == 'CAN'){
		    getReferencesByContext('EN_CA',node);
		} else {
		    getReferencesByContext('EN_US',node);
		    getReferencesByContext('EN_CA',node);
		}

		productReferences = referencesArray;
		for(var j = 0 ;j<productReferences.length;j++){				
			var oldTarget =productReferences[j].getTarget();
			//To Use oldSource at last step of this exercise for CC enrichment workflow transition
			//var oldSource =productReferences.get(j).getSource();
			/*if(oldTarget.getID() == node.getID()){
				logger.info("Going To Continue");
				continue;
			}
			
			if(oldTarget.getID() != node.getID())
			{
				var old_shotCode = oldTarget.getValue('a_Shot_Code').getSimpleValue();
				var old_lifecycle_status = oldTarget.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
				var old_shared_market = oldTarget.getValue('a_Shared_Markets').getSimpleValue();
				
				logger.info("Going to check if it's a duplicate node");
				if(old_shotCode == curr_shotCode && old_lifecycle_status == "Submitted" && (curr_shared_market == old_shared_market || (curr_shared_market.contains("US") && old_shared_market.contains("US")) || (curr_shared_market.contains("CAN") && old_shared_market.contains("CAN"))))
				{
					
					isDuplicate = true;
					var dupShot = oldTarget;
					
					if(curr_shared_market != old_shared_market){
						oldTarget.getValue('a_Shared_Markets').setSimpleValue(null);
						oldTarget.getValue('a_Shared_Markets').addValue("CAN");
						oldTarget.getValue('a_Shared_Markets').addValue("US");
					}
		
					var attributes = ['a_Shot_Type','a_Shot_Instructions','a_Site_Placement'];
					var shotMet = oldTarget.getValue('a_Shot_Request_Method').getSimpleValue();
					if (shotMet!="ASLR" && shotMet!="Bulk"){
					oldTarget.getValue('a_Shot_Request_Method').setSimpleValue("Manual");
					}
					//oldTarget.getValue('a_Shot_Request_Status').setSimpleValue("Submitted");
					//oldTarget.getValue('a_Market_PhotoShot_Requested_In').setSimpleValue("US");
				
					logger.info("Matched | Updating Attributes")
					for(var  k = 0 ;k<attributes.length;k++){
						var temp = node.getValue(attributes[k]).getSimpleValue();
						oldTarget.getValue(attributes[k]).deleteCurrent();
						oldTarget.getValue(attributes[k]).setSimpleValue(temp);
					}
					
					//Logic to delete 'ShotRequestToStylingPieceCCRef' link on old object and copy the links from new object
					logger.info("Matched | Updating Links")
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
		
					var sharedMarkets = oldTarget.getValue("a_Shared_Markets").getSimpleValue();
					if(sharedMarkets != null) {
						// if shared market has US, run US context
						// if(sharedMarkets.indexOf("US") >= 0) {
						// 	queueUS.queueDerivedEvent(shot,oldTarget);
						// } else {
						// 	queueCA.queueDerivedEvent(shot,oldTarget);
						// }
					}
					break;
				}	
			}
		}

		//Code to delete the current node if it's found to be a duplicate
		if (isDuplicate) {
			logger.info("Deleting Workflow Instance");
			if(!((node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle")) == null)){
				node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").delete("");
			}
			//Below code to delete referencedStylingCC links from current node
			logger.info("Deleting References");
			var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");
			var sShotReqToCCRefs = node.getReferences(sReferenceType);
			if (!sShotReqToCCRefs.isEmpty()) {
		        for (var p = 0; p < sShotReqToCCRefs.size(); p++) {
		        	sShotReqToCCRefs.get(p).delete();
		        }
		    }
			//Below code to delete referencedBy links
			logger.info("Deleting Referenced Links");
			var sReferencingCCs = new java.util.ArrayList();
			
			var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
			if(sharedMarkets.indexOf("US")>=0 && sharedMarkets.indexOf("CA")>=0){
				step.executeInContext(currentContext,function(enContextManager) {
					enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
					sReferencingCCs.addAll(enShotRequest.getReferencedByProducts());
					if (!sReferencingCCs.isEmpty()) {
						for (var num = 0; num < sReferencingCCs.size(); num++) {
							sReferencingCCs.get(num).delete();				
						}
					}
				});
				var sReferencingCCsTwo = new java.util.ArrayList();
				step.executeInContext(otherContext,function(enContextManager) {
					enShotRequest = enContextManager.getEntityHome().getEntityByID(node.getID());		
					sReferencingCCsTwo.addAll(enShotRequest.getReferencedByProducts());
					if (!sReferencingCCsTwo.isEmpty()) {
						for (var num = 0; num < sReferencingCCsTwo.size(); num++) {
							sReferencingCCsTwo.get(num).delete();				
						}
					}
				});
				
				
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
			
			//Finally delete the node
			logger.info("Delete Node");
			node.delete();
		
			//code for visibility of new shot which is replacing duplicate one:
			var currentContext1 = step.getCurrentContext().getID();
			var context = null;
			if(dupShot.getReferencedBy().size() == 0){
				
				if(currentContext1 == "EN_US"){
					setVisibility(node, "EN_CA", isDuplicate, logger,dupShot);
				}else{
					setVisibility(node, "EN_US", isDuplicate, logger,dupShot);
				}
			}else {
				logger.info("In Else Block With Context " + currentContext);
				if(shotMet2 != 'Bulk'){
					setVisibility(node, "EN_US", isDuplicate, logger,dupShot);
					setVisibility(node, "EN_CA", isDuplicate, logger,dupShot);
				}
				else{
					if(dupShot.getValue('a_Shared_Markets').getSimpleValue()=="US" || dupShot.getValue('a_Shared_Markets').getSimpleValue()=="CAN"){
						setVisibility(node, currentContext1, isDuplicate, logger,dupShot);
					}
				}
			}

			step.executeInContext("EN_US",function(enContextManager) {	
				var enCurrentProduct = enContextManager.getEntityHome().getEntityByID(dupShot.getID());
		        var ar_shotToCCReferencesNew = enCurrentProduct.getReferences().asList();
		        for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
		            var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
		            var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
		            var stylePieceCCNumber = a_oCC.getValue('a_CC_Number').getSimpleValue();
		            logger.info(stylePieceCCNumber + "duplicate US");
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
		            logger.info(stylePieceCCNumber + "duplicate CA");
		            ar_shotToCCReferencesNew.get(a_count).getValue('a_Styling_Piece_CC_Number').setSimpleValue(stylePieceCCNumber);                
		            
		        }  
			})
		} else {
			var shotMet2 = node.getValue('a_Shot_Request_Method').getSimpleValue();
			if (shotMet2!="ASLR" && shotMet2!="Bulk") {
				node.getValue('a_Shot_Request_Method').setSimpleValue("Manual");
			}
			//node.getValue('a_Shot_Request_Status').setSimpleValue("Submitted");
			//node.getValue('a_Market_PhotoShot_Requested_In').setSimpleValue("US");
		
			var currentContext = step.getCurrentContext().getID();
			var context = null;
		
			logger.info("Current Context = " + currentContext);
			//This will run only in US & CA contexts. If more contexts are introduced, then this needs to be modified accordingly.
			if(node.getReferencedBy().size() == 0){
				if(currentContext == "EN_US"){
					setVisibility(node, "EN_CA", isDuplicate, logger,dupShot);
				} else {
					setVisibility(node, "EN_US", isDuplicate, logger,dupShot);
				}
			} else {
				//logger.info("In Else Block With Context " + currentContext);
				setVisibility(node, "EN_US", isDuplicate, logger,dupShot);
				// setVisibility(node, "EN_CA", isDuplicate, logger);
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
		    
			//Below code is to push the shot request object to next state (Submitted) in workflow.
			/*if (node.isInState("wf_ShortRequestLifeCycle", "Draft")) {
				node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Moved to 'Submitted' state");
			}else{
				queue.queueDerivedEvent(shot,node);
			}
			
			//if (oldSource.isInState("wf_CCEnrichment", "NewCCEnrich_Photo1")) {
				//oldSource.getWorkflowInstanceByID("wf_CCEnrichment").getTaskByID("NewCCEnrich_Photo1").triggerByID("Submit", "Moved to 'Modify or Create Alt Shots' state");
			//}
		
			//generating the outbound for the shot request
			var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
			if(sharedMarkets != null) {
				// if shared market has US, run US context
				// if(sharedMarkets.indexOf("US") >= 0) {
				// 	queueUS.queueDerivedEvent(shot,node);
				// } else {
				// 	queueCA.queueDerivedEvent(shot,node);
				// }
			}
		}
	}
	function getReferencesByContext(context, photoshot) {
		var step = photoshot.getManager();
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
} */


function shotRequestSubmitActionPart2(node, logger, portal, shotEvent,  assethubqueueUS, assethubqueueCA) {
	//getting linked CC with the shot request
	var sReferencingCCs = new java.util.ArrayList();
	var ccID;
	sReferencingCCs.addAll(node.getReferencedByProducts());
	if (!sReferencingCCs.isEmpty()) {
		for (var num = 0; num < sReferencingCCs.size(); num++) {
			ccID=sReferencingCCs.get(num).getSource().getID();				
		}
	}
	var CC = node.getManager().getProductHome().getProductByID(ccID);
	
	//end of the code
	var valShotCode = node.getValue('a_Shot_Code').getSimpleValue();
	var valShotType = node.getValue('a_Shot_Type').getSimpleValue();
	var valSharedMarket = node.getValue('a_Shared_Markets').getSimpleValue();
	var valSitePlacement = node.getValue('a_Site_Placement').getSimpleValue();
	if (valShotCode == null || valShotCode == '')	{
		if (portal) { portal.showAlert("ERROR", "Mandatory Attribute Shot Code is Missing"); }
	} else if (valShotType == null || valShotType == '')	{
		if (portal) { portal.showAlert("ERROR", "Mandatory Attribute Shot Type is Missing"); }
	} else if (valSharedMarket == null || valSharedMarket == '')	{
		if (portal) { portal.showAlert("ERROR", "Mandatory Attribute Shared Markets is Missing"); }
	} else if (valSitePlacement == null || valSitePlacement == '')	{
		if (portal) { portal.showAlert("ERROR", "Mandatory Attribute Site Placement is Missing"); }
	} else{
		if (node.isInState("wf_ShortRequestLifeCycle", "Draft")) {
			node.getValue('a_Shot_Request_Method').setSimpleValue("Manual");
			node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Moved to 'Submitted' state");
			if (portal) {
				//Separate Screen Movement for Non Merch CC - PPIM-1406
				var nonMerchType = CC.getParent().getValue("a_product_merch_type").getSimpleValue();
				if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES"
				                  || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED"
				                  || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")) {
					portal.navigate("CC_Details_Screen",CC);
				} else {
					portal.navigate("GAPNonMerchCCDetailsList",CC);
				}
			}
		} else if (node.isInState("wf_ShortRequestLifeCycle", "Submitted")) {
			var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();
			if(sharedMarkets != null) {
				// if shared market has US, run US context
				if(sharedMarkets.indexOf("US") >= 0) {
					//queueUS.queueDerivedEvent(shotEvent,node);
					//assethubqueueUS.queueDerivedEvent(shotEvent,node);
				} else {
					//queueCA.queueDerivedEvent(shotEvent,node);
					//assethubqueueCA.queueDerivedEvent(shotEvent,node);
				}
			}
			if (portal) {
				//Separate Screen Movement for Non Merch CC - PPIM-1406
				var nonMerchType = CC.getParent().getValue("a_product_merch_type").getSimpleValue();
				if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES"
				               || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED"
				               || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")){
					portal.navigate("CC_Details_Screen",CC);
				} else{
					portal.navigate("GAPNonMerchCCDetailsList",CC);
				}
				//node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Submitted").triggerByID("Ready_to_Review", "Moved to 'Ready to Review' state");
			}
		} else{
			if (portal) {
				portal.showAlert("ERROR", "Shot Request is not in Draft/Submitted status");
			}
		}
	}
}


// Note! This function was copied from the br_Copy_ASLR_Shot_Request_Attrs_Action business action. However it is currently
// not valid for any object type. So it seems this code should not be invoked. See ShotRequestSaveSubmitAction.
function br_Copy_ASLR_Shot_Request_Attrs_Action(node) {
	var oldStylingRef = node.getManager().getReferenceTypeHome().getReferenceTypeByID("OldShotRequestToStylingPieceCCRef");
	var stylingRef = node.getManager().getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");
	
	var shotRequestMethod = node.getValue('a_Shot_Request_Method').getSimpleValue();
	if(shotRequestMethod == 'ASLR'){
		
		var shotCode = node.getValue('a_Shot_Code').getSimpleValue();
		var shotType = node.getValue('a_Shot_Type').getSimpleValue();
		var sitePlacement = node.getValue('a_Site_Placement').getSimpleValue();
		var marketCode = node.getValue('a_Shared_Markets').getSimpleValue();
		var shotInstructions = node.getValue('a_Shot_Instructions').getSimpleValue();
		var oldShotCode = node.getValue('a_Old_Shot_Code').getSimpleValue();
		var oldShotType = node.getValue('a_Old_Shot_Type').getSimpleValue();
		var oldSitePlacement = node.getValue('a_Old_Site_Placement').getSimpleValue();
		var oldMarketCode = node.getValue('a_Old_Shared_Markets').getSimpleValue();
		var oldShotInstructions = node.getValue('a_Old_Shot_Instructions').getSimpleValue();
		
		var oldStylingReferences = node.getReferences(oldStylingRef).toArray();
		var newStylingReferences = node.getReferences(stylingRef).toArray();
		var changeInRefFlag = false;
		if(newStylingReferences.length != oldStylingReferences.length){
			changeInRefFlag = true;
		}
		else{
			for(var  i=0 ; i<newStylingReferences.length; i++){
				var sameReferenceExistFlag = false;
				var target = newStylingReferences[i].getTarget().getID();
				var stylingPieceInstructions =newStylingReferences[i].getValue('a_Styling_Piece_Instructions').getSimpleValue();
				for(var j = 0;j<oldStylingReferences.length;j++){			
					var oldTarget = oldStylingReferences[j].getTarget().getID();
					var oldStylingPieceInstructions =oldStylingReferences[j].getValue('a_Styling_Piece_Instructions').getSimpleValue();
					if(oldTarget == target && stylingPieceInstructions == oldStylingPieceInstructions){
						sameReferenceExistFlag = true;
						break;
					}
				}
				if(sameReferenceExistFlag == false){
					changeInRefFlag = true;
					break;
				}
			}
		}
		
		if(shotCode != oldShotCode || shotType != oldShotType || sitePlacement != oldSitePlacement || marketCode != oldMarketCode || shotInstructions != oldShotInstructions || changeInRefFlag == true){
			node.getValue('a_Shot_Request_Method').setSimpleValue('Manual');
			node.getValue('a_Old_Shot_Code').setSimpleValue(shotCode);
			node.getValue('a_Old_Shot_Type').setSimpleValue(shotType);
			node.getValue('a_Old_Site_Placement').setSimpleValue(sitePlacement);
			node.getValue('a_Old_Shared_Markets').setSimpleValue(marketCode);
			node.getValue('a_Old_Shot_Instructions').setSimpleValue(shotInstructions);
		
			for(var k =0 ; k< oldStylingReferences.length; k ++ ){
				oldStylingReferences[k].delete();
			}
		
			for(var m = 0;m < newStylingReferences.length ; m++){
				var target = newStylingReferences[m].getTarget();
				var newStylingInstruction = newStylingReferences[m].getValue('a_Styling_Piece_Instructions').getSimpleValue();
				var reference = node.createReference(target,oldStylingRef);
				reference.getValue('a_Styling_Piece_Instructions').setSimpleValue(newStylingInstruction);
			}
		}
	}
}
/*
function shotRequestSubmitActionPart4(node, LKT, stepManager, logger) { 
  var step = node.getManager();
  var sReferencingCCs = new java.util.ArrayList();
  var ccID;
  var ent_ID = node.getID();
  sReferencingCCs.addAll(node.getReferencedByProducts());
  if (!sReferencingCCs.isEmpty()) {
    for (var num = 0; num < sReferencingCCs.size(); num++) {
      ccID = sReferencingCCs.get(num).getSource().getID();
    }
  }
  var CC = step.getProductHome().getProductByID(ccID);
  if (CC) {
    var marketDesignationArray = CC.getValue('a_Market_Designation').getValues().toArray();
    marketDesignationArray.forEach(function(marketDesignation) {
    var marketNumber = node.getValue("a_Market_Number").getSimpleValue();
    var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", marketDesignation.getValue());
        stepManager.executeInContext(context, function(step) {
        var enCurrentEntity = step.getEntityHome().getEntityByID(ent_ID);
        var marketCode = LKT.getLookupTableValue("LKT_Context_to_MarketCode", context);
        var value = marketCode + " : " + marketDesignation.getValue();
        logger.info(value);
        enCurrentEntity.getValue("a_Shot_Market_Number").setSimpleValue(value);
       })
    })
  }
}
*/


//PPIM-8231-PPIM-8283 ShotRequest Shared Market Validation
function shotRequestSharedMarketValidation(node, step, portal, lookupTable) {	   
    var isSharedMarketValid = 'invalid';
    var shotReferencingCCs = new java.util.ArrayList();
    var invalidSharedMarkets = null
    var ccID = null;
    var shotRequestLifeCycle = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue()
    
    if (shotRequestLifeCycle == 'Draft') {
	    //Fetch CC details from the shot request
	    shotReferencingCCs.addAll(node.getReferencedByProducts());
	    if (!shotReferencingCCs.isEmpty()) {
	        ccID=shotReferencingCCs.get(0).getSource().getID();				
	    }
	
	    if(ccID!= null) {
	        var currentContext = step.getCurrentContext().getID()
	        var referencedCC = step.getProductHome().getProductByID(ccID);
	        var ccMarketDesignation = referencedCC.getValue("a_Market_Designation").getSimpleValue();
	        var shotSharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();
	
	        shotSharedMarkets.forEach(function (market) {
	            var context = lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", market.getSimpleValue())
		        step.executeInContext(context, function (otherStepManager) {
			        othercontextReferencedCC = otherStepManager.getObjectFromOtherManager(referencedCC)
			            	
		            if(ccMarketDesignation.indexOf(market.getSimpleValue()) != -1 ) {
		                //Add the shared market from CC market designation only if CC life cycle status is not in Draft/NULL
		                if(othercontextReferencedCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == 'Draft' || othercontextReferencedCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == null || othercontextReferencedCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == '' ) {
		                
		                    if(invalidSharedMarkets != null)
		                        invalidSharedMarkets = invalidSharedMarkets + ' '+ market.getSimpleValue()
		                    else
		                     	invalidSharedMarkets = market.getSimpleValue()
		                }
		                else
		                	isSharedMarketValid = 'valid';
		            }
	                else {
	                	if(invalidSharedMarkets != null)
	                		invalidSharedMarkets = invalidSharedMarkets + ' '+ market.getSimpleValue()
		                else
		                	invalidSharedMarkets = market.getSimpleValue()
		            }
		        })
	        })
			if (invalidSharedMarkets !=null) {
				portal.showAlert("Warning", 'Invalid Shared Markets selected : '+ invalidSharedMarkets );
				isSharedMarketValid = 'invalid';
			}
        } 
	}
	else if (shotRequestLifeCycle == null || shotRequestLifeCycle == '') {
		//Validation added if the ShotRequest Lifecycle is Null/Blank
        portal.showAlert("Warning", "Invalid Shot. Shot Request Life Cycle Status should not be Blank.");
    }	
	else {
		//No Validations performed for ShotRequest Lifecycle if !Draft or not Null/Blank
		isSharedMarketValid = 'valid'
	}
	return isSharedMarketValid
}

/*===== business library exports - this part will not be imported to STEP =====*/
exports.shotRequestSubmitActionPart2 = shotRequestSubmitActionPart2
exports.br_Copy_ASLR_Shot_Request_Attrs_Action = br_Copy_ASLR_Shot_Request_Attrs_Action
exports.shotRequestSharedMarketValidation = shotRequestSharedMarketValidation