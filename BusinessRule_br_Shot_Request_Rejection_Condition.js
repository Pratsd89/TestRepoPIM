/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Shot_Request_Rejection_Condition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Shot Request Pre Season Rejection Condition",
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
var valShotStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
var valShotReason = node.getValue('a_Shot_Request_Rejection_Reason').getSimpleValue();
var valShotComment = node.getValue('a_Shot_Request_Rejection_Comments').getSimpleValue();
if (valShotStatus != "Draft" && valShotStatus != "Submitted" && valShotStatus != null){
	if((valShotReason != null && valShotReason != '') && (valShotComment != null && valShotComment != '')){
		node.getValue('a_Shot_Request_Rejection_Status').setSimpleValue("Rejected");
		node.getValue('a_Shot_Request_Lifecycle_Status').setSimpleValue("Rejected");
		if (node.isInState("wf_ShortRequestLifeCycle", "Ready_to_Review")) {
		node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Ready_to_Review").triggerByID("Reject", "Moved to 'Rejected' state");
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