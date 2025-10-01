/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Save_Category_Test",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test Dev Save Category",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
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
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Web_Hierarchy_Inheritance_Actions"
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
    "value" : "br_Web_Hierarchy_Mandatory_Check"
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
    "value" : "br_SEO_Slug_Genearation"
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
    "value" : "br_SEOPageTitleGeneration"
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
    "value" : "br_SEO_PopulatePageDescription"
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
    "value" : "br_Web_Hierarchy_Sort_Order_Buffer"
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
exports.operation7 = function (node,UI,ag) {
//PPIM-5700 Validate Tags
var categoryDescription = node.getValue("a_Category_Description").getSimpleValue();
if(categoryDescription!=null){
var categoryDepartmentTag = node.getValue("a_Department_Tag").getSimpleValue();
var categoryProductTypeTag = node.getValue("a_ProductType_Tag").getSimpleValue();
var categoryGroupTag = node.getValue("a_CategoryGroup_Tag").getSimpleValue();
var objectType = node.getObjectType().getID();
var validCategoryDepartmentTag = 0;
var validCategoryProductTypeTag = 0;
var validCategoryGroupTag = 0;
var validTags = false;

if (objectType == "WebCategory" || objectType == "WebSubCategory") {
	//Checking if the tags are populated
	if (categoryDepartmentTag != "" && categoryDepartmentTag != null) {
		validCategoryDepartmentTag = 1;
	}
	if (categoryProductTypeTag != "" && categoryProductTypeTag != null) {
		validCategoryProductTypeTag = 1;
	}
	if (categoryGroupTag != "" && categoryGroupTag != null) {
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
}
}
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
    "value" : "br_setMaintLastUpdateDate"
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
    "value" : "br_Publish_Child_Cats_to_DGL"
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
    "value" : "br_Save_Category_Conditions"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "true"
  } ],
  "pluginType" : "Precondition"
}
*/
