/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "cscategoryname",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set CS Category Name",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerServiceCategory", "CustomerServiceHome" ],
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
exports.operation0 = function (node,log) {
var desc = node.getValue("a_Category_Description").getSimpleValue();
var cid = node.getValue("a_WebCategory_CID").getSimpleValue();
var note = node.getValue("a_WebCategory_Note").getSimpleValue();
var newName = node.getName();
if(note!=null){
	newName = desc + "-" + cid + "-" + note
}
else {
	newName = desc + "-" + cid 
}

node.setName(newName);

}