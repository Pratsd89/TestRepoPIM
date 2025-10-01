/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_OneTimeMarketingFlag",
  "type" : "BusinessAction",
  "setupGroups" : [ "MarketingFlagActions" ],
  "name" : "ba_OneTimeMarketingFlag",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var Brand = node.getValue("MarketingFlagBrand").getSimpleValue();
var MarketingFlagType = node.getValue("MarketingFlagType").getSimpleValue();
var MarketingFlagName = node.getValue("MarketingFlagName").getSimpleValue();
if(MarketingFlagName!=null){
	var KeyValue = Brand + "_" + MarketingFlagType + "_" + MarketingFlagName;
	node.getValue("MarketingFlagKey").setSimpleValue(KeyValue);
}
node.approve();

}