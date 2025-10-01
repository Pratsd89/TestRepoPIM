/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_RestoreButtonVisibilityCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "RestoreButtonVisibilityCondition",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "ReadOnly",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "Stibo-PIM-Read-Only-Security-Group",
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,ReadOnly,node,shotRef) {
var userId = manager.getCurrentUser();
if(!(ReadOnly.isMember(userId))) {
	var currentProduct = manager.getProductHome().getProductByID(node.getID());
	var objectType = node.getObjectType().getID();
	if (objectType == "CustomerChoice") {
  	  	var refs = new java.util.ArrayList();
    		refs.addAll(currentProduct.getReferences(shotRef));
    		for (var i = 0; i < refs.size(); i++) {
       		 var shot = refs.get(i).getTarget();
        		 if (shot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue() == "Rejected") {
            		return true;
        		}
    		}
	}
}
return false;
}