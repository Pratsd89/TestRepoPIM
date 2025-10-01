/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "getMVG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "getMVG",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
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
exports.operation0 = function (step) {
var brand = step.getProductHome().getProductByID("AT_MultiVariantGroup");

var divisions = brand.getChildren().iterator();
var mvgArray = new Array();
while (divisions.hasNext()) {
    var division = divisions.next();

    var mvgs = division.getChildren().iterator();
    while (mvgs.hasNext()) {
    	mvgArray.push(mvgs.next().getID())
    	
    }
}

log.info(mvgArray)
}