/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Autopop_Workflow_Find_Children",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Autopop Workflow Find Children",
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
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepMan",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "aAutoWebUpdate",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "Autopop_WebClass_Update",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refWebClass",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,stepMan,aAutoWebUpdate,refWebClass) {
logger.info("Start Autopop Workflow Node: " + node.getID());
if(node.getValue(aAutoWebUpdate.getID()).getSimpleValue() != null) {
	if(node.getValue(aAutoWebUpdate.getID()).getSimpleValue() != "") {
		node.getValue(aAutoWebUpdate.getID()).setSimpleValue("");
	}
}
var myRefs = node.getClassificationProductLinks(refWebClass);
var myIDs = "";
for(var x=0; x < myRefs.size(); x++) {
	myIDs += myRefs.get(x).getClassification().getID() + ",";
}

node.getValue(aAutoWebUpdate.getID()).setSimpleValue(myIDs);

var allChild = node.getChildren();
for(var y=0; y < allChild.size(); y++) {
	if(allChild.get(y).getValue(aAutoWebUpdate.getID()).getSimpleValue() != null) {
		if(allChild.get(y).getValue(aAutoWebUpdate.getID()).getSimpleValue() != "") {
			allChild.get(y).getValue(aAutoWebUpdate.getID()).setSimpleValue("");
		}
	}	
	myRefs = allChild.get(y).getClassificationProductLinks(refWebClass);
	myIDs = "";
	for(var t=0; t < myRefs.size(); t++) {
		myIDs += myRefs.get(t).getClassification().getID() + ",";
	}

	allChild.get(y).getValue(aAutoWebUpdate.getID()).setSimpleValue(myIDs);
}





if(node.getObjectType().getID() == "SubClass"){
	var nodeChildren = node.getChildren();
	var workflow = stepMan.getWorkflowHome().getWorkflowByID("Autopop_Async_Action");
	var initialState = workflow.getStateByID("Autopop_Initial");
	var runState = workflow.getStateByID("Autopop_Run");
	var endState = workflow.getStateByID("Autopop_End");
	for(var x=0; x < nodeChildren.size(); x++){
		var currObj = nodeChildren.get(x);
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
	var inWorkflow = node.getWorkflowInstanceByID("Autopop_Async_Action");
	if (inWorkflow != null) {
		inWorkflow.delete("Removed Due To PPH Object");
		log.info("Removed PPH Object from Autopop_Async_Action");
	}

}

}