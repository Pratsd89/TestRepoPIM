/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DeltaLoadXMLInboundStyleCCSKUActionJPN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeltaLoadXMLInboundStyleCCSKUActionJPN",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "alias" : "shotRequestRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotReqRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step,shotRequestRef,shotReqRef) {
//This Business Rule has been created to meet the requirements for JAPAN -PPIM-7589

//PPIM-2406 - XML Inbound for Style, CC, SKU transition States
function triggerEnrichmentWorkflow(product, count) {
    var wfErrorMessage = null;
    var wfErrorMessageStyle = null;
    var parent = product.getParent();
    if ((!(product.isInWorkflow("wf_CCEnrichmentJapan"))) && count >= 1) {
        if (!(product.getValue("a_Source_CC_Life_Cycle_Status").getSimpleValue() == "Approved" && product.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Approved" && (!(product.isInWorkflow("wf_CCEnrichmentJapan"))) && product.getApprovalStatus() != "Not in Approved workspace")) {
            product.startWorkflowByID("wf_CCEnrichmentJapan", "Delta Load based initiation");
        }
    }
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrichState1")) && count >= 2) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment", "Delta Load based trigger from SKU WF").getScriptMessage();
    }
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Photo1")) && count >= 3) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrich_Photo1").triggerByID("Submit", "Delta Load based trigger from SKU WF").getScriptMessage();
    }
    //WF to introduce Style
    if ((!(parent.isInWorkflow("wf_NewStyleEnrichmentJapan"))) && count >= 4) {
        if (!(parent.getValue("a_Source_Style_Life_Cycle_Status").getSimpleValue() == "Approved" && parent.getValue("a_Style_Life_Cycle_Status").getSimpleValue() == "Approved" && (!(parent.isInWorkflow("wf_NewStyleEnrichmentJapan"))) && parent.getApprovalStatus() != "Not in Approved workspace")) {
            parent.startWorkflowByID("wf_NewStyleEnrichmentJapan", "Delta Load based initiation");
        }
    }
    if ((parent.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrichState1")) && count >= 5) {
        wfErrorMessageStyle = parent.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment", "Delta Load based trigger from SKU WF").getScriptMessage();
    }
    if ((parent.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrich_Copy1")) && count >= 6) {
        wfErrorMessageStyle = parent.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete", "Delta Load based trigger from SKU WF").getScriptMessage();
    }
    if ((parent.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEntrich_WebMerch1")) && count >= 6) {
        if (wfErrorMessage == null) {
            wfErrorMessageStyle = parent.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEntrich_WebMerch1").triggerByID("Merch_complete", "Delta Load based trigger from SKU WF").getScriptMessage();
        }
    }
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Photo2")) && count >= 7) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview", "Delta Load based trigger from SKU WF").getScriptMessage();
    }
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Photo3")) && count >= 8) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrich_Photo3").triggerByID("Submit", "Delta Load based trigger from SKU WF").getScriptMessage();
    }
    if ((parent.isInState("wf_NewStyleEnrichmentJapan", "WaitingForFirst_CC")) && count >= 9) {
        wfErrorMessageStyle = parent.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("WaitingForFirst_CC").triggerByID("Submit", "Delta Load based trigger from SKU WF").getScriptMessage();
    }
    if ((parent.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrich_Final")) && count >= 10) {
        if (parent.getValue("a_error_message").getSimpleValue() != null) {
            parent.getValue("a_error_message").deleteCurrent();
        }
        if (product.getValue("a_error_message").getSimpleValue() != null) {
            product.getValue("a_error_message").deleteCurrent();
        }
        wfErrorMessageStyle = parent.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation", "Delta Load based trigger from SKU WF").getScriptMessage();
    }
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Final")) && count == 11) {
        if (product.getValue("a_error_message").getSimpleValue() != null) {
            product.getValue("a_error_message").deleteCurrent();
        }
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrich_Final").triggerByID("Submit", "Delta Load based trigger from SKU WF").getScriptMessage();
    }
    if (wfErrorMessage != null) {
        product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessage);
    } else {
        if (product.getValue("a_error_message").getSimpleValue() != null) {
            product.getValue("a_error_message").deleteCurrent();
        }
    }
    if (wfErrorMessageStyle != null) {
        parent.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessageStyle);
    } else {
        if (parent.getValue("a_error_message").getSimpleValue() != null) {
            parent.getValue("a_error_message").deleteCurrent();
        }
    }
}
//Function to trigger Style enrichment for CC status till in progress 
function triggerStyleEnrichmentWorkflow(styleProduct, count) {
    var wfErrorMessage = null;
    if ((!(styleProduct.isInWorkflow("wf_NewStyleEnrichmentJapan"))) && count >= 1) {
        styleProduct.startWorkflowByID("wf_NewStyleEnrichmentJapan", "Delta Load based initiation");
    }
    if ((styleProduct.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrichState1")) && count >= 2) {
        wfErrorMessage = styleProduct.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment", "Delta Load based trigger").getScriptMessage();
    }
    if ((styleProduct.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrich_Copy1")) && count >= 3) {
        wfErrorMessage = styleProduct.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete", "Delta Load based trigger").getScriptMessage();
    }
    if ((styleProduct.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEntrich_WebMerch1")) && count >= 3) {
        if (wfErrorMessage == null) {
            wfErrorMessage = styleProduct.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEntrich_WebMerch1").triggerByID("Merch_complete", "Delta Load based trigger").getScriptMessage();
        }
    }
    if (wfErrorMessage != null) {
        styleProduct.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessage);
    } else {
        if (styleProduct.getValue("a_error_message").getSimpleValue() != null) {
            styleProduct.getValue("a_error_message").deleteCurrent();
        }
    }
}
//function to set steps of style workflow execution
function setStyleOrderWorkFlow(styleNode, manager) {
    var styleMarketDesignation = styleNode.getValue("a_Style_Market_Designation").getSimpleValue(); //it may contain US, CAN, JPN or US/CAN/JPN
    if (styleMarketDesignation != null) {
        var currentContext = manager.getCurrentContext().getID();
        //adding Japan requirements as part of PPIM-7563
        if (currentContext == "EN_JP" && marketDesignation.contains("JPN")) {
            var status = styleNode.getValue("a_Source_Style_Life_Cycle_Status").getSimpleValue();
            if (status == "Draft") {
                order = 1;
                triggerStyleEnrichmentWorkflow(styleNode, order);
            } else if (status == "In Progress") {
                var copyStatus = styleNode.getValue("a_Source_Copy_Complete_Status").getSimpleValue();
                if (copyStatus == "In Progress" || copyStatus == "New") {
                    order = 2;
                    triggerStyleEnrichmentWorkflow(styleNode, order);
                }
                if (copyStatus == "Complete") {
                    order = 3;
                    triggerStyleEnrichmentWorkflow(styleNode, order);
                }
            }
        } else {
            styleNode.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Style_Market_Designation is not valid for executing context");
        }
    } else {
        styleNode.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Style_Market_Designation is missing");
    }
}
//=============Allow catalog sync user to trigger functions============
var lastModifiedUser = node.getRevision().getUserID();
if (lastModifiedUser.toUpperCase() == "STIBOCATALOGSYNCUSER") {
    var currentContext = step.getCurrentContext().getID(); //currentContext can be EN_US, EN_CA or FR_CA, EN_JP OR JA_JP
    var wfErrorMessage = null;
    var order = 0;
    var ccNode = node.getParent();
    var stNode = ccNode.getParent();
    //log.info("ccNode "+ccNode);
    var objType = ccNode.getObjectType().getID();
    if (objType == "CustomerChoice") {
        //log.info("yes, its a CC")
        var marketDesignation = ccNode.getValue("a_Market_Designation").getSimpleValue(); //it may contain US, CAN, JPN or US/CAN/JPN
        //log.info("marketDesignation "+marketDesignation);
        if (marketDesignation != null) {
            if (currentContext == "EN_JP" && marketDesignation.contains("JPN")) {
                var status = ccNode.getValue("a_Source_CC_Life_Cycle_Status").getSimpleValue();
                //log.info("cc status "+status);
                if (status == "Draft") {
                    order = 1;
                    triggerEnrichmentWorkflow(ccNode, order);
                    setStyleOrderWorkFlow(stNode, step);
                } else if (status == "In Progress") {
                    var isMainP1Shot = false;
                    var shotRef = new java.util.ArrayList();
                    shotRef.addAll(ccNode.getReferences(shotRequestRef));
                    for (var i = 0; i < shotRef.size(); i++) {
                        var shotRequest = shotRef.get(i).getTarget();
                        if (shotRequest.getValue("a_Site_Placement").getLOVValue()!=null && shotRequest.getValue("a_Site_Placement").getLOVValue().getID() == 5) {
                            isMainP1Shot = true;
                            var shotLifeCycleStatus = shotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
                        }
                    }
                    //log.info("isMainP1Shot "+isMainP1Shot);
                    if (isMainP1Shot == false) {
                        order = 2;
                        triggerEnrichmentWorkflow(ccNode, order);
                        setStyleOrderWorkFlow(stNode, step);;
                    } else {
                        if (shotLifeCycleStatus == "Submitted") {
                            order = 3;
                            triggerEnrichmentWorkflow(ccNode, order);
                            setStyleOrderWorkFlow(stNode, step);
                        }
                        if (shotLifeCycleStatus == "Ready for Review") {
                            order = 7;
                            triggerEnrichmentWorkflow(ccNode, order);
                        }
                        if (shotLifeCycleStatus == "Complete") {
                            order = 8;
                            triggerEnrichmentWorkflow(ccNode, order);
                        }
                    }
                }
                //To Cover PPIM-1802 & 2940 use cases
                else if (status == "Approved" && ccNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue() != "Approved") {
                    order = 11;
                    triggerEnrichmentWorkflow(ccNode, order);
                }
            } else {
                ccNode.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Market_Designation is not valid for executing context");
            }
        } else {
            ccNode.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Market_Designation is missing");
        }
    }
}
}