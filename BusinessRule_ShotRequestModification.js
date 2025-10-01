/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestModification",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request Modification",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step) {
var valShotReqStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
//var valShotReqType = node.getValue('a_Shot_Request_Type').getSimpleValue();
var valShotCode = node.getValue('a_Shot_Code').getSimpleValue();
var valShotType = node.getValue('a_Shot_Type').getSimpleValue();
var valSharedMarket = node.getValue('a_Shared_Markets').getSimpleValue();
if (valShotReqStatus!="Ready for Review" && (valShotType != null && valShotType != '') && (valSharedMarket != null && valSharedMarket != '')){
	
//-----StartofOldValueAdditionBlock-----

var valOldSharedMarket = node.getValue('a_Shared_Markets').getSimpleValue();
var valOldSharedMarketcurr = node.getValue('a_Old_Shared_Markets').getSimpleValue();
if(valOldSharedMarketcurr != null || valOldSharedMarketcurr != ''){
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
var a_shotToCCReferencesNew = node.getReferences().asList();
						for(var a_count=0;a_count<a_shotToCCReferencesNew.size();a_count++){
	    					var a_referenceTypeID = a_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
	    					if(a_referenceTypeID == 'OldShotRequestToStylingPieceCCRef'){
								a_shotToCCReferencesNew.get(a_count).delete();             
							}
						}
							var ar_shotToCCReferencesNew = node.getReferences().asList();
							for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
							var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
							if(ar_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
								var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
								var a_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
								var a_newRef = node.createReference(a_oCC, "OldShotRequestToStylingPieceCCRef");								
								a_newRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(a_val);
								}
							}
//--------------------EndOfOldValueadditionblock--

log.info("Now executing Main Block");

var curr_shotCode = node.getValue('a_Shot_Code').getSimpleValue();
var curr_shared_market = node.getValue('a_Shared_Markets').getSimpleValue();
var sReferencingCCs = new java.util.ArrayList();
var isDuplicate = false;

sReferencingCCs.addAll(node.getReferencedByProducts());

if (!sReferencingCCs.isEmpty()) {
	for (var i = 0; i < sReferencingCCs.size(); i++) {
		var refCC = sReferencingCCs.get(i);
		var oStyleCC = refCC.getSource();
		var productReferences = oStyleCC.getReferences().asList();
		for(var j=0;j<productReferences.size();j++){
			var referenceTypeID = productReferences.get(j).getReferenceType().getID();
			if(referenceTypeID == 'CCToPhotoShotRef'){
				var oldTarget =productReferences.get(j).getTarget();
				/*if(oldTarget.getID() == node.getID()){
					log.info("Going To Continue");
					continue;
				}*/
				if(oldTarget.getID() != node.getID())
				{
					var old_shotCode = oldTarget.getValue('a_Shot_Code').getSimpleValue();
					var old_lifecycle_status = oldTarget.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
					var old_shared_market = oldTarget.getValue('a_Shared_Markets').getSimpleValue();
					
					log.info("Going to check if it's a duplicate node");
					if(old_shotCode == curr_shotCode && old_lifecycle_status == "Submitted" && (curr_shared_market == old_shared_market || (curr_shared_market.contains("US") && old_shared_market.contains("US")))){
						
						isDuplicate = true;
						var attributes = ['a_Shot_Type','a_Shot_Request_Instructions','a_Site_Placement','a_Shared_Markets'];
						oldTarget.getValue('a_Shot_Request_Method').setSimpleValue("Manual");
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
	
						//Delete old links
						var shotToCCReferencesOld = oldTarget.getReferences().asList();
						for(var count=0;count<shotToCCReferencesOld.size();count++){
	    					var referenceTypeID = shotToCCReferencesOld.get(count).getReferenceType().getID();
							if(referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
								productReferences.get(count).delete();             
							}
						}
						
						//Create new links
						//var shotToCCReferencesNew = oldTarget.getReferences().asList();
						var shotToCCReferencesNew = node.getReferences().asList();
						for(var count=0;count<shotToCCReferencesNew.size();count++){
	    					var referenceTypeID = shotToCCReferencesNew.get(count).getReferenceType().getID();
							if(referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
								var oCC = shotToCCReferencesNew.get(count).getTarget();
								var setOfDimensionPoints = shotToCCReferencesNew.get(count).getDimensionPoints();
								
								var newRef = oldTarget.createReference(oCC, "ShotRequestToStylingPieceCCRef");
								newRef.setDimensionPoints(setOfDimensionPoints);
							}
						}
					}	
					
					break;
				}
			}
		}
	}
}


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
			caCurrentProduct.getValue('a_Shot_Request_Method').setSimpleValue('Manual');
		})	
})

//Below function is to handle PPIM-801 (Context specific reference link visibility requirement based on the selected shared markets)

function setVisibility(ctx){

	step.executeInContext(ctx, function(step)
	{
		var oEntity = step.getEntityHome().getEntityByID(node.getID());
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

			var setOfDimensionPoints = ref.getDimensionPoints();
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

			if(node.getValue("a_Shared_Markets").getSimpleValue() == null){
				//Do Nothing
			}else if(node.getValue("a_Shared_Markets").getSimpleValue() == "US"){
				while(itrAllDimPoints.hasNext()){
					var currentDimPoint = itrAllDimPoints.next();
					if(currentDimPoint.getID() == "USA"){
						setOfDimensionPoints.add(currentDimPoint);
					}
				}
			}else if(node.getValue("a_Shared_Markets").getSimpleValue() == "CAN"){
				while(itrAllDimPoints.hasNext()){
					var currentDimPoint = itrAllDimPoints.next();
					if(currentDimPoint.getID() == "Canada"){
						setOfDimensionPoints.add(currentDimPoint);
					}
				}
			}else{
				setOfDimensionPoints.add(parentDimPoint);
			}

			log.info("setOfDimensionPoints = "+ setOfDimensionPoints);
			log.info("setOfDimensionPointsBkp =" + setOfDimensionPointsBkp);
			if(!setOfDimensionPointsBkp.equals(setOfDimensionPoints)){
				log.info("Old and New Dimension Points are not equal, so updating");
				ref.setDimensionPoints(setOfDimensionPoints);			
			}
		}
	});
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
	sReferencingCCs.addAll(node.getReferencedByProducts());

	if (!sReferencingCCs.isEmpty()) {
		for (var num = 0; num < sReferencingCCs.size(); num++) {
			var refCC = sReferencingCCs.get(num);
			var oStyleCC = refCC.getSource();
		  	var productReferences = oStyleCC.getReferences().asList();
			for(var index=0;index<productReferences.size();index++){
				var referenceTypeID = productReferences.get(index).getReferenceType().getID();
				if(referenceTypeID == 'CCToPhotoShotRef'){
					var oldTarget =productReferences.get(index).getTarget();
					if(oldTarget.getID() == node.getID()){                                              
						productReferences.get(index).delete();             
					}
				}
			}
		}
	}

    
	//Finally delete the node
	log.info("Delete Node");
	node.delete();
	
}else{

	node.getValue('a_Shot_Request_Method').setSimpleValue("Manual");
	//node.getValue('a_Shot_Request_Status').setSimpleValue("Submitted");
	//node.getValue('a_Market_PhotoShot_Requested_In').setSimpleValue("US");
	var currentContext = step.getCurrentContext().getID();
	var context = null;

	log.info("Current Context = " + currentContext);
	//This will run only in US & CA contexts. If more contexts are introduced, then this needs to be modified accordingly.
	if(node.getReferencedBy().size() == 0){
		if(currentContext == "EN_US"){
			setVisibility("EN_CA");
		}else{
			setVisibility("EN_US");
		}
	}else{
		log.info("In Else Block With Context " + currentContext);
		setVisibility(currentContext);
	}

	//Below code is to push the shot request object to next state (Submitted) in workflow.\
	if (node.isInState("wf_ShortRequestLifeCycle", "Draft")) {
		node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Draft").triggerByID("Submit", "Moved to 'Submitted' state");
	}
}
}
else
{
	//---------Assigning Old Values Block Start----
var valOldSharedMarket = node.getValue('a_Old_Shared_Markets').getSimpleValue();
var valOldSharedMarketcurr = node.getValue('a_Shared_Markets').getSimpleValue();
if(valOldSharedMarketcurr != null || valOldSharedMarketcurr != ''){
node.getValue('a_Shared_Markets').deleteCurrent();
if(valOldSharedMarket != null || valOldSharedMarket != ''){
node.getValue('a_Shared_Markets').setSimpleValue(valOldSharedMarket);
}
}
else{
if(valOldSharedMarket != null || valOldSharedMarket != ''){
node.getValue('a_Shared_Markets').setSimpleValue(valOldSharedMarket);
}
}
//--------------------
var valOldShotIns = node.getValue('a_Old_Shot_Instructions').getSimpleValue();
var valOldShotInscurr = node.getValue('a_Shot_Instructions').getSimpleValue();
if(valOldShotInscurr != null || valOldShotInscurr != ''){
node.getValue('a_Shot_Instructions').deleteCurrent();
if(valOldShotIns != null || valOldShotIns != ''){
node.getValue('a_Shot_Instructions').setSimpleValue(valOldShotIns);
}
}
else{
if(valOldShotIns != null || valOldShotIns != ''){
node.getValue('a_Shot_Instructions').setSimpleValue(valOldShotIns);
}
}
//--------------------
var valOldShotType = node.getValue('a_Old_Shot_Type').getSimpleValue();
var valOldShotTypecurr = node.getValue('a_Shot_Type').getSimpleValue();
if(valOldShotTypecurr != null || valOldShotTypecurr != ''){
node.getValue('a_Shot_Type').deleteCurrent();
if(valOldShotType != null || valOldShotType != ''){
node.getValue('a_Shot_Type').setSimpleValue(valOldShotType);
}
}
else{
if(valOldShotType != null || valOldShotType != ''){
node.getValue('a_Shot_Type').setSimpleValue(valOldShotType);
}
}
//--------------------
var valOldSitePlac = node.getValue('a_Old_Site_Placement').getSimpleValue();
var valOldSitePlaccurr = node.getValue('a_Site_Placement').getSimpleValue();
if(valOldSitePlaccurr != null || valOldSitePlaccurr != ''){
node.getValue('a_Site_Placement').deleteCurrent();
if(valOldSitePlac != null || valOldSitePlac != ''){
node.getValue('a_Site_Placement').setSimpleValue(valOldSitePlac);
}
}
else{
if(valOldSitePlac != null || valOldSitePlac != ''){
node.getValue('a_Site_Placement').setSimpleValue(valOldSitePlac);
}
}
						var a_shotToCCReferencesNew = node.getReferences().asList();
						for(var a_count=0;a_count<a_shotToCCReferencesNew.size();a_count++){
	    					var a_referenceTypeID = a_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
	    					if(a_referenceTypeID == 'ShotRequestToStylingPieceCCRef'){
								a_shotToCCReferencesNew.get(a_count).delete();             
							}
						}
							var ar_shotToCCReferencesNew = node.getReferences().asList();
							for(var a_count=0;a_count<ar_shotToCCReferencesNew.size();a_count++){
							var ar_referenceTypeID = ar_shotToCCReferencesNew.get(a_count).getReferenceType().getID();
							if(ar_referenceTypeID == 'OldShotRequestToStylingPieceCCRef'){
								var a_oCC = ar_shotToCCReferencesNew.get(a_count).getTarget();
								var a_val = ar_shotToCCReferencesNew.get(a_count).getValue("a_Styling_Piece_Instructions").getSimpleValue();
								var a_newRef = node.createReference(a_oCC, "ShotRequestToStylingPieceCCRef");								
								a_newRef.getValue("a_Styling_Piece_Instructions").setSimpleValue(a_val);
								}
							}
//---------Assigning Old Values Block End----
	//throw "No modification allowed as Lifecycle status is Ready for Review.";
	throw "No modification allowed.";
	}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node) {
//Removal of Non-DGL Outbound
//queue.queueDerivedEvent(shot,node);
}