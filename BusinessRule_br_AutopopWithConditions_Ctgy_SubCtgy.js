/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_AutopopWithConditions_Ctgy_SubCtgy",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_AutopopWithConditions_Ctgy_SubCtgy",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "currObj",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,log,currObj) {
log.info("br_AutopopWithConditions_Ctgy_SubCtgy Node: " + currObj.getID());

var workflow = manager.getWorkflowHome().getWorkflowByID("Autopop_Async_Action_WebCategory");
var initialState = workflow.getStateByID("Autopop_Initial");
var runState = workflow.getStateByID("Autopop_Run");
var endState = workflow.getStateByID("Autopop_End");

var inWorkflow = currObj.getWorkflowInstanceByID("Autopop_Async_Action_WebCategory");
if (!inWorkflow) {
	log.info("Added to Autopop_Async_Action_WebCategory");
	workflow.start(currObj, null);
} else {
	if (currObj.getTask(endState)) {
		inWorkflow.delete("Removed Due To New Request");
		log.info("Removed from Autopop_Async_Action_WebCategory");
		workflow.start(currObj, null);
		log.info("Added to Autopop_Async_Action_WebCategory");
	} else  {
		//need to validate with Stibo what is the reprecussions of running the same autopop request on a single node
	}
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "inclusionTagsAttGroup",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_AutoClass_Attribute",
    "description" : null
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "exclusionTagsAttGroup",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_AutoClass_Exclusion_Tags",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,manager,log,inclusionTagsAttGroup,exclusionTagsAttGroup) {
//For PPIM-3739
//This will determine whether or not the Stibo Autopopulate Business Rule will run for a Category or Sub Category
//upon clicking the 'Save' button from the Web UI

//The business rule should run ONLY if web category assortment type is Autopop
if(node.getValue("a_WebCategory_Assortment_Type").getSimpleValue() != "Autopop"){
	log.info('WebCategory Assortment Type not set to Autopop');
	return false;
}

//Evaluate the inclusion and exclusion tag attributes for a value
var inclusionTagAttsForReview = inclusionTagsAttGroup.getAttributes();
var exclusionTagAttsForReview = exclusionTagsAttGroup.getAttributes();
var inclusionItr = inclusionTagAttsForReview.iterator();
var exclusionItr = exclusionTagAttsForReview.iterator();
var inclusionAttributeID;
var exclusionAttributeID;
var allInclusionAttributesNull = true;
var allExclusionAttributesNull = true;
while(inclusionItr.hasNext()){
	//validate each inclusion tag attribute for a value
	inclusionAttributeID = inclusionItr.next().getID();
	log.info('inclusion attribute= '+inclusionAttributeID+' inclusion attribute value= '+node.getValue(inclusionAttributeID).getSimpleValue());
	if (node.getValue(inclusionAttributeID).getSimpleValue() != null) {
		allInclusionAttributesNull = false;
	}
}
while(exclusionItr.hasNext()){
	//validate each exclusion tag attribute for a value
	exclusionAttributeID = exclusionItr.next().getID();
	log.info('exclusion attribute= '+exclusionAttributeID+' exclusion attribute value= '+node.getValue(exclusionAttributeID).getSimpleValue());
	if (node.getValue(exclusionAttributeID).getSimpleValue() != null) {
		allExclusionAttributesNull = false;
	}
}
//If one attribute has a value, the autopop logic will apply on a Category/SubCategory Save, otherwise it should be skipped
if(allInclusionAttributesNull == true && allExclusionAttributesNull == true){
	log.info('All attributes were null, skip the rule');
	return false;
}
else{
	log.info('Some attributes had a value, dont skip the rule');
	return true;
}
}