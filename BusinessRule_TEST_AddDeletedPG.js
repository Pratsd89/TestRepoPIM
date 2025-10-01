/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TEST_AddDeletedPG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Test_Business_Rules" ],
  "name" : "TEST Add Deleted PG to US",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ProductGroupLibrary",
    "libraryAlias" : "pgLibrary"
  } ]
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "rt_pg",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,rt_pg,manager,webUI,pgLibrary) {
var ObjectType = node.getObjectType().getID();
var References;
var USNode;
var USName;
var currentContext = manager.getCurrentContext().getID();
var superPDPMkt = node.getValue("a_SuperPDP_Market").getSimpleValue();
var otherContextManager;
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

manager.executeInContext("EN_US", function (otherContextManager) {
    USManager = otherContextManager;
});

manager.executeInContext("EN_CA", function (otherContextManager) {
    CANManager = otherContextManager;
});

if (ObjectType == "Product_Group") {
    var primaryStyle = null;
    USNode = USManager.getProductHome().getProductByID(node.getID());
    var primaryStyleID = USNode.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
    if (primaryStyleID != null) {
        primaryStyle = USManager.getProductHome().getProductByID(primaryStyleID);
    }
    var primaryStyleMktDsg = primaryStyle.getValue("a_Style_Market_Designation").getSimpleValue();

    if ((currentContext == "EN_CA" || currentContext == "FR_CA") && (superPDPMkt == null) && primaryStyle != null && !primaryStyleMktDsg.contains("CAN")) {
        webUI.showAlert("WARNING", "This action cannot be perfomed here.");
    }
    else if (primaryStyle != null && primaryStyleMktDsg.contains("CAN")) {
        var primarystyleCAN = CANManager.getObjectFromOtherManager(primaryStyle);
        var primaryStyleLcs = primarystyleCAN.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

        if (primaryStyleLcs == "Draft" || primaryStyleLcs == "Purged") {
            webUI.showAlert("ERROR", "Primary Style is in Draft/Purged state in CAN market.");
        }
        else {
            References = USNode.getReferences(rt_pg).toArray();
            if (References.length > 0) {
                USNode.getValue("a_SuperPDP_Market").deleteCurrent();
                USNode.getValue("a_SuperPDP_Market").addValue("US");
                USNode.getValue("a_SuperPDP_Market").addValue("CAN");
            }

            //Remove existing style references in EN_CA
            pgLibrary.removeReferences(node, rt_pg);

            //Add style references in EN_CA based on EN_US
            addReferences(node, rt_pg, References);

            //Set group data in EN_CA
            USName = USNode.getName();
            node.setName(USName);
            node.getValue("a_SuperPDP_Market").deleteCurrent();
            node.getValue("a_SuperPDP_Market").addValue("US");
            node.getValue("a_SuperPDP_Market").addValue("CAN");

            //Copy attribute values from group in EN_US to group and referenced styles in EN_CA
            CopyAttributeValues(node);
        }
    }
}



function addReferences(node, RefType, References) {
    for (var i in References) {
        var metadata = References[i].getValue("a_Primary_Selling_Style").getSimpleValue();
        var refStyle = References[i].getTarget();
        var StyleMKTDesg = refStyle.getValue("a_Style_Market_Designation").getSimpleValue();

        if (StyleMKTDesg.contains("CAN")) {
            var refStyleCAN = CANManager.getObjectFromOtherManager(refStyle);
            var styleLcsCAN = refStyleCAN.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

            //Skip adding Draft or Purged styles
            if (styleLcsCAN != "Draft" && styleLcsCAN != "Purged") {
                try {
                    var newRef = node.createReference(refStyleCAN, RefType);
                    if (metadata != null) {
                        newRef.getValue("a_Primary_Selling_Style").setSimpleValue(metadata);
                    }
                } catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
                        logger.info("Link already Exists");
                    }
                }
            }
        }
    }
}

function CopyAttributeValues(node) {
    var PGAttributes = ["a_Primary_Selling_Style_ID", "a_Product_Group_Name", "a_Product_Grouping_Start_date", "a_Product_Grouping_End_Date"];
    var AttributeValue;
    for (var m in PGAttributes) {
        var otherContextNode = USManager.getProductHome().getProductByID(node.getID());
        AttributeValue = otherContextNode.getValue(PGAttributes[m]).getSimpleValue();
        if (AttributeValue != null) {
            node.getValue(PGAttributes[m]).setSimpleValue(AttributeValue);
        }
    }

    //Set style data based on group data
    var currentNodeRefs = node.getReferences(rt_pg).toArray();
    var grpStartDate = node.getValue("a_Product_Grouping_Start_date").getSimpleValue();
    var grpEndDate = node.getValue("a_Product_Grouping_End_Date").getSimpleValue();
    var primaryStyle = manager.getProductHome().getProductByID(node.getValue("a_Primary_Selling_Style_ID").getSimpleValue());

    for (var i in currentNodeRefs) {
        var ref = currentNodeRefs[i];
        var styleTarget = ref.getTarget();
        styleTarget.getValue("a_Product_Grouping_Start_date").setSimpleValue(grpStartDate);
        styleTarget.getValue("a_Product_Grouping_End_Date").setSimpleValue(grpEndDate);
        styleTarget.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyle.getValue("a_Style_Number").getSimpleValue());
        styleTarget.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    }
}
}