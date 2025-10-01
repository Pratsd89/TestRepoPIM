/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Delete_External_Asset",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Delete_External_Asset",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ExternalStoredDAMAsset" ],
  "allObjectTypesValid" : false,
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
stepManager.executeInContext("EN_US", function(otherManager) {
var enUsAsset = otherManager.getAssetHome().getAssetByID(node.getID());
var reference = enUsAsset.getReferencedBy().toArray();								
for(var m = 0 ; m < reference.length; m++){
	referenceTypeId = reference[m].getReferenceType().getID();
	var tempCC = reference[m].getSource();
	reference[m].delete();
	tempCC.approve();
}
});

stepManager.executeInContext("EN_CA", function(otherManager) {
var enCAAsset = otherManager.getAssetHome().getAssetByID(node.getID());
var reference = enCAAsset.getReferencedBy().toArray();								
for(var m = 0 ; m < reference.length; m++){
	referenceTypeId = reference[m].getReferenceType().getID();
	var tempCC = reference[m].getSource();
	reference[m].delete();
	tempCC.approve();
}
});


node.delete()
}