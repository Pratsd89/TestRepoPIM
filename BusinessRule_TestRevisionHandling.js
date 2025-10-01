/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TestRevisionHandling",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test Revision Handling",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
var valShotReqType = node.getValue('a_Shot_Request_Type').getSimpleValue();
var valShotCode = node.getValue('a_Shot_Code').getSimpleValue();
var valShotType = node.getValue('a_Shot_Type').getSimpleValue();
var valSharedMarket = node.getValue('a_Shared_Markets').getSimpleValue();

var revisions = new java.util.ArrayList();
revisions = node.getRevisions();
revisions.sort;

if(valShotReqType == null || valShotReqType == '')
{
	for (var j = revisions.size(); j > 0 ; j--) {
		var previousVersion = revisions.get(revisions.size() - 1).getNode();
		var valShotReqTypeOld = previousVersion.getValue('a_Shot_Request_Type').getSimpleValue();
		//var valShotCodeOld = previousVersion.getValue('a_Shot_Code').getSimpleValue();
		//var valShotTypeOld = previousVersion.getValue('a_Shot_Type').getSimpleValue();
		//var valSharedMarketOld = previousVersion.getValue('a_Shared_Markets').getSimpleValue();
	
		node.getValue('a_Shot_Request_Type').setSimpleValue(valShotReqTypeOld);
		//node.getValue('a_Shot_Code').setSimpleValue(valShotCodeOld);
		//node.getValue('a_Shot_Type').setSimpleValue(valShotTypeOld);
		//node.getValue('a_Shared_Markets').setSimpleValue(valSharedMarketOld);
	}
	throw "<Mandatory Attribute Shot Request Type is Missing>";
}
else if (valShotCode == null || valShotCode == '')
{
	for (var j = revisions.size(); j > 0 ; j--) {
		var previousVersion = revisions.get(revisions.size() - 1).getNode();
		//var valShotReqTypeOld = previousVersion.getValue('a_Shot_Request_Type').getSimpleValue();
		var valShotCodeOld = previousVersion.getValue('a_Shot_Code').getSimpleValue();
		//var valShotTypeOld = previousVersion.getValue('a_Shot_Type').getSimpleValue();
		//var valSharedMarketOld = previousVersion.getValue('a_Shared_Markets').getSimpleValue();
	
		//node.getValue('a_Shot_Request_Type').setSimpleValue(valShotReqTypeOld);
		node.getValue('a_Shot_Code').setSimpleValue(valShotCodeOld);
		//node.getValue('a_Shot_Type').setSimpleValue(valShotTypeOld);
		//node.getValue('a_Shared_Markets').setSimpleValue(valSharedMarketOld);
	}
	throw "<Mandatory Attribute Shot Code is Missing>";
}
else if (valShotType == null || valShotType == '')
{
	for (var j = revisions.size(); j > 0 ; j--) {
		var previousVersion = revisions.get(revisions.size() - 1).getNode();
		//var valShotReqTypeOld = previousVersion.getValue('a_Shot_Request_Type').getSimpleValue();
		//var valShotCodeOld = previousVersion.getValue('a_Shot_Code').getSimpleValue();
		var valShotTypeOld = previousVersion.getValue('a_Shot_Type').getSimpleValue();
		//var valSharedMarketOld = previousVersion.getValue('a_Shared_Markets').getSimpleValue();
	
		//node.getValue('a_Shot_Request_Type').setSimpleValue(valShotReqTypeOld);
		//node.getValue('a_Shot_Code').setSimpleValue(valShotCodeOld);
		node.getValue('a_Shot_Type').setSimpleValue(valShotTypeOld);
		//node.getValue('a_Shared_Markets').setSimpleValue(valSharedMarketOld);
	}
	throw "<Mandatory Attribute Shot Type is Missing>";
}
else if (valSharedMarket == null || valSharedMarket == '')
{
	for (var j = revisions.size(); j > 0 ; j--) {
		var previousVersion = revisions.get(revisions.size() - 1).getNode();
		//var valShotReqTypeOld = previousVersion.getValue('a_Shot_Request_Type').getSimpleValue();
		//var valShotCodeOld = previousVersion.getValue('a_Shot_Code').getSimpleValue();
		//var valShotTypeOld = previousVersion.getValue('a_Shot_Type').getSimpleValue();
		var valSharedMarketOld = previousVersion.getValue('a_Shared_Markets').getSimpleValue();
	
		//node.getValue('a_Shot_Request_Type').setSimpleValue(valShotReqTypeOld);
		//node.getValue('a_Shot_Code').setSimpleValue(valShotCodeOld);
		//node.getValue('a_Shot_Type').setSimpleValue(valShotTypeOld);
		node.getValue('a_Shared_Markets').setSimpleValue(valSharedMarketOld);
	}
	throw "<Mandatory Attribute Shared Markets is Missing>";
}

}