/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DeleteUnattendedShotRequests",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Delete Unattended Shot Requests",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "alias" : "CurrentCtxNode",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
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
exports.operation0 = function (CurrentCtxNode,step,log) {

if(CurrentCtxNode.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue() == "Draft"){

	var contextHome = step.getContextHome();
	var contexts = contextHome.getContexts();
	var itr = contexts.iterator();
	var id = CurrentCtxNode.getID();
	var node;
	
	while(itr.hasNext()){
		var ctx = itr.next().getID();
		log.info("Running for " + ctx + " Context");
		setVisibility(ctx);
	}
	
	CurrentCtxNode.delete();
}

function setVisibility(ctx){
	log.info("ctx ==== " + ctx);
	step.executeInContext(ctx, function(step){
		
		node = step.getEntityHome().getEntityByID(id);		
		
		//Below code to delete workflow instances (if any)
		
		if(!((node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle")) == null)){
			node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").delete("");
		}
		
		//Below code is to delete reference by links
		
		var sReferencingCCs = new java.util.ArrayList();
		sReferencingCCs.addAll(node.getReferencedByProducts());
		log.info("sReferencingCCs " + sReferencingCCs);
		if (!sReferencingCCs.isEmpty()) {
			for (var i = 0; i < sReferencingCCs.size(); i++) {
		     	var refCC = sReferencingCCs.get(i);
		       	var oStyleCC = refCC.getSource();
		       	var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef");
				var sCCToShotReqRefs = oStyleCC.getReferences(sReferenceType);
				
				log.info("sCCToShotReqRefs ---> " + sCCToShotReqRefs);
				if (!sCCToShotReqRefs.isEmpty()) {
					for (var j = 0; j< sCCToShotReqRefs.size(); j++) {
						if(sCCToShotReqRefs.get(j)){
							if(sCCToShotReqRefs.get(j).getTarget().getID() == node.getID()){
	                        			log.info("MATCHED -- " + node.getID());
	                        			sCCToShotReqRefs.get(j).delete();	 
	                        			//oStyleCC.approve();            
	                        		}	
						}
				   	}
				}
			}
		}
		
		//Below code to delete referenced links
		var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToStylingPieceCCRef");
		var sShotReqToCCRefs = node.getReferences(sReferenceType);
	
		log.info("sShotReqToCCRefs - " + sShotReqToCCRefs);
		if (!sShotReqToCCRefs.isEmpty()) {
		   for (var p = 0; p < sShotReqToCCRefs.size(); p++) {
			if(sShotReqToCCRefs.get(p)){
				sShotReqToCCRefs.get(p).delete();
			}
		   }
		}
	});
}

}