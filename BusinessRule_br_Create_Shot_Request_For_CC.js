/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_Shot_Request_For_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create_Shot_Request_For_CC",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,log,step) {

log.info("Node (CC) id is " + node.getID());

var atrShotRequestType = node.getValue('a_Temp_Shot_Request_Type').getSimpleValue();
var atrShotCode = node.getValue('a_Temp_Shot_Code').getSimpleValue();
var atrShotType = node.getValue('a_Temp_Shot_Type').getSimpleValue();
var atrSharedMarket = node.getValue('a_Temp_Shared_Market').getSimpleValue();

log.info("atrShotRequestType " + atrShotRequestType);
log.info("atrShotCode " + atrShotCode);
log.info("atrShotType " + atrShotType);
log.info("atrSharedMarket " + atrSharedMarket);

if(atrShotRequestType == null || atrShotRequestType == '')
{
    throw "<Mandatory attribute Shot Request Type is missing>";
}
else if (atrShotCode == null || atrShotCode == '')
{
    throw "<Mandatory attribute Shot Code is missing>";
}
else if (atrShotType == null || atrShotType == '')
{
	throw "<Mandatory attribute Shot Type is missing>";
}
else if (atrSharedMarket == null || atrSharedMarket == '')
{
	throw "<Mandatory attribute Shared Markets is missing>";
}


var oShotReqRoot = step.getEntityHome().getEntityByID("101812");
var oNewShotRequest = oShotReqRoot.createEntity(null, "PhotoShotCustomerChoice");

oNewShotRequest.getValue("a_Shot_Request_Type").setSimpleValue(node.getValue("a_Temp_Shot_Request_Type").getSimpleValue());
oNewShotRequest.getValue("a_Shot_Code").setSimpleValue(node.getValue("a_Temp_Shot_Code").getSimpleValue());
oNewShotRequest.getValue("a_Shot_Type").setSimpleValue(node.getValue("a_Temp_Shot_Type").getSimpleValue());
oNewShotRequest.getValue("a_Shared_Markets").setSimpleValue(node.getValue("a_Temp_Shared_Market").getSimpleValue());

node.createReference(oNewShotRequest, "CCToPhotoShotRef");


log.info("Shot Request Created" + oNewShotRequest.getID());
}