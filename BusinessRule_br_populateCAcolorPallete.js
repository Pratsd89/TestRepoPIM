/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_populateCAcolorPallete",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_populateCAcolorPallete",
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
var filePath = "/opt/stibo/CAcolorpallete.csv";
var file = new java.io.File(filePath);

if (!file.exists()) {
    throw new Error("File does not exist at path: " + filePath);
}

var asset = step.getAssetHome().getAssetByID("TF_128695521");
var fr = new java.io.FileReader(file);
}