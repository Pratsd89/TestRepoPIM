/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CategoryRedirectURL_webUI",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_CategoryRedirectURL_webUI",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
    "contract" : "MandatoryContextBind",
    "alias" : "mandatory",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "a_Redirect_URL",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Redirect_URL",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "SimpleValueBindContract",
    "alias" : "CategoryDisplayType",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Category_Display_Type",
    "description" : null
  }, {
    "contract" : "DataIssuesContextBind",
    "alias" : "Issues",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,mandatory,a_Redirect_URL,manager,CategoryDisplayType,Issues) {
var error = false;
var attrHome = manager.getAttributeHome();
var RedirectURL = node.getValue("a_Redirect_URL").getSimpleValue();
if(CategoryDisplayType == "Standard: Content" && RedirectURL == null ){
    //error = true
	mandatory.setMandatory("Category Redirect URL is mandatory if Category Display Type is Standard: Content", node, attrHome.getAttributeByID("a_Redirect_URL"));
     //Issues.addWarning("Category Redirect URL is mandatory if Category Display Type is Standard: Content", node, a_Redirect_URL);
}

if(error){
	return Issues;
}
else return (true);
}