/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Setting_Customer_Service_CID_Value",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Setting Customer Service CID Value",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerServiceBusinessUnit", "CustomerServiceCategory", "CustomerServiceHome" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ID_Generator_Library",
    "libraryAlias" : "IDGeneratorLibrary"
  } ]
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
exports.operation0 = function (node,stepManager,IDGeneratorLibrary) {
IDGeneratorLibrary.setIDValue(node,stepManager,'CIDGenerator','a_WebCategory_CID');

  
//moving the node to the end state
if(node.isInState("CustomerServiceDefaultValueWorkflow","Draft")) {
	var wf = node.getWorkflowInstanceByID("CustomerServiceDefaultValueWorkflow");
	wf.getTaskByID("Draft").triggerByID("Submit","");
}
}