/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Slug_English_Natural_Langauge_url",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Slug English Natural Language URL Generator(DELETE)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
    "contract" : "AttributeBindContract",
    "alias" : "divisionSlug",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Division_Slug",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
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
    "contract" : "AttributeBindContract",
    "alias" : "categorySlug",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Category_Slug",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "subCategorySlug",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_SubCategory_Slug",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,divisionSlug,queryHome,stepManager,categorySlug,subCategorySlug,slug) {
// BR name 
//br_Slug_English_Natural_Langauge_url

var objectType = node.getObjectType().getID();
var logArray = [];

if (objectType == "WebDivision") {
	
	//log.info("objectType . -->  " +objectType);
	//var brand = node.getParent().getName();
	var divisionSlugValue = node.getValue('a_Division_Slug').getSimpleValue();
	var divisionCidValue = node.getValue('a_WebCategory_CID').getSimpleValue();
	var div_english_natural_url = "/"+divisionSlugValue + "?CID="+divisionCidValue;
	node.getValue("a_English_Natural_Language_URL").setSimpleValue(div_english_natural_url);
	
}

else if (objectType=="WebCategory") {
			var divisionSlugValue = node.getParent().getValue('a_Division_Slug').getSimpleValue();
			var categorySlugValue = node.getValue('a_Category_Slug').getSimpleValue();
               var categoryCidValue = node.getValue('a_WebCategory_CID').getSimpleValue();
			var categoryEnglisNaturalUrl = "/"+divisionSlugValue+"/"+categorySlugValue+"?CID="+categoryCidValue;
			node.getValue("a_English_Natural_Language_URL").setSimpleValue(categoryEnglisNaturalUrl);
	
}

else if (objectType=="WebSubCategory") {
	
			var divisionSlugValue = node.getParent().getParent().getValue('a_Division_Slug').getSimpleValue();
			var categorySlugValue = node.getParent().getValue('a_Category_Slug').getSimpleValue();
			var subCategorySlugValue = node.getValue('a_SubCategory_Slug').getSimpleValue();
			var subCategoryCidValue = node.getValue('a_WebCategory_CID').getSimpleValue();
			var subCategoryEnglisNaturalUrl = "/"+divisionSlugValue+"/"+categorySlugValue+"/"+subCategorySlugValue+"?CID="+subCategoryCidValue+"&style=";
			node.getValue("a_English_Natural_Language_URL").setSimpleValue(subCategoryEnglisNaturalUrl);
		
}

if (logArray.length > 0) {
	throw "\n<b>Error: " + logArray + "\n</b>";
}
}