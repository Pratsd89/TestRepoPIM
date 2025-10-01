/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ProductShotRequestApproval",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ProductShotRequestApproval",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
exports.operation0 = function (node,log) {
var a_shotRef = node.getReferences().asList();
						for(var a_count=0;a_count<a_shotRef.size();a_count++){
							var refType = a_shotRef.get(a_count).getReferenceType().getID();
								if(refType == "ShotRequestPrimaryImageRef" || refType == "ShotRequestSwatchRef" || refType == "ShotRequestToExternalAsset" || refType == "ShotRequestVideoRef"){
									var a_TargetID = a_shotRef.get(a_count).getTarget();
									try{
									a_TargetID.approve();
									}
									catch (e) {
										if (e.javaException instanceof com.stibo.core.domain.synchronize.exception.SynchronizeException) {
									throw(e);
										} 
									}
									
									
								}
						}
try{
	node.approve();
	}
catch (e) {
if (e.javaException instanceof com.stibo.core.domain.synchronize.exception.SynchronizeException) {
throw(e);
} 
}
}