/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "lib_AutoTriggerWorkflowInCAN",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Auto Trigger Workflow In CAN Library",
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



function triggerCANTransitionForStyle(node,stepManager,stateID,triggerEventID){
    stepManager.executeInContext("EN_CA",function(manager){
        var product = manager.getProductHome().getProductByID(node.getID());
        if ((product.isInState("wf_NewStyleEnrichmentCanada",stateID))){
            wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentCanada").getTaskByID(stateID).triggerByID(triggerEventID,"Auto Trigger from US context").getScriptMessage();
            if(wfErrorMessage != null){
                product.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    })
}


function triggerCANTransitionForCC(node,stepManager,stateID,triggerEventID){
    stepManager.executeInContext("EN_CA",function(manager){
        var product = manager.getProductHome().getProductByID(node.getID());
        if ((product.isInState("wf_CCEnrichmentCanada",stateID))){
            wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentCanada").getTaskByID(stateID).triggerByID(triggerEventID,"Auto Trigger from US context").getScriptMessage();
            if(wfErrorMessage != null){
                product.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    })
}


function triggerCANTransitionForSKU(node,stepManager,stateID,triggerEventID){
    stepManager.executeInContext("EN_CA",function(manager){
        var product = manager.getProductHome().getProductByID(node.getID());
        if ((product.isInState("wf_NewSKUEnrichmentCanada",stateID))){
            wfErrorMessage = product.getWorkflowInstanceByID("wf_NewSKUEnrichmentCanada").getTaskByID(stateID).triggerByID(triggerEventID,"Auto Trigger from US context").getScriptMessage();
            if(wfErrorMessage != null){
                product.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    })
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.triggerCANTransitionForStyle = triggerCANTransitionForStyle
exports.triggerCANTransitionForCC = triggerCANTransitionForCC
exports.triggerCANTransitionForSKU = triggerCANTransitionForSKU