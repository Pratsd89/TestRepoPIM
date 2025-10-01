/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_deleteDuplicateStyleGroup",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Delete Duplicate Style Group",
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "avp",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">attr_Confirmation</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,portal,avp) {
if(avp == "No, Cancel" || avp == null){
	portal.showAlert("WARNING", "Deleting cancelled.");
} else if (avp == "Yes, Delete"){
var reftType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_mergeDuplicateStyles");
var refList = node.getReferences(reftType);
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
ctx = manager.getCurrentContext().getID();
portal.showAlert("WARNING", "Deleting the Duplicate Style Group in " + ctx + " context will delete the Duplicate Style Group in other markets as well.");
for(var i=0; i < refList.size();i++){
	var ref = refList.get(i);
	var styleTarget = ref.getTarget();
	styleTarget.getValue("a_Primary_Selling_Style_ID").setSimpleValue("");
	styleTarget.getValue("a_Primary_Selling_Style").setSimpleValue("");
	styleTarget.getValue("a_Supporting_Styles").setSimpleValue("");
	styleTarget.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	styleTarget.getValue("a_SuperPDP_Program_ID").setSimpleValue("");  // PPIM-10910 - Delete value of SuperPDP_Program_ID if DSG is deleted so that Export Smartsheet will not show the value.
	
	ref.delete();
}

node.delete();
}
}