/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Set MainLastUpdateDate For CS",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Main Last Update Date For CS",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerServiceBusinessUnit", "CustomerServiceCategory", "CustomerServiceHome" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,log,stepManager,portal) {
if(stepManager.getCurrentWorkspace().getID()== "Main") {
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	//log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
}
else if (stepManager.getCurrentWorkspace().getID() == "Approved") {
	portal.showAlert("Warning", "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "CustomerService_Approve"
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
    "value" : "CustomerServiceCategory_Approval"
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
    "value" : "CustomerServiceCategoryDetailsPortalMSG"
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation5 = function (node,log,stepManager,LKT) {
var currentContext = stepManager.getCurrentContext().getID();

if (currentContext == 'EN_US') {
  var type = node.getObjectType().getID();
  //get parent
  var parent = node.getParent();
  var brandNum = null;

  //get parent object type
  var parentType = parent.getObjectType().getID();

  if (type == "CustomerServiceCategory" || type == "CustomerServiceHome") {
    //then keep getting parent until type is CustomerServiceBusinessUnit
    while (parentType != "CustomerServiceBusinessUnit") {
      parent = parent.getParent();

      parentType = parent.getObjectType().getID();
    }
    //get a_Brand_Number
    brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
  }
  //else get Brand Number
  else {

    brandNum = node.getValue("a_Brand_Number").getSimpleValue();
  }
  var inheritValue = node.getValue("a_WebCategory_Inherit_US").getSimpleValue();
  var newName = node.getName();

  if (brandNum != null) {
    var contexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Context", brandNum);

    contexts = contexts.split(";");

    contexts.forEach(function (ctx) {

      if (inheritValue == "Yes" && ctx != 'EN_US') {

        stepManager.executeInContext(ctx, function (cntxManager) {
          var cntxNode = cntxManager.getObjectFromOtherManager(node);

          cntxNode.setName(newName);
        });
      }
    })
  }
}
}