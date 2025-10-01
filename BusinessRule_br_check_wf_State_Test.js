/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_check_wf_State_Test",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_check_wf_State_Test",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
exports.operation0 = function (node,stepManager,compCheck) {
/* If at least one CC under the Style is in "Review and Approve Photos" or "Final Validation" state 
 *  of the CC Enrichment Workflow, Style can auto exit the "Waiting for first CC" state and go into 
 *  "Final Validation" state of the Style Enrichment workflow.
 */

var CCList = node.getChildren();
var ccReady = false;
var errorStr = '';
var existingErrorMsg = '' + node.getValue('a_error_message').getSimpleValue();

if(CCList.size() == 0) {
	//return "The Style does not contain any CC.";
	errorStr = "The Style does not contain any CC.";
} else {
	for(var i = 0; i < CCList.size(); i++) {
		if (CCList.get(i).getValue("a_CC_Life_Cycle_Status").getLOVValue() != null) {
			if(CCList.get(i).getValue("a_CC_Life_Cycle_Status").getLOVValue().getID() == "WAITING_FOR_STYLE_APPROVAL" 
				|| CCList.get(i).isInState("wf_CCEnrichment","NewCCEnrich_Photo3")) {
				ccReady = true;
				break;
			}
		}
	}	
}

/*if (ccReady) {
	return true;
} else {*/
if(!ccReady) {
	//return "There should be atleast one child CC in Final Validation OR Review and Approve Photos state of CC Enrichment workflow for Style to move to Final Validation.";
	if (errorStr.length == 0) //error not set yet
	{
		errorStr = "There should be atleast one child CC in Final Validation OR Review and Approve Photos state of CC Enrichment workflow for Style to move to Final Validation.";
	}
}

if (errorStr.length > 0) {
	node.getValue('a_error_message').setSimpleValue(errorStr);
	return errorStr;
}

return true;

}