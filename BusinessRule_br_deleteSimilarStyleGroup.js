/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_deleteSimilarStyleGroup",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Delete Similar Style Group",
  "description" : "Completely delete a SimilarStyleGroup from Delete button on screen.",
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
	portal.showAlert("WARNING", null, "Deleting cancelled.");
} else if (avp == "Yes, Delete"){
	var superPDPMarket = node.getValue("a_SuperPDP_Market").getSimpleValue();
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    ctx = manager.getCurrentContext().getID();
    if (ctx == "EN_US" && superPDPMarket != null && superPDPMarket.contains("CAN") && !superPDPMarket.contains("US")) {
        portal.showAlert("ERROR", "", "Cannot delete Canada specific Similar Style Group in " + ctx);
    } else {
        portal.showAlert("WARNING", null, "Deleting the Similar Style Group in " + ctx + " context will delete the Similar Style Group in other markets as well.");
        var reftType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_styles");
        var refList = node.getReferences(reftType);
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
}
}