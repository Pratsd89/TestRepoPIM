/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DSGCleanUpOneTime",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_DSGCleanUpOneTime",
  "description" : "Completely delete a DuplicateStyleGroup from Delete button on screen.",
  "scope" : "Global",
  "validObjectTypes" : [ "DuplicateStyleGroup" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
exports.operation0 = function (manager,node) {

var reftType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_mergeDuplicateStyles");
var refList = node.getReferences(reftType);
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
for(var i=0; i < refList.size();i++){
	var ref = refList.get(i);
	var styleTarget = ref.getTarget();
	styleTarget.getValue("a_Primary_Selling_Style_ID").setSimpleValue("");
	styleTarget.getValue("a_Primary_Selling_Style").setSimpleValue("");
	styleTarget.getValue("a_Supporting_Styles").setSimpleValue("");
	styleTarget.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	styleTarget.getValue("a_SuperPDP_Program_ID").setSimpleValue(""); 
	ref.delete();
}

node.delete();
}