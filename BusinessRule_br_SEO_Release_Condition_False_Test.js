/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Release_Condition_False_Test",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_SEO_Release_Condition_False_Test",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,LookupTableHome,SEOlib) {
var condition = SEOlib.SEOcheckcondition(step,LookupTableHome,node);
log.info("condition=" + condition);

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


if (newCount >0)
{
	return false ;
}else if(condition == false){
	return true
}else if (condition == true)
{
return false;
}

/*function SEOcheckcondition(step,LookupTableHome,node) {
    
    var count = 0;
    var userId = step.getUserHome().getUserByID("SRISAILAM_POLEBONI@GAP.COM");
    log.info("userId=" + userId);
    var userGroups = userId.getAllGroups().toArray();
    for (var i in userGroups) {
        var BrandValue = userGroups[i].getValue("a_Brand_Number").getSimpleValue();
        if (BrandValue != null) {
        	   var AllowedBrands = LookupTableHome.getLookupTableValue("LKT_SEOConfigManagementbyBrand","AllowedBrand");        	   
            log.info("BrandValue=" + BrandValue);
            var nodeBrand = node.getValue("a_Brand_Number").getSimpleValue();
            if (AllowedBrands.contains(BrandValue) && AllowedBrands.contains(nodeBrand)) {
            	log.info("AllowedBrands=" + AllowedBrands);
                count = count + 1
            }
        }
        
        var UserGroupID = userGroups[i].getID();
        log.info("UserGroupID=" + UserGroupID);
        if (UserGroupID == "Stibo" || UserGroupID == "Super user" || UserGroupID == "SEO-PIM-Group" ) {
                count = count + 1
            }
    }
    log.info("count="+count);
    if (count > 0) {
        return true;
    } else {
        return false;
    }

}*/
}