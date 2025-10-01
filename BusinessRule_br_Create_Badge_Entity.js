/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_Badge_Entity",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Badge Entity",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EntityBindContract",
    "alias" : "badgeRoot",
    "parameterClass" : "com.stibo.core.domain.impl.entity.FrontEntityImpl$$Generated$$6",
    "value" : "BadgesRoot",
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
exports.operation0 = function (node,step,badgeRoot,portal) {
var newBadge = badgeRoot.createEntity(null, "Temp_Badge");

//a_Badge_Category
newBadge.getValue("a_Badge_Category").setSimpleValue(node.getID());

//node.createReference(newBadge, "WebCategoryToBadgeRef");
brand = node.getValue("a_Brand_Number").getSimpleValue();
newBadge.getValue("a_Brand_Number").setSimpleValue(brand);
portal.navigate("Badge Details Screen", newBadge);
}