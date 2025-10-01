/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CCValidationACLJP",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CCValidationACLJP",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "value" : "ag_Required_CC_Attributes",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,agRequired) {
/**
 * PPIM-7581
 */
try{
	var obj = node.getObjectType().getID();
	log.info(obj);
	log.info(node.getApprovalStatus());
	if(obj == "CustomerChoice"){
		
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
	var status = node.getApprovalStatus();
	if(status != "Not in Approved workspace"){
		if(status == "Approved" && (!(node.isInWorkflow("wf_NewStyleEnrichmentJapan")))){
		if(node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow")){
		//node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow").delete("delete");
		//node.startWorkflowByID("wf_StyleMaintenanceWorkflow","ACL Based Initiation");
		}
		else{
		node.startWorkflowByID("wf_StyleMaintenanceWorkflow","ACL Based Initiation");
		}
		}
		}
		}
}
catch(e){
	logger.info("CC Created/Updated Event Processor Failed For : " + node.getID());
}

		
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "setACLMarketDesig"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_CCSecondMarketUpdate"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Calculated_Values_CC"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Set_CC_Sort_Order_Inbound"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "InitiateWorkflowAction"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_CheckCatSyncUserUpdate"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
