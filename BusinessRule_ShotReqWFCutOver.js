/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotReqWFCutOver",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request WorkFlow CutOver Task",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,log,manager) {
var wf = manager.getWorkflowHome().getWorkflowByID("wf_ShortRequestLifeCycle");
var ShotReqLifeCycle = node.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
//log.info("=============>>"+ ShotReqLifeCycle);

if(ShotReqLifeCycle=="Submitted") {
	if(!node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle")){
	wf.start(node, "Started");
	movetostate(node,1)
	//log.info("Inside Submitted state:"+node.isInState("wf_ShortRequestLifeCycle","Submitted"));
	}	
	}
else if(ShotReqLifeCycle=="Ready for Review") {
	if(!node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle")){
	wf.start(node, "Started");
	movetostate(node,2)
	//log.info("Inside Ready for Review state:"+node.isInState("wf_ShortRequestLifeCycle","Ready_to_Review"));
	}	
	}
else if(ShotReqLifeCycle=="Complete") {
	if(!node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle")){
	wf.start(node, "Started");
	movetostate(node,3)
	//log.info("Inside Approved state:"+node.isInState("wf_ShortRequestLifeCycle","Approved"));
	}	
	}
	
function movetostate(node,num){
if(num==1){
	nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
	var draft = nWF.getTaskByID("Draft")
	draft.triggerByID("Submit","moved to Submit"); 
	//log.info("Inside move to state::::"+node.isInState("wf_ShortRequestLifeCycle","Submitted"));
}
else if(num==2){
	nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
	var draft = nWF.getTaskByID("Draft")
	draft.triggerByID("Submit","moved to Submit"); 
	//log.info("Inside move to state::::"+node.isInState("wf_ShortRequestLifeCycle","Submitted"));
	nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
	var draft1 = nWF.getTaskByID("Submitted")
	draft1.triggerByID("Ready_to_Review","moved to Ready for Review"); 
	//log.info("Inside move to state::::"+node.isInState("wf_ShortRequestLifeCycle","Ready_to_Review"));
}
else if(num==3){
	nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
	var draft = nWF.getTaskByID("Draft")
	draft.triggerByID("Submit","moved to Submit"); 
	//log.info("Inside move to state::::"+node.isInState("wf_ShortRequestLifeCycle","Submitted"));
	nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
	var draft1 = nWF.getTaskByID("Submitted")
	draft1.triggerByID("Ready_to_Review","moved to Ready for Review"); 
	//log.info("Inside move to state::::"+node.isInState("wf_ShortRequestLifeCycle","Ready_to_Review"));
	nWF = node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle");
	var draft2 = nWF.getTaskByID("Ready_to_Review")
	draft2.triggerByID("Approve","moved to Approved"); 
	//log.info("Inside Approved::::"+node.isInState("wf_ShortRequestLifeCycle","Approved"));
	//log.info(node.getWorkflowInstanceByID("wf_ShortRequestLifeCycle"));
}
}
}