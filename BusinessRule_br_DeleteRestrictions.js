/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DeleteRestrictions",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Delete Restrictions",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (stepManager) {
var todayDate = new java.util.Date();
var dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");

var restrictionRoot = stepManager.getEntityHome().getEntityByID("Restriction_Root");
log.info("Restriction Root ID: " + (restrictionRoot ? restrictionRoot.getID() : "null"));

var brandFolders = restrictionRoot.getChildren().iterator();
var deletedCount = 0;

while (brandFolders.hasNext()) {
    var brandFolder = brandFolders.next();
    if (brandFolder.getObjectType().getID() != "RestrictionBrand") continue;

    var restrictionList = brandFolder.getChildren().iterator();
    while (restrictionList.hasNext()) {
        var restriction = restrictionList.next();
        if (restriction.getObjectType().getID() != "RestrictionClassifications") continue;

        var gateDataContainerType = restriction.getDataContainerByTypeID("Gate");
        if (gateDataContainerType == null) continue;

        var dataContainers = gateDataContainerType.getDataContainers().toArray();

        for (var i = 0; i < dataContainers.length; i++) {
            var dataContainerObj = dataContainers[i].getDataContainerObject();
            var endDateVal = dataContainerObj.getValue("a_Restriction_End_Date");
            if (endDateVal == null) continue;

            var endDate = endDateVal.getSimpleValue();
            if (!endDate) continue;

            if (typeof endDate === "string" || endDate instanceof java.lang.String) {
                try {
                    endDate = dateFormat.parse(endDate);
                } catch (e) {
                    continue;
                }
            }

            if (!endDate.after(todayDate)) {
//            	log.info("here");
                dataContainers[i].deleteLocal();
//                log.info("Deleted Gate at index " + i + " for restriction " + restriction.getID());
                deletedCount++;
            }
        }
    }
}

log.info("Total gates deleted: " + deletedCount);

}