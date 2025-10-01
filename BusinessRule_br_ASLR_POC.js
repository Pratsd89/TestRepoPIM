/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ASLR_POC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ASLR POC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
var dataContainer = node.getDataContainerByTypeID('a_ASLR_Data_Container_POC').getDataContainers().toArray();

for(var n=0;n<dataContainer.length;n++)
{    
        var dataContainerObject = dataContainer[n]. getDataContainerObject();
	   var isInherited = dataContainer[n].getDataContainerType().isInherited();
        var shotType = dataContainerObject.getValue('a_Shot_Type').isInherited();
        var shotCode = dataContainerObject.getValue('a_Shot_Code').	setSimpleValue('P02');
        var sitePlacement = dataContainerObject.getValue('a_Site_Placement').	getSimpleValue();
        

}
}