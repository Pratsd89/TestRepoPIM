/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SetProductPastDraftDeadlineCAN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetProductPastDraftDeadlineCAN",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step) {
if(node.getValue("a_Product_Past_Draft_Deadline").getSimpleValue() != "Yes"){
var deadlineTime = null;
var date = new Date();
//log.info(date);
//log.info(date.getTime());
var currTime = date.getTime();
//log.info(date.getTime() + 3600000);
//date.setTime(date.getTime() + 3600000);
//style enrichment workflow
if(node.getObjectType().getID() == "Style"){
//node.getTaskByID("wf_NewStyleEnrichment", "NewStyleEnrichState1").setDeadline(date);
//log.info(node.getTaskByID("wf_NewStyleEnrichment", "NewStyleEnrichState1").getDeadline());
//log.info(node.getTaskByID("wf_NewStyleEnrichment", "NewStyleEnrichState1").getDeadline().getTime());
deadlineTime = node.getTaskByID("wf_NewStyleEnrichmentCanada", "NewStyleEnrichState1").getDeadline().getTime();
log.info("style deadline "+deadlineTime);
if(parseInt(deadlineTime) < parseInt(currTime)){
	log.info("deadline crossed Style");
	node.getValue("a_Product_Past_Draft_Deadline").setSimpleValue("Yes");
	}
}
	else if(node.getObjectType().getID() == "CustomerChoice"){
	deadlineTime = node.getTaskByID("wf_CCEnrichmentCanada", "NewCCEnrichState1").getDeadline().getTime();
	log.info("cc deadline "+deadlineTime);
	if(parseInt(deadlineTime) < parseInt(currTime)){
		log.info("deadline crossed CC");
		node.getValue("a_Product_Past_Draft_Deadline").setSimpleValue("Yes");
		}
	}
		else if(node.getObjectType().getID() == "SKU"){
		deadlineTime = node.getTaskByID("wf_NewSKUEnrichmentCanada", "NewSKUEnrich1").getDeadline().getTime();
		log.info("sku deadline "+deadlineTime);
		if(parseInt(deadlineTime) < parseInt(currTime)){
			log.info("deadline crossed SKU");
			node.getValue("a_Product_Past_Draft_Deadline").setSimpleValue("Yes");
			}
		}
}
}