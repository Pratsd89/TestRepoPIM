/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_initial_SetDefaultBackorderable_to_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_initial_SetDefaultBackorderable_to_CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {

if (node.getValue('a_Backorderable').isInherited() == true || node.getValue('a_Backorderable').getSimpleValue()==null){
	node.getValue('a_Backorderable').setSimpleValue('No')
	var changesToApprove = new java.util.HashSet();
	for (var partObjects = node.getNonApprovedObjects().iterator(); partObjects.hasNext(); ) {
        var partObject = partObjects.next();
        if (partObject instanceof com.stibo.core.domain.partobject.ValuePartObject && partObject.getAttributeID()=='a_Backorderable') {
            changesToApprove.add(partObject);
            break;
        }
	}
	if(node.getParent().getApprovalStatus()!='Not in Approved workspace' && node.getApprovalStatus()!='Not in Approved workspace')
		node.approve(changesToApprove);
}
}