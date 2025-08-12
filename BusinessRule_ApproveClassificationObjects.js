/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ApproveClassificationObjects",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ApproveClassificationObjects",
  "description" : "Business Rule to Approve objects",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
//Comment the one accordingly
//All 3 context approval
/*function nodeApprove(classification, contextID) {
    step.executeInContext(contextID, function (contextManager) {
        var currentClassification = contextManager.getClassificationHome().getClassificationByID(classification.getID());
        if(currentClassification.getApprovalStatus() != "Not in Approved workspace"){
			currentClassification.approve();
		}       
        });
       }
nodeApprove(node,"EN_US");
nodeApprove(node,"EN_CA");
nodeApprove(node,"FR_CA");*/

//Only executing context approval
if(node.getApprovalStatus() != "Not in Approved workspace"){
			node.approve();
		}
}