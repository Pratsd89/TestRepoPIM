/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Auto_Approve_Shot_Request_Condition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Auto Approve Shot Request Condition",
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
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,CCToPhotoShotRef) {
var sitePlacement = node.getValue('a_Site_Placement').getSimpleValue();
var otherPrimaryShotRequestFlag = false;
var otherShotRequestApprovedFlag = false;
var CCApprovedFlag = false;
if(sitePlacement != 'Main P1'){
	var CCToShotRequestRef = node.getReferencedByProducts().toArray();
	if(CCToShotRequestRef.length != 0 ) { 
		var CC = CCToShotRequestRef[0].getSource();
		var CCApprovalStatus = CC.getApprovalStatus();
		
		if(CCApprovalStatus != 'Not in Approved workspace'){
			CCApprovedFlag = true;
		}
		var allPhotoShotReferences = CC.getReferences(CCToPhotoShotRef).toArray();
		for(var k =0 ; k< allPhotoShotReferences.length;k++){
			var otherShotRequests = allPhotoShotReferences[k].getTarget();
			var otherSitePlacement = otherShotRequests.getValue('a_Site_Placement').getSimpleValue();
			if(otherSitePlacement == 'Main P1'){
				otherPrimaryShotRequestFlag = true;
				var shotRequestApprovalStatus = otherShotRequests.getApprovalStatus();
				if(shotRequestApprovalStatus != 'Not in Approved workspace'){
					otherShotRequestApprovedFlag = true;
				}
				break;
			}
			
		}

		if(otherPrimaryShotRequestFlag == true && otherShotRequestApprovedFlag == true && CCApprovedFlag == true){
			return true;
		}
	}
}

return false;

}