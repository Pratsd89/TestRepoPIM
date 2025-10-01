/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_delete_BadgingFlagsOnImport",
  "type" : "BusinessAction",
  "setupGroups" : [ "Badges" ],
  "name" : "Delete Badging Flags On Import",
  "description" : "Delete badging flags with null values during import",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,badgingGroup,manager) {
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
    var dataContainer = node.getDataContainerByTypeID(idf).getDataContainers().toArray();
    log.info(dataContainer);
    if (dataContainer.length>0 && idf.indexOf("Badges")!= -1){
        var dataContainerObject = dataContainer[0].getDataContainerObject();
         log.info(dataContainerObject);
        if (dataContainerObject != null) {
            if (dataContainerObject.getOwnerObject().getID() == node.getID()) {
                log.info(idf);
                var values = dataContainerObject.getValues().toArray();
                values.forEach(function(val) {
                    var valID = val.getAttribute().getID();
                    var ptrn = new RegExp("^a_badge_" + brandNum + "$");
                    if (ptrn.test(valID)) {
                        log.info("found Badging flag name: " + valID);
                        var badgingName = dataContainerObject.getValue(valID).getSimpleValue();
                        log.info("badgingName: " + badgingName);
                        if (badgingName == null) {
                            dataContainer[0].deleteLocal();
                        }
                    }
                });
            }
        }
    }
});
}