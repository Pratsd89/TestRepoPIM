/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Approve_Color_Pallete",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Approve_Color_Pallete",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ColorPalette" ],
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
    "contract" : "WebUiContextBind",
    "alias" : "portal",
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,portal,stepManager,logger) {
logger.info("BR Approve_Color_Pallete");
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
var flag = 0;

if(node.isInWorkflow("wf_ColorPalette")){
	logger.info("OUTER IF");
	
	if (node.isInState("wf_ColorPalette","ModifyColorPalette")){
		logger.info("CALLING WORKLFOW wf_ColorPalette 1");
		var wf = node.getWorkflowInstanceByID("wf_ColorPalette");
		wf.getTaskByID("ModifyColorPalette").triggerByID("Submit","Color Palette in submit stage");
		if (node.isInState("wf_ColorPalette","EnglishNameApproval")){
			var wf = node.getWorkflowInstanceByID("wf_ColorPalette");
			wf.getTaskByID("EnglishNameApproval").triggerByID("Approve","Color Palette in approved stage");
		
		}
		}
	else if (node.isInState("wf_ColorPalette","EnglishNameApproval")){
		logger.info("CALLING WORKLFOW wf_ColorPalette 2");
		var wf = node.getWorkflowInstanceByID("wf_ColorPalette");
		wf.getTaskByID("EnglishNameApproval").triggerByID("Approve","Color Palette in approved stage");
		
		}
		flag=1;
}



if (flag == 0)
{
	portal.showAlert("ERROR", "Click on the Save Button to put the Color Pallete in workflow")
	log.info("Approval cannot be done");
}

else if (flag == 1)
{
	var templateClassification=stepManager.getClassificationHome().getClassificationByID(node.getID());
	var links=templateClassification.getClassificationProductLinks();

	for(var i=0;i<links.size();i++){
	var CC = links.get(i).getProduct();
		var colorPaletteName = node.getName();
		var CCName = CC.getName();
		if(colorPaletteName == CCName)
		{
			if(CC.isInWorkflow("wf_CCEnrichment")||CC.isInWorkflow("wf_CCEnrichmentCanada")||CC.isInWorkflow("wf_CCEnrichmentJapan")||CC.isInWorkflow("wf_StyleMaintenanceWorkflow")||
				(CC.isInWorkflow("wf_CCEnrichment")&& CC.isInWorkflow("wf_CCEnrichmentCanada"))||
				(CC.isInWorkflow("wf_CCEnrichment")&& CC.isInWorkflow("wf_CCEnrichmentJapan"))||
				(CC.isInWorkflow("wf_CCEnrichmentCanada")&& CC.isInWorkflow("wf_CCEnrichmentJapan"))||
				(CC.isInWorkflow("wf_CCEnrichment")&& CC.isInWorkflow("wf_CCEnrichmentCanada")&& CC.isInWorkflow("wf_CCEnrichmentJapan"))|(CC.isInWorkflow("wf_CCEnrichment")&& CC.isInWorkflow("wf_StyleMaintenanceWorkflow")))
			{
				portal.showAlert("Warning",  "Cannot Approve CC with id : " + CC.getID()+ " as it is present in the workflow"); 
			}
			else
			{
				//CC.approve();
				/*if(CC.isInWorkflow("wf_StyleMaintenanceWorkflow"))
				{
					if(CC.isInState("wf_StyleMaintenanceWorkflow","CCMaintenance")) {
    var wf1 = CC.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow");
    wf1.getTaskByID("CCMaintenance").triggerByID("ApproveCC", "Approving CCs from Style Final Validation");
    CC.approve();
    portal.showAlert("SUCCESS",null,"Approved CC with id : " + CC.getID());
				}*/
				 CC.approve();
				}
				portal.showAlert("SUCCESS", "Approval done successfully");
			}
		}
			
		}
	
	log.info("Approval done successfully");
	
}
}