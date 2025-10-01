/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TESTcharacters",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "TESTcharacters",
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
var a_Overview_Bullet1 = node.getValue("a_Overview_Bullet1").getSimpleValue();
log.info(a_Overview_Bullet1);
var a_Overview_Bullet2 = node.getValue("a_Overview_Bullet2").getSimpleValue();
log.info(a_Overview_Bullet2);
a_Overview_Bullet2 = a_Overview_Bullet2.replace("<lt/>lt/<gt/>","<lt/>");
a_Overview_Bullet2 = a_Overview_Bullet2.replace("<lt/>gt/<gt/>","<gt/>");
log.info(a_Overview_Bullet2);
}