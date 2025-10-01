/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DeltaLoadXMLInboundSKUAction_Sugu",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeltaLoadXMLInboundSKUAction_PPIM-4913",
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
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "setACLMarketDesid_DeltaLoad"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "SetSKUDIMValuesOnSKU_DeltaLoad"
  } ],
  "pluginType" : "Operation"
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (node,log,step,shotRequestRef) {
//PPIM-2406 - XML Inbound for Style, CC, SKU transition States
function triggerSKUEnrichmentWorkflow(product, count, wf) {
    var wfErrorMessage = null;
    if ((!(product.isInWorkflow(wf))) && count >= 1) {
        if (!(product.getValue("a_Source_SKU_Life_Cycle_Status").getSimpleValue() == "Approved" && product.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() == "Approved" && (!(product.isInWorkflow(wf))) && product.getApprovalStatus() != "Not in Approved workspace")) {
            product.startWorkflowByID(wf, "Delta Load based initiation");
        }
    }
    if ((product.isInState(wf, "NewSKUEnrich1")) && count >= 2) {
        wfErrorMessage = product.getWorkflowInstanceByID(wf).getTaskByID("NewSKUEnrich1").triggerByID("Submit", "Delta Load based trigger").getScriptMessage();
    }
    // uncommented below loop for fixing PPIM-4913
    if ((product.isInState(wf,"NewSKUEnrich2")) && count == 3){
    	wfErrorMessage = product.getWorkflowInstanceByID(wf).getTaskByID("NewSKUEnrich2").triggerByID("Submit","Delta Load based trigger").getScriptMessage();
    }
    if (wfErrorMessage != null) {
        product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessage);
    } else {
        if (product.getValue("a_error_message").getSimpleValue() != null) {
            product.getValue("a_error_message").deleteCurrent();
        }
    }
}
var currentContext = step.getCurrentContext().getID(); //currentContext can be EN_US, EN_CA or FR_CA
var wfErrorMessage = null;
var order = 0;
var objType = node.getObjectType().getID();
if (objType == "SKU") {
    var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue(); //it may contain US, CAN or US/CAN
    if (marketDesignation != null) {
        if ((currentContext == "EN_US" && marketDesignation.contains("US")) || ((currentContext == "EN_CA" || currentContext == "FR_CA") && marketDesignation.contains("CAN"))) {
            var status = node.getValue("a_Source_SKU_Life_Cycle_Status").getSimpleValue();
            if (status == "Draft") {
                order = 1;
               // triggerSKUEnrichmentWorkflow(node, order);
            } else if (status == "In Progress") {
                order = 2;
              //  triggerSKUEnrichmentWorkflow(node, order);
            //} else if ((status == "Approved" && (node.isInWorkflow("wf_NewSKUEnrichment") || node.isInWorkflow("wf_NewSKUEnrichmentCanada"))) || (status == "Approved" && node.getApprovalStatus() == "Not in Approved workspace")) {
            //To Cover PPIM-1802&2940 use cases
            } else if (status == "Approved" && node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() != "Approved") {
                order = 3;
               // triggerSKUEnrichmentWorkflow(node, order);
            } else if (status == "Approved" && node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() == "Approved" && !node.isInWorkflow("wf_NewSKUEnrichment") && !node.isInWorkflow("wf_NewSKUEnrichmentCanada") && node.getApprovalStatus() != "Not in Approved workspace") {
                node.approve();
            }
            
             // trigger workflow transition depending on context
            if (order != 0) {
                if (currentContext == "EN_US") {
                    triggerSKUEnrichmentWorkflow(node, order, "wf_NewSKUEnrichment");
                } else {
                    triggerSKUEnrichmentWorkflow(node, order, "wf_NewSKUEnrichmentCanada");
                }
            }

        } else {
            node.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Market_Designation is not valid for executing context");
        }
    } else {
        node.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Market_Designation is missing");
    }
}

}