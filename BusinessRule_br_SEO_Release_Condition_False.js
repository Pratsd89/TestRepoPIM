/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Release_Condition_False",
  "type" : "BusinessCondition",
  "setupGroups" : [ "SEO" ],
  "name" : "br_SEO_Release_Condition_False",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "SEOlib"
  } ]
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
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LookupTableHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,LookupTableHome,SEOlib) {
var condition = SEOlib.SEOcheckcondition(step, LookupTableHome, node);

if (condition == false && hideGPSTab() == false) {
    return true;
} else {
    return false;
}


function hideGPSTab() {
    var userId = step.getCurrentUser();
    var userGroups = userId.getAllGroups().toArray();
    var count = 0;
    for (var i in userGroups) {
        var userGrp = userGroups[i];
        if (userGrp.getName() == "GPS-PIM-Lead-MC-Security-Group-NonProd" || userGrp.getName() == "GPS-PIM-Lead-MC-Security-Group") {
            count++;
        }
    }
    if (count > 0) {
        return true;
    }
    return false;
}
}