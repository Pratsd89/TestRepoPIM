/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "acn-4b35d003-939d-4847-80a2-33955b2e60cc",
  "type" : "BusinessAction",
  "setupGroups" : [ "Workflows" ],
  "name" : "Initial_OnEntry",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ID_Generator_Library",
    "libraryAlias" : "IDGeneratorLibrary"
  }, {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "slug"
  } ]
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,IDGeneratorLibrary,slug) {
var objType = node.getObjectType().getID();
if(objType == "CMS_Slot") {
		/*Slot id to be updated on creation of slot manually for now
	//log.info(node.getParent().getValue("a_current_max_slot_id").getSimpleValue())
	current_max = node.getParent().getValue("a_current_max_slot_id").getSimpleValue();
	if(current_max==null) {
		current_max = 0;
	} else{
		current_max = parseInt(current_max)
	}
	node.getValue("a_Slot_ID").setSimpleValue(current_max+1);
	node.getParent().getValue("a_current_max_slot_id").setSimpleValue(current_max+1);	*/
	//IDGeneratorLibrary.setIDValue(node,step,'CMF_Slot_ID_Generator','a_Slot_ID');
}
else if(objType =="CMS_Content_Group") {
		//node.getValue("a_WebCategory_CID").setSimpleValue(node.getID().split("-")[1]);
	IDGeneratorLibrary.setIDValue(node,step,'CIDGenerator','a_WebCategory_CID');
	Brand_Number = node.getParent().getParent().getValue("a_Brand_Number").getSimpleValue()
	
	node.getValue("a_Brand_Number").setSimpleValue(Brand_Number);
	if(step.getCurrentContext().getID() =="EN_US" ){
		node.getValue("a_Content_Group_Can_InheritOption").setSimpleValue("CAN");
	}
	node.getValue("a_Category_Display_Type").setSimpleValue("Standard: Core");
	node.getValue("a_WebCategory_Product_Type").setSimpleValue("Style");
	node.getValue("a_Channel_Number").setSimpleValue("ONL");
	node.getValue("a_WebCategory_Sort_Order").setSimpleValue("999999");
	
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "RepublishEventQueueOperation",
  "parameters" : [ {
    "id" : "HasEventQueue",
    "type" : "com.stibo.core.domain.haseventqueue.HasEventQueue",
    "value" : "step://eventprocessor?id=setObjectNameEventProcessor"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateTriggerStateFlowEvent",
  "parameters" : [ {
    "id" : "currentStateID",
    "type" : "java.lang.String",
    "value" : "Initial"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "Submit"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_CMS_id_generation"
  } ],
  "pluginType" : "Operation"
}
*/
