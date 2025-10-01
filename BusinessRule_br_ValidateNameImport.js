/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ValidateNameImport",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Validate Name Import",
  "description" : "Validate import of smartsheet import with blank names",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (manager,node,log,LKT) {
var type = node.getObjectType().getName();
var name = node.getName();
if (type == "Style") {
    if (name == "" || name == null) {
        return "<b style='color:red;'>Style import smartsheet rejected for Style " + node.getID() + " due to blank name </b>";
    }
} else if (type == "CC") { 
    if (name == "" || name == null) { 
        return "<b style='color:red;'>CC import smartsheet rejected for CC" + node.getID() + " due to blank name </b>";
    }

}else {
    return true;
}
return true;
}