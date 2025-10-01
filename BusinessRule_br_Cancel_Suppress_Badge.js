/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Cancel_Suppress_Badge",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Cancel Suppress Badge",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Badge", "Temp_Badge" ],
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "WebCategoryToBadgeRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,portal,ref) {
objectType = node.getObjectType().getID();
if (objectType == "Badge") {
	category = node.queryReferencedBy(ref).asList(10).get(0).getSource();

	var startDate = node.getValue("a_suppress_badge_old_start_date").getSimpleValue();
	var endDate = node.getValue("a_suppress_badge_old_end_date").getSimpleValue();
	var oldValueid = node.getValue("a_suppress_badge_old_value_id").getSimpleValue();
	brand = node.getValue("a_Brand_Number").getSimpleValue()
	attributeId = "a_suppress_badge_" + brand;

	node.getValue("a_suppress_badge_start_date").setSimpleValue(startDate);
	node.getValue("a_suppress_badge_end_date").setSimpleValue(endDate);
	node.getValue(attributeId).setLOVValueByID(oldValueid);
}
else {
	categoryid = node.getValue("a_Badge_Category").getSimpleValue();
	category = step.getClassificationHome().getClassificationByID(categoryid)
}

var currentContext = step.getCurrentContext().getID();



portal.navigate("WebCategory_Details_Screen", category);



}