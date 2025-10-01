/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_RemoveOrphanShotRequests",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_RemoveOrphanShotRequests",
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
    "contract" : "EntityBindContract",
    "alias" : "rootShotRequest",
    "parameterClass" : "com.stibo.core.domain.impl.entity.FrontEntityImpl$$Generated$$12",
    "value" : "126402",
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
exports.operation0 = function (rootShotRequest,logger) {
var allShotRequests = rootShotRequest.getChildren();
for (var i = 0; i < rootShotRequest.size(); i++) {
	var myShotRequest = allShotRequests.get(i);

	var myShotRequestRefs = myShotRequest.getReferencedBy();

	if(myShotRequestRefs.size() == 0) {
		logger.info(myShotRequest.getID() + " WILL BE DELETED");
		//Best Way To Delete A Node
	} 
}

}