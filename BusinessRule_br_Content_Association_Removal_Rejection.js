/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Content_Association_Removal_Rejection",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Content Association Removal Due To Rejection",
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
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
var lifeCycleStatus  = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
if(lifeCycleStatus == 'Rejected'){
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
     node.getValue('a_Shot_Request_Rejection_Status').setSimpleValue('Was Rejected Needs Approval');
     /*var references= node.getReferencedByProducts().toArray();
     for(var i=0;i<references.length;i++){
     	var cc=references[i].getSource();
     	if(cc.isInState("wf_CCEnrichment","NewCCEnrich_Photo2")) {
            var wf = cc.getWorkflowInstanceByID("wf_CCEnrichment");            
            wf.getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview","");
           
            
        }
     }*/
     
     
	
}
	                       
	                        
}