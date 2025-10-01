/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerPublishOnApprove",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger Publish On Approve",
  "description" : "Runs on approval of an object to publish it to Approved endpoints",
  "scope" : "Global",
  "validObjectTypes" : [ "Class", "CustomerChoice", "Department", "Division", "SKU", "SizeFacetCategory", "SizeFacetCode", "SizeFacetValue", "Style", "SubClass", "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Trigger",
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
//Removal of Non-DGL Outbound
/*var apprStatus = node.getApprovalStatus().toString();
if(apprStatus != "Not in Approved workspace") {
	enUS.republish(node);
	enCA.republish(node);
	frCA.republish(node);	
}*/



}