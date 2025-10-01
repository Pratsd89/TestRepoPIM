/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "InitiateJPNWorkflowActionSKU",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "InitiateJPNWorkflowActionSKU",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av1Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV1",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av2Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV2",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av3Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV3",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av4Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV4",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av5Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV5",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av6Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV6",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av7Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV7",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av8Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV8",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av9Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV9",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ppiRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "swatchRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Swatch",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "videoRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Video",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "webHierRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,shotRef,av1Ref,av2Ref,av3Ref,av4Ref,av5Ref,av6Ref,av7Ref,av8Ref,av9Ref,ppiRef,swatchRef,videoRef,webHierRef) {
log.warning("BR_Entry=InitiateJPNWorkflowActionSKU="+node.getID());
//The below code is implemented as part of Japan requirements- PPIM-7565
//Style Workflow
function triggerStyleEnrichmentWorkflow(product, count, flag) {
    var wfErrorMessage = null;
    if ((product.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrichState1")) && count >= 2) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment", "Style JPN Workflow movement from NewStyleEnrichState1 - SKU").getScriptMessage();
    }
    if (((product.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrich_Copy1")) && count >= 3) || ((product.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrich_Copy1")) && count >= 2 && flag == 1)) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete", "Style JPN Workflow movement from NewStyleEnrich_Copy1  - SKU").getScriptMessage();
    }
    if (((product.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEntrich_WebMerch1")) && count >= 3) || ((product.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEntrich_WebMerch1")) && count >= 2 && flag == 2)) {

        if (wfErrorMessage == null) {
            wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("NewStyleEntrich_WebMerch1").triggerByID("Merch_complete", "Style JPN Workflow movement from NewStyleEntrich_WebMerch1  - SKU").getScriptMessage();
        }
    }
    if ((product.isInState("wf_NewStyleEnrichmentJapan", "WaitingForFirst_CC")) && count >= 4) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID("WaitingForFirst_CC").triggerByID("Submit", "Style JPN Workflow movement from WaitingForFirst_CC - SKU").getScriptMessage();
    }
    if (wfErrorMessage != null) {
        product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessage);
    } else {
        if (product.getValue("a_error_message").getSimpleValue() != null) {
            product.getValue("a_error_message").deleteCurrent();
        }
    }
}
//CC Workflow
function triggerCCEnrichmentWorkflow(product, count) {
    var wfErrorMessage = null;
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrichState1")) && count >= 2) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment", "CC JPN Workflow movement from NewCCEnrichState1 - SKU").getScriptMessage();
    }
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Photo1")) && count >= 3) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrich_Photo1").triggerByID("Submit", "CC JPN Workflow movement from NewCCEnrich_Photo1 - SKU").getScriptMessage();
    }
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Photo2")) && count >= 4) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview", "CC JPN Workflow movement from NewCCEnrich_Photo2 - SKU").getScriptMessage();
    }
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Photo3")) && count >= 5) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrich_Photo3").triggerByID("Submit", "CC JPN Workflow movement from NewCCEnrich_Photo3 - SKU").getScriptMessage();
    }
    if ((product.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Copy1")) && count >= 5) {
        wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID("NewCCEnrich_Copy1").triggerByID("CCNameComplete", "CC JPN Workflow movement from NewCCEnrich_Copy1 - SKU").getScriptMessage();
    }
    if (wfErrorMessage != null) {
        product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessage);
    } else {
        if (product.getValue("a_error_message").getSimpleValue() != null) {
            product.getValue("a_error_message").deleteCurrent();
        }
    }
}

var currContext = step.getCurrentContext().getID();
if (currContext == "EN_JP" || currContext == "JA_JP") {
    var order = 0;
    var flags = 0;
    var style = node.getParent().getParent();
    if (style.isInState("wf_NewStyleEnrichment", "NewStyleEnrich_Copy1") || style.isInState("wf_NewStyleEnrichment", "NewStyleEntrich_WebMerch1")) {
        if (!(style.isInState("wf_NewStyleEnrichment", "NewStyleEnrich_Copy1"))) {
            flags = 1;
        } else if (!(style.isInState("wf_NewStyleEnrichment", "NewStyleEntrich_WebMerch1"))) {
            flags = 2;
        }
        order = 2;
        triggerStyleEnrichmentWorkflow(style, order, flags);
    } else if (style.isInState("wf_NewStyleEnrichment", "WaitingForFirst_CC")) {
        order = 3;
        triggerStyleEnrichmentWorkflow(style, order, flags);
    } else if (style.isInState("wf_NewStyleEnrichment", "NewStyleEnrich_Final")) {
        order = 4;
        triggerStyleEnrichmentWorkflow(style, order, flags);
    }

    var cc = node.getParent();
    if (cc.isInState("wf_CCEnrichment", "NewCCEnrich_Copy1") || cc.isInState("wf_CCEnrichment", "NewCCEnrich_Photo1")) {
        order = 2;
        triggerCCEnrichmentWorkflow(cc, order);
    } else if (cc.isInState("wf_CCEnrichment", "NewCCEnrich_Photo2")) {
        order = 3;
        triggerCCEnrichmentWorkflow(cc, order);
    } else if (cc.isInState("wf_CCEnrichment", "NewCCEnrich_Photo3")) {
        order = 4;
        triggerCCEnrichmentWorkflow(cc, order);
    } else if (cc.isInState("wf_CCEnrichment", "NewCCEnrich_Final")) {
        order = 5;
        triggerCCEnrichmentWorkflow(cc, order);
    }

}

log.warning("BR_Exit=InitiateJPNWorkflowActionSKU="+node.getID());
}