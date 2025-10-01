/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Autopop_SaveCategory_ReturnMessage",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Autopop_SaveCategory_ReturnMessage",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,inclusionTagsAttGroup,exclusionTagsAttGroup,webui,slug) {
//For PPIM-3739
//This will determine whether or not the Stibo Autopopulate Business Rule will run for a Category or Sub Category
//This rule will return a Warning message if a_WebCategory_Assortment_Type = Autopop but the Tags are all NULL
//Runs upon clicking the 'Save' button from the Web UI (Ref by Save_Category business rule) that is triggered by the 'Save' button in Web UI


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
	//log.info('inclusion attribute= '+inclusionAttributeID+' inclusion attribute value= '+node.getValue(inclusionAttributeID).getSimpleValue());
	if (node.getValue(inclusionAttributeID).getSimpleValue() != null) {
		allInclusionAttributesNull = false;
	}
}
while(exclusionItr.hasNext()){
	//validate each exclusion tag attribute for a value
	exclusionAttributeID = exclusionItr.next().getID();
	//log.info('exclusion attribute= '+exclusionAttributeID+' exclusion attribute value= '+node.getValue(exclusionAttributeID).getSimpleValue());
	if (node.getValue(exclusionAttributeID).getSimpleValue() != null) {
		allExclusionAttributesNull = false;
	}
}

var nlumsg = slug.checkNLUmessage(node);
if(allInclusionAttributesNull == true && allExclusionAttributesNull == true){
	//log.info('All attributes were null, skip the rule');
	webui.showAlert("Warning", nlumsg + "No product tag is set, Autopop will not be executed.");
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,log,slug) {
//The business rule should run ONLY if web category assortment type is Autopop
if(node.getValue("a_WebCategory_Assortment_Type").getSimpleValue() == "Autopop"){
	return true;
}
else{
	log.info('WebCategory Assortment Type not set to Autopop');
	return false;
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
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition1 = function (node,slug) {
var categoryDescription = node.getValue("a_Category_Description").getSimpleValue();
if(categoryDescription!=null){
	return true;
} else return false;
}