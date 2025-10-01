/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Hide_Inheritace_Attributes_For_GAPS",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_Hide_Inheritace_Attributes_For_GAPS",
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
    "contract" : "UserGroupBindContract",
    "alias" : "GPSMerchant",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "GPS-PIM-Lead-MC-Security-Group",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,GPSMerchant,manager) {
var userId = manager.getCurrentUser();
var userGroups = userId.getAllGroups().toArray();
var brand = node.getValue("a_Brand_Number").getSimpleValue();
var count =0 ; 
for (var i in userGroups) {
		var userGrp = userGroups[i];
		if ( userGrp.getName()== "GPS-PIM-Lead-MC-Security-Group-NonProd" || userGrp.getName()== "GPS-PIM-Lead-MC-Security-Group" )
		{
		count ++ ; 
		}
}
	
if(count >0 ){
return true ;
} 
//Added below line when GPSA user started seeing 2 category attributes
return false;
}