/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Dropship_Reject_Shots",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Dropship Reject  Shots",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log) {
var rejectionReason = node.getValue('a_Shot_Request_Rejection_Reason').getSimpleValue();
var rejectionComment = node.getValue('a_Shot_Request_Rejection_Comments').getSimpleValue();
var rejectionUpdateTime = node.getValue('a_Shot_Request_Rejection_Updated_Time').getSimpleValue()

if (rejectionReason != null && rejectionReason != '') {
	if (rejectionComment != null && rejectionComment != '') {
        if(rejectionUpdateTime !=null && rejectionUpdateTime !=''){
        	//Rejection Logic Implementation for Dropship
		try{
		var result = true;
		//var entityRefApproveStatus = null;
		var shotLifeCycleStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
		var site = node.getValue('a_Site_Placement').getID();
		var referencedBy = node.getReferencedBy().toArray();
		for (var j = 0; j < referencedBy.length; j++) {
			var referenceTypeID = referencedBy[j].getReferenceType().getID();
			if (referenceTypeID == 'CCToPhotoShotRef') {
				var sourceCC = referencedBy[j].getSource();
				var ccDeactivationDate = sourceCC.getValue('a_CC_End_Date').getSimpleValue();
				/*var unnapprovedSet = sourceCC.getNonApprovedObjects().iterator();
				while (unnapprovedSet.hasNext()) {
					var partObject = unnapprovedSet.next();
					if (partObject instanceof com.stibo.core.domain.partobject.EntityReferencePartObject) {
						if (partObject.getTargetID() == node.getID()) {
							entityRefApproveStatus = "Unapproved";
						}
					}
				}*/
			}
		}

		var ccDeactivationDateFlag = null;
		if (ccDeactivationDate != null) {
			var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
			var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");
			var now = java.time.ZonedDateTime.now();
			var current = now.format(formatter);
			ccDeactivationDate = simpleDateFormat.parse(ccDeactivationDate);
			current = simpleDateFormat.parse(current);
			if (current.after(ccDeactivationDate) || current.compareTo(ccDeactivationDate) == 0) {
				ccDeactivationDateFlag = true;
			} else {
				ccDeactivationDateFlag = false;
			}
		}


		//var approvalStatus = sourceCC.getApprovalStatus();
		var instance = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");

		//Rejection through Event processor for Dropship Products only
		if(node.getValue('a_External_Source_Image_URL').getSimpleValue() !=null && node.getValue('a_External_Source_Image_URL').getSimpleValue() !='' ){
			
			if (shotLifeCycleStatus == "Draft" || shotLifeCycleStatus == "Submitted") {

				log.info("Deleting Workflow Instance");
				if(!((node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle")) == null)){
				node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").delete("");
				}

				//Delete Draft/Submitted Dropship Shots
				log.info(node.getID() + " Deleting the shot request in " +shotLifeCycleStatus+" status");
				var shotReferencingCCs = new java.util.ArrayList();
				shotReferencingCCs.addAll(node.getReferencedByProducts());
				if (!shotReferencingCCs.isEmpty()) {
					for (var num = 0; num < shotReferencingCCs.size(); num++) {
						shotReferencingCCs.get(num).delete();				
					}
				}
				node.delete()

			}
			//Changes made as per PPIM-9980
			//else if (shotLifeCycleStatus == "Complete" && approvalStatus != "Not in Approved workspace" && site == 5 && (ccDeactivationDate == null || ccDeactivationDateFlag == false) && instance == null)
			else if (shotLifeCycleStatus == "Complete" && site == 5 && (ccDeactivationDate == null || ccDeactivationDateFlag == false) && instance == null) {
					node.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
					node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
					node.getValue('a_Shot_Request_Rejection_Updated_Time').deleteCurrent();
				
				log.info(" for the Shot Request with ID: " + node.getID() + " You can not reject a P1 image. You will need to deactivate the CC before rejecting this image.");
			} else {
				if (shotLifeCycleStatus == "Ready for Review" && node.isInState("wf_ShortRequestLifeCycle", "Ready_to_Review") == true) {
					node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Ready_to_Review").triggerByID("Reject", "StiboACL Based Shot Request Rejection for Dropship");
				}
				//Changes made as per PPIM-9980
				//else if ((shotLifeCycleStatus == "Complete" && approvalStatus == "Not in Approved workspace" && instance == null) || (shotLifeCycleStatus == "Complete" && site == 5 && ccDeactivationDate != null && ccDeactivationDateFlag == true && instance == null) || (shotLifeCycleStatus == "Complete" && site != 5))
				else if ((shotLifeCycleStatus == "Complete" && site == 5 && ccDeactivationDate != null && ccDeactivationDateFlag == true && instance == null) || (shotLifeCycleStatus == "Complete" && site != 5)) {
					node.startWorkflowByID("wf_ShortRequestLifeCycle", 'Initiating Shot Request Workflow Based on Rejection');
					var task = node.getTaskByID("wf_ShortRequestLifeCycle", "Draft");
					task.triggerByID("Auto_Submit_Rejection", 'StiboACL Based Shot Request Rejection for Dropship');
				} else {
					if (shotLifeCycleStatus != "Rejected") {
                            node.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
                            node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
                            node.getValue('a_Shot_Request_Rejection_Updated_Time').deleteCurrent();
					}
					log.info("Shot request " + node.getID() + " cannot be rejected in Status : "+shotLifeCycleStatus);
				}
	
			}
		} else {

			log.info("Shot request " + node.getID() + " is not eligible for Rejection as this is not Dropship shot");
			if (shotLifeCycleStatus != "Rejected") {
                    node.getValue('a_Shot_Request_Rejection_Reason').deleteCurrent();
                    node.getValue('a_Shot_Request_Rejection_Comments').deleteCurrent();
                    node.getValue('a_Shot_Request_Rejection_Updated_Time').deleteCurrent();
			}
		}
		} catch(e) {
			log.info(e)
		}
        }
	}
}



}