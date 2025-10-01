/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestUnrejection",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request Un-rejection",
  "description" : null,
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
		if (valShotStatus += "Rejected"){
			if((valShotReason != null && valShotReason != '') && (valShotComment != null && valShotComment != '')){
				reference.getValue('a_Shot_Request_Rejection_Status').setSimpleValue("Ready to Review");
				reference.getValue('a_Shot_Request_Lifecycle_Status').setSimpleValue("Ready to Review");		
				}
				else{
					throw 'Rejection fields are incomplete';
					}
			
			}
		else{
			throw ' invalid status' ;
			}
	}
}
}