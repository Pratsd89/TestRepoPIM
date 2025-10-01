/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Populate_Franchise_Exclusive",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Populate Franchise Exclusive",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
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
//Temporarily commenting based on the SA User Request.

/*var canadaManager = "";
var usManager = "";
var jpManager = "";
var saManager = "";
step.executeInContext("EN_CA", function(contextManager) {
    canadaManager = contextManager;
});
step.executeInContext("EN_US", function(contextManager) {
    usManager = contextManager;
});
step.executeInContext("EN_JP", function(contextManager) {
    jpManager = contextManager;
});
step.executeInContext("EN_SA", function(contextManager) {
    saManager = contextManager;
});

var canNode = canadaManager.getObjectFromOtherManager(node);
var usNode = usManager.getObjectFromOtherManager(node);
var jpNode = jpManager.getObjectFromOtherManager(node);
var saNode = saManager.getObjectFromOtherManager(node);


var ccMktDesg=node.getValue("a_Market_Designation").getSimpleValue()



if ( ("SA").equals(ccMktDesg) && ( !ccMktDesg.contains("US") || !ccMktDesg.contains("CAN") || !ccMktDesg.contains("JPN") ) ){
	saNode.getValue("a_Franchise_Exclusive").setSimpleValue("Yes");
	usNode.getValue("a_Franchise_Exclusive").setSimpleValue("No");
	jpNode.getValue("a_Franchise_Exclusive").setSimpleValue("No");
	canNode.getValue("a_Franchise_Exclusive").setSimpleValue("No");
}
else {
	saNode.getValue("a_Franchise_Exclusive").setSimpleValue("No");
	usNode.getValue("a_Franchise_Exclusive").setSimpleValue("No");
	jpNode.getValue("a_Franchise_Exclusive").setSimpleValue("No");
	canNode.getValue("a_Franchise_Exclusive").setSimpleValue("No");
}
*/
}