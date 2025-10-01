/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_delete_Old_New_Aslr_Container",
  "type" : "BusinessAction",
  "setupGroups" : [ "Bulk Updates/One Time Updates" ],
  "name" : "Delete ASLR Containers",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var dataContainer = node.getDataContainerByTypeID('a_Old_ASLR_Entry_Data_Container').getDataContainers().toArray();
for(var n=0;n<dataContainer.length;n++)
{
    dataContainer[n].deleteLocal();
}


var dataContainerNew = node.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
	for(var j=0;j<dataContainerNew.length;j++)
	{
		dataContainerNew[j].deleteLocal();
	}
}