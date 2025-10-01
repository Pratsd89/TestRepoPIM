/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Auto_Trigger_CA_WF_When_US_CompleteIN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Auto Trigger CA WF When US Complete Inside WF",
  "description" : "//Auto Trigger was failing in new Stage version. So, implementing BRs with only triggerLaterByID running within the workflow",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
//Auto Trigger was failing in new Stage version. So, implementing BRs with only triggerLaterByID running within the workflow
if (node.getObjectType().getID() == 'CustomerChoice') {
    var autoTrigger = false;
    var wfErrorMessage = null;
    stepManager.executeInContext("EN_US", function(enContextManager) {
        var enProduct = enContextManager.getProductHome().getProductByID(node.getID());
        var usLifeCycleStatus = enProduct.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
        if (usLifeCycleStatus == 'Approved') {
            autoTrigger = true;
        }
    });
    if (autoTrigger == true) {
        if ((node.isInState("wf_CCEnrichmentCanada", "NewCCEnrich_Photo2"))) {
            var myTask = node.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo2");
            if (myTask != null || myTask != "") {
                myTask.triggerLaterByID("SubmitForReview", "Auto Trigger");
            } else {
                wfErrorMessage = "No Such task NewCCEnrich_Photo2";
            }
            if (wfErrorMessage != null) {
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
        if ((node.isInState("wf_CCEnrichmentCanada", "NewCCEnrich_Photo3"))) {
            var myTask2 = node.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID("NewCCEnrich_Photo3");
            if (myTask2 != null || myTask2 != "") {
                myTask2.triggerLaterByID("Submit", "Auto Trigger");
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
    stepManager.executeInContext("EN_US", function(enContextManager) {
        var enProduct = enContextManager.getProductHome().getProductByID(node.getID());
        var usLifeCycleStatus = enProduct.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
        if (usLifeCycleStatus == 'Approved') {
            if (!enProduct.isInWorkflow('wf_NewStyleEnrichment')) {
                autoTrigger = true;
            }
        }
    });
    if (autoTrigger == true) {
        if ((node.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrich_Copy1"))) {
            var myTask = node.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Copy1");
            if (myTask != null || myTask != "") {
                myTask.triggerLaterByID("Copy_Complete", "Auto Trigger");
            } else {
                wfErrorMessage = "No Such task NewStyleEnrich_Copy1";
            }
            if (wfErrorMessage != null) {
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
        if ((node.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrich_Final"))) {
            var myTask2 = node.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID("NewStyleEnrich_Final");
            if (myTask2 != null || myTask2 != "") {
                myTask2.triggerLaterByID("FinalValidation", "Auto Trigger");
            } else {
                wfErrorMessage = "No Such task NewStyleEnrich_Final";
            }
            if (wfErrorMessage != null) {
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    }
}
}