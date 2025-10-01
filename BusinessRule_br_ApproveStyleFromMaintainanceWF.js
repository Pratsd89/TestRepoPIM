/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ApproveStyleFromMaintainanceWF",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_ApproveStyleFromMaintainanceWF_WebUI",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  } ]
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
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,webUI,compCheck) {
//loop through each selected product in Web UI
var selection = webUI.getSelection().iterator();
var wfName = "wf_StyleMaintenanceWorkflow";

while (selection.hasNext()) {
	node = selection.next();
	
	var wf = node.getWorkflowInstanceByID(wfName);
	if(wf != null){
		var header = "";
		var message = "";
		var CCList = node.getChildren();
		
		// Check if any CC is in CC Maintanance State
			for(i = 0; i < CCList.size(); i++){
				if(CCList.get(i).isInState(wfName,"CCMaintenance")) {	
					var ccMain = CCList.get(i).getWorkflowInstanceByID(wfName);		
					var shotRequests = CCList.get(i).getReferences(manager.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef")).toArray();		
					if(shotRequests.length !=0){
						// Check missing attrs for CC
						var approveCC = ccMain.getTaskByID("CCMaintenance").triggerByID("ApproveCC", "Approve CC");	
						if(approveCC.isRejectedByScript()){
							message = ", "+approveCC.getScriptMessage();				
						}else{
							// Check missing attrs for SKU
							var SKUList = CCList.get(i).getChildren();
							for(j = 0; j< SKUList.size();j++){
								if(SKUList.get(j).isInState(wfName, "SKUMaintenance")){
									var skuMaint = SKUList.get(j).getWorkflowInstanceByID(wfName);								
									var approveSKU = skuMaint.getTaskByID("SKUMaintenance").triggerByID("ApproveSKU", "Approve SKU");	
										if(approveSKU.isRejectedByScript()){
											message = ", "+approveSKU.getScriptMessage();			
										}
								}
							}
						}
					}else{
						message = ", CC is missing shot request";
					}					
				}
			}
			
			var result = wf.getTaskByID("StyleMaintenance").triggerByID("ApproveStyle","test");
			if(result.isRejectedByScript()){	
				header = node.getName()+" ("+node.getID()+")";	
				webUI.showAlert("ERROR", header, result.getScriptMessage());
			}else{		
				webUI.showAlert("ACKNOWLEDGMENT", "Business Condition Maintenance WF completed for Style "+message);
			}
	}
}
	







}