/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test_ars2",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "test_ars2",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "alias" : "currSelected",
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
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "unrejReason",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Shot_Request_Rejection_Reason</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">RejectionReason</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "unrejComment",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Shot_Request_Rejection_Comments</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">RejectionComments</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currSelected,step,webUI,unrejReason,unrejComment) {
var stat = currSelected.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
//  currSelected.getValue("a_Shot_Request_Rejection_Reason").setSimpleValue("");
//  currSelected.getValue("a_Shot_Request_Rejection_Comments").setSimpleValue("");


  // Check if status is 'Rejected' and both rejection reason and comment are not
  // null
  if (stat == "Rejected") {
    if (currSelected.isInState("wf_ShortRequestLifeCycle","Rejected") == true) {
      if (unrejReason != null && unrejComment != null) {
        var setValue = true;
        var tagArray = [];
        if (!(unrejReason.indexOf("<multisep/>") < 0)) {
          unrejReason.split("<multisep/>").forEach(function(ValID) {
            tagArray.push(ValID);
          });
        } else {
          tagArray.push(unrejReason);
        }
        tagArray.forEach(function(ValID) {
          lov = step.getAttributeHome().getAttributeByID("a_Shot_Request_Rejection_Reason").getListOfValues();
          valueToSet = lov.getListOfValuesValueByID(ValID).getValue();
          if (setValue == true) {
            setValue = false;
            currSelected.getValue("a_Shot_Request_Rejection_Reason").setSimpleValue(valueToSet);
          } else {
            currSelected.getValue("a_Shot_Request_Rejection_Reason").addLOVValueByID(ValID);
          }
        });
        currSelected.getValue("a_Shot_Request_Rejection_Comments").setSimpleValue(unrejComment);
        
        // Workflow state change
        currSelected.getWorkflowInstanceByID("wf_ShortRequestLifeCycle").getTaskByID("Rejected").triggerByID("Rejected_Needs_Approval","Web UI Based Shot Request Restoration");
        webUI.showAlert("SUCCESS", "Restoration successful");

      } else {
        webUI.showAlert("ERROR","Cannot restore the shot request. Please ensure both Reject/Restore reason and comment are provided.");
      }
    } else {
      webUI.showAlert("ERROR","Shot Request is not present in correct WF State. Please reach out to Dev team.")
    }
  } else {
    webUI.showAlert("ERROR","Shot Restoration is only allowed if the shot status is 'Rejected'.");
  }
}