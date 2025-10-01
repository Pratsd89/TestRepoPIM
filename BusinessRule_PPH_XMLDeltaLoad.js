/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "PPH_XMLDeltaLoad",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "PPH_XMLDeltaLoad",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Brand", "Class", "Department", "Division", "SubClass" ],
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
if(objectType == "Brand")
{
	node.approve();
}
else if(objectType == "Division")
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
else if(objectType == "Department")
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
else if(objectType == "Class")
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
	if(objectType == "SubClass")
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
}
}