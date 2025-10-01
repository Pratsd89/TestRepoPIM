/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_checkUniqueName",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Check Unique Name",
  "description" : "PPIM-13846",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "categoryName",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Category_Description",
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
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
exports.operation0 = function (qh,categoryName,node,webUI,step) {
var c = com.stibo.query.condition.Conditions;
var objType = node.getObjectType();
var nameToCheck = node.getValue("a_Category_Description").getSimpleValue();
var inheritOptionCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
var inheritOptionJPN = node.getValue("a_JPN_Inherit_Option").getSimpleValue();

var nodeParent = node.getParent();
if (nameToCheck != null) {
    var query = qh.queryFor(com.stibo.core.domain.Classification).where(c.objectType(objType)
        .and(c.hierarchy().simpleBelow(nodeParent))
        .and(c.valueOf(categoryName).ignoreCase().eq(nameToCheck)));
    var resList = query.execute().asList(100000);
    var resSize = resList.size();
    if (resSize > 1) { //found multiple records with same name
        throw ("\n<b>Category name provided is not unique under the parent category. Kindly enter a unique name.</b>");
    }
    else {
        if (inheritOptionCAN != null) {
            var caNode;
            var caNodeParent;
            step.executeInContext("EN_CA", function (caManager) {
                caNode = caManager.getObjectFromOtherManager(node);
                caNodeParent = caNode.getParent();
                var qh1 = caManager.getHome(com.stibo.query.home.QueryHome);
                var query1 = qh1.queryFor(com.stibo.core.domain.Classification).where(c.objectType(objType)
                    .and(c.hierarchy().simpleBelow(caNodeParent))
                    .and(c.valueOf(categoryName).ignoreCase().eq(nameToCheck)));
                var resList1 = query1.execute().asList(100000);
                var resSize1 = resList1.size();
                if (resSize1 > 1) { //found multiple records with same name
                    throw ("\n<b>Category name provided is not unique under the parent category. Same name already exist in en_CA, kindly enter a unique name.</b>");
                }
            });
        }
        if (inheritOptionJPN != null) {
            var jpNode;
            var jpNodeParent;
            step.executeInContext("EN_JP", function (jpManager) {
                jpNode = jpManager.getObjectFromOtherManager(node);
                jpNodeParent = jpNode.getParent();
                var qh2 = jpManager.getHome(com.stibo.query.home.QueryHome);
                var query2 = qh2.queryFor(com.stibo.core.domain.Classification).where(c.objectType(objType)
                    .and(c.hierarchy().simpleBelow(jpNodeParent))
                    .and(c.valueOf(categoryName).ignoreCase().eq(nameToCheck)));
                var resList2 = query2.execute().asList(100000);
                var resSize2 = resList2.size();
                if (resSize2 > 1) { //found multiple records with same name
                    throw ("\n<b>Category name provided is not unique under the parent category. Same name already exist in en_JP, kindly enter a unique name.</b>");
                }
            });
        }
    }
}
}