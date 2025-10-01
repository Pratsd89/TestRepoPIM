/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_checkPacmanLOV",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "ba_checkPacmanLOV",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Domain user-type root" ],
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
var MarketingFlagList = ["LoV_CC_Marketing_Flags_AT","LoV_Style_Marketing_Flags_AT","LoV_CC_Marketing_Flags_BR","LoV_Style_Marketing_Flags_BR","LoV_CC_Marketing_Flags_BRFS","LoV_Style_Marketing_Flags_BRFS","LoV_CC_Marketing_Flags_GAP","LoV_Style_Marketing_Flags_GAP","LoV_CC_Marketing_Flags_ON","LoV_Style_Marketing_Flags_ON"];
var MarketingFlag = false;
var lovID = node.getID();
var productTagRoot = manager.getClassificationHome().getClassificationByID('Product_Tags_Root');
var LovProductTag = productTagRoot.getValue('Tag_Outbound_Variable').getSimpleValue();
for (var i in MarketingFlagList){
	if(MarketingFlagList[i] == lovID){
		MarketingFlag = true;
		break;
	}
}

if(lovID == "Size_Variant" || lovID == "LoV_Dimension_Values" || LovProductTag != null || MarketingFlag == true){
	return true;
} else{
	return false;
}

}