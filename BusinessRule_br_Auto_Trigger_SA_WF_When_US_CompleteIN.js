/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Auto_Trigger_SA_WF_When_US_CompleteIN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Auto Trigger SA WF When US Complete Inside WF",
  "description" : null,
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
var BusinessRuleHome = stepManager.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
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
        }
    }
}
}