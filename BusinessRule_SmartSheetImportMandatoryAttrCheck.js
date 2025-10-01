/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SmartSheetImportMandatoryAttrCheck",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "SmartSheet Import Mandatory Attr Check",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  } ]
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "agRequired",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_Required_SmartSheet_Import_Attr",
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
exports.operation0 = function (node,log,agRequired,step,compCheck) {
var obj = node.getObjectType().getID();

var name = node.getName();
if (name == null || name == "") {
    return "<b style ='color:red;'>" + obj + " Name can't be blank!</b>";
}

// Script runs only for "Style" objects
if (obj == "Style") {  
    var reject = false; 
    var emptyAttributes = [];

    // Check for the mandatory attribute 'a_Overview_Bullet1'
    var overviewAttrID = "a_Overview_Bullet1";  
    var overviewVal = node.getValue(overviewAttrID).getSimpleValue();
    
    if (overviewVal == null || overviewVal.trim() === "") {
        reject = true;
        emptyAttributes.push("a_Overview_Bullet1");
    }

    // Reject import if 'a_Overview_Bullet1' is missing
    if (reject) {
        return "Import Rejected: Mandatory attribute 'Overview Bullets 1' is missing. Please update and re-upload";
    }

    return true;
}

return true;

}