/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StyleWFCutOver",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Style WorkFlow CutOver Task",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log) {
var wf = manager.getWorkflowHome().getWorkflowByID("wf_NewStyleEnrichment");
var styleLifeCycle = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
log.info("=============>>"+ styleLifeCycle);

var styleCopyStat = node.getValue("a_Copy_Complete_Status").getSimpleValue();
log.info("=============>>"+ styleCopyStat);

if(styleLifeCycle=="In Progress" && (styleCopyStat=="In Progress") || (styleCopyStat=="New") ) {
	if(!node.getWorkflowInstanceByID("wf_NewStyleEnrichment"))
	wf.start(node, "Started for case 1");	
	movetostate(node,1)
}
else if(styleLifeCycle=="In Progress" && styleCopyStat=="Complete") {
		if(!node.getWorkflowInstanceByID("wf_NewStyleEnrichment")){
			wf.start(node, "Started for case 1");	
			movetostate(node,2)
			}
		}


function movetostate(node,num){
if(num==1){
	nWF = node.getWorkflowInstanceByID("wf_NewStyleEnrichment");
	var draft = nWF.getTaskByID("NewStyleEnrichState1")
	draft.triggerByID("ReadyForEnrichment","moved to parallel"); 
	//Trigger will not work if completeness check condition fails. condition is in "ReadyForEnrichment" transition	
	log.info("Inside case 1::::"+node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_Copy1"));
}
else if(num==2){
	nWF = node.getWorkflowInstanceByID("wf_NewStyleEnrichment");
	//Trigger will not work if completeness check condition fails. condition is in "ReadyForEnrichment" transition
	nWF.getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","moved to parallel");
	log.info(node.getTaskByID("wf_NewStyleEnrichment","NewStyleEnrich_Copy1"));
	nWF.getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete","moved to copy Exit");
	log.info(node.getTaskByID("wf_NewStyleEnrichment","NewStyleEnrich_Copy2"));
	
}

}

}