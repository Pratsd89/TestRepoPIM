/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "GetCCsFromShotRequest",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "GetCCsFromShotRequest",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log) {
log.info("----------1---------- Node (shot Request) id is -- " + node.getID());
var sReferencingCCs = new java.util.ArrayList();
sReferencingCCs.addAll(node.getReferencedByProducts());
log.info("----------2---------- " + sReferencingCCs);
if (!sReferencingCCs.isEmpty()) {
	for (var i = 0; i < sReferencingCCs.size(); i++) {
		var refCC = sReferencingCCs.get(i);
		var oStyleCC = refCC.getSource();
		log.info("----------3---------- Associated CC ID is - " +oStyleCC.getID());
		
		var sMarketDesigOnCC = oStyleCC.getValue("a_Market_Designation").getSimpleValue();
		log.info("----------4---------- Market Designation On CC = " + sMarketDesigOnCC);

		
	}

}
}