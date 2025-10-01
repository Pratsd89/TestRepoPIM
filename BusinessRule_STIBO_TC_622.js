/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "STIBO_TC_622",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Save Web SubCategory",
  "description" : "See Save_Category",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
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
 //	portal.showAlert("Warning", null , "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
logger.info("first end");
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "STIBO_TC_GAPNC622_LastUpdate"
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
    "value" : "STIBO_TC_GAPNC622_ReturnMessage"
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
    "value" : "Stibo_TC_GAPNC622_ApprovalCode"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "com.stibo.customer.gapinc.autopop.server.AutoPopBusinessAction",
  "parameters" : [ {
    "id" : "ExcludedContexts",
    "type" : "java.lang.String",
    "value" : ""
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
    "value" : "br_Check_Old_Category_Tags_Values"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "true"
  } ],
  "pluginType" : "Precondition"
}
*/
