/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Save_ProductGroup",
  "type" : "BusinessAction",
  "setupGroups" : [ "Test_Business_Rules" ],
  "name" : "TEST Save Product Group",
  "description" : "Runs behind \"Save Duplicate Style Group\" button on the screen with ID “DuplicateStyleGroup_Details_Screen”",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
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
exports.operation0 = function (node,step,productGroupReference,webUI) {
var Market = node.getValue("a_SuperPDP_Market").getSimpleValue();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var universalPrimaryID = node.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
var context = step.getCurrentContext().getID();
var canadaManager = "";
step.executeInContext("EN_CA", function (contextManager) {
    canadaManager = contextManager;
});

if (Market != null) {
    if ((step.getCurrentContext().getID() == "EN_CA") && (Market.contains("multisep"))) {
        revertValues(context, node, universalPrimaryID);
        setDatesFromUS(node);
        webUI.showAlert("WARNING", "<b>ALERT: " + "This a shared group between US and Canada. Kindly perform this action is EN_US context" + "</b>");
    }
    else {
        var time = new java.util.Date();
        var referencedStyles = node.getReferences(productGroupReference).toArray();
        var primaryCount = 0;
        var primaryStyle = null;

        for (var i = 0; i < referencedStyles.length; i++) {
            var currentStyle = referencedStyles[i].getTarget();
            var primaryRefValue = referencedStyles[i].getValue("a_Primary_Selling_Style").getSimpleValue();
            if (primaryRefValue == "Yes") {
                primaryCount = primaryCount + 1;
                primaryStyle = currentStyle;
            }
            else if (primaryRefValue == null) {
                referencedStyles[i].getValue("a_Primary_Selling_Style").setSimpleValue("No");
                if (context == "EN_US" && (Market.contains("multisep"))) {
                    var caNode = canadaManager.getProductHome().getProductByID(referencedStyles[i]);
                    caNode.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                }
            }
        }

        if (primaryCount > 1) {
            revertValues(context, node, universalPrimaryID);
            webUI.showAlert("ERROR", "There should be only one Style marked as Primary Selling Style for a PrimaryGroup. Please fix prior to saving");
        } else if (primaryCount == 0) {
            revertValues(context, node, universalPrimaryID);
            webUI.showAlert("ERROR", "You must mark one of the Styles as the Primary Selling Style for this Primary Group. Please fix prior to saving");
        } else {
            var startDateStr = node.getValue("a_Product_Grouping_Start_date").getSimpleValue();
            var endDateStr = node.getValue("a_Product_Grouping_End_Date").getSimpleValue();
            var startDate = null;
            var endDate = null;
            var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

            if (startDateStr != null) {
                startDate = java.time.LocalDate.parse(startDateStr, formatter);
            }
            if (endDateStr != null) {
                endDate = java.time.LocalDate.parse(endDateStr, formatter);
            }

            if (startDate > endDate) {
                node.getValue("a_Product_Grouping_Start_date").setSimpleValue(primaryStyle.getValue("a_Product_Grouping_Start_date").getSimpleValue());
                node.getValue("a_Product_Grouping_End_Date").setSimpleValue(primaryStyle.getValue("a_Product_Grouping_End_Date").getSimpleValue());
                webUI.showAlert("WARNING", "Product Group Start Date is greater than Product Group End Date.");
            }
            else {
                var primaryID = node.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
                if (primaryID != primaryStyle.getID()) {
                    var primaryNum = primaryStyle.getValue("a_Style_Number").getSimpleValue();
                    var parentSubClass = primaryStyle.getValue("a_SubClass_Description").getSimpleValue();
                    node.getValue("a_SubClass_Description").setSimpleValue(parentSubClass);
                    if (context == 'EN_US' && (Market.contains("multisep"))) {
                        node.setName(primaryStyle.getName());
                        node.getValue("a_Product_Group_Name").setSimpleValue(primaryStyle.getName());
                        node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());

                        var contextNode = canadaManager.getObjectFromOtherManager(node);
                        contextNode.getValue("a_Product_Group_Name").setSimpleValue(primaryStyle.getName());
                        contextNode.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());

                        var dsg_refs = contextNode.getReferences(productGroupReference);
                        for (var i = 0; i < dsg_refs.size(); i++) {
                            var ref = dsg_refs.get(i);
                            var curID = ref.getTarget().getID();
                            if (curID == primaryStyle.getID()) {
                                ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                            } else {
                                ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                            }
                        }
                    } else if (context == 'EN_US' || context == 'EN_CA' || context == 'FR_CA') {
                        node.getValue("a_Product_Group_Name").setSimpleValue(primaryStyle.getName());
                        node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());
                        node.setName(primaryStyle.getName());
                    }
                }
                publishStyles();
            }
        }
    }
}
else {
    var startDate = node.getValue("a_Product_Grouping_Start_date").getSimpleValue();
    var endDate = node.getValue("a_Product_Grouping_End_Date").getSimpleValue();
    if (startDate != null) {
        node.getValue("a_Product_Grouping_Start_date").setSimpleValue(null);
    }
    if (endDate != null) {
        node.getValue("a_Product_Grouping_End_Date").setSimpleValue(null);
    }
}


//Set style dates with Group Date and publish them
function publishStyles() {
    var currentContextStyles = node.getReferences(productGroupReference).toArray();
    var startDate = node.getValue("a_Product_Grouping_Start_date").getSimpleValue();
    var endDate = node.getValue("a_Product_Grouping_End_Date").getSimpleValue();
    for (var i = 0; i < currentContextStyles.length; i++) {
        var currentStyle = currentContextStyles[i].getTarget();
        currentStyle.getValue("a_Product_Grouping_Start_date").setSimpleValue(startDate);
        currentStyle.getValue("a_Product_Grouping_End_Date").setSimpleValue(endDate);
        currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    }

    if (context == 'EN_US' && (Market.contains("multisep"))) {
        var otherContextNode = canadaManager.getObjectFromOtherManager(node);
        var otherContextStyles = otherContextNode.getReferences(productGroupReference).toArray();
        for (var i = 0; i < otherContextStyles.length; i++) {
            var otherStyle = otherContextStyles[i].getTarget();
            otherStyle.getValue("a_Product_Grouping_Start_date").setSimpleValue(startDate);
            otherStyle.getValue("a_Product_Grouping_End_Date").setSimpleValue(endDate);
            otherStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));

        }
        otherContextNode.getValue("a_Product_Grouping_Start_date").setSimpleValue(startDate);
        otherContextNode.getValue("a_Product_Grouping_End_Date").setSimpleValue(endDate);
    }
}


function setDatesFromUS(node) {
    var contextNodeDateSetter = step.executeInContext('EN_US', function (cmmanager) {
        return cmmanager.getObjectFromOtherManager(node);
    });
    node.getValue("a_Product_Grouping_Start_date").setSimpleValue(contextNodeDateSetter.getValue("a_Product_Grouping_Start_date").getSimpleValue());
    node.getValue("a_Product_Grouping_End_Date").setSimpleValue(contextNodeDateSetter.getValue("a_Product_Grouping_End_Date").getSimpleValue());
}


function revertValues(context, node, primaryStyle) {
    var contextNode = canadaManager.getObjectFromOtherManager(node);
    var dsg_refs = contextNode.getReferences(productGroupReference);

    for (var i = 0; i < dsg_refs.size(); i++) {
        var ref = dsg_refs.get(i);
        var curID = ref.getTarget().getID();
        if (curID == primaryStyle) {
            ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
        } else {
            ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");
        }
    }
}
}