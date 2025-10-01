/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetAutopopRequest",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Autopop Request",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "currObj",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (log,currObj,manager) {
log.info("br_SetAutopopRequest Node: " + currObj.getID());
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
currObj.getValue("a_autopop_request_date").setSimpleValue(iso.format(time));
log.info("Node :" + currObj.getID() + " Update Autopop att: " + currObj.getValue("a_autopop_request_date").getSimpleValue());
var workflow = manager.getWorkflowHome().getWorkflowByID("Autopop_Async_Action");
var initialState = workflow.getStateByID("Autopop_Initial");
var runState = workflow.getStateByID("Autopop_Run");
var endState = workflow.getStateByID("Autopop_End");

var inWorkflow = currObj.getWorkflowInstanceByID("Autopop_Async_Action");
if (!inWorkflow) {
	log.info("Added to Autopop_Async_Action");
	workflow.start(currObj, null);
} else {
	if (currObj.getTask(endState)) {
		inWorkflow.delete("Removed Due To New Request");
		log.info("Removed from Autopop_Async_Action");
		workflow.start(currObj, null);
		log.info("Added to Autopop_Async_Action");
	} else  {
		//need to validate with Stibo what is the reprecussions of running the same autopop request on a single node
	}
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "currObj",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "attProdType",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_Product_Tags",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "currLog",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "attAutopop",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "Autopop_Validate_Update",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (currObj,attProdType,currLog,attAutopop) {
//validate for Autopop
currLog.info("BUS RULE CONDITION: br_SetAutopopRequest Node: " + currObj.getID());


//Save from WebUI sets new revision point
//Set object major revision for comparison between saves
//First major revision will cause all children to export for initial update
var currSize = currObj.getRevisions().size();
currObj.getRevision().setMajor();

//Set tags for review
//var allAttsForReview = new java.util.ArrayList();
var allAttsForReview = attProdType.getAttributes();

if(currObj.getValue(attAutopop.getID()).getSimpleValue() == null){
	currObj.getValue(attAutopop.getID()).setSimpleValue("Updated");
	return true;
}

if(currObj.getValue(attAutopop.getID()).getSimpleValue() == ""){
	currObj.getValue(attAutopop.getID()).setSimpleValue("Updated");
	return true;
}

var attsIt = allAttsForReview.iterator();

while (attsIt.hasNext()){
	//validate each attribute for export need
	//currLog.info("Attribute: " + allAttsForReview.get(i).getID());
	var needsExport = revisionCheck(currObj, attsIt.next());
	if (needsExport) {
		return true;
	}
}

return false;

function revisionCheck (currObj, attForReview) {
	var currLovs = currObj.getValue("" + attForReview.getID()).getValues();
	var allRevs = currObj.getRevisions();
	
	//if the first revision, export
	//currLog.info("allRevs.size: " + allRevs.size());
	if(allRevs.size() <= 1) {
		return true;
	}
	var prevRevNode = allRevs.get(1).getNode();
	var prevLovs = prevRevNode.getValue("" + attForReview.getID()).getValues();
	
	//if the revision lov sizes are different, export
	//currLog.info("CurLOV size: " + currLovs.size() + " PrevLOV size: " + prevLovs.size());
	if(currLovs.size() != prevLovs.size()) {
		return true;
	}
	for (var t=0; t < currLovs.size(); t++) {
		var isFound = false;
		for (var s=0; s < prevLovs.size(); s++) {
			if (currLovs.get(t).getID() == prevLovs.get(s).getID()) {
				
				//if each lov is found for both versions, don't export
				//currLog.info("CurrObj: " + currObj.getID() + " CurrLOVValue: " + currLovs.get(t).getValue() + "\nPrevObjDate: " +  currObj.getRevision().getCreatedDate() + " PrevLOVValue: " + prevLovs.get(s).getValue());
				isFound = true;
				
			}
		}
		if (!isFound){
			return true;
		}
	}
	return false;
}


}