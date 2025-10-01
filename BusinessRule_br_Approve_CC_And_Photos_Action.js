/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Approve_CC_And_Photos_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Approve CC And Photos Action",
  "description" : "Web UI button to Approve CC and Photos for Non-Merch CCs- PPIM-12147",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToShotRequestRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRequestToExternalAssetRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToExternalAsset",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "Log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,CCToShotRequestRef,shotRequestToExternalAssetRef,LKT,portal,Log,compCheck) {
/*
 * This rule works as follows:
 * -Check context
 * -Check that node is in appropriate states of workflow for CC and Photo Approval
 * -Progress shot requests
 * -Submit CC to next state
 */

var currentContext = stepManager.getCurrentContext().getID();
var wfID = LKT.getLookupTableValue("LKT_Context_to_CC_Enrich_Workflows", currentContext)

//If node is not in the CC Enrichment workflow of states "NewCCEnrich_Photo3" and "NewCCEnrich_Final"
if (!node.isInState(wfID, "NewCCEnrich_Photo3") && !node.isInState(wfID, "NewCCEnrich_Final")) {
  portal.showAlert("Error","This CC " + node.getName() + " and Photos are not eligible for approval at this time")
}

else {
  
	var shotRequestReferences = node.getReferences(CCToShotRequestRef).toArray();
	var imageCheck = compCheck.checkCCAssetCompleteness(node, stepManager);

	   //If image check is NOT true
        if (imageCheck != true) {
          portal.showAlert("Error", imageCheck);
        } 
        else {

          //For each shot request reference
          for (var i = 0; i < shotRequestReferences.length; i++) {
            var shotRequest = shotRequestReferences[i].getTarget();

            //If shot request is in the Shot Request Life Cycle workflow state "Ready_to_Review"
            if (shotRequest.isInState("wf_ShortRequestLifeCycle", "Ready_to_Review")) {
              var wf = shotRequest.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");

              try {
                wf.getTaskByID("Ready_to_Review").triggerByID("Approve", "Approving Shots and CCs from Style Final Validation");
              }
              catch (e) {
                portal.showAlert("Error",e.message)
              }
            }
          }




          //After progressing the shot requests, simply submit CC to next state. All previous conditions from this business rules have been incorporated as conditions in the workflow
          var styleStatus = node.getParent().getValue("a_Style_Life_Cycle_Status").getSimpleValue();
          //If node is in the CC Enrichment workflow state "NewEnrich_Photo3"


          if (node.isInState(wfID, "NewCCEnrich_Photo3")) {
            var wf = node.getWorkflowInstanceByID(wfID);
            var wfSubmit = wf.getTaskByID("NewCCEnrich_Photo3").triggerByID("Submit", "Approving Shots and CCs from Style Final Validation");
            
            //wfSubmit is rejected
            if (wfSubmit.isRejectedByScript()) {
              portal.showAlert("Error",wfSubmit.getScriptMessage())
            }
          } 




          //Else if node is in the CC Enrichment workflow state "NewCCEnrich_Final" and parent is NOT in Approved workspace
          //Before PPIM-10755 : Hardcoded String "wf_CCEnrichment" is present in the below else if condition check
          //After PPIM-10755 : Added wfID which is fetched based on currentContext selected using Lookup Table in the below else if condition check
          else if (node.isInState(wfID, "NewCCEnrich_Final")) {
            var wf = node.getWorkflowInstanceByID(wfID);
            var wfSubmit = wf.getTaskByID("NewCCEnrich_Final").triggerByID("Submit", "Approving Shots and CCs from Style Final Validation");
            //wfSubmit is rejected
            if (wfSubmit.isRejectedByScript()) {
              portal.showAlert("Error",wfSubmit.getScriptMessage())
            }
          }
        }
}
}