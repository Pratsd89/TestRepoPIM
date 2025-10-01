/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_badgingCheck_Inherited",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Actions" ],
  "name" : "br_badgingCheck_Inherited",
  "description" : null,
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "AttributeGroupBindContract",
    "alias" : "badgingGroup",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_badge_details",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (badgingGroup,manager,node) {
var logArray = new Array();
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var badgingFlags = badgingGroup.getDataContainerTypes().toArray();
var badgingFlagIDs = new Array();
badgingFlags.forEach(function(flag) {
    badgingFlagIDs.push(flag.getID());
});
var currentContext = manager.getCurrentContext().getID();
const [currLang, currMkt] = currentContext.split("_");
var pattern = new RegExp(currMkt);
var loop = 0;
for (var x = 0; x <= badgingFlagIDs.length - 1; x++) {
    if (!pattern.test(badgingFlagIDs[x])) {
        badgingFlagIDs.splice(x, 1);
        x--
    }
    loop++
    if (loop > 100) {
        break;
    }
}
log.info(badgingFlagIDs);
badgingFlagIDs.forEach(function(idf) {
    var dataContainer = node.getDataContainerByTypeID(idf);
    if (dataContainer != null && idf.contains("Badges")) {
        var dataContainerObject = dataContainer.getDataContainerObject();
        if (dataContainerObject != null) {
            if (dataContainerObject.getOwnerObject().getID() == node.getID()) {
			return true ;
            }else {
			return "<b style='color:red;'>  Can not be imported as this is in  inherited from parent .</b>";	
			}
        }
    }
});
}