/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Approval_PPH",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Approval PPH",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Class", "Department", "Division", "SubClass" ],
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
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
var flag=0;

if(node.isInWorkflow("wf_NewPPHEnrichment"))
{
	if (node.isInState("wf_NewPPHEnrichment","NewPPHEnrichState1"))
		{
		var wf = node.getWorkflowInstanceByID("wf_NewPPHEnrichment");
		wf.getTaskByID("NewPPHEnrichState1").triggerByID("ReadyforEnrichment","Enrichment-Processed");
		if (node.isInState("wf_NewPPHEnrichment","NewPPHEnrichEdit1"))
		{
	log.info("ye");
		var wf = node.getWorkflowInstanceByID("wf_NewPPHEnrichment");
		wf.getTaskByID("NewPPHEnrichEdit1").triggerByID("Approve","start");
		flag=1;
		}
		}
	else if (node.isInState("wf_NewPPHEnrichment","NewPPHEnrichEdit1"))
	{
	log.info("ye1");
		var wf = node.getWorkflowInstanceByID("wf_NewPPHEnrichment");
		wf.getTaskByID("NewPPHEnrichEdit1").triggerByID("Approve","start");
		flag=1;
	}
	if(flag == 1)
	{
		log.info(flag);
		//portal.showAlert("Success", null, "Approved Successfully"); 
	}
	else
	{
		//portal.showAlert("ERROR", null, "Approval Failed");
	}
}
else
{
	node.startWorkflowByID("wf_NewPPHEnrichment",'');
	if(node.isInWorkflow("wf_NewPPHEnrichment"))
	{
		if (node.isInState("wf_NewPPHEnrichment","NewPPHEnrichState1"))
		{
		var wf = node.getWorkflowInstanceByID("wf_NewPPHEnrichment");
		wf.getTaskByID("NewPPHEnrichState1").triggerByID("ReadyforEnrichment","Enrichment-Processed");
		if (node.isInState("wf_NewPPHEnrichment","NewPPHEnrichEdit1"))
		{
	log.info("ye");
		var wf = node.getWorkflowInstanceByID("wf_NewPPHEnrichment");
		wf.getTaskByID("NewPPHEnrichEdit1").triggerByID("Approve","start");
		flag=1;
		}
		}
	else if (node.isInState("wf_NewPPHEnrichment","NewPPHEnrichEdit1"))
	{
	log.info("ye");
		var wf= node.getWorkflowInstanceByID("wf_NewPPHEnrichment");
		wf.getTaskByID("NewPPHEnrichEdit1").triggerByID("Approve","start");
		flag=1;
	}
	if(flag == 1)
	{
		
		//portal.showAlert("Success", null, "Approved Successfully"); 
	}
	else
	{
		//portal.showAlert("ERROR", null, "Approval Failed");
	}
	}
}
}
/*else if (stepManager.getCurrentWorkspace().getID() == "Approved")
{
	portal.showAlert("Warning", null , "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}*/
}