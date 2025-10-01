/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_FilterClassificationOutboundCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Filter Classification Outbound Condition",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
//Check to filter classification outbounds to be exported if there is no a_Category_Description value
var obj = node.getObjectType().getID();
if (obj == "CustomerServiceBusinessUnit" || obj == "CustomerServiceCategory" || obj == "CustomerServiceHome" || obj == "NonProductCategory" || obj == "WebBU" || obj == "WebCategory" || obj == "WebDivision" || obj == "WebSubCategory" || obj == "NonProductBusinessUnit") {
    var result = false;
    step.executeInContext("EN_US", function(usContextManager) {
        var usCurrentClass = usContextManager.getClassificationHome().getClassificationByID(node.getID());
        if (usCurrentClass == null) {
            throw "usCurrentClass is null. Node ID is: " + node.getID()
        }
        var objType = usCurrentClass.getObjectType().getID();
        if (objType == "CustomerServiceBusinessUnit" || objType == "CustomerServiceCategory" || objType == "CustomerServiceHome" || objType == "NonProductCategory" || objType == "WebBU" || objType == "WebCategory" || objType == "WebDivision" || objType == "WebSubCategory") {
            var catDesc = usCurrentClass.getValue("a_Category_Description").getSimpleValue();
            if (catDesc != null) {
                result = true;
            }
        } else if (objType == "CustomerServiceRoot" || objType == "NonProductBusinessUnit") {
            result = true;
        }

    });
    return result;
} else {
    return false;
}
}