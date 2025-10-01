/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "FR Mkt Flag Trigger Style event DGL",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "FR Marketing Flag Trigger Style event DGL",
  "description" : "ApproveStyle",
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,queryHome,manager) {
function triggerUpdatesForObjectType(pphNode, triggerObjectType) {
			var c = com.stibo.query.condition.Conditions;
			var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
				c.objectType(manager.getObjectTypeHome().getObjectTypeByID(triggerObjectType))
				.and(c.hierarchy().simpleBelow(pphNode))
			);
			var res = querySpecification.execute();
			res.forEach(function(resNode) {
			//logger.info("res node = " + resNode.getID());
			//logger.info("res node = " + resNode.getObjectType().getID());
			if(resNode.getObjectType().getID() == "Style")
			{
				triggerEvent(resNode);
			}
			return true;
			});
			}


triggerUpdatesForObjectType (node, "Style");

function triggerEvent(Style)
{

	var lifecycle = Style.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

	if(!(lifecycle == "DRAFT" || lifecycle == "Draft"))
	{
			//Triggering Style
			//Removal of FR_CA DGL Outbound
			//OutboundQueue.queueDerivedEvent(Outbound,Style);
	}
	
	
}
}