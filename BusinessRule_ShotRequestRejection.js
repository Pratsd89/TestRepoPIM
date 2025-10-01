/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestRejection",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request Rejection",
  "description" : "Shot Request Rejection",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {

var referencedBy = node.getReferencedBy().toArray();
for(var i = 0 ; i< referencedBy.length;i++){
	var referenceTypeName = referencedBy[i].getReferenceType().getID();
	if(referenceTypeName == 'CCToPhotoShotRef'){
		var reference = referencedBy[i];
		var valShotStatus = reference.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
		logger.info(valShotStatus);
		var valShotReason = reference.getValue('a_Shot_Request_Rejection_Reason').getSimpleValue();
		var valShotComment = reference.getValue('a_Shot_Request_Rejection_Comments').getSimpleValue();
		if (valShotStatus != "Draft" && valShotStatus != "Submitted"){
			if((valShotReason != null && valShotReason != '') && (valShotComment != null && valShotComment != '')){
				reference.getValue('a_Shot_Request_Rejection_Status').setSimpleValue("Rejected");
				reference.getValue('a_Shot_Request_Lifecycle_Status').setSimpleValue("Rejected");		
				}
				else{
//					portal.showAlert("ERROR", "Please verify that you have entered rejection reason and comments");
throw 'Rejection fields are incomplete';
					}
			
			}
		else{
//			portal.showAlert("ERROR", "Cannot reject a shot request in this status");
throw ' invalid status' ;
			}
	}
}
//var ID = node.getID();
//throw ID;

}