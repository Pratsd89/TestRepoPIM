/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_Badge_Condition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Create Badge Condition",
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
    "alias" : "step",
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
exports.operation0 = function (node,step,ref) {
brand = node.getValue("a_Brand_Number").getSimpleValue();
name = node.getValue("a_badge_name").getSimpleValue();
start_date = node.getValue("a_badge_start_date_temporary").getSimpleValue();
end_date = node.getValue("a_badge_end_date_temporary").getSimpleValue();
    attributeId = "a_badge_" + brand;
if (name == null || start_date == null || end_date == null) {
  return "Name,Start date and End date are mandatory,They cannot be empty"
}
else {
  var duplicate_flag = false;
  node.queryReferences(ref).forEach(function (referenceInstance) {
    var badge = referenceInstance.getTarget();
    //log.info("yy "+badge.getID())
    var currentstartDate = badge.getValue("a_badge_start_date").getSimpleValue();
    var currentEndDate = badge.getValue("a_badge_end_date").getSimpleValue();
    var currentBadgeValue = badge.getValue(attributeId).getSimpleValue();
    log.info(start_date +","+currentstartDate +","+end_date +","+currentEndDate + ","+name+ ","+ currentBadgeValue)
    if (start_date == currentstartDate && end_date == currentEndDate && name == currentBadgeValue) {
    	 log.info("duplicateee")
      duplicate_flag = true;
      return false;
    }
    return true;
  });
  if(duplicate_flag) {
  	return "Badge already exists for this Category with the given details";
  }
}
return true;
}