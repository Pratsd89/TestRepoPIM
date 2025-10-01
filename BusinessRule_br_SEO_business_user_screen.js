/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_business_user_screen",
  "type" : "BusinessCondition",
  "setupGroups" : [ "SEO" ],
  "name" : "br_SEO_business_user_screen",
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
var context = manager.getCurrentContext().getID();
log.info("userId  ------> " + userId);
//SEO_User_Group
//SEO User Group
/*var userGroups = new java.util.ArrayList();
log.info("All groups "+userId.getAllGroups());
    userGroups.addAll(userId.getAllGroups());
    for(var n = 0 ; n < userGroups.size(); n++){
        log.info("userGroups.get(n).getName()   " +userGroups.get(n).getName());
        if(userGroups.get(n).getName() == "SEO Users Group"){
            log.info("tabs are disabled ");
            return true;
        }
    	
    }

    return false ;*/

if (context != "EN_SA") {
    if (SEOGroup.isMember(userId)) {
        return false;
    }
    else {
        return true;
    }
}
else {
	return false;
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_SEO_Release_Condition_True"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "true"
  } ],
  "pluginType" : "Operation"
}
*/
