/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Create_Group_UI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Test_Business_Rules" ],
  "name" : "TEST Create Product Group from Search Style Screen",
  "description" : "Create Product Group button in Search Style screen &  Create Product Groups from a list of selected Styles.",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "productGroupReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
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
exports.operation0 = function (manager,productGroupReference,node) {
function findCorrectPrimaryStyle(styleList, market, primaryStyle) {
	var currentContext = manager.getCurrentContext().getID();
     for (var i = 0; i < styleList.length; i++) {
        var currStyle = styleList[i].getTarget();
        var styleMktDesg = currStyle.getValue("a_Style_Market_Designation").getSimpleValue();
        var stylelcs = null;

        if (market == "both" && currentContext == "EN_US") {
            if (styleMktDesg != null && styleMktDesg.contains("US") && styleMktDesg.contains("CAN") && (currStyle != primaryStyle)) {
                stylelcs = currStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                var currStyle_CAN = canadaManager.getObjectFromOtherManager(currStyle);
                var stylelcs_CAN = currStyle_CAN.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (stylelcs != null && stylelcs == "Approved" && stylelcs_CAN != null && stylelcs_CAN == "Approved") {
                    return currStyle;
                }
            }
        }
        else if (market == "US" && currentContext == "EN_US") {
            if (styleMktDesg.contains("US") && (currStyle != primaryStyle)) {
                stylelcs = currStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (stylelcs != null && stylelcs == "Approved") {
                    return currStyle;
                }
            }
        }
        else if (market == "CAN" && currentContext == "EN_CA") {
            if (styleMktDesg.contains("CAN") && (currStyle != primaryStyle)) {
                stylelcs = currStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (stylelcs != null && sstylelcs == "Approved") {
                    return currStyle;
                }
            }
        }
    }
    return "StyleNotFound";
}


function updatePrimaryStyle(node, newPrimaryStyle) {
	log.info("test");
    var dsg_refs = node.getReferences(productGroupReference);
    for (var i = 0; i < dsg_refs.size(); i++) {
        var ref = dsg_refs.get(i);
        var currID = ref.getTarget().getID();
        if (currID == newPrimaryStyle.getID()) {
            ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
        } else {
            ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");
        }
    }
    node.setName(newPrimaryStyle.getName());
    node.getValue("a_Product_Group_Name").setSimpleValue(newPrimaryStyle.getName());
    node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(newPrimaryStyle.getID());
}


function findCurrentPrimaryStyle(referencedStyles) {
    for (var i = 0; i < referencedStyles.length; i++) {
        var currentStyle = referencedStyles[i].getTarget();
        var primaryRefValue = referencedStyles[i].getValue("a_Primary_Selling_Style").getSimpleValue();
        if (primaryRefValue == "Yes") {
            return currentStyle;
        }
    }
}

function publishAllStyles(node) {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    for (var i = 0; i < referencedStyles.length; i++) {
        var currentStyle = referencedStyles[i].getTarget();
        style.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    }
}




var canadaManager = null;
manager.executeInContext("EN_CA", function (contextManager) {
    canadaManager = contextManager;
});

var nodeCAN = canadaManager.getObjectFromOtherManager(node);
var referencedStyles = node.getReferences(productGroupReference).toArray();
var primaryProductNumber = node.getValue("a_Primary_Product").getSimpleValue();
var market = node.getValue("a_SuperPDP_Market").getSimpleValue();

if (market.contains("US") && market.contains("CAN")) {
    var spdpMarket = "both";
}
else if (market == "US") {
    var spdpMarket = "US";
}
else if (market == "CAN") {
    var spdpMarket = "CAN";
}


var primaryStyle = findCurrentPrimaryStyle(referencedStyles);
var primaryStyleNumber = primaryStyle.getValue("a_Style_Number").getSimpleValue();
var primaryStyleLCS = primaryStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

if (primaryStyleLCS != "Approved" && (primaryProductNumber == primaryStyleNumber)) {
    var newPrimaryStyle = findCorrectPrimaryStyle(referencedStyles, spdpMarket, primaryStyle);
    if (newPrimaryStyle != "StyleNotFound") {
        if (spdpMarket == "both") {
            updatePrimaryStyle(node, newPrimaryStyle);
            updatePrimaryStyle(nodeCAN, newPrimaryStyle);
        } else if (spdpMarket == "US") {
            updatePrimaryStyle(node, newPrimaryStyle);
        } else if (spdpMarket == "CAN") {
            updatePrimaryStyle(nodeCAN, newPrimaryStyle);
        }
        publishAllStyles(node);
        publishAllStyles(nodeCAN);
    }
}

}