/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PrimaryStyleValidation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Primary Style Validation",
  "description" : "Check the changes on Primary Selling Style Number",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ImportChangeInfoBind",
    "alias" : "importChangeInfo",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log,importChangeInfo,LKT) {
var program_ID = node.getValue("a_SuperPDP_Program_ID").getSimpleValue();
var primaryStyleID = null;

if (program_ID != null && program_ID.length() == 6) {
    primaryStyleID = "000" + program_ID;
}
else if (program_ID != null && program_ID.length() == 7) {
    primaryStyleID = "00" + program_ID;
}

var styleGroupID = "";
var styleGroupObj;
var superPDPMarket = null;
var styleObj = manager.getProductHome().getProductByID(primaryStyleID);


//check for PPIM-11523
if (styleObj != null) {
    superPDPMarket = getProductGroupMKT(styleObj);
}

var context = manager.getCurrentContext().getID();
var currentMarketSPDP = LKT.getLookupTableValue("LKT_Context_to_Market", context);

if (importChangeInfo.getChanges() != null) {

    if (importChangeInfo.getChanges().getAttributes().contains("a_SuperPDP_Program_ID") && (program_ID == "" || program_ID == null)) {
        return "<b style='color:red;'>Primary Selling Style Number can't be changed to empty or blank. To remove the value, please use the 'DELETE' keyword.</b>";
    }

    if (program_ID != null && program_ID.equalsIgnoreCase('DELETE')) {
        var RefID = RefID(node);
        var styleObj = manager.getProductHome().getProductByID(node.getID());
        var currentStyleDSGMKT = getProductGroupMKT(node);
        var allowDelete = false;
        if (styleObj == null) {
            return "<b style='color:red;'>Style with Style Number '" + program_ID + "' doesn't Exists.</b>";
        } else if (currentMarketSPDP == "US" && currentStyleDSGMKT != null && currentStyleDSGMKT.contains("US")) {
            allowDelete = true;
        } else if (currentMarketSPDP == "CAN" && currentStyleDSGMKT == "CAN") {
            allowDelete = true;
        } else if (RefID == null) {
            allowDelete = true;
        }

        if (allowDelete) {
            return true;
        } else {
            return "<b style='color:red;'> Product Group cannot be deleted in this market.</b>";
        }
    }
    if (program_ID != null) {
        if (styleObj == null) {
            return "<b style='color:red;'>Style with Primary Selling Style Number '" + program_ID + "' doesn't Exists.</b>";
        } else if (currentMarketSPDP == "CAN" && superPDPMarket != null && superPDPMarket.contains("US")) {
            throw "<b style='color:red;'>Please proceed to US market and then add the styles only from US market.</b>";
        } else {
            return true;
        }
    }
}
return true;



function getProductGroupMKT(style) {
    var duplicateStyleGroupMKT = null;
    var refByDSG = style.getReferencedBy().toArray();
    for (var i = 0; i < refByDSG.length; i++) {
        if (refByDSG[i].getReferenceType().getID() == "rt_ProductGroups") {
            duplicateStyleGroupMKT = refByDSG[i].getSource().getValue("a_SuperPDP_Market").getSimpleValue();
        }
    }
    return duplicateStyleGroupMKT;
}

function RefID(style) {
    var RefID = null;
    var refByDSG = style.getReferencedBy().toArray();
    for (var i = 0; i < refByDSG.length; i++) {
        if (refByDSG[i].getReferenceType().getID() == "rt_ProductGroups") {
            RefID = refByDSG[i].getSource().getID();
        }
    }
    return RefID;
}
}