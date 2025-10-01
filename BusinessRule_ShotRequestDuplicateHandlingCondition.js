/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ShotRequestDuplicateHandlingCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Photo Shot Mandatory Check Condition",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var attributeName = node.getValue('a_Shot_Request_Type').getSimpleValue();
var attributeName1 = node.getValue('a_Shot_Code').getSimpleValue();
var attributeName2 = node.getValue('a_Shot_Type').getSimpleValue();
var attributeName3 = node.getValue('a_Shared_Markets').getSimpleValue();
if(attributeName == null || attributeName == '')
{
    return "<Mandatory Attribute Shot Request Type is Missing>";
}
else if (attributeName1 == null || attributeName1 == '')
{
    return "<Mandatory Attribute Shot Code is Missing>";
}
else if (attributeName2 == null || attributeName2 == '')
{
    return "<Mandatory Attribute Shot Type is Missing>";
}
else if (attributeName3 == null || attributeName3 == '')
{
	return "<Mandatory Attribute Shared Markets is Missing>";
}
var curr_shotCode = node.getValue('a_Shot_Code').getSimpleValue();
//var curr_market_Array = node.getValue('a_Shared_Markets').getValues().toArray();
var curr_shared_market = node.getValue('a_Shared_Markets').getSimpleValue();
//curr_market_Array = curr_market_Array.sort();
//var curr_market_Array_String = curr_market_Array.join();
var sReferencingCCs = new java.util.ArrayList();
sReferencingCCs.addAll(node.getReferencedByProducts());

if (!sReferencingCCs.isEmpty()) {
	for (var i = 0; i < sReferencingCCs.size(); i++) {
		var refCC = sReferencingCCs.get(i);
		var oStyleCC = refCC.getSource();
		var productReferences = oStyleCC.getReferences().asList();
		for(var j=0;j<productReferences.size();j++){
			var referenceTypeID = productReferences.get(j).getReferenceType().getID();
			if(referenceTypeID == 'CCToPhotoShotRef'){
				var oldTarget =productReferences.get(j).getTarget();
				if(oldTarget.getID() == node.getID()){
					continue;
				}
				var old_shotCode = oldTarget.getValue('a_Shot_Code').getSimpleValue();
				var old_lifecycle_status = oldTarget.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
				//var old_market_Array = oldTarget.getValue('a_Shared_Markets').getValues().toArray();
				var old_shared_market = oldTarget.getValue('a_Shared_Markets').getSimpleValue();
				//old_market_Array = old_market_Array.sort();
				//var old_market_Array_String = old_market_Array.join();
				if(old_shotCode == curr_shotCode && old_lifecycle_status == "Submitted" && (curr_shared_market == old_shared_market || (curr_shared_market.contains("US") && old_shared_market.contains("US")))){
					var attributes = ['a_Shot_Type','a_Shot_Request_Instructions','a_Site_Placement','a_Shared_Markets'];
					for(var  k = 0 ;k<attributes.length;k++){
						var temp = node.getValue(attributes[k]).getSimpleValue();
						oldTarget.getValue(attributes[k]).deleteCurrent();
						oldTarget.getValue(attributes[k]).setSimpleValue(temp);
					}

					
				}
				
				
				
			}
		}

		
	}

}

return true;
}