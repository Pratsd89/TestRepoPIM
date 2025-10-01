/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SEO_Release_Condition_True",
  "type" : "BusinessCondition",
  "setupGroups" : [ "SEO" ],
  "name" : "br_SEO_Release_Condition_True",
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
return condition;


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