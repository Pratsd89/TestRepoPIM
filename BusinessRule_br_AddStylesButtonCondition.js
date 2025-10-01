/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_AddStylesButtonCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Add Styles Button Condition",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
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
exports.operation0 = function (step) {
/*var userId = manager.getCurrentUser();
log.info("userId  ------> " + userId);

// Fetch all user groups
var userGroups = new java.util.ArrayList();
log.info("Fetching all groups for user: " + userId.getAllGroups());
userGroups.addAll(userId.getAllGroups());

log.info("Total number of groups: " + userGroups.size());

for (var n = 0; n < userGroups.size(); n++) {
    log.info("Group " + n + ": " + userGroups.get(n).getName());
}

// Check if user is a member of the ReadOnly group
if (ReadOnly.isMember(userId)) {
    log.info("User is a member of ReadOnly group. Tabs are disabled.");
    return false;
}*/

// If user is not in the ReadOnly group, check the context
var context = step.getCurrentContext().getID();
log.info("Current context ID: " + context);

if (context == 'EN_US' || context == 'EN_CA') {
    log.info("Context is either EN_US or EN_CA. Tabs are enabled.");
    return true;
} else {
    log.info("Context is neither EN_US nor EN_CA. Tabs are disabled.");
    return false;
}

}