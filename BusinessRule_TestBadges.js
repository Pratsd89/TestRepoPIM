/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TestBadges",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TestBadges",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager,queryHome) {
/*//PPIM-13297
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var today = (new java.text.SimpleDateFormat("yyyy-MM-dd")).format(time);
var flag = 0;


function triggerUpdatesForCC(pphNode) {
    var c = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
    	   c.hierarchy().simpleBelow(pphNode)
        .and(c.objectType(manager.getObjectTypeHome().getObjectTypeByID("CustomerChoice")))
    );

    var res = querySpecification.execute();
    res.forEach(function (resNode) {
        resNode.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        return true;
    });
}


//US
var badgingDataContainerUS1 = node.getDataContainerByTypeID('BadgesUS1');
var badgingDataContainerUS2 = node.getDataContainerByTypeID('BadgesUS2');
var badgingDataContainerUS3 = node.getDataContainerByTypeID('BadgesUS3');
var badgingDataContainerUS4 = node.getDataContainerByTypeID('BadgesUS4');
var badgingDataContainerUS5 = node.getDataContainerByTypeID('BadgesUS4');
var badgingDataContainerUS6 = node.getDataContainerByTypeID('BadgesUS6');
var badgingDataContainerUS7 = node.getDataContainerByTypeID('BadgesUS7');
var badgingDataContainerUS8 = node.getDataContainerByTypeID('BadgesUS8');
var badgingDataContainerUS9 = node.getDataContainerByTypeID('BadgesUS9');
var badgingDataContainerUS10 = node.getDataContainerByTypeID('BadgesUS10');

//CAN
var badgingDataContainerCA1 = node.getDataContainerByTypeID('BadgesCA1');
var badgingDataContainerCA2 = node.getDataContainerByTypeID('BadgesCA2');
var badgingDataContainerCA3 = node.getDataContainerByTypeID('BadgesCA3');
var badgingDataContainerCA4 = node.getDataContainerByTypeID('BadgesCA4');
var badgingDataContainerCA5 = node.getDataContainerByTypeID('BadgesCA5');
var badgingDataContainerCA6 = node.getDataContainerByTypeID('BadgesCA6');
var badgingDataContainerCA7 = node.getDataContainerByTypeID('BadgesCA7');
var badgingDataContainerCA8 = node.getDataContainerByTypeID('BadgesCA8');
var badgingDataContainerCA9 = node.getDataContainerByTypeID('BadgesCA9');
var badgingDataContainerCA10 = node.getDataContainerByTypeID('BadgesCA10');

//JPN
var badgingDataContainerJP1 = node.getDataContainerByTypeID('BadgesJP1');
var badgingDataContainerJP2 = node.getDataContainerByTypeID('BadgesJP2');
var badgingDataContainerJP3 = node.getDataContainerByTypeID('BadgesJP3');
var badgingDataContainerJP4 = node.getDataContainerByTypeID('BadgesJP4');
var badgingDataContainerJP5 = node.getDataContainerByTypeID('BadgesJP5');
var badgingDataContainerJP6 = node.getDataContainerByTypeID('BadgesJP6');
var badgingDataContainerJP7 = node.getDataContainerByTypeID('BadgesJP7');
var badgingDataContainerJP8 = node.getDataContainerByTypeID('BadgesJP8');
var badgingDataContainerJP9 = node.getDataContainerByTypeID('BadgesJP9');
var badgingDataContainerJP10 = node.getDataContainerByTypeID('BadgesJP10');

var dataContainerArray = [badgingDataContainerUS1, badgingDataContainerUS2, badgingDataContainerUS3, badgingDataContainerUS4, badgingDataContainerUS5, badgingDataContainerUS6, badgingDataContainerUS7, badgingDataContainerUS8, badgingDataContainerUS9, badgingDataContainerUS10, badgingDataContainerCA1, badgingDataContainerCA2, badgingDataContainerCA3, badgingDataContainerCA4, badgingDataContainerCA5, badgingDataContainerCA6, badgingDataContainerCA7, badgingDataContainerCA8, badgingDataContainerCA9, badgingDataContainerCA10, badgingDataContainerJP1, badgingDataContainerJP2, badgingDataContainerJP3, badgingDataContainerJP4, badgingDataContainerJP5, badgingDataContainerJP6, badgingDataContainerJP7, badgingDataContainerJP8, badgingDataContainerJP9, badgingDataContainerJP10];

for (var i = 0; i < dataContainerArray.length; i++) {
    var dataContainers = dataContainerArray[i].getDataContainers().toArray();
    for (var j = 0; j < dataContainers.length; j++) {
        var singleDataContainer = dataContainers[j].getDataContainerObject();
        if (singleDataContainer != null) {
            var end_date = singleDataContainer.getValue('a_badge_end_date').getSimpleValue();
            if (today > end_date) {
                dataContainers[j].deleteLocal();
                flag = flag + 1;
            }
        }
    }
}

if (flag > 0) {
	if (node.getObjectType().getID() == "Style"){
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	}
     triggerUpdatesForCC(node);
}

flag = 0;*/

log.info(node.getID());

}