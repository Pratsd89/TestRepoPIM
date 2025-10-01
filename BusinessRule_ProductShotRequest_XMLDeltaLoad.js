/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ProductShotRequest_XMLDeltaLoad",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ProductShotRequest_XMLDeltaLoad",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
exports.operation0 = function (manager,node) {
var wf = manager.getWorkflowHome().getWorkflowByID("wf_ShortRequestLifeCycle");
var ShotReqLifeCycle = node.getValue("a_Source_Shot_Request_Lifecycle_Status").getSimpleValue();
var wfErrorMessage = null;
if(ShotReqLifeCycle=="Submitted") 
{
	if(!node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle"))
	{
		wf.start(node, "Started");
		movetostate(node,1)
	}	
}
else if(ShotReqLifeCycle=="Ready for Review") 
{
	if(!node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle"))
	{
		wf.start(node, "Started");
		movetostate(node,2);	
	}	
	else
	{
		if(node.isInState("wf_ShortRequestLifeCycle","Submitted"))
		{
			nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
			var submitted = nWF.getTaskByID("Submitted");
			wfErrorMessage = submitted.triggerByID("Ready_to_Review","moved to Ready for Review").getScriptMessage();
			if(wfErrorMessage != null)
			{
				node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : "+wfErrorMessage);
			}
			else
			{
				if(node.getValue("a_error_message").getSimpleValue() != null)
				{
					node.getValue("a_error_message").deleteCurrent();
				}
			} 
		}
	}
}
else if(ShotReqLifeCycle=="Complete") 
{
	if(!node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle"))
	{
		wf.start(node, "Started");
		movetostate(node,3);
	}	
	else
	{
		if(node.isInState("wf_ShortRequestLifeCycle","Submitted"))
		{
			nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
			var submitted = nWF.getTaskByID("Submitted");
			wfErrorMessage = submitted.triggerByID("Ready_to_Review","moved to Ready for Review").getScriptMessage();
			if(node.isInState("wf_ShortRequestLifeCycle","Ready_to_Review"))
			{
				nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
				var review = nWF.getTaskByID("Ready_to_Review");
				wfErrorMessage = review.triggerByID("Approve","moved to Approved").getScriptMessage(); 
			}
			if(wfErrorMessage != null)
			{
				node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : "+wfErrorMessage);
			}
			else
			{
				if(node.getValue("a_error_message").getSimpleValue() != null)
				{
					node.getValue("a_error_message").deleteCurrent();
				}
			} 
		}
		else if(node.isInState("wf_ShortRequestLifeCycle","Ready_to_Review"))
		{
			nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
			var review = nWF.getTaskByID("Ready_to_Review");
			wfErrorMessage = review.triggerByID("Approve","moved to Approved").getScriptMessage(); 
			if(wfErrorMessage != null)
			{
				node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : "+wfErrorMessage);
			}
			else
			{
				if(node.getValue("a_error_message").getSimpleValue() != null)
				{
					node.getValue("a_error_message").deleteCurrent();
				}
			} 
		}
	}
}	
function movetostate(node,num)
{
	if(num==1)
	{
		nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
		var draft = nWF.getTaskByID("Draft")
		wfErrorMessage = draft.triggerByID("Submit","moved to Submit").getScriptMessage();
		if(wfErrorMessage != null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : "+wfErrorMessage);
		}
		else
		{
			if(node.getValue("a_error_message").getSimpleValue() != null)
			{
				node.getValue("a_error_message").deleteCurrent();
			}
		} 
	}	
	else if(num==2)
	{
		nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
		var draft = nWF.getTaskByID("Draft");
		wfErrorMessage = draft.triggerByID("Submit","moved to Submit");
		nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
		var submitted = nWF.getTaskByID("Submitted");
		wfErrorMessage = submitted.triggerByID("Ready_to_Review","moved to Ready for Review").getScriptMessage();
		if(wfErrorMessage != null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : "+wfErrorMessage);
		}
		else
		{
			if(node.getValue("a_error_message").getSimpleValue() != null)
			{
				node.getValue("a_error_message").deleteCurrent();
			}
		} 
	}
	else if(num==3)
	{
		nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
		var draft = nWF.getTaskByID("Draft");
		wfErrorMessage = draft.triggerByID("Submit","moved to Submit").getScriptMessage(); 
		nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
		var submitted = nWF.getTaskByID("Submitted");
		wfErrorMessage = submitted.triggerByID("Ready_to_Review","moved to Ready for Review").getScriptMessage(); 
		if(node.isInState("wf_ShortRequestLifeCycle","Ready_to_Review"))
		{
			nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
			var review = nWF.getTaskByID("Ready_to_Review");
			wfErrorMessage = review.triggerByID("Approve","moved to Approved").getScriptMessage(); 
		}
		if(wfErrorMessage != null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : "+wfErrorMessage);
		}
		else
		{
			if(node.getValue("a_error_message").getSimpleValue() != null)
			{
				node.getValue("a_error_message").deleteCurrent();
			}
		} 
	}
}
}