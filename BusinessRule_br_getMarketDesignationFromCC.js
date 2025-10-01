/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_getMarketDesignationFromCC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "GetMarketDesignationFromCC",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log) {
log.info("Node (shot Request) id is -- " + node.getID());
var sReferencingCCs = new java.util.ArrayList();
sReferencingCCs.addAll(node.getReferencedByProducts());

if (!sReferencingCCs.isEmpty()) {
	for (var i = 0; i < sReferencingCCs.size(); i++) {
		var refCC = sReferencingCCs.get(i);
		var oStyleCC = refCC.getSource();
		log.info("Associated CC ID is - " +oStyleCC.getID());
				
		var sMarketDesigOnCC = oStyleCC.getValue("a_Market_Designation").getSimpleValue();
		node.getValue("a_Shared_Markets").setSimpleValue(sMarketDesigOnCC);
		//for (var j = 0; j < sMarketDesigOnCC.length; j++) {
			//var sharedMarketValue = sMarketDesigOnCC[j].getSimpleValue();
			//node.getValue("a_Shared_Markets").setSimpleValue(sharedMarketValue);
			
		//}		
	}
}
}