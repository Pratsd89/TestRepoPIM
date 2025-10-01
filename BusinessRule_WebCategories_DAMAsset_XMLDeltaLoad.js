/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "WebCategories_DAMAsset_XMLDeltaLoad",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "WebCategories_DAMAsset_XMLDeltaLoad",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ExternalStoredDAMAsset", "WebBU", "WebCategory", "WebDivision", "WebSubCategory" ],
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
if(objectType == "WebBU")
{
	if(node.getValue("a_Category_Description").getSimpleValue()!=null && node.getValue("a_WebCategory_Start_Date").getSimpleValue()!=null)
	{
		if(node.getValue("a_error_message").getSimpleValue() != null)				    
		{
			node.getValue("a_error_message").deleteCurrent();
		}
		node.approve();
	}
	else
	{
		if(node.getValue("a_Category_Description").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_Category_Description is missing");
		}
		else if(node.getValue("a_WebCategory_Start_Date").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_WebCategory_Start_Date is missing");
		}
	}	
}
else if(objectType == "WebDivision")
{	
	if(node.getValue("a_Category_Description").getSimpleValue()!=null && node.getValue("a_WebCategory_Start_Date").getSimpleValue()!=null && node.getValue("a_Division_Display_Type").getSimpleValue()!=null)
	{
		if(node.getValue("a_error_message").getSimpleValue() != null)				    
		{
			node.getValue("a_error_message").deleteCurrent();
		}
		if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
		{
			node.approve();
		}
		else
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Parent not approved");
		}
	}
	else
	{		
		if(node.getValue("a_Category_Description").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_Category_Description is missing");
		}
		else if(node.getValue("a_WebCategory_Start_Date").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_WebCategory_Start_Date is missing");
		}
		else if(node.getValue("a_Division_Display_Type").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_Division_Display_Type is missing");
		}
	}				
	 
}
else if(objectType == "WebCategory")
{
	if(node.getValue("a_Category_Description").getSimpleValue()!=null && node.getValue("a_WebCategory_Start_Date").getSimpleValue()!=null && node.getValue("a_Category_Display_Type").getSimpleValue()!=null)
	{
		if(node.getValue("a_error_message").getSimpleValue() != null)				    
		{
			node.getValue("a_error_message").deleteCurrent();
		}
		if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
		{
			node.approve();
		}
		else
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Parent not approved");
		}
	}
	else
	{
		if(node.getValue("a_Category_Description").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_Category_Description is missing");
		}
		else if(node.getValue("a_WebCategory_Start_Date").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_WebCategory_Start_Date is missing");
		}
		else if(node.getValue("a_Division_Display_Type").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_Division_Display_Type is missing");
		}
	}		 
}

else if(objectType == "WebSubCategory")
{
	if(node.getValue("a_Category_Description").getSimpleValue()!=null && node.getValue("a_WebCategory_Start_Date").getSimpleValue()!=null && node.getValue("a_Category_Display_Type").getSimpleValue()!=null)
	{
		if(node.getValue("a_error_message").getSimpleValue() != null)				    
		{
			node.getValue("a_error_message").deleteCurrent();
		}
		if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
		{
			node.approve();
		}
		else
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Parent not approved");
		}
	}
	else
	{
		if(node.getValue("a_Category_Description").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_Category_Description is missing");
		}
		else if(node.getValue("a_WebCategory_Start_Date").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_WebCategory_Start_Date is missing");
		}
		else if(node.getValue("a_Division_Display_Type").getSimpleValue() == null)
		{
			node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_Division_Display_Type is missing");
		}
	}		 
}
else
{
	if(objectType == "ExternalStoredDAMAsset")
	{
		node.approve();
	}
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Set_Web_Hierarchy_Inherit_Option"
  } ],
  "pluginType" : "Operation"
}
*/
