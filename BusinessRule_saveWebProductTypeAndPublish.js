/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "saveWebProductTypeAndPublish",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Web Product Type and Publish",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Web_Product_Type" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "eventType",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_wpt",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "eventQueue",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=Pacman_Updates_Outbound",
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
exports.operation0 = function (node,manager,eventType,eventQueue,webUI) {
//Fetching from main
var setwptDimension1Label1 = false;
var setwptDimension2Label1 = false;
var setwptDimension2Label2 = false;
var setwptCCSelectorLabel = false;
var setwptDescription = false;
var classID = node.getID();
var brandNumber = node.getValue("a_Brand_Number").getSimpleValue();
var lovId = "LoV_" + brandNumber + "_WebProductType";
var wptDescription = node.getValue("a_WPT_Description").getSimpleValue();
var wptDimension1Label1 = node.getValue("a_WPT_Dimension1Label1").getSimpleValue();
var wptDimension2Label1 = node.getValue("a_WPT_Dimension2Label1").getSimpleValue();
var wptDimension2Label2 = node.getValue("a_WPT_Dimension2Label2").getSimpleValue();
var wptCCSelectorLabel = node.getValue("a_WPT_CC_Selector_Label").getSimpleValue();
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

/*PPIM-10715 : Fetch WPT Brand from node to fetch all WPTs within the Brand
			Check if modified WPT already exists within the respective Brand WPT */
var parentWPTBrand = node.getParent();
var allChildWPTs = parentWPTBrand.getChildren().toArray();
var isUniqueName = true
allChildWPTs.forEach(function(wpt) {
    var existingName = wpt.getValue('a_WPT_Description').getSimpleValue();
    var existingId = wpt.getID()
    if (existingName != null) {
    	   //verify for all names in the Brand WPT exclude the current object check
        if (existingId != classID && existingName.trim().toUpperCase() == wptDescription.trim().toUpperCase()) {
            isUniqueName = false
        }
    }
})

// PPIM-10715 : If WPT name is unique then run the existing logic, else pop error message in UI
if (isUniqueName) {
    //Fetching Values from Approved Workspace comparing and set name and description to add value to LOV
    var approvedCheck = manager.executeInWorkspace("Approved", function(approvedManager) {
        var appwptDescription = approvedManager.getObjectFromOtherManager(node).getValue("a_WPT_Description").getSimpleValue();
        if (wptDescription != appwptDescription) {
            setwptDescription = true;
            var fetchLov = manager.getListOfValuesHome().getListOfValuesByID(lovId);
            var lovValue = fetchLov.getListOfValuesValueByID(classID).getValue();
            fetchLov.getListOfValuesValueByID(classID).setValue(wptDescription, null);

        }
        var appWptDimension1Label1 = approvedManager.getObjectFromOtherManager(node).getValue("a_WPT_Dimension1Label1").getSimpleValue();
        if (wptDimension1Label1 != appWptDimension1Label1) {
            setwptDimension1Label1 = true;
        }
        var appWptDimension2Label1 = approvedManager.getObjectFromOtherManager(node).getValue("a_WPT_Dimension2Label1").getSimpleValue();
        if (wptDimension2Label1 != appWptDimension2Label1) {
            setwptDimension2Label1 = true;
        }
        var appWptDimension2Label2 = approvedManager.getObjectFromOtherManager(node).getValue("a_WPT_Dimension2Label2").getSimpleValue();
        if (wptDimension2Label2 != appWptDimension2Label2) {
            setwptDimension2Label2 = true;
        }
        var appWptCCSelectorLabel = approvedManager.getObjectFromOtherManager(node).getValue("a_WPT_CC_Selector_Label").getSimpleValue();
        if (wptCCSelectorLabel != appWptCCSelectorLabel) {
            setwptCCSelectorLabel = true;
        }
    });

    if (setwptDescription) {
        node.setName(wptDescription);
    }

    var ref = node.getClassificationProductLinks().toArray();
    for (var itr = 0; itr < ref.length; itr++) {
        var currentObj = ref[itr].getProduct();
        if (setwptDescription) {
            currentObj.getValue("a_Web_Product_Type").setSimpleValue(wptDescription);
        }
        if (setwptDimension1Label1) {
            currentObj.getValue("a_WPT_Dim1Label1").setSimpleValue(wptDimension1Label1);
        }
        if (setwptDimension2Label1) {
            currentObj.getValue("a_WPT_Dim2Label1").setSimpleValue(wptDimension2Label1);
        }
        if (setwptDimension2Label2) {
            currentObj.getValue("a_WPT_Dim2Label2").setSimpleValue(wptDimension2Label2);
        }
        if (setwptCCSelectorLabel) {
            currentObj.getValue("a_WPT_CCLabel").setSimpleValue(wptCCSelectorLabel);
        }
        if (setwptDimension1Label1 == true || setwptDimension2Label1 == true || setwptDimension2Label2 == true || setwptCCSelectorLabel == true || setwptDescription == true) {
            currentObj.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        }
    }

    if (setwptDescription == true || setwptDimension1Label1 == true || setwptDimension2Label1 == true || setwptDimension2Label2 == true || setwptCCSelectorLabel == true) {
        node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        node.approve();
        eventQueue.queueDerivedEvent(eventType, node);
    }
} else {
    webUI.showAlert("ERROR", "Web Product Type is case-insensitive. Found <b>" + wptDescription + "</b> already present in " + brandNumber + " WPT Brand. Please Retry Save with Unique Description.");

}

}