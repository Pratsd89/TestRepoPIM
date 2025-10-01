/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_DataImport",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "SEO Data Import",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
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
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ImportChangeInfoBind",
    "alias" : "importChangeInfo",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,importChangeInfo) {
function getContextSpecificObject(object, context)
	{
		var contextSpecificObject = "";
		contextSpecificObject = stepManager.executeInContext(context, function(specificManager) {
				//get the object of the required context
				var ObjectinContext =  specificManager.getObjectFromOtherManager(object);
				// checks if the Object in Other Context is Active ? 
				//var isActive= isCategoryInActive(ObjectinContext) ;
				if (ObjectinContext != "undefined" && ObjectinContext !=  null  ){
				 return ObjectinContext; }
			});		
			return contextSpecificObject ;
	}
	
	
function setSeoNonIndexDefaultValue(node)
{
	var isSeoIndxTag = node.getValue("a_SEO_Non_Indexable").getSimpleValue();
	var isOldSeoIndexTagValue = node.getValue("a_Old_SEO_Non_Indexable_Value").getSimpleValue();
	var isOldSeoIndexTag = node.getValue("a_Old_SEO_Non_Indexable").getSimpleValue();
	log.info("isOldSeoIndexTag  " + isOldSeoIndexTag);
	log.info("isOldSeoIndexTagValue  " + isOldSeoIndexTagValue);
	log.info("isSeoIndxTag  " + isSeoIndxTag);
	// if both the a_Old_SEO_Non_Indexable_Value and a_SEO_Non_Indexable are empty means use has not changed any value for the a_SEO_Non_Indexable attribute 
	if ( isSeoIndxTag == isOldSeoIndexTagValue)
	{
	// this condition satisfy if there is no change to a_SEO_Non_Indexable attribute value by SEO user 
	return true ;
	}else if (isOldSeoIndexTagValue == null && isSeoIndxTag != null &&   isSeoIndxTag != isOldSeoIndexTag){
	// when SEO user change the value first time means there will not be any value on the a_Old_SEO_Non_Indexable_Value hence no need to throw any validation 
	node.getValue("a_Old_SEO_Non_Indexable_Value").setSimpleValue(isSeoIndxTag);
	return true ;
	}else if  (isOldSeoIndexTagValue == null && isSeoIndxTag != null &&   isSeoIndxTag == isOldSeoIndexTag)
	{
		//this condition to address when the a_SEO_Non_Indexable is set as Index due to merchant action and SEO user try to import the same in this case no need to set the a_Old_SEO_Non_Indexable_Value as SEO user is not intended to change 
		return true ;
	}else if (isOldSeoIndexTagValue != null && isOldSeoIndexTagValue != isSeoIndxTag){
	
		var SeoIndxTag = "";
		if(isSeoIndxTag == "Index" ){
		 SeoIndxTag = "No Index";
		node.getValue("a_SEO_Non_Indexable").setSimpleValue(SeoIndxTag);
		}
		else if (isSeoIndxTag == "No Index" ){
		SeoIndxTag = "Index";
		node.getValue("a_SEO_Non_Indexable").setSimpleValue(SeoIndxTag);
		} else if (isSeoIndxTag == null)
		{
		var isOldSeoIndexTagValuetoSet = node.getValue("a_Old_SEO_Non_Indexable_Value").getSimpleValue();
		node.getValue("a_SEO_Non_Indexable").setSimpleValue(isOldSeoIndexTagValuetoSet);
		}
	
		return "<b style='color:red;'>  "+node.getObjectType().getName()+"  "+ node.getID() +" SEO Page Index Tag has already been changed hence it can not be updated .</b>";
	
	}

}
var currentContext=stepManager.getCurrentContext().getID();
if(importChangeInfo.getChanges() != null)
{
//var currentContxtObj = getContextSpecificObject(node,currentContext);
return setSeoNonIndexDefaultValue(node);
}else{

return true;
}
}