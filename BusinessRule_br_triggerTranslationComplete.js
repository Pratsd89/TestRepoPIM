/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_triggerTranslationComplete",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Trigger Translation Complete",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  }, {
    "libraryId" : "lib_MarketUpdate",
    "libraryAlias" : "marketUpdate"
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,step,log,LKT,helper,marketUpdate) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("'Date:'yyyy:MM:dd 'Time:'HH:mm:ss");
var currentContext = step.getCurrentContext().getID();
var market = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
var objectType = node.getObjectType().getID();
var USManager = null;
step.executeInContext("EN_US", function (otherContextManager) {
    USManager = otherContextManager;
});

if (objectType == 'Style') {
    // Translation IIEP completed so set translation status to complete and delete due date
    node.getValue('a_Translation_Due_Date').deleteCurrent();
    node.getValue("a_Translation_Status").setSimpleValue("Complete");
    node.getValue("translation_sent_to_publish").setSimpleValue(iso.format(time));

	var styleMarketDesignation = node.getValue("a_Style_Market_Designation").getSimpleValue();
	
    // Set Translation Status to complete in EN_US
	if (market == "CAN" && styleMarketDesignation != null && styleMarketDesignation.contains("US")){ //PPIM-13150
        var usCurrentProduct = USManager.getProductHome().getProductByID(node.getID());
        var translationStatus = usCurrentProduct.getValue("a_Translation_Status").getSimpleValue();
        if (translationStatus != null) {
            usCurrentProduct.getValue("a_Translation_Due_Date").deleteCurrent();
            usCurrentProduct.getValue("a_Translation_Status").setSimpleValue("Complete");
            usCurrentProduct.getValue("translation_sent_to_publish").setSimpleValue(iso.format(time));
        }
    }

    // auto approve if Style is approved before 
    if (styleMarketDesignation != null) {
        if (styleMarketDesignation.contains('US')) {
            var usCurrentProduct = USManager.getProductHome().getProductByID(node.getID());
            var styleLCS_US = usCurrentProduct.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

            if (styleLCS_US == "Approved" && styleMarketDesignation.contains(market)) {
                triggerProductWorkflow(node, currentContext);
            }
        }

        //When styleMarketDesignation is CAN;CAN,JPN or JPN;JPN,CAN
        if (styleMarketDesignation.contains(market) && !styleMarketDesignation.contains('US')) {
            triggerProductWorkflow(node, currentContext);
        }
    }
}
else if (objectType == 'CustomerChoice') {
	//PPIM-13151
	node.getValue("a_CC_Translation_Due_Date").deleteCurrent();
	node.getValue("a_CC_Translation_Status").setSimpleValue("Complete");
	node.getValue("a_CC_Translation_Sent_to_Publish").setSimpleValue(iso.format(time));

    var ccMarketDesignation = node.getValue("a_Market_Designation").getSimpleValue();

	if (market == "CAN" && ccMarketDesignation != null && ccMarketDesignation.contains("US")) { //PPIM-13150
		var usCurrentProduct = USManager.getProductHome().getProductByID(node.getID());
		var translationStatus = usCurrentProduct.getValue("a_CC_Translation_Status").getSimpleValue();
		if (translationStatus != null) {
			usCurrentProduct.getValue("a_CC_Translation_Due_Date").deleteCurrent();
			usCurrentProduct.getValue("a_CC_Translation_Status").setSimpleValue("Complete");
			usCurrentProduct.getValue("a_CC_Translation_Sent_to_Publish").setSimpleValue(iso.format(time));
		}
	}

    var parentStyle = node.getParent();
    var parentStyleMkts = parentStyle.getValue("a_Style_Market_Designation").getSimpleValue();
    var parentStyleLCS = null;
    var wfErrorMessage = null;

    if (ccMarketDesignation != null) {
        if (ccMarketDesignation.contains('US')) {
            var usCurrentProduct = USManager.getProductHome().getProductByID(node.getID());
            var ccLCS_US = usCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();

            if (ccLCS_US == "Approved" && ccMarketDesignation.contains(market)) {
                if (parentStyleMkts.contains(market)) {
                    parentStyleLCS = parentStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                    if (parentStyleLCS != "Approved") {
                        triggerProductWorkflow(parentStyle, currentContext);   //Approve Style
                    }
                }
                triggerProductWorkflow(node, currentContext);  //Approve CC if its not approved by now
            }
        }

        if (ccMarketDesignation.contains(market) && !ccMarketDesignation.contains('US')) {
            if (parentStyleMkts.contains(market)) {
                parentStyleLCS = parentStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (parentStyleLCS != "Approved") {
                    triggerProductWorkflow(parentStyle, currentContext);
                }
            }
            triggerProductWorkflow(node, currentContext);
        }
    }
}


function triggerProductWorkflow(currentNode, context) {
    var wfID = null;
    var state = null;
    var event = null;
    var objType = currentNode.getObjectType().getID();

    if (objType == 'Style') {
        wfID = LKT.getLookupTableValue("LKT_Context_to_Style_Enrich_Workflows", context);
        state = 'NewStyleEnrich_Final';
        event = 'FinalValidation';
    }
    else if (objType == 'CustomerChoice') {
        wfID = LKT.getLookupTableValue("LKT_Context_to_CC_Enrich_Workflows", context);
        state = 'NewCCEnrich_Final';
        event = 'Submit';
    }

    step.executeInContext(context, function (othercontextManager) {
        var otherCurrentProduct = othercontextManager.getProductHome().getProductByID(currentNode.getID());
        var wfErrorMessage = null;
        if (otherCurrentProduct.isInState(wfID, state)) {
            wfErrorMessage = otherCurrentProduct.getWorkflowInstanceByID(wfID).getTaskByID(state).triggerByID(event, "Product Workflow Approval from Translation Inbound").getScriptMessage();
        }
        if (wfErrorMessage != null) {
            otherCurrentProduct.getValue("a_error_message").setSimpleValue(currentContext + " : " + wfErrorMessage);
        }
        else {
            if (otherCurrentProduct.getValue("a_error_message").getSimpleValue() != null) {
                otherCurrentProduct.getValue("a_error_message").deleteCurrent();
            }
        }
    });

    if (objType == 'Style') {
        if (context == "FR_CA") {
            marketUpdate.checkAndApproveStyleInContext(currentNode, step, "EN_CA");
        }
        if (context == "JA_JP") {
            marketUpdate.checkAndApproveStyleInContext(currentNode, step, "EN_JP");
        }
        marketUpdate.checkAndApproveStyleInContext(currentNode, step, context);
    }
}

}