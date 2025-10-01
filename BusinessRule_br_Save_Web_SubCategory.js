/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Save_Web_SubCategory",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Save Web SubCategory",
  "description" : "Replaced with Save_Category",
  "scope" : "Global",
  "validObjectTypes" : [ "WebSubCategory" ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,portal) {
//'a_WebCategory_Inherit_US' defaulted to "NO". PPIM-3500
if (stepManager.getCurrentWorkspace().getID() == "Main")
{
	var inheritValue = node.getValue('a_WebCategory_Inherit_US').getSimpleValue();
	if(inheritValue == null || inheritValue == '')
	{
		node.getValue('a_WebCategory_Inherit_US').setSimpleValue("No");
	}
}
else if (stepManager.getCurrentWorkspace().getID() == "Approved")
{
	portal.showAlert("Warning", null , "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Web_Hierarchy_Approval_Code"
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
    "contract" : "WebUiContextBind",
    "alias" : "UI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "ag",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_AutoClass_Attribute",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (node,UI,ag) {
//PPIM-5700 Validate Tags
var categoryDepartmentTag = node.getValue("a_Department_Tag").getSimpleValue();
var categoryProductTypeTag = node.getValue("a_ProductType_Tag").getSimpleValue();
var categoryGroupTag = node.getValue("a_CategoryGroup_Tag").getSimpleValue();
var validCategoryDepartmentTag = 0;
var validCategoryProductTypeTag = 0;
var validCategoryGroupTag = 0;
var validTags = false;

//Checking if the tags are populated
if (categoryDepartmentTag != "" && categoryDepartmentTag != null){
	validCategoryDepartmentTag = 1;
}
if (categoryProductTypeTag != "" && categoryProductTypeTag != null){
	validCategoryProductTypeTag = 1;
}
if (categoryGroupTag != "" && categoryGroupTag != null){
	validCategoryGroupTag = 1;
}

//Validating tag configuration
var sum = validCategoryDepartmentTag + validCategoryProductTypeTag + validCategoryGroupTag;

//Can't have only one of the first 3 tags selected unless another is also selected
if (sum == 1) {
	var tags = ag.getAttributes().toArray();
	var OtherTags = new Array();

	//get just the IDs
	tags.forEach(
		function (tag) {
			OtherTags.push(tag.getID());
		}
	);

	//filter out Specification attributes
	OtherTags = OtherTags.filter(
		function (tag) { 
			return !tag.endsWith('_Inherit');
		}
	);

	//filter out the three tags already checked above
	OtherTags = OtherTags.filter(
		function (tag) {
			return !tag.match(/a_Department_Tag|a_CategoryGroup_Tag|a_ProductType_Tag/);
		}	
	);

	//find how many tags are selected
	for (var i = 0; i < OtherTags.length; i++) {
		var tempTag = node.getValue(OtherTags[i]).getSimpleValue();

		if (tempTag != "" && tempTag != null) {
			sum++;
		}
	}

	if (sum > 1) { validTags = true; }
	else { validTags = false; }
}
else {
	validTags = true;
}

//get current time
var now = new java.util.Date();
var fmt = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//format current time
now = fmt.format(now);

//get revision history of node
var rev = node.getRevision().getEditedDate();
//format revision time
rev = fmt.format(rev);

if (validTags) {
	//if WebCategory recent revision matches current time then save with autopop
	if (now == rev) {
		//needs autopop
		node.getValue("does_not_need_autopop").setSimpleValue("false");
	}
	//else save without autopop
	else {
		//reject from autopop
		node.getValue("does_not_need_autopop").setSimpleValue("true: timestamps do not match");
	}
}
else {
	UI.showAlert(
		"ERROR",
		"Invalid Tag Configuration",
		"Please fill out additional product tags for Autopop to run as these tag conditions will cause a very large assortment to be created"
	);
	
	//reject from autopop
	node.getValue("does_not_need_autopop").setSimpleValue("true: tag config not valid");
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_setMainLastUpdateDate"
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
    "value" : "br_Autopop_SaveCategory_ReturnMessage"
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
    "value" : "br_CategoryStartDateDefault"
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
    "value" : "br_CategoryEndDate_errorMessage"
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
    "value" : "br_Append_StartDate_EndDate"
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
    "value" : "br_Revive_Web_Category"
  } ],
  "pluginType" : "Operation"
}
*/

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
exports.precondition0 = function (node) {
//PPIM-6955 - Validation for Redirect URL to flag error for specific characters appearing twice in sequence.
var result = true;
var url = node.getValue("a_Redirect_URL").getSimpleValue();
if(url != null){
	var arrUrl = url.split('');
	for(i=0;i<arrUrl.length;i++){
		if(i!=0){
			if((arrUrl[i-1] == arrUrl[i]) && (arrUrl[i] == "=" || arrUrl[i] == "/" || arrUrl[i] == "&" || arrUrl[i] == "?")){
				result =false;
				throw "<b style='color:red;'>\nError: Category Redirect URL Error</b>\n<b style='color:navy;'>Please provide a valid Category Redirect URL. </b>\n\n";
			}
		}
	}
}

return result;
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_Check_Old_Category_Tags_Values"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "true"
  } ],
  "pluginType" : "Precondition"
}
*/
