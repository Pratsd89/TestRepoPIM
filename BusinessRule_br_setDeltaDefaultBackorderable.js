/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setDeltaDefaultBackorderable",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_setDeltaDefaultBackorderable",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
var needToApprove = false;
//PPIM-6978 - Set Style a_Backorderable to No if existing value is null 
if (node.getObjectType().getID()=='Style' &&  node.getValue('a_Backorderable').getSimpleValue()==null){
	node.getValue('a_Backorderable').setSimpleValue('No')
	needToApprove = true
}

//PPIM-6978 - Inherit parent(Style) back orderable value to CC if its back orderable value is not Yes
if(node.getObjectType().getID()=='CustomerChoice' && node.getValue('a_Backorderable').isInherited() != true && 
	node.getParent().getValue('a_Backorderable').getSimpleValue()!=node.getValue('a_Backorderable').getSimpleValue() && node.getValue('a_Backorderable').getSimpleValue()!='Yes'){
   	node.getValue('a_Backorderable').deleteCurrent()
   	needToApprove = true
}

//PPIM-6978 - Inherit parent(CC) back orderable value to SKU if its back orderable value is not Yes
if(node.getObjectType().getID()=='SKU' && node.getValue('a_Backorderable').isInherited() != true && 
	node.getParent().getValue('a_Backorderable').getSimpleValue()!=node.getValue('a_Backorderable').getSimpleValue() && node.getValue('a_Backorderable').getSimpleValue()!='Yes'){
   	node.getValue('a_Backorderable').deleteCurrent()
   	needToApprove = true
}

if(needToApprove) {
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