/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_WebCategoryTranslations_InboundAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Web Category Translations - Inbound Action",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
var time = new java.util.Date(); 
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

node.getValue("a_Cat_Translation_Due_Date").deleteCurrent();	
node.getValue("a_Cat_Translation_Status").setSimpleValue("Complete");

step.executeInContext("EN_US",function(contextManager){
			var currentClassification = contextManager.getClassificationHome().getClassificationByID(node.getID());
			var translation_status = currentClassification.getValue("a_Cat_Translation_Status").getSimpleValue();
			if(translation_status){
				currentClassification.getValue("a_Cat_Translation_Status").setSimpleValue("Complete");
				currentClassification.getValue("a_Cat_Translation_Due_Date").deleteCurrent();
			}
		}
	)		

node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_SEO_Slug_French_Langauge_Generator"
  } ],
  "pluginType" : "Operation"
}
*/
