/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CheckACLUserUpdateSA",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check ACL User on Update SA",
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
// Return true if current context = EN_SA and last update user STIBOACLUSER and acl market designation is SA
var result = false;
var currContext = step.getCurrentContext().getID();
if (currContext == "EN_SA"){
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
		step.executeInContext('EN_SA', function (saContextManager) {
			var saCurrentProduct = saContextManager.getProductHome().getProductByID(node.getID());
			if (saCurrentProduct.getValue("a_ACL_Market_Designation").getSimpleValue() == "SA" && saCurrentProduct.getValue("a_ACL_Market_Designation").isInherited() == false) {
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