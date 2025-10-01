/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Division_Page_Save_Actions",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Division Page Save Actions",
  "description" : "Replaced with Save_Category",
  "scope" : "Global",
  "validObjectTypes" : [ "WebDivision" ],
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
	if(inheritValue == null || inheritValue == '')	{
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
    "value" : "br_Web_Division_Approval_Code"
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
    "value" : "br_save_Current_WebCat_Sort_Order"
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