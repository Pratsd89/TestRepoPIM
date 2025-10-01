/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_cancel_badge_condition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Actions" ],
  "name" : "br_cancel_badge_condition",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,portal) {
objectType = node.getObjectType().getID();
if (objectType == "Badge") {
    category = node.queryReferencedBy(ref).asList(10).get(0).getSource();
}
else {
    categoryid = node.getValue("a_Badge_Category").getSimpleValue();
    category = step.getClassificationHome().getClassificationByID(categoryid)
}

//deleteLink("EN_US", node)
//deleteLink("EN_CA", node)

return true;
portal.navigate("WebCategory_Details_Screen", category);
//node.delete();
//
//
//function deleteLink(context, node) {
//    step.executeInContext(context, function (manager) {
//        linkExists = false;
//        var context_badge = manager.getObjectFromOtherManager(node);
//        context_badge.queryReferencedBy(ref).forEach(function (refInstance) {
//            refInstance.delete()
//        });
//    });
//}
}