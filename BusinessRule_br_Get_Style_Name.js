/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Get_Style_Name",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Get Style Name",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
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
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
var stepName;
//var styleName;
var styleNumber;
//var inheritedStyleNumber;
stepName = node.getName();
//styleName = node.getValue("a_Style_Name").getSimpleValue();
styleNumber = node.getID();
//inheritedStyleNumber = node.getValue("a_Style_Number").getSimpleValue();

//log.info("STYLE NAME: " + styleName);
//log.info("STEP NAME: " + stepName);
//log.info("STYLE NUMBER: " + styleNumber);
//log.info("INHERITED STYLE NUMBER: " + inheritedStyleNumber);
if(stepName!=null)
node.getValue("a_Style_Name").setSimpleValue(stepName);
//node.getValue("a_Style_Number").setSimpleValue(styleNumber);
log.info("NEW STYLE NAME: " + node.getValue("a_Style_Name").getSimpleValue());
//log.info("NEW STYLE NUMBER: " + node.getValue("a_Style_Number").getSimpleValue());

}