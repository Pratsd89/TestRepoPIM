/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SKU_Size_ref",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br SKU Size ref",
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
    "alias" : "manager",
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
exports.operation0 = function (node,manager,log) {
var nodeID=node.getID();
var id_classification = node.getValue("a_Size_Code").getSimpleValue();
log.info(id_classification)

if(id_classification != null )
{

	var classification_a = manager.getClassificationHome().getClassificationByID(id_classification);
	var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("SKUToSizeCode");
	log.info(classification_a)
	if(classification_a != null)
	{
               classification_a.createClassificationProductLink(node,linkType);
              log.info("linked")
	}
}
}