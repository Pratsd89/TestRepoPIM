/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StyleValidationACLCanada",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "StyleValidationACLCanada",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "agRequired",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_Required_Style_Fields",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,agRequired) {
try{
	var obj = node.getObjectType().getID();
	log.info(obj);
	log.info(node.getApprovalStatus());
	if(obj == "Style"){
		node.getValue("a_error_message").setSimpleValue("no");
		var sAttributes = new java.util.ArrayList();
		sAttributes.addAll(agRequired.getAllAttributes());
		for (var i=0;i<sAttributes.size();i++){
			var attr = sAttributes.get(i).getID();
			var val = node.getValue(attr).getSimpleValue();
			var err = node.getValue("a_error_message").getSimpleValue();
			if((val == null || val == '') && (err == "no")){
				var msg = "Mandatory "+attr+" is missing";
				node.getValue("a_error_message").setSimpleValue(msg);			
				}
			}
		if(node.getValue("a_error_message").getSimpleValue() == "no"){
		node.getValue("a_error_message").deleteCurrent();
		}
	var status = node.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
	if(status == "Approved" && (!node.isInWorkflow('wf_NewStyleEnrichmentCanada'))){
		if(node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow")){	
		node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow").delete("delete");
		node.startWorkflowByID("wf_StyleMaintenanceWorkflow","ACL Based Initiation");
		}
		else{
		node.startWorkflowByID("wf_StyleMaintenanceWorkflow","ACL Based Initiation");
		}
		}
		}
}
catch(e){
	logger.info("SKU Created Size Code Invocation Event Processor Failed for ID : " + node.getID());
}
	
}