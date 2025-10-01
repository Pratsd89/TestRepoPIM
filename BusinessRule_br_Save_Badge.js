/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Save_Badge",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Badge",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Badge", "Temp_Badge" ],
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
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EntityBindContract",
    "alias" : "badgeRoot",
    "parameterClass" : "com.stibo.core.domain.impl.entity.FrontEntityImpl$$Generated$$6",
    "value" : "BadgesRoot",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "tagref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "TagType_To_AlternateNames",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,badgeRoot,portal,ref,tagref,LKT,webUI) {
brand = node.getValue("a_Brand_Number").getSimpleValue()
attributeId = "a_suppress_badge_" + brand;
var badgeValue = node.getValue(attributeId).getSimpleValue();
node.setName(badgeValue);

var badgeLovId = node.getValue(attributeId).getID();

//step.getEntityHome().getEntityByID(categoryid)

var category;
objectType = node.getObjectType().getID();
if (objectType == "Badge") {
    category = node.queryReferencedBy(ref).asList(10).get(0).getSource();
}
else {
    categoryid = node.getValue("a_Badge_Category").getSimpleValue();
    category = step.getClassificationHome().getClassificationByID(categoryid)
}
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var startDate = node.getValue("a_suppress_badge_start_date").getSimpleValue();
if (startDate == null) {
    var tmrwDate = new java.util.Date();
    tmrwDate.setDate(tmrwDate.getDate() + 1);

    var d = new Date(tmrwDate),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    startDate = year + "-" + month + "-" + day;
    node.getValue("a_suppress_badge_start_date").setSimpleValue(startDate);

}

var endDate = node.getValue("a_suppress_badge_end_date").getSimpleValue();

if (endDate == null) {
    endDate = "2400-01-01";
    node.getValue("a_suppress_badge_end_date").setSimpleValue(endDate);

}

if (endDate < startDate) {
    throw "End Date cannot be before Start Date";
    return;
}

//check if badge is a duplicate
category.queryReferences(ref).forEach(function (referenceInstance) {
    var badge = referenceInstance.getTarget();
    var currentstartDate = badge.getValue("a_suppress_badge_start_date").getSimpleValue();
    var currentEndDate = badge.getValue("a_suppress_badge_end_date").getSimpleValue();

    var currentBadgeValue = badge.getValue(attributeId).getSimpleValue();
    if (startDate == currentstartDate && endDate == currentEndDate && badgeValue == currentBadgeValue && node.getID() != badge.getID()) {
        log.info("deleting the badge as all the details matches")
        referenceInstance.delete();
        //delete ref from EN_CA Context as well
        deleteRefLink(badge, "EN_CA")
        badge.delete();
        return false;
    }
    return true;
});

if (objectType == "Temp_Badge") {
    var newBadge = badgeRoot.createEntity(null, "Badge");
    brand = node.getValue("a_Brand_Number").getSimpleValue();
    newBadge.getValue("a_Brand_Number").setSimpleValue(brand);
    newBadge.getValue("a_suppress_badge_start_date").setSimpleValue(startDate);
    newBadge.getValue("a_suppress_badge_end_date").setSimpleValue(endDate);
    
    newBadge.getValue("a_suppress_badge_old_start_date").setSimpleValue(startDate);
    newBadge.getValue("a_suppress_badge_old_end_date").setSimpleValue(endDate);
    newBadge.getValue("a_suppress_badge_old_value_id").setSimpleValue(badgeLovId);
    
    newBadge.setName(badgeValue);
    newBadge.getValue(attributeId).setSimpleValue(badgeValue)
    category.createReference(newBadge, "WebCategoryToBadgeRef");
    node.delete()
    node = newBadge;
}
else {
    node.getValue("a_suppress_badge_old_start_date").setSimpleValue(startDate);
    node.getValue("a_suppress_badge_old_end_date").setSimpleValue(endDate);
    node.getValue("a_suppress_badge_old_value_id").setSimpleValue(badgeLovId);
}

var currentContext = step.getCurrentContext().getID();

var ENUS_startDate = null, ENUS_endDate = null;
var ENCA_startDate = null, ENCA_endDate = null;
var today = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());

step.executeInContext("EN_US", function (manager) {
    var ENUS_category = manager.getObjectFromOtherManager(category);
    ENUS_startDate = ENUS_category.getValue("a_WebCategory_Start_Date").getSimpleValue();
    ENUS_endDate = ENUS_category.getValue("a_WebCategory_End_Date").getSimpleValue();
});

step.executeInContext("EN_CA", function (manager) {
    var ENCA_category = manager.getObjectFromOtherManager(category);
    ENCA_startDate = ENCA_category.getValue("a_WebCategory_Start_Date").getSimpleValue();
    ENCA_endDate = ENCA_category.getValue("a_WebCategory_End_Date").getSimpleValue();
});

function isActive(start, end) {
    if (start == null) return false;
    if (end == null) return true;
    return end >= today;
}

var isENUSActive = isActive(ENUS_startDate, ENUS_endDate);
var isENCAActive = isActive(ENCA_startDate, ENCA_endDate);

var canInherit = (category.getValue("a_CAN_Inherit_Option").getSimpleValue() != null && category.getValue("a_CAN_Inherit_Option").getSimpleValue() != "");


if (currentContext.equals("EN_CA")) {
    if (isENUSActive && !isENCAActive) {
        throw "Category is US exclusive. Create Badge in US context";
    } else if (isENUSActive && isENCAActive) {
        if (!canInherit) {
            //CAN exclusive, continue
            // throw "Creating badges in CAN context for a non-CAN exclusive category is not allowed. Please create in US context for this category and enable CAN Inherit option."
        } else {
            throw "Creating/Updating badges in CAN context for a non-CAN exclusive category is not allowed. Please create in US context for this category.";
        }
    } else if (!isENUSActive && isENCAActive) {
        // CAN exclusive, continue
    } else {
        throw "Category is not active in any context";
    }

} else if (currentContext.equals("EN_US")) {
    if (!isENUSActive && isENCAActive) {
        throw "Category is CAN exclusive. Create Badge in CAN context.";
    } else if (isENUSActive && !isENCAActive && canInherit) {
        portal.showAlert("WARNING", "Category is not Active in CAN market but CAN inherit option is selected, Badge will be created in CAN as well");
    }
}

if (currentContext.equals("EN_US") && canInherit) {
    step.executeInContext("EN_CA", function (manager) {
    	log.info("hereee")
        linkExists = false;
        var ENCA_category = manager.getObjectFromOtherManager(category);
        ENCA_category.queryReferences(ref).forEach(function (refInstance) {
            var badge = refInstance.getTarget();
            if (badge.getID() == node.getID()) {
                linkExists = true;
                return false;
            }
            return true;

        });
        ca_badge = manager.getObjectFromOtherManager(node);
        if (!linkExists) {
            ENCA_category.createReference(ca_badge, "WebCategoryToBadgeRef");
        }
        ca_badge.getValue(attributeId).setLOVValueByID(badgeLovId);
        value = ca_badge.getValue(attributeId).getSimpleValue();
        ca_badge.setName(value);
    	   //ca_badge.getValue(attributeId).setSimpleValue(badgeValue)       
        ca_badge.getValue("a_suppress_badge_start_date").setSimpleValue(startDate);
        ca_badge.getValue("a_suppress_badge_end_date").setSimpleValue(endDate);
        
        ca_badge.getValue("a_suppress_badge_old_start_date").setSimpleValue(startDate);
        ca_badge.getValue("a_suppress_badge_old_end_date").setSimpleValue(endDate);
        ca_badge.getValue("a_suppress_badge_old_value_id").setSimpleValue(badgeLovId);
        
        ENCA_category.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time))
        
    });
}

category.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));

portal.navigate("WebCategory_Details_Screen", category);


function deleteRefLink(node, context) {

    step.executeInContext(context, function (manager) {
        linkExists = false;
        var ENCA_category = manager.getObjectFromOtherManager(category);
        ENCA_category.queryReferences(ref).forEach(function (refInstance) {
            var badge = refInstance.getTarget();
            if (badge.getID() == node.getID()) {
                refInstance.delete();
                return false;
            }
            return true;

        });
    });
}

}