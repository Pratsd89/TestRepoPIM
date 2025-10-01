/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PGMarketUS",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Product Group Market Check US",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "MultiVariantGroup", "Product_Group" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
var SuperPDPMarket;
var MVGStatus;
step.executeInContext('EN_US',function(USmanager){
	var USproduct = USmanager.getProductHome().getProductByID(node.getID());
	SuperPDPMarket = USproduct.getValue("a_SuperPDP_Market").getSimpleValue();
	var MVGStatus = USproduct.getValue("a_MVG_Status").getSimpleValue();
});
if (SuperPDPMarket == null || !SuperPDPMarket.contains("US") || MVGStatus == "Error"){
	return false;
}
else {
	return true;
}

}