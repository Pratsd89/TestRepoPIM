/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_showDSGScreenEditable",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_showDSGScreenEditable",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "rt_ProductGroups",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log,rt_ProductGroups) {
var context =manager.getCurrentContext().getID();
var condition2 = true;
var References;
var ObjectType = node.getObjectType().getID();

manager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        if (ObjectType == "Product_Group") {
        References = getReferences(currentContextNode, rt_ProductGroups);
        }
    });
	
	if (References.length > 0) {
        condition2 = false;
    }

if(context == "EN_US" || condition2 == true ){
	return true;
}

else {
	return false;
}


function getReferences(node, RefType) {
    var References = node.getReferences(RefType).toArray();
    return References;
}
}