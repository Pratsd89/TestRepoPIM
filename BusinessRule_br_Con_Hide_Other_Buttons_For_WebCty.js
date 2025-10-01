/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Con_Hide_Other_Buttons_For_WebCty",
  "type" : "BusinessCondition",
  "setupGroups" : [ "SEO" ],
  "name" : "br_Con_Hide_Other_Buttons_For_WebCategory",
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
    "value" : "Stibo-PIM-SEO-Security-Group",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,SEOGroup) {
var userId = manager.getCurrentUser();
//log.info("userId  ------> "+userId );
//SEO_User_Group
//SEO User Group
var userGroups = new java.util.ArrayList();
//log.info("All groups "+userId.getAllGroups());
	userGroups.addAll(userId.getAllGroups());
	for(var n = 0 ; n < userGroups.size(); n++){
		//log.info("userGroups.get(n).getName()   " +userGroups.get(n).getName());
		//log.info("userGroups size  " +userGroups.size());
		//if(userGroups.get(n).getName() == "SEO Users Group"){	
			if(SEOGroup.isMember(userId) && userGroups.size()==1){
			return false;
		} 
		
	}

	return true ;
}