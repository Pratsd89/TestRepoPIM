/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Release_Condition_True_Test",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_SEO_Release_Condition_True_Test",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "SEOlib"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LookupTableHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "gpsNonProd",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "GPS-PIM-Lead-MC-Security-Group-NonProd",
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "gpsProd",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "GPS-PIM-Lead-MC-Security-Group",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,LookupTableHome,gpsNonProd,gpsProd,SEOlib) {
// if condition is true then display the tab else no 
var condition = SEOlib.SEOcheckcondition(step,LookupTableHome,node);
//overwriting the condition if the user belong to GPS-PIM-Lead-MC-Security-Group-NonProd or GPS-PIM-Lead-MC-Security-Group 
	var userId = step.getCurrentUser();
    var userGroups = userId.getAllGroups().toArray();
	// intiating the count as Zero and it will increase if the user has the at least one of the above mentioned roles 
	var newCount = 0;
    for (var i in userGroups) {
        var usrGrpName = userGroups[i].getName();
		if (usrGrpName == "GPS-PIM-Lead-MC-Security-Group-NonProd" ||  usrGrpName == "GPS-PIM-Lead-MC-Security-Group" )
		{
		newCount ++;
		} 
	}	
// If the count is more than one that means user is belog to one of the group GPS-PIM-Lead-MC-Security-Group-NonProd or GPS-PIM-Lead-MC-Security-Group then return false other wise return condition from SEOlib
	if (newCount >0)
	{
		return false ;
	}
	return condition
	
}