/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestRejectionValidation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "ShotRequestRejectionValidation",
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log) {
var result = true;
var entityRefApproveStatus = null;
var stat = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
var site = node.getValue('a_Site_Placement').getID();
//log.info("site "+site);
var referencedBy = node.getReferencedBy().toArray();
		for(var j=0; j< referencedBy.length;j++){
			var referenceTypeID = referencedBy[j].getReferenceType().getID();
			if(referenceTypeID == 'CCToPhotoShotRef'){
				var sourceCC = referencedBy[j].getSource();
				var ccDeactivationDate = sourceCC.getValue('a_CC_End_Date').getSimpleValue();
				log.info("ccDeactivationDate "+ccDeactivationDate);
				/*var unnapprovedSet = sourceCC.getNonApprovedObjects().iterator();
				while (unnapprovedSet.hasNext()){
					var partObject = unnapprovedSet.next();
					if (partObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject){
						//log.info(partObject.getTargetID());
						if(partObject.getTargetID() == node.getID()){
							entityRefApproveStatus = "Unapproved";
							//log.info("entityRefApproveStatus "+entityRefApproveStatus);	
							}
					}
				}*/
				}
				}
				
var ccDeactivationDateFlag = null;
if(ccDeactivationDate != null){					
						var formatter =java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
		                    var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");  
		                    var now = java.time.ZonedDateTime.now();
		                    var current = now.format(formatter);
		                    ccDeactivationDate = simpleDateFormat.parse(ccDeactivationDate);
		                    current = simpleDateFormat.parse(current);
		                    log.info("current "+current);
		                    if(current.after(ccDeactivationDate) || current.compareTo(ccDeactivationDate)==0){
		                        ccDeactivationDateFlag = true;
		                        //log.info("deactivation date before current");
		                    }
		                    else{
		                    	ccDeactivationDateFlag = false;
		                    	//log.info("deactivation date after current");
		                    	}
}

var rejReason = node.getValue('a_Shot_Request_Rejection_Reason').getSimpleValue();
var rejComment = node.getValue('a_Shot_Request_Rejection_Comments').getSimpleValue();
//var approvalStatus = sourceCC.getApprovalStatus();
//log.info("approvalStatus "+approvalStatus);
var instance = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
//log.info("state "+state);

if(rejReason == null){
			if (rejComment != null){
			node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
			}
//result = "Please enter rejection reason to reject shot request "+node.getID()+".";
result = "Please verify you have entered rejection reason";
}
else if(stat == "Draft" || stat == "Submitted"){
			if(stat != "Rejected"){
			if (rejReason != null){
			node.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
			}
			if (rejComment != null){
			node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
			}
			}
	//result = "Shot Request cannot be rejected in Draft or Submitted Status.";	
	result = "Cannot reject a shot request in this status";
	}
//Changes made as per PPIM-9980
//else if(stat == "Complete" && approvalStatus != "Not in Approved workspace" && site == 5 && (ccDeactivationDate == null || ccDeactivationDateFlag == false) && instance == null){
else if(stat == "Complete" && site == 5 && (ccDeactivationDate == null || ccDeactivationDateFlag == false) && instance == null){
			if (rejReason != null){
			node.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
			}
			if (rejComment != null){
			node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
			}
result = "You can not reject a P1 image. You will need to deactivate the CC before rejecting this image.";
}
else{
	if (stat == "Ready for Review" && node.isInState("wf_ShortRequestLifeCycle", "Ready_to_Review") == true){
	node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Ready_to_Review").triggerByID("Reject","Web UI Based Shot Request Rejection");
	}
	//else if ((stat == "Complete" && approvalStatus == "Not in Approved workspace" && instance == null) || (stat == "Complete" && site == 5 && ccDeactivationDate != null && ccDeactivationDateFlag == true && instance == null) || (stat == "Complete" && approvalStatus != "Not in Approved workspace" && (!(entityRefApproveStatus == "Unapproved")) && site != 5 && (ccDeactivationDate == null || ccDeactivationDateFlag == false) && instance == null)){
	//Changes made as per PPIM-9980
	//else if ((stat == "Complete" && approvalStatus == "Not in Approved workspace" && instance == null) || (stat == "Complete" && site == 5 && ccDeactivationDate != null && ccDeactivationDateFlag == true && instance == null) || (stat == "Complete" && site != 5)){
	else if ((stat == "Complete" && site == 5 && ccDeactivationDate != null && ccDeactivationDateFlag == true && instance == null) || (stat == "Complete" && site != 5)){
		node.startWorkflowByID("wf_ShortRequestLifeCycle",'Initiating Shot Request Workflow Based on Rejection');
		var task=node.getTaskByID("wf_ShortRequestLifeCycle","Draft");
		task.triggerByID("Auto_Submit_Rejection",'Web UI Based Shot Rejection');
		}
	else{
			if(stat != "Rejected"){
			if (rejReason != null){
			node.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
			}
			if (rejComment != null){
			node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
			}
			}
		result = "Shot request "+node.getID()+" cannot be rejected.";
		}
	
}
return result;
}