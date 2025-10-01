/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Auto_Trigger_SA_WF_BOM_CC-IN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Auto Trigger SA WF When US BOM CC Complete Inside WF",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
var BusinessRuleHome = stepManager.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
if (node.getObjectType().getID() == 'CustomerChoice') {
    var autoTrigger = false;
    var wfErrorMessage = null;

    var ccRefs = node.getReferences().asList();
    for (var i = 0; i < ccRefs.size(); i++) {
        if (ccRefs.get(i).getReferenceType().getID() == "rt_BOM_CC") {
            var bomCC = ccRefs.get(i).getTarget();
            log.info(bomCC);
            stepManager.executeInContext("EN_US", function(enContextManager) {
                var enProduct = enContextManager.getProductHome().getProductByID(bomCC.getID());
                var usLifeCycleStatus = enProduct.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
                log.info(usLifeCycleStatus);
                var usCCPhotoStatus = enProduct.getValue('a_CC_Photo_Status').getSimpleValue();
                log.info(usCCPhotoStatus);
                if (usLifeCycleStatus == 'Approved' || (usLifeCycleStatus == 'In Progress' && usCCPhotoStatus == 'Complete') || (usLifeCycleStatus == 'Waiting for Style Approval' && usCCPhotoStatus == 'Complete')) {
                    autoTrigger = true;
                } else if (usLifeCycleStatus == 'In Progress' && usCCPhotoStatus == 'Ready For Review') {
                    log.info('line 17');
                    triggerNewCCEnrichPhoto2Event(node);
                }


            });
        }
    }

    if (autoTrigger == true) {
        log.info("Executing Autotrigger of CC");
        /*if ((node.isInState("wf_CCEnrichmentSA", "NewCCEnrich_Photo2"))) {
        	try {
        		wfErrorMessage = node.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview", "Auto Trigger").getScriptMessage();
        	} catch (e) {
        		if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
        			node.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo2").triggerLaterByID("SubmitForReview", "Auto Trigger");
        		}
        	}
        	if (wfErrorMessage != null) {
        		node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
        	}
        }*/
        triggerNewCCEnrichPhoto2Event(node);

        if ((node.isInState("wf_CCEnrichmentSA", "NewCCEnrich_Photo3"))) {
            var myTask = node.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo3");
            if (myTask != null || myTask != "") {
                myTask.triggerLaterByID("Submit", "Auto Trigger");
            } else {
                wfErrorMessage = "No Such task NewCCEnrich_Photo3";
            }

            if (wfErrorMessage != null) {
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    }
} else if (node.getObjectType().getID() == 'Style') {
    var autoTrigger = false;
    var wfErrorMessage = null;
    var styleRefs = node.getReferences().asList();
    for (var i = 0; i < styleRefs.size(); i++) {
        if (styleRefs.get(i).getReferenceType().getID() == "rt_BOM_Style") {
            var bomStyle = styleRefs.get(i).getTarget();
            stepManager.executeInContext("EN_US", function(enContextManager) {
                var enProduct = enContextManager.getProductHome().getProductByID(bomStyle.getID());
                var usLifeCycleStatus = enProduct.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
                var usCopyCompleteStatus = enProduct.getValue('a_Copy_Complete_Status').getSimpleValue();
                if (usLifeCycleStatus == 'Approved') {
                    if (!enProduct.isInWorkflow('wf_NewStyleEnrichment')) {
                        autoTrigger = true;
                    }
                } else if (usLifeCycleStatus == 'In Progress' && usCopyCompleteStatus == 'Complete') {
                    autoTrigger = true;
                }

            });
        }
    }

    if (autoTrigger == true) {
        if ((node.isInState("wf_NewStyleEnrichmentSA", "NewStyleEnrich_Copy1"))) {
            var myTask = node.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Copy1");
            if (myTask != null || myTask != "") {
                myTask.triggerLaterByID("Copy_Complete", "Auto Trigger");
            } else {
                wfErrorMessage = "No Such task NewStyleEnrich_Copy1";
            }

            if (wfErrorMessage != null) {
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }

        if ((node.isInState("wf_NewStyleEnrichmentSA", "NewStyleEnrich_Final"))) {
            var myTask = node.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Final");
            if (myTask != null || myTask != "") {
            	BusinessRuleHome.getBusinessActionByID("wf_NewStyleEnrichSA_NewStyleEnrich_Final").execute(node);
                //myTask.triggerLaterByID("FinalValidation", "Auto Trigger");
            } else {
                wfErrorMessage = "No Such task NewStyleEnrich_Final";
            }
            if (wfErrorMessage != null) {
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }

            if (wfErrorMessage != null) {
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    }
}


function triggerNewCCEnrichPhoto2Event(node) {

    if ((node.isInState("wf_CCEnrichmentSA", "NewCCEnrich_Photo2"))) {
        var myTask = node.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo2");
        if (myTask != null || myTask != "") {
            myTask.triggerLaterByID("SubmitForReview", "Auto Trigger");
        } else {
            wfErrorMessage = "No Such task NewCCEnrich_Photo2";
        }
        if (wfErrorMessage != null) {
            node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
        }
    }
}
}