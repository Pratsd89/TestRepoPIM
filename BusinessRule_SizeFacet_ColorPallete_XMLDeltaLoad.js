/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SizeFacet_ColorPallete_XMLDeltaLoad",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SizeFacet_ColorPallete_XMLDeltaLoad",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CPBrand", "ColorPalette", "SeasonCode", "SeasonYear", "SizeFacetCategory", "SizeFacetValue" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var objectType = node.getObjectType().getID();
var workflow;
if(objectType == "SizeFacetCategory")
{
	node.approve();
}
else if(objectType == "SizeFacetValue")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		if(node.getValue("a_error_message").getSimpleValue() != null)
		{
			node.getValue("a_error_message").deleteCurrent();
		}
		node.approve();
	}
	else
	{
		node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Parent not approved");
	}
}
else if(objectType == "CPBrand")
{
	node.approve();
}
else if(objectType == "SeasonYear")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		if(node.getValue("a_error_message").getSimpleValue() != null)
		{
			node.getValue("a_error_message").deleteCurrent();
		}
		node.approve();
	}
	else
	{
		node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Parent not approved");
	}
}
else if(objectType == "SeasonCode")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		if(node.getValue("a_error_message").getSimpleValue() != null)
		{
			node.getValue("a_error_message").deleteCurrent();
		}
		node.approve();
	}
	else
	{
		node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Parent not approved");
	}
}
else
{	
	if(!node.getWorkflowInstanceByID("wf_ColorPalette"))
	{
		var workflowManager = manager.getWorkflowHome().getWorkflowByID("wf_ColorPalette");
		workflowManager.start(node, "Started");	
		workflow = node.getWorkflowInstanceByID("wf_ColorPalette");
		var modifyColorPalette = workflow.getTaskByID("ModifyColorPalette");
		wfErrorMessage = modifyColorPalette.triggerByID("Submit","Submit Triggered").getScriptMessage(); 
		if(node.getWorkflowInstanceByID("wf_ColorPalette"))
		{
			var StateID= node.getWorkflowInstanceByID("wf_ColorPalette").getTasks().toArray()[0].getState().getID();
			if(StateID=="EnglishNameApproval")
			{
				workflow = node.getWorkflowInstanceByID("wf_ColorPalette");
				var progress = workflow.getTaskByID("EnglishNameApproval");
				wfErrorMessage = progress.triggerByID("Approve","moved to Final").getScriptMessage();
			}
		}
	}
	else
	{
		var StateID= node.getWorkflowInstanceByID("wf_ColorPalette").getTasks().toArray()[0].getState().getID();
		if(StateID=="ModifyColorPalette")
		{
			workflow = node.getWorkflowInstanceByID("wf_ColorPalette");
			var modifyColorPalette = workflow.getTaskByID("ModifyColorPalette");
			wfErrorMessage = modifyColorPalette.triggerByID("Submit","Submit Triggered").getScriptMessage(); 
			if(node.getWorkflowInstanceByID("wf_ColorPalette"))
			{
				var StateID= node.getWorkflowInstanceByID("wf_ColorPalette").getTasks().toArray()[0].getState().getID();		
				if(StateID=="EnglishNameApproval")
				{
					workflow = node.getWorkflowInstanceByID("wf_ColorPalette");
					var progress = workflow.getTaskByID("EnglishNameApproval");
					wfErrorMessage = progress.triggerByID("Approve","moved to Final").getScriptMessage();
				}
			}
		}
		else if(StateID=="EnglishNameApproval")
		{
				workflow = node.getWorkflowInstanceByID("wf_ColorPalette");
				var progress = workflow.getTaskByID("EnglishNameApproval");
				wfErrorMessage = progress.triggerByID("Approve","moved to Final").getScriptMessage();
		}
		else
		{
			node.approve();
		}
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