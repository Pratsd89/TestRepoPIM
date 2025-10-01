/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "2_Excel_Test",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "2_Excel_Test",
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
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AssetBindContract",
    "alias" : "assetHome",
    "parameterClass" : "com.stibo.core.domain.impl.FrontAssetImpl",
    "value" : "SOX_111405",
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AssetBindContract",
    "alias" : "attachment",
    "parameterClass" : "com.stibo.core.domain.impl.FrontAssetImpl",
    "value" : "SOX_111405",
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
exports.operation0 = function (stepManager,assetHome,mail,attachment,node) {
var revisions = [];
var nodeValue = node.getValue("a_WebCategory_Price_Type_Filter").getSimpleValue();
log.info("nodeVa lue    " +nodeValue);
revisions = node.getRevisions()​;
var oldnodeValue = "";
for(var m=0 ;m<revisions.size();m++){

	var oldnodeValue =  revisions.get(m).	getNode().getValue("a_WebCategory_Price_Type_Filter").getSimpleValue();
	log.info("oldnodeValu e    " +oldnodeValue);
	if(nodeValue !=oldnodeValue ){
		
		 oldnodeValue = oldnodeValue;
	}
}
log.info("oldnode Value  " +oldnodeValue);
}