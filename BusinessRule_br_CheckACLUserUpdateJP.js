/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CheckACLUserUpdateJP",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check ACL User on Update JP",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log) {
// Return true if current context = EN_US and last update user STIBOACLUSER and acl market designation is US
var result = false;
var currContext = step.getCurrentContext().getID();
if (currContext == "EN_JP" || currContext == "JA_JP") {
	result = true;
}
else {
	result = false;
}
if (result == true) {
	var lastModifiedUser = node.getRevision().getUserID();
	if (lastModifiedUser.toUpperCase() == "STIBOACLUSER") {
		result = true;
	}
	else {
		result = false;
	}
	if (result == true) {
		step.executeInContext('EN_JP', function (caContextManager) {
			var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());
			if (caCurrentProduct.getValue("a_ACL_Market_Designation").getSimpleValue() == "JPN" && caCurrentProduct.getValue("a_ACL_Market_Designation").isInherited() == false) {
				result = true;
			}
			else {
				result = false;
			}
		});
	}
}

return result;
}