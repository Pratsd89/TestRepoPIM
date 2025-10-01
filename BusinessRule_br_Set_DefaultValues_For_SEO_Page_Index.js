/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Set_DefaultValues_For_SEO_Page_Index",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Default Values For SEO Page Index Tag",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,web,slug) {
// Set a_SEO_No_Index_Tag as "No Index" when "a_WebCategory_Hide_Category" is set as Yes
//Set a_SEO_No_Index_Tag as "Index" when a_WebCategory_Hide_Category" is set as No 
// Set a_SEO_No_Index_Tag as "Index" when "a_WebCategory_Hide_Category" is null 
// br_SEO_Slug_Genearation updated Start Story PPIM-11700

// setSeoNonIndexDefaultValue is set to the  a_SEO_Non_Indexable when a brand new Division/Category/Sub category gets created 
// also when ever merchant changes the a_WebCategory_Hide_Category attribute value 
function setSeoNonIndexDefaultValue(node)
{
	var isCategoryHide = node.getValue("a_WebCategory_Hide_Category").getSimpleValue();
	var isSeoIndxTag = node.getValue("a_SEO_Non_Indexable").getSimpleValue();
	var isOldSeoIndexTag = node.getValue("a_Old_SEO_Non_Indexable").getSimpleValue();

	
	if (isSeoIndxTag != isOldSeoIndexTag){
	
		return "<b style='color:red;'>  "+node.getObjectType().getName()+"  "+ node.getID() +" SEO Page Index Tag has already been changed hence it can not be updated .</b>";
		}
}

function getContextSpecificObject(object, context)
{
		var contextSpecificObject = "";
		contextSpecificObject = stepManager.executeInContext(context, function(specificManager) {
				var ObjectinContext =  specificManager.getObjectFromOtherManager(object);
				if (ObjectinContext != "undefined" && ObjectinContext !=  null  ){
				 return ObjectinContext; }
			});		
			return contextSpecificObject ;
}

var currentContext=stepManager.getCurrentContext().getID();

if(currentContext == "EN_US"){
	
	var en_CAObject = getContextSpecificObject(node,"EN_CA");
	var fr_CAObject = getContextSpecificObject(node,"FR_CA");
	setSeoNonIndexDefaultValue(node);
	setSeoNonIndexDefaultValue(en_CAObject);
	setSeoNonIndexDefaultValue(fr_CAObject);
	//setOldIndexValue(node);
	//setOldIndexValue(en_CAObject);
	//setOldIndexValue(fr_CAObject);
		
}else if (currentContext == "EN_CA"){
	
		var fr_CAObject = getContextSpecificObject(node,"FR_CA");
		setSeoNonIndexDefaultValue(fr_CAObject);
		setSeoNonIndexDefaultValue(node);
		//setOldIndexValue(node);
		//setOldIndexValue(fr_CAObject);

}else {
setSeoNonIndexDefaultValue(node);
//setOldIndexValue(node);
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
exports.precondition0 = function (node,slug) {
var categoryDescription = node.getValue("a_Category_Description").getSimpleValue();
if(categoryDescription!=null){
	return true;
} else return false;

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_SEO_Release_Condition_True"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "true"
  } ],
  "pluginType" : "Precondition"
}
*/
