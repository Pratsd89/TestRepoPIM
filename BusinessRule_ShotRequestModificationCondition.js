/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestModificationCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Shot Request Modification Condition",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,log,node) {
var valShotReqStatus = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
if (valShotReqStatus!="Ready for Review"){
	
	var valShotReqType = node.getValue('a_Shot_Request_Type').getSimpleValue();
	var valShotCode = node.getValue('a_Shot_Code').getSimpleValue();
	var valShotType = node.getValue('a_Shot_Type').getSimpleValue();
	var valSharedMarket = node.getValue('a_Shared_Markets').getSimpleValue();

	if(valShotReqType == null || valShotReqType == '')
	{
		//portal.alert("<Mandatory Attribute Shot Request Type is Missing>");
		return false;
	}
	else if (valShotCode == null || valShotCode == '')
	{
		//portal.alert("<Mandatory Attribute Shot Code is Missing>");
		return false;
	}
	else if (valShotType == null || valShotType == '')
	{
		//portal.alert("<Mandatory Attribute Shot Type is Missing>");
		return false;
	}
	else if (valSharedMarket == null || valSharedMarket == '')
	{
		//portal.alert("<Mandatory Attribute Shared Markets is Missing>");
		return false;
	}
  return true;
}
else
{
	//portal.alert("Can't update; In review state");
	return false;
}
}