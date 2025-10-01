/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DeltaLoadXMLInboundProductAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeltaLoadXMLInboundProductAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRequestRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step,shotRequestRef) {
//var a= node.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Delta Load based trigger - LifeCycle is In Progress and Copy Status is In Progress or New").getScriptMessage();
//log.info(a);

//PPIM-2406 - XML Inbound for Style, CC, SKU transition States
log.info("Executing BR DeltaLoadXMLInboundProductAction");
var currentContext = step.getCurrentContext().getID();//currentContext can be EN_US, EN_CA or FR_CA
var wfErrorMessage = null;
var objType = node.getObjectType().getID();
if(objType == "Style"){
	var marketDesignation = node.getValue("a_Style_Market_Designation").getSimpleValue(); //it may contain US, CAN or US/CAN
	if(marketDesignation != null){
		if((currentContext == "EN_US" && marketDesignation.contains("US")) || ((currentContext == "EN_CA" || currentContext == "FR_CA") && marketDesignation.contains("CAN"))){
			var status = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
			if(status == "Draft"){
				if(!(node.isInWorkflow("wf_NewStyleEnrichment"))){
					node.startWorkflowByID("wf_NewStyleEnrichment", "Delta Load based initiation - LifeCycle is Draft");
					}
				}
			else if(status == "In Progress"){
				var copyStatus = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
				if(copyStatus == "In Progress" || copyStatus == "New"){
					if(!(node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_Copy1") || node.isInState("wf_NewStyleEnrichment","NewStyleEntrich_WebMerch1"))){
						if(!(node.isInWorkflow("wf_NewStyleEnrichment"))){
							node.startWorkflowByID("wf_NewStyleEnrichment", "Delta Load based initiation - LifeCycle is In Progress");
							wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Delta Load based trigger - LifeCycle is In Progress and Copy Status is In Progress or New").getScriptMessage();
							}
						
						}
					}
				if(copyStatus == "Complete"){
					if(!(node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_Copy2") || node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_WebMerch2"))){
						if(node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_Copy1")){
							wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete","Delta Load based trigger - LifeCycle is In Progress and Copy Status is Complete").getScriptMessage();
							}
						}
					}
				}
			else if(status == "Approved" && node.isInWorkflow("wf_NewStyleEnrichment")){
				if(node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_Copy1")){
					wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete","Delta Load based trigger - LifeCycle is Approved").getScriptMessage();
					log.info(wfErrorMessage);
					}
				if(node.isInState("wf_NewStyleEnrichment","NewStyleEntrich_WebMerch1")){
					wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEntrich_WebMerch1").triggerByID("Merch_complete","Delta Load based trigger to Merch Complete - LifeCycle is Approved").getScriptMessage();
					log.info(wfErrorMessage);
					}
				if(node.isInState("wf_NewStyleEnrichment","NewStyleEnrichState1")){
					wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Delta Load based trigger to Ready For Enrichment - LifeCycle is Approved").getScriptMessage();
					log.info(wfErrorMessage);
					if(node.isInState("wf_NewStyleEnrichment","NewStyleEnrich_Copy1")){
						wfErrorMessage = node.getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete","Delta Load based trigger to Copy Complete - LifeCycle is Approved").getScriptMessage();
						log.info(wfErrorMessage);
						}
					}
				}
			}
		}
		if(wfErrorMessage != null){
			var completeMessage = "Style ID: "+node.getID()+". Error Message: "+wfErrorMessage;
			node.getValue("a_error_message").setSimpleValue(completeMessage);
			log.info(node.getValue("a_error_message").getSimpleValue());
			}
			else{
				if(node.getValue("a_error_message").getSimpleValue() != null){
					node.getValue("a_error_message").deleteCurrent();
					}
				}
	}
else if(objType == "CustomerChoice"){
	//log.info("This is CC");
	}
else if(objType == "SKU"){
	//log.info("This is SKU");
	}
}