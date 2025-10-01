/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SKUWFCutOver",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SKU WorkFlow CutOver Task",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (log,manager,node) {
var wf = manager.getWorkflowHome().getWorkflowByID("wf_NewSKUEnrichment");
log.info(wf);
var skuLifeCycle = node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
log.info("=============>>"+ skuLifeCycle);


if(skuLifeCycle=="In Progress") 
{
	if(!node.getWorkflowInstanceByID("wf_NewSKUEnrichment")){
		wf.start(node, "Started for In Progress");	
		log.info("Inside case 1::::"+ node.isInState("wf_NewSKUEnrichment","NewSKUEnrich2"));
		
	}
}
}