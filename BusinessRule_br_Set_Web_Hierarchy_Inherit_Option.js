/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Set_Web_Hierarchy_Inherit_Option",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Web Hierarchy Inherit Option",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
  "allObjectTypesValid" : false,
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT) {
//Function for obtaining brand number from parent Business Unit (works recursively) (pulled from BR: Copying_WebCategory_To_Division)
function getBrandNumber(node) {
    //get category object type
    var type = node.getObjectType().getID();

    //get parent
    var parent = node.getParent();

    //get parent object type
    var parentType = parent.getObjectType().getID();

    //if category object type is WebCategory || WebSubCategory || WebDivision
    if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
        //then keep getting parent until type is WebBU
        while ((parentType != "WebBU") && (parentType != "WebHierarchyArchiveBU")) {

            parent = parent.getParent();
            parentType = parent.getObjectType().getID();
        }

        //get a_Brand_Number
        var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
    }

    return brandNum;
}

var currentContext = step.getCurrentContext().getID();
var inheritCatAtts = node.getValue("a_WebCategory_Inherit_US").getSimpleValue();

if (currentContext == "EN_US") {
    //Get a_Brand_Number of parent of source
    var brandNumber = getBrandNumber(node);
    var objectType = node.getObjectType().getID();

    if (brandNumber != null) {
        // set/fix inherit option for CAN - Data Load and General Fix
        if (inheritCatAtts == "Yes") {
            if (objectType == "WebCategory") {
                var inheritOptionCAN = LKT.getLookupTableValue("LKT_WebCat_Brand_Inheritance_CAN", brandNumber);
                node.getValue("a_CAN_Inherit_Option").setSimpleValue(inheritOptionCAN);
            }
            if (objectType == "WebSubCategory") {
                var inheritOptionCAN = LKT.getLookupTableValue("LKT_WebSubCat_Brand_Inheritance_CAN", brandNumber);
                node.getValue("a_CAN_Inherit_Option").setSimpleValue(inheritOptionCAN);
            }
        }
        // set/fix inherit option for JPN - General Fix
        step.executeInContext("EN_JP", function (manager) {
            var jpNode = manager.getClassificationHome().getClassificationByID(node.getID());
            var catStart = jpNode.getValue('a_WebCategory_Start_Date').getSimpleValue();
            var catEnd = jpNode.getValue('a_WebCategory_End_Date').getSimpleValue();
            var today = java.time.ZonedDateTime.now();
            var jpInheritCatAtts = jpNode.getValue('a_WebCategory_Inherit_US').getSimpleValue();

            if (catStart != null && catEnd > today || catStart != null && catEnd == null) {
                if (jpInheritCatAtts == "Yes") {
                    jpNode.getValue("a_JPN_Inherit_Option").setValue("Attributes");
                }
            }

        });
    }
}

// set/fix inherit option for JPN - Data Load
if (currentContext == "EN_JP") {
    if (inheritCatAtts == "Yes") {
        node.getValue("a_JPN_Inherit_Option").setValue("Attributes");
    }
}
}