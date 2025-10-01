/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestUnrejectValidation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Shot Request Un-reject Validation",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log) {
var result = true;
var stat = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
var rejReason = node.getValue('a_Shot_Request_Rejection_Reason').getSimpleValue();
var rejComment = node.getValue('a_Shot_Request_Rejection_Comments').getSimpleValue();

// Check if status is 'Rejected' and both rejection reason and comment are not null
if (stat == "Rejected") {
    if (rejReason != null && rejComment != null) {
        // Set status to "Ready for Review"
        node.getValue('a_Shot_Request_Lifecycle_Status').setSimpleValue("Ready for Review");
        // Workflow change
        if (node.isInState("wf_ShortRequestLifeCycle", "Rejected") == true) {
            node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Rejected").triggerByID("Rejected_Needs_Approval", "Web UI Based Shot Request Restoration");
        }
        
    } 
    else {
        result = "Cannot unreject the shot request. Please ensure rejection reason and comment are provided.";
    }
} 
else {
    result = "Unrejecting is only allowed if the shot status is 'Rejected'.";
}

return result; 

}