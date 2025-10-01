/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setMainLastUpdateDate_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_setMainLastUpdateDate_CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : true,
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
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
/*if(node.getParent().getApprovalStatus()!="Not in Approved workspace" && node.getApprovalStatus()!='Not in Approved workspace') {
	node.approve();
}*/
}