/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Slug_French_Natural_Langauge_url",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Slug French Natural Language URL Generator",
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
//br_Slug_French_Natural_Langauge_url

var objectType = node.getObjectType().getID();
var logArray = [];

if (objectType == "WebDivision") {
	
	//log.info("objectType . -->  " +objectType);
	//var brand = node.getParent().getName();
	var stiboValue = node.getValue('a_Division_Slug').getSimpleValue();
	var  divisionSlugValue = slug.slugify(String(stiboValue),{locale:"fr"});
		log.info("divisionSlugValue . --> in the division  " +divisionSlugValue);
		log.info("stiboValue . --> in the division " +stiboValue);

	var divisionCidValue = node.getValue('a_WebCategory_CID').getSimpleValue();
	var div_fr_natural_url = "/"+divisionSlugValue + "?CID="+divisionCidValue;
	node.getValue("a_French_Natural_Language_URL").setSimpleValue(div_fr_natural_url);
	
}

else if (objectType=="WebCategory") {
			var stiboValue = node.getParent().getValue('a_Division_Slug').getSimpleValue();
			var  divisionSlugValue = slug.slugify(String(stiboValue),{locale:"fr"});
			log.info("divisionSlugValue . --> in category  " +divisionSlugValue);
			log.info("stiboValue . -->  in category " +stiboValue);
			var categorySlugValue = node.getValue('a_Category_Slug').getSimpleValue();
            var categoryCidValue = node.getValue('a_WebCategory_CID').getSimpleValue();
			var categoryFrNaturalUrl = "/"+divisionSlugValue+"/"+categorySlugValue+"?CID="+categoryCidValue;
			node.getValue("a_French_Natural_Language_URL").setSimpleValue(categoryFrNaturalUrl);
	
}

else if (objectType=="WebSubCategory") {
	
			var stiboValue = node.getParent().getParent().getValue('a_Division_Slug').getSimpleValue();
			var  divisionSlugValue = slug.slugify(String(stiboValue),{locale:"fr"});
			log.info("divisionSlugValue in webSUBCategory . -->  " +divisionSlugValue);
			log.info("stiboValue . --> in webSUBCategory " +stiboValue);
			var categorySlugValue = node.getParent().getValue('a_Category_Slug').getSimpleValue();
			var subCategorySlugValue = node.getValue('a_SubCategory_Slug').getSimpleValue();
			var subCategoryCidValue = node.getValue('a_WebCategory_CID').getSimpleValue();
			var subCategoryFrNaturalUrl = "/"+divisionSlugValue+"/"+categorySlugValue+"/"+subCategorySlugValue+"?CID="+subCategoryCidValue+"&style=";
			node.getValue("a_French_Natural_Language_URL").setSimpleValue(subCategoryFrNaturalUrl);
		
}

if (logArray.length > 0) {
	throw "\n<b>Error: " + logArray + "\n</b>";
}
}