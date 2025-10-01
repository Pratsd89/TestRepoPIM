/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "lib_AutoTriggerWorkflowInSA",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Auto Trigger Workflow In SA Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
function triggerSATransitionForStyle(node,stepManager,stateID,triggerEventID){
    stepManager.executeInContext("EN_SA",function(manager){
        var product = manager.getProductHome().getProductByID(node.getID());
        if ((product.isInState("wf_NewStyleEnrichmentSA",stateID))){
            wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID(stateID).triggerByID(triggerEventID,"Auto Trigger from US context").getScriptMessage();
            if(wfErrorMessage != null){
                product.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    })
}


function triggerSATransitionForCC(node,stepManager,stateID,triggerEventID){
    stepManager.executeInContext("EN_SA",function(manager){
        var product = manager.getProductHome().getProductByID(node.getID());
        if ((product.isInState("wf_CCEnrichmentSA",stateID))){
            wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID(stateID).triggerByID(triggerEventID,"Auto Trigger from US context").getScriptMessage();
            if(wfErrorMessage != null){
                product.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    })
}


function triggerSATransitionForSKU(node,stepManager,stateID,triggerEventID){
    stepManager.executeInContext("EN_SA",function(manager){
        var product = manager.getProductHome().getProductByID(node.getID());
        if ((product.isInState("wf_NewSKUEnrichmentSA",stateID))){
            wfErrorMessage = product.getWorkflowInstanceByID("wf_NewSKUEnrichmentSA").getTaskByID(stateID).triggerByID(triggerEventID,"Auto Trigger from US context").getScriptMessage();
            if(wfErrorMessage != null){
                product.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    })
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.triggerSATransitionForStyle = triggerSATransitionForStyle
exports.triggerSATransitionForCC = triggerSATransitionForCC
exports.triggerSATransitionForSKU = triggerSATransitionForSKU