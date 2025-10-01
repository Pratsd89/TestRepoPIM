/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_deleteProductGroup",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Delete Product Groups",
  "description" : "Completely delete a Product Group from Delete button on screen.",
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group" ],
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
if (avp == "No, Cancel" || avp == null) {
    portal.showAlert("WARNING", "Deleting cancelled.");
} else if (avp == "Yes, Delete") {
    //PPIM-11517 Canada Exclusive DSG should be deleted from EN_CA only
    var superPDPMarket = node.getValue("a_SuperPDP_Market").getSimpleValue();
    var brand = node.getValue("a_Brand_Number").getSimpleValue()
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    ctx = manager.getCurrentContext().getID();
    var USsuperPDPMarket = getContextAttributeValue(node, "EN_US", "a_SuperPDP_Market");
    var CANsuperPDPMarket = getContextAttributeValue(node, "EN_CA", "a_SuperPDP_Market");
    if(superPDPMarket == null){
    	portal.showAlert("ERROR", "", "Cannot delete this Product Group as it is not valid in " + ctx);
    } else if (ctx == "EN_US" && superPDPMarket != null && superPDPMarket.contains("CAN") && !superPDPMarket.contains("US")) {
        portal.showAlert("ERROR", "", "Cannot delete Canada specific Product Group in " + ctx);
    } else if (ctx.contains("CA") && superPDPMarket != null && superPDPMarket.contains("US") && superPDPMarket.contains("CAN")) {
        portal.showAlert("ERROR", "", "It is not permitted to delete a Group in Canada when inheritance applies.");
    } else if (ctx.contains("CA") && superPDPMarket != null && superPDPMarket.contains("US") && !superPDPMarket.contains("CAN") || (ctx.contains("CA") && brand == "GO")) {
        portal.showAlert("ERROR", "", "It is not permitted to delete a US specific Group in Canada.");
    } else if (ctx.contains("CA") && superPDPMarket == "CAN" && USsuperPDPMarket == "US") {
    	         clearSpecificContext("EN_CA", node);
    } else if(ctx == "EN_US" && superPDPMarket == "US" && CANsuperPDPMarket == "CAN"){
    	         clearSpecificContext("EN_US", node);
    }
     else {
        portal.showAlert("WARNING", "Deleting the Product Group in " + ctx + " context will delete the Product Group in other markets as well, if applicable.");
        clearSpecificContext("EN_US", node);
        clearSpecificContext("EN_CA", node);
        node.delete();
        portal.navigate("homepage", null);
    }
}


function getContextAttributeValue(node, context, AttrID) {
    var value;
    manager.executeInContext(context, function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        value = currentContextNode.getValue(AttrID).getSimpleValue();
    });
    return value;
}

function clearSpecificContext(context,node){
 manager.executeInContext(context, function(currentContextManager) {
            var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
            var reftType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_ProductGroups");
            var refList = currentContextNode.getReferences(reftType);
            for (var i = 0; i < refList.size(); i++) {
                var ref = refList.get(i);
                var styleTarget = ref.getTarget();
                styleTarget.getValue("a_Primary_Selling_Style_ID").setSimpleValue("");
                styleTarget.getValue("a_Primary_Selling_Style").setSimpleValue("");
                styleTarget.getValue("a_Product_Grouping_Start_date").setSimpleValue(null);
                styleTarget.getValue("a_Product_Grouping_End_Date").setSimpleValue(null);
                styleTarget.getValue("a_SuperPDP_Program_ID").setSimpleValue("");
                styleTarget.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                ref.delete();
            }
            currentContextNode.getValue("a_Product_Grouping_Start_date").setSimpleValue("");
            currentContextNode.getValue("a_Product_Grouping_End_Date").setSimpleValue("");
            currentContextNode.getValue("a_SuperPDP_Market").setSimpleValue("");
            currentContextNode.getValue("a_Product_Group_Name").setSimpleValue("");
            currentContextNode.getValue("a_Primary_Selling_Style_ID").setSimpleValue("");
        });
}
}