/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_cancelShotRequest_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CancelShotRequest_Action",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookUpHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
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
exports.operation0 = function (node,step,lookUpHome,CCToPhotoShotRef,webUI,helper) {

var result = true;
var stat = node.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
var site = node.getValue('a_Site_Placement').getID();
var shotPrimaryMkt = node.getValue("a_Shot_Primary_Market").getSimpleValue();
log.info('stat' + stat);

if (site == 5) {
	result = false;
    webUI.showAlert("ERROR",  "Main P1 Shots can't be cancelled");
} else if (stat == "Submitted" && node.isInState("wf_ShortRequestLifeCycle", "Submitted") == true) {
	log.info("tet");
    node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Submitted").triggerByID("Cancel", "Web UI Based Shot Request Cancel");
    updateCCPhotoStatus(node);
}
else {
	log.info("else");
    result = false;
    webUI.showAlert("ERROR", "This Shot Request cannot be cancelled");
}


//Publish shotRequest
/*if (result == true) {
    if (shotPrimaryMkt == "US") {
        assethubqueueUS.queueDerivedEvent(eventType, node);
    }
    else if (shotPrimaryMkt == "CAN") {
        assethubqueueCA.queueDerivedEvent(eventType, node);
    }
    else if (shotPrimaryMkt == "JPN") {
        assethubqueueJP.queueDerivedEvent(eventType, node);
    }
    else if (shotPrimaryMkt == "SA") {
        assethubqueueSA.queueDerivedEvent(eventType, node);
    }
}*/


//PPIM-12693
function updateCCPhotoStatus(node) {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();
    if (sharedMarkets.length > 0) {
        for (var itr = 0; itr < sharedMarkets.length; itr++) {
            var value = sharedMarkets[itr].getSimpleValue();
            var contextId = lookUpHome.getLookupTableValue("LKT_MarketDesignationToMarket", value);
            setCCPhotoStatus(node, step, contextId);
        }
    }


    function setCCPhotoStatus(node, stepManager, contextId) {
        stepManager.executeInContext(contextId, function (manager) {
            var shotRequest = manager.getEntityHome().getEntityByID(node.getID());
            var ccList = helper.getCCsFromShot(shotRequest);

            for (i = 0; i < ccList.size(); i++) {
                var cc = ccList.get(i);
                var photoStatus = cc.getValue("a_CC_Photo_Status").getSimpleValue();
                var allShotsStatus = null;

                if (photoStatus == "Complete: Request Submitted") {
                    allShotsStatus = checkAllShotsStatus(cc);
                    if (allShotsStatus == "Complete") {
                        cc.getValue("a_CC_Photo_Status").setSimpleValue("Complete");
                        webUI.navigate("homepage", null);
                    }
                }
            }
            cc.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        });
    }


    function checkAllShotsStatus(cc) {
        var status = "Complete";
        var shotList = cc.getReferences(CCToPhotoShotRef).toArray();
        for (var i = 0; i < shotList.length; i++) {
            var shot = shotList[i].getTarget();
            var shotStatus = shot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
            if (shotStatus == "Submitted") {
                status = "Submitted";
                break;
            }
        }
        return status;
    }
}

}