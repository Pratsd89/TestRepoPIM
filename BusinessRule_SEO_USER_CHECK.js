/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SEO_USER_CHECK",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "SEO_USER_CHECK",
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
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,webui) {
    var userHasSeoAccess = false;
    var currentUserGroups = new java.util.ArrayList();
    currentUserGroups.addAll(stepManager.getCurrentUser().getGroups());

    log.info("Starting to check user group membership.");

    // Check if the current user belongs to the SEO_TEST_USER_ACCESS group
    for (var n = 0; n < currentUserGroups.size(); n++) {
        var group = currentUserGroups.get(n); // Use indexed access as per the provided syntax
        log.info("Checking group: " + group.getID());
        if (group.getID() == "SEO_TEST_USER_ACCESS") {
            userHasSeoAccess = true;
            log.info("User has SEO_TEST_USER_ACCESS group membership.");
            break;
        }
    }

    if (userHasSeoAccess) {
        log.info("User is part of the SEO_TEST_USER_ACCESS group, proceeding with object type checks.");
        var objectType = node.getObjectType().getID();
        log.info("Current object type: " + objectType);

        if (objectType == "WebCategory") {
            log.info("Object is a WebCategory, checking for WebSubCategory associations.");
            var subCategoryList = node.getChildren();
            if (subCategoryList.size() == 0) {
                log.info("No WebSubCategory found. Editing is permitted.");
                return true;
            } else {
                for (var i = 0; i < subCategoryList.size(); i++) {
                    var subCategory = subCategoryList.get(i);
                    // Assuming the mere presence of any children (WebSubCategory) blocks editing
                    if (subCategory.getObjectType().getID() == "WebSubCategory") {
                        log.info("Found a WebSubCategory association. Displaying alert and blocking editing.");
                        webui.showAlert("ERROR", "Permission Denied", "You cannot edit this field on the category level as it has associated subcategories.");
                        return false; // Block editing due to associated WebSubCategory
                    }
                }
            }
        } else {
            log.info("Object is not a WebCategory. No additional checks required.");
            return true;
        }
    } else {
        log.info("User does not belong to the SEO_TEST_USER_ACCESS group. No further action taken.");
        return true;
    }

    // This line should never be reached due to the structure of the conditions above
    log.info("Completed all checks without finding actionable conditions.");
    return true;


}