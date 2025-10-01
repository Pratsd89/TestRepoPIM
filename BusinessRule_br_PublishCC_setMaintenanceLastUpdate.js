/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PublishCC_setMaintenanceLastUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_PublishCC_setMaintenanceLastUpdate",
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
    "contract" : "EventQueueBinding",
    "alias" : "BadgePublish",
    "parameterClass" : "com.stibo.core.domain.impl.eventprocessor.EventProcessorImpl",
    "value" : "step://eventprocessor?id=EP_BadgingPublish",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,BadgePublish,queryHome,manager) {
//br_setMaintLastUpdateDate_ForCCs
var ObjectType = node.getObjectType().getID();

if (ObjectType == "CustomerChoice") {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
} else if (ObjectType == "Style") {
    var CC = SearchCC(node);
    log.info(CC.length);
    for (var i in CC) {
        BadgePublish.republish(CC[i]);
    }
} else if (ObjectType == "SubClass") {
    var CC = SearchCC(node);
    log.info(CC.length);
    for (var i in CC) {
        BadgePublish.republish(CC[i]);
    }
} else if (ObjectType == "Class") {
    var CC = SearchCC(node);
    log.info(CC.length);
    for (var i in CC) {
        BadgePublish.republish(CC[i]);
    }
} else if (ObjectType == "Department") {
    var CC = SearchCC(node);
    log.info(CC.length);
    for (var i in CC) {
        BadgePublish.republish(CC[i]);
    }
} else if (ObjectType == "Division") {
    var CC = SearchCC(node);
    log.info(CC.length);
    for (var i in CC) {
        BadgePublish.republish(CC[i]);

    }
}


function SearchCC(node) {
    var c = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
        c.objectType(manager.getObjectTypeHome().getObjectTypeByID("CustomerChoice"))
        .and(c.hierarchy().simpleBelow(node))
    );
    var res = querySpecification.execute();
    var list = res.asList(100000).toArray();
    return list;
}
}