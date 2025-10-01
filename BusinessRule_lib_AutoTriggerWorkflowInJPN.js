/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "lib_AutoTriggerWorkflowInJPN",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Auto Trigger Workflow In JPN Library",
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
function triggerJPNTransitionForStyle(node,stepManager,stateID,triggerEventID){
    stepManager.executeInContext("EN_JP",function(manager){
        var product = manager.getProductHome().getProductByID(node.getID());
        if ((product.isInState("wf_NewStyleEnrichmentJapan",stateID))){
            wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentJapan").getTaskByID(stateID).triggerByID(triggerEventID,"Auto Trigger from US context").getScriptMessage();
            if(wfErrorMessage != null){
                product.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    })
}


function triggerJPNTransitionForCC(node,stepManager,stateID,triggerEventID){
    stepManager.executeInContext("EN_JP",function(manager){
        var product = manager.getProductHome().getProductByID(node.getID());
        if ((product.isInState("wf_CCEnrichmentJapan",stateID))){
            wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentJapan").getTaskByID(stateID).triggerByID(triggerEventID,"Auto Trigger from US context").getScriptMessage();
            if(wfErrorMessage != null){
                product.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    })
}


function triggerJPNTransitionForSKU(node,stepManager,stateID,triggerEventID){
    stepManager.executeInContext("EN_JP",function(manager){
        var product = manager.getProductHome().getProductByID(node.getID());
        if ((product.isInState("wf_NewSKUEnrichmentJapan",stateID))){
            wfErrorMessage = product.getWorkflowInstanceByID("wf_NewSKUEnrichmentJapan").getTaskByID(stateID).triggerByID(triggerEventID,"Auto Trigger from US context").getScriptMessage();
            if(wfErrorMessage != null){
                product.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
        }
    })
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.triggerJPNTransitionForStyle = triggerJPNTransitionForStyle
exports.triggerJPNTransitionForCC = triggerJPNTransitionForCC
exports.triggerJPNTransitionForSKU = triggerJPNTransitionForSKU