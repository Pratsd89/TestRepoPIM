/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_GPS_WptMandatory",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "GPS WptMandatory",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log) {
var objBrand = node.getValue("a_Brand_Number").getSimpleValue();

if (objBrand == "GPS") {
    var GPSWPT = node.getValue("a_GPS_WebProductType").getSimpleValue();
    if (GPSWPT == "" || GPSWPT == null) {
        node.getValue('a_error_message').setSimpleValue('GPS - Web Product Type is  mandatory and needs to be filled to proceed.');
        return false;
    }
    return true;
}

}