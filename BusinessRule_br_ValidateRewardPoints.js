/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ValidateRewardPoints",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_ValidateRewardPoints",
  "description" : "Validate if Reward Points is non-negative; non-numeric already handled",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
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
exports.operation0 = function (node) {
var objectType = node.getObjectType().getName();
if(objectType == "CC"){
	var rewardPoint = node.getValue("a_Reward_Points").getSimpleValue();
//	log.info(rewardPoint);
	if(rewardPoint < 0){
		return "CC import SmartSheet rejected for CC " +node.getID()+" due negative Reward Points.";
	}
}
return true;

}