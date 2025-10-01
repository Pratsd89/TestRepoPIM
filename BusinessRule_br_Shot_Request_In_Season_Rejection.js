/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Shot_Request_In_Season_Rejection",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Shot Request In Season Rejection Condition",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
exports.operation0 = function (node) {
//if shot request is in shot request lifecycle workflow
if(node.isInWorkflow('wf_ShortRequestLifeCycle')){
	var valShotStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
	var valShotReason = node.getValue('a_Shot_Request_Rejection_Reason').getSimpleValue();
	var valShotComment = node.getValue('a_Shot_Request_Rejection_Comments').getSimpleValue();
	if (valShotStatus != "Draft" && valShotStatus != "Submitted" && valShotStatus != null){
		if((valShotReason != null && valShotReason != '') && (valShotComment != null && valShotComment != '')){
			node.getValue('a_Shot_Request_Rejection_Status').setSimpleValue("Rejected");
			node.getValue('a_Shot_Request_Lifecycle_Status').setSimpleValue("Rejected");
			if(node.isInState("wf_ShortRequestLifeCycle","Ready_to_Review")) {
				var wf = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
				wf.getTaskByID("Ready_to_Review").triggerByID("Reject","");
			}
			return true;		
		}
		else{
			if (valShotReason != null || valShotReason != ''){
			node.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
			}
			if (valShotComment != null || valShotComment != ''){
			node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
			}
			return "Please verify that you have entered rejection reason and comments";
		}
	
	}
	else{
		if (valShotReason != null || valShotReason != ''){
			node.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
			}
		if (valShotComment != null || valShotComment != ''){
			node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
			}
		return "Cannot reject a shot request in this status";
	}
	
}
//if the shot request is not in the shot request lifecycle workflow
else{
	var valShotReason = node.getValue('a_Shot_Request_Rejection_Reason').getSimpleValue();
	var valShotComment = node.getValue('a_Shot_Request_Rejection_Comments').getSimpleValue();
	if((valShotReason != null && valShotReason != '') && (valShotComment != null && valShotComment != '')){
		
	}
	else{
		if (valShotReason != null || valShotReason != ''){
		node.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
		}
		if (valShotComment != null || valShotComment != ''){
		node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
		}
		return "Please verify that you have entered rejection reason and comments";
	}
	var sitePlacement = node.getValue('a_Site_Placement').getSimpleValue();
	
	var shotRequestLifeCycleStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
	if(sitePlacement == null){
		return ' The site placement can not be null. Please add site placement and try again';
	}
	logger.info(shotRequestLifeCycleStatus);
	if(shotRequestLifeCycleStatus == 'Complete'){
		var referencedBy = node.getReferencedBy().toArray();
		for(var j=0; j< referencedBy.length;j++){
			var referenceTypeID = referencedBy[j].getReferenceType().getID();
			if(referenceTypeID == 'CCToPhotoShotRef'){
				var sourceCC = referencedBy[j].getSource();
				var ccDeactivationDate = sourceCC.getValue('a_CC_End_Date').getSimpleValue();
				
				if(ccDeactivationDate == null && sitePlacement == 'Main P1'){
					return 'You can not reject a P1 image. You will need to deactivate the CC before rejecting this image.';
				}
				else{
					var ccDeactivationDateFlag = false;
					if(ccDeactivationDate == null){
						ccDeactivationDateFlag = false;
					}
					else{
						var approvalStatus = sourceCC.getApprovalStatus();	                    
		                    var formatter =java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
		                    var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");  
		                    var now = java.time.ZonedDateTime.now();
		                    var current = now.format(formatter);
		                    ccDeactivationDate = simpleDateFormat.parse(ccDeactivationDate);
		                    current = simpleDateFormat.parse(current);
		                    if(current.after(ccDeactivationDate) || current.compareTo(ccDeactivationDate)==0){
		                        ccDeactivationDateFlag = true;
		                    }
					}
					
					
	                    //checking if site placement is not equal to 5 or is equal to 5 and the approval status is approved and the deactivation date is a past date, then sending the CC to the workflow
					if(sitePlacement != 'Main P1' || (sitePlacement == 'Main P1' && (approvalStatus =='Partly approved' || approvalStatus=="Completely approved" || approvalStatus=="Approved in current context") && ccDeactivationDateFlag == true)){
	                  
	                        node.getValue('a_Shot_Request_Lifecycle_Status').setSimpleValue("Rejected");
	                        node.getValue('a_Shot_Request_Rejection_Status').setSimpleValue("Rejected");
	                        var references = node.getReferences().asList().toArray();
	                        for(var k =0 ; k <references.length;k++){
	                        		referenceTypeID = references[k].getReferenceType().getID();
	                        		if(referenceTypeID == 'ShotRequestToExternalAsset'){
	                        			var content = references[k].getTarget();
	                        			var contentReference = content.getReferencedBy().toArray();
	                        			for(var m = 0;m<contentReference.length;m++){
	                        				var contentReferenceType = contentReference[m].getReferenceType().getID();
	                        				var targetID = contentReference[m].getSource().getObjectType().getID();
	                        				if(targetID == 'CustomerChoice' || targetID == 'Style'){
	                        					contentReference[m].delete();
	                        				}
	                        			}
	                        		}
	                        }
	                        node.startWorkflowByID("wf_ShortRequestLifeCycle",'');
	                        var task=node.getTaskByID("wf_ShortRequestLifeCycle","Draft");
		                   var triggerResult = task.triggerByID("Auto_Submit_Rejection",'');
			              return true;
	                    }
	                    else{
	                    	return 'The CC is not deactivated hence the shot request can not be rejected';
	                    }
					
				}
				
			}
		}
	}
	else{
		return 'The shot request '+node.getID()+' is not in life cycle workflow and its life cycle status is not Complete hence it can not be rejected.';
	}
	
}

}