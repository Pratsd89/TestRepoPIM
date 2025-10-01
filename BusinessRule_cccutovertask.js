/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "cccutovertask",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CC Workflow Cut Over task",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
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
    "alias" : "reftype",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToExternalAsset",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,reftype,shotref) {
var status = 0;

var wf = manager.getWorkflowHome().getWorkflowByID("wf_CCEnrichment");

var ccLifeCycle = node.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
log.info(ccLifeCycle);
var myref = null;
if(ccLifeCycle=="In Progress"){
	myref = node.getReferences(reftype).toArray();
	
	 if(myref.length >0){
		var eligibleCC = getSitePlacement(myref); // if a_Site_Placement of Shot request is Main P1
		if(eligibleCC){ 					
		
		//CC has shot requests associated			
				var shotLifecycle = getLifeCycle(myref); //Get a_Shot_Request_Lifecycle_Status of each shot 
				log.info(shotLifecycle)
	 
			if(shotLifecycle == "Submitted"){
					if(!node.getWorkflowInstanceByID("wf_CCEnrichment")){
						wf.start(node, "Started for case 2");
						status=2;						
						movetostate(status)//move to Modify or Create Alt shots state
						}		
					}
				else if(shotLifecycle == "Ready for Review"){
						
						if(!node.getWorkflowInstanceByID("wf_CCEnrichment")){
							wf.start(node, "Started for case 3");
							status = 3;
							
							movetostate(status)//move to Review and Approve photos state
						}
					}
				else if(shotLifecycle == "Complete"){
					
					if(!node.getWorkflowInstanceByID("wf_CCEnrichment")){
							wf.start(node, "Started for case 4");
							status=4;
							log.info("Calling move");
							movetostate(status)
						}	
					}
	 			}			
				
				else{
					if(!node.getWorkflowInstanceByID("wf_CCEnrichment")){
					wf.start(node, "Started for case 1");
					
					}
			}
		}
}

//This function moves the node to the appropriate state in WF --- START
function movetostate(num){
	var inState = null;	
	log.info("-----------------------------")
		 
	if (num == 3){
		inState = node.getTaskByID("wf_CCEnrichment", "NewCCEnrich_Photo2")
		log.info(inState)
		if(inState!=null){
		inState.triggerByID("SubmitForReview","move to Modify or Create Alt Shot State");
		log.info("node is in  NewCCEnrich_Photo3::::"+node.isInState("wf_CCEnrichment","NewCCEnrich_Photo3"))
		}
	}
	if (num == 4){
		
		inState = node.getTaskByID("wf_CCEnrichment", "NewCCEnrich_Photo2")
		
		if(inState!=null){
		inState.triggerByID("SubmitForReview","move to Modify or Create Alt Shot State");
		log.info("node is in  NewCCEnrich_Photo3::::"+node.isInState("wf_CCEnrichment","NewCCEnrich_Photo3"))
		}
		inState = node.getTaskByID("wf_CCEnrichment", "NewCCEnrich_Photo3")
		if(inState!=null){		
		inState.triggerByID("Submit","move to Final / Exit State");
		log.info("node is in NewCCEnrich_Photo4 ::::"+node.isInState("wf_CCEnrichment","NewCCEnrich_Final"))
		}
	}
	
}
//This function moves the node to the appropriate state in WF --- END

//Check the Life Cycle Status of the Photo Shot Requests linked to this node --- START
function getLifeCycle(shotlist){
	
	var result = null; 
	var contentID1 = false;
	var starget = null
	var shotLifeCycle = "no result";
	for(var i=0;i<shotlist.length;i++){
		starget = shotlist[i].getTarget();		
		//contentID1 = getContID(starget); //This check is no longer required as per comment in 1801 --- 6th April 2020
		 
		// if(contentID1){
		 	shotLifeCycle = starget.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
		 	var sitePlace = starget.getValue("a_Site_Placement").getSimpleValue();
		 	
			if(sitePlace == "Main P1"){			
					
					if(shotLifeCycle== "Submitted"){
						result = "Submitted";
						}
					else if(shotLifeCycle== "Ready for Review"){
						result = "Ready for Review";
						}
					else if(shotLifeCycle== "Complete" ){
						result = "Complete";
							
						}
		 		
					else result = "no result";
		 	}
		
	}
	return result;
}
//Check the Life Cycle Status of the Photo Shot Requests linked to this node --- END

//Check if ContentID is not equal to 1 -- START
/*function getContID(shotReq){
	  var extAssetref = shotReq.getReferences(shotref).toArray();
	  //log.info(extAssetref.length)
	  var flag = false;
	  if (!extAssetref.length>0){
	  	flag = true;
	  }
	  else{
	  for(i=0;i<extAssetref.length;i++){
	  	target = extAssetref[i].getTarget();
	  	var content = target.getValue("a_Content_Type_ID").getSimpleValue();
	  	if(content == 1){
	  		flag= false;
	  		break;}
	  	else{
	  		flag = true;}
	  	}	
	  }
	return flag;
}*/
//Check if ContentID is not equal to 1 -- END


//Check if Site Placement is 5 (Main P1) -- START
function getSitePlacement(shotlist1){
	var result = false;
	for(i=0;i<shotlist1.length;i++){
		target = shotlist1[i].getTarget();
		//log.info("Target"+(i+1)+" == " + target);
		var sitePlace = target.getValue("a_Site_Placement").getSimpleValue();
		//log.info("------>>"+sitePlace)
		if(sitePlace == "Main P1"){
			result = true;		
		
		}
		
		if(result == true)
			return result;
	}
		return result;
}

//Check if Site Placement is 5 (Main P1) -- END


 		
				
}