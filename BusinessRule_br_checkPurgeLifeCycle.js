/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_checkPurgeLifeCycle",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_checkPurgeLifeCycle",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "LOG",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (NODE,LOG) {
var type = NODE.getObjectType().getID();
var attrName = "";

//LOG.info(type)
switch(true){
	case type == "Style":
		attrName = "a_Style_Life_Cycle_Status";
	break;	
	case type == "CustomerChoice":
		attrName = "a_CC_Life_Cycle_Status";
	break;	
	case type == "SKU":
		attrName = "a_SKU_Life_Cycle_Status";
	break;	
}
//LOG.info(attrName);
return (NODE.getValue(attrName).getSimpleValue() == "Purged")?true:false;
}