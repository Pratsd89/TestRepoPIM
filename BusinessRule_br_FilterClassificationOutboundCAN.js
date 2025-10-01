/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_FilterClassificationOutboundCAN",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Filter Classification Outbound Condition CAN",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,logger) {
// Check to filter classification outbound to be reported if there is an a_Category_Description value
var obj = node.getObjectType().getID();
logger.info("Object Type: " + obj);
var result = false;

if (obj == "WebCategory" || obj == "WebSubCategory" || obj=="WebDivision" ) {

    step.executeInContext("EN_CA", function(caContextManager) {

        var caCurrentClass = caContextManager.getClassificationHome().getClassificationByID(node.getID());
        logger.info("Retrieved Classification for Node ID: " + node.getID());

        if (caCurrentClass == null) {
            logger.info("Error: caCurrentClass is null for Node ID: " + node.getID());
            throw "caCurrentClass is null. Node ID is: " + node.getID();
        }
        
//        // Not to publish Standard:Content categories without redirect URL in EN_CA
//        var catDisplayType = caCurrentClass.getValue("a_Category_Display_Type").getSimpleValue();
//        var catRedirectURL = caCurrentClass.getValue("a_Redirect_URL").getSimpleValue();
//        if (catDisplayType == "Standard: Content" && catRedirectURL == null) {
//           log.info("RedirectURLStatus "+catDisplayType == "Standard: Content" && catRedirectURL == null);
//           return false;
//        }
        
        var objType = caCurrentClass.getObjectType().getID();
        logger.info("Classification Object Type: " + objType);

        // Retrieve values for a_Category_Description and a_WebCategory_Start_Date
        var catDesc = caCurrentClass.getValue("a_Category_Description").getSimpleValue();
        var webStartDate = caCurrentClass.getValue("a_WebCategory_Start_Date").getSimpleValue();

        logger.info("a_Category_Description: " + catDesc);
        logger.info("a_WebCategory_Start_Date: " + webStartDate);

        // Ensure both Category Description and Start Date are available
        if (catDesc != null && webStartDate != null) {
            result = true;
            logger.info("Category and Start Date are valid. Setting result = true");

            // Additional check for WebCategory and WebSubCategory to validate parent object
            if (objType == "WebCategory" || objType == "WebSubCategory") {
                var parentObject = caCurrentClass.getParent();
                if (parentObject) {
                    var parentCategoryDesc = parentObject.getValue("a_Category_Description").getSimpleValue();
                    var parentStartDate = parentObject.getValue("a_WebCategory_Start_Date").getSimpleValue();

                    logger.info("Parent a_Category_Description: " + parentCategoryDesc);
                    logger.info("Parent a_WebCategory_Start_Date: " + parentStartDate);

                    // Ensure parent also has both a_Category_Description and a_WebCategory_Start_Date
                    if (parentCategoryDesc == null || parentStartDate == null) {
                        result = false;
                        logger.info("Parent object is missing required values. Setting result = false");
                    }
                } else {
                    logger.info("Warning: Parent object is null");
                }
            }
        } else {
            logger.info("Missing a_Category_Description or a_WebCategory_Start_Date. Setting result = false");
        }
    });

    logger.info("Final Result: " + result);
    return result;
} 
else if(obj=="CMS_Content_Group" || obj=="CMS_Slot")
{
	 return true;
}
else {
    logger.info("Object Type not in required list. Returning false.");
    return false;
}

}