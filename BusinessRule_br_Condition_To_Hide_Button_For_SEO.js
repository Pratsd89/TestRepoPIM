/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Condition_To_Hide_Button_For_SEO",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_Condition_To_Hide_Button_For_SEO",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "SEOGroup",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "SEO-PIM-Group",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,SEOGroup) {
var userId = manager.getCurrentUser();
////SEO_User_Group
////SEO User Group
//userGroups.get(n).getName() == "SEO Users Group"
var userGroups = new java.util.ArrayList();
	userGroups.addAll(userId.getAllGroups());
	log.info(userGroups.size());
	for(var n = 0 ; n < userGroups.size(); n++){
		
		if( userGroups.size()==1 && SEOGroup.isMember(userId)){
			log.info("tabs are disabled ");
			return false;
		}
		
	}

	return true ;
}