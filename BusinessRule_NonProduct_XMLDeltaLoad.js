/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "NonProduct_XMLDeltaLoad",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "NonProduct_XMLDeltaLoad",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "NonProductBusinessUnit", "NonProductCategory" ],
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

if(objectType == "NonProductBusinessUnit")
{
	node.approve();
}
else
{	
	if(objectType == "NonProductCategory")
	{
		if(node.getValue("a_Category_Description").getSimpleValue()!=null) 
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
			if(node.getValue("a_Category_Description").getSimpleValue()==null) 
			{
				node.getValue("a_error_message").setSimpleValue(manager.getCurrentContext().getID()+" : Mandatory attribute a_Category_Description is missing");
			}
		}	
	}	 
}
}