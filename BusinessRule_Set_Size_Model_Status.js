/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Set_Size_Model_Status",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set_Size_Model_Status",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Dim1", "Dim2", "SizeCode", "SizeModel" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
// set a_Size_Model_Status = approved for all the size models

var obj = node.getObjectType().getID();

if(obj == "SizeModel"){		
	node.getValue("a_Size_Model_Status").setSimpleValue("approved");	
}

if(obj =="SizeCode")
{
var parent = node.getParent();
if(parent.getValue("a_Size_Model_Status").getSimpleValue()!="approved")
parent.getValue("a_Size_Model_Status").setSimpleValue("approved");
}

if(obj == "Dim1" || obj == "Dim2")
{
	var parent = node.getParent().getParent();
	if(parent.getValue("a_Size_Model_Status").getSimpleValue()!="approved")
	parent.getValue("a_Size_Model_Status").setSimpleValue("approved");
}

}