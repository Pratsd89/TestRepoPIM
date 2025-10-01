/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DeleteBadges",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Delete Badges",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "WebCategoryToBadgeRef",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "setMainLastUpdateDate",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_SetMainLastUpdateDateAllObj",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (stepManager,ref,setMainLastUpdateDate) {
function removeLink(context,badge) {
    stepManager.executeInContext(context, function(manager) {
        var context_badge = manager.getObjectFromOtherManager(badge);
        categoryList = context_badge.queryReferencedBy(ref).asList(10);
        if (categoryList.size() > 0) {
        	var cat = categoryList.get(0).getSource();
            categoryList.get(0).delete();
            setMainLastUpdateDate.execute(cat);
        }

    });
  }


var today = new java.util.Date();
today.setDate(today.getDate() - 1);
var dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");
var badgeRoot = stepManager.getEntityHome().getEntityByID("BadgesRoot");
var badgeList = badgeRoot.getChildren().iterator();
var deletedCount = 0;

while (badgeList.hasNext()) {
    var badge = badgeList.next();
    badgeID=badge.getID()
    var startUS = null;
    var startCA = null;
    var endUS = null;
    var endCA = null;

    stepManager.executeInContext("EN_US", function (mgrUS) {
        var usBadge = mgrUS.getEntityHome().getEntityByID(badgeID);
        if(usBadge.queryReferencedBy(ref).asList(10).size() == 0){
        	return;
        }
        var usCat = usBadge.queryReferencedBy(ref).asList(10).get(0).getSource();
        var usCatStartDate  = usCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
        var usCatEndDate = usCat.getValue("a_WebCategory_End_Date").getSimpleValue();
        if ( usCatStartDate == null || usCatStartDate == "") {
        	startUS = null;
        	endUS = dateFormat.parse("1900-01-01");
        }
        else if(usCatEndDate == null){
        	startUS = usBadge.getValue("a_suppress_badge_start_date").getSimpleValue();
        endUS = usBadge.getValue("a_suppress_badge_end_date").getSimpleValue();	
        }
        else if(!dateFormat.parse(usCatEndDate).after(today)){
        	startUS = null;
        	endUS = dateFormat.parse("1900-01-01");
        }
        else{
        startUS = usBadge.getValue("a_suppress_badge_start_date").getSimpleValue();
        endUS = usBadge.getValue("a_suppress_badge_end_date").getSimpleValue();	
        }
    });

    stepManager.executeInContext("EN_CA", function (mgrCA) {
        var caBadge = mgrCA.getEntityHome().getEntityByID(badgeID);
        if(caBadge.queryReferencedBy(ref).asList(10).size() == 0){
        	return;
        }
        var caCat = caBadge.queryReferencedBy(ref).asList(10).get(0).getSource();
        var caCatStartDate  = caCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
        var caCatEndDate = caCat.getValue("a_WebCategory_End_Date").getSimpleValue();
        if ( caCatStartDate == null || caCatStartDate == "") {
        	startCA = null;
        	endCA = dateFormat.parse("1900-01-01");
        }
        else if(caCatEndDate == null){
        startCA = caBadge.getValue("a_suppress_badge_start_date").getSimpleValue();
        endCA = caBadge.getValue("a_suppress_badge_end_date").getSimpleValue();	
        }
        else if(!dateFormat.parse(caCatEndDate).after(today)){
        	startCA = null;
        	endCA = dateFormat.parse("1900-01-01");
        }
        else{
        startCA = caBadge.getValue("a_suppress_badge_start_date").getSimpleValue();
        endCA = caBadge.getValue("a_suppress_badge_end_date").getSimpleValue();	
        }
    });

    if (endUS && (typeof endUS === "string" || endUS instanceof java.lang.String)) {
        try { endUS = dateFormat.parse(endUS); } catch (_) { endUS = null; }
    }
    if (endCA && (typeof endCA === "string" || endCA instanceof java.lang.String)) {
        try { endCA = dateFormat.parse(endCA); } catch (_) { endCA = null; }
    }
    if (startUS && !startCA) {
        if (endUS && !endUS.after(today)) {
        	removeLink("EN_US",badge);
        	removeLink("EN_CA",badge);        	
            badge.delete();
            deletedCount++;
        }
    } else if (!startUS && startCA) {
        if (endCA && !endCA.after(today)) {
        	removeLink("EN_US",badge);
        	removeLink("EN_CA",badge);  
            badge.delete();
            deletedCount++;
        }
    } else if (startUS && startCA) {
        if (endUS && endCA) {
            var later = endUS.after(endCA) ? endUS : endCA;
            if (!later.after(today)) {
        	removeLink("EN_US",badge);
        	removeLink("EN_CA",badge);  
                badge.delete();
                deletedCount++;
            }
        }
    }
}

log.info("Total badges deleted: " + deletedCount);
}