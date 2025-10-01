/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_test_user_SEO",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SEO user test",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "slug"
  } ]
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
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
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
exports.operation0 = function (node,queryHome,step,webui,slug) {
 var seoTestUserGroup = "SEO_TEST_USER_ACCESS"; // The ID for the SEO test user access group
    var userHasSeoAccess = false;
   // var userGroups = new java.util.ArrayList();
//userGroups.addAll(stepManager.getCurrentUser().getGroups());
//for(var n=0;n<userGroups.size();n++){
	//if(userGroups.get(n).getID() == "CA-PIM-MC-Security-Group")
	
    var currentUserGroups = new java.util.ArrayList();
    currentUserGroups.addAll(step.getCurrentUser().getGroups());
    
    log.info("Starting to check user group membership.");
    
    // Check if the current user belongs to the SEO_TEST_USER_ACCESS group
    for (var n = 0; n < currentUserGroups.size(); n++) {
        log.info("Checking group: " + currentUserGroups.get(n).getID());
        if (currentUserGroups.get(n).getID() == seoTestUserGroup) {
            userHasSeoAccess = true;
            log.info("User has SEO_TEST_USER_ACCESS group membership.");
            break;
        }
    }
    
    if (userHasSeoAccess) {
        log.info("User is part of the SEO_TEST_USER_ACCESS group, proceeding with object type and subcategory checks.");
        var objectType = node.getObjectType().getID();
        log.info("Current object type: " + objectType);
        
        if (objectType == "WebCategory") {
            log.info("Object is a WebCategory, checking for WebSubCategory associations.");
            var subCategoryList = node.getChildren().toArray();
            var hasWebSubCategory = false;
            for (var i = 0; i < subCategoryList.length; i++) {
                if (subCategoryList[i].getObjectType().getID() == "WebSubCategory") {
                    hasWebSubCategory = true;
                    log.info("Found a WebSubCategory association.");
                    break; // Exit the loop as soon as a WebSubCategory is found
                }
            }
            
            if (hasWebSubCategory) {
                log.info("At least one associated WebSubCategory found. Displaying alert and blocking editing.");
                webui.showAlert("ERROR", "Permission Denied", "You cannot edit this field on the category level as it has associated subcategories.");
                return false; // Indicate that editing should be blocked
            } else {
                log.info("No associated WebSubCategory found. Editing is permitted.");
            }
        } else {
            log.info("Object is not a WebCategory. No additional checks required.");
        }
    } else {
        log.info("User does not belong to the SEO_TEST_USER_ACCESS group. No further action taken.");
    }
    
    log.info("Editing permission check completed. Editing allowed unless previously blocked.");
    return true; // Default to allowing editing if none of the above conditions are met

}