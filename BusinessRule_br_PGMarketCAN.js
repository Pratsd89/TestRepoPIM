/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PGMarketCAN",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Product Group Market Check CAN",
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
step.executeInContext('EN_CA',function(CAmanager){
	var CAproduct = CAmanager.getProductHome().getProductByID(node.getID());
	SuperPDPMarket = CAproduct.getValue("a_SuperPDP_Market").getSimpleValue();
	var MVGStatus = CAproduct.getValue("a_MVG_Status").getSimpleValue();
})
if (SuperPDPMarket == null || !SuperPDPMarket.contains("CA") || MVGStatus == "Error"){
	return false;
}
else {
	return true;
}

}