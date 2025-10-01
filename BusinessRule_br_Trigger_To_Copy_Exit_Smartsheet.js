/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Trigger_To_Copy_Exit_Smartsheet",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Trigger To Copy Exit Smartsheet",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
	//PPIM-3040: Blocking a_main_last_modified_date modification, Outbound will be triggered explicitly
	/* var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	*/
}
else if (stepManager.getCurrentWorkspace().getID() == "Approved")
{
	//portal.showAlert("Warning", null , "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
	throw("Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_setMaintLastUpdateDate"
  } ],
  "pluginType" : "Operation"
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (node,stepManager) {
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
	var context = stepManager.getCurrentContext().getID();
	if(context == "EN_US")
	{
		if(node.isInWorkflow("wf_NewStyleEnrichment")){
			var task=node.getTaskByID("wf_NewStyleEnrichment","NewStyleEnrich_Copy1");
				if(task != null){
					task.triggerByID("Copy_Complete",'');
					}
				}
	}
	// PPIM-1802 & PPIM-2940
	else if(context == "EN_CA" || context == "FR_CA")
	{
		if(node.isInWorkflow("wf_NewStyleEnrichmentCanada")){
			var task=node.getTaskByID("wf_NewStyleEnrichmentCanada","NewStyleEnrich_Copy1");
				if(task != null){
					task.triggerByID("Copy_Complete",'');
					}
				}
	}
	
	//Migrated below changes as part of PPIM-7542
	//Below code is implemented as part of Japan Context requirements
	else if(context == "EN_JP" || context == "JA_JP")
	{
		if(node.isInWorkflow("wf_NewStyleEnrichmentJapan")){
			var task=node.getTaskByID("wf_NewStyleEnrichmentJapan","NewStyleEnrich_Copy1");		
				if(task != null){
					task.triggerByID("Copy_Complete",'');
					}
				}
	}
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "ENUStoENCACopyAction"
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
    "value" : "ENUStoENJPCopyAction"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "AttributeComparatorCondition",
  "parameters" : [ {
    "id" : "Attribute1",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Run_Copy_Complete"
  }, {
    "id" : "Attribute2",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : null
  }, {
    "id" : "Constant",
    "type" : "java.lang.String",
    "value" : "Yes"
  }, {
    "id" : "Operator",
    "type" : "java.lang.String",
    "value" : "="
  } ],
  "pluginType" : "Precondition"
}
*/
