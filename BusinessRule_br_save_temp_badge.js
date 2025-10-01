/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_save_temp_badge",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Badge(2)",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,badgeRoot,portal,ref,tagref,LKT) {
brand = node.getValue("a_Brand_Number").getSimpleValue()
attributeId = "a_badge_" + brand;
var badgeValue = node.getValue(attributeId).getSimpleValue();
node.setName(badgeValue);


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
var startDate = node.getValue("a_badge_start_date").getSimpleValue();
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
    node.getValue("a_badge_start_date").setSimpleValue(startDate);

}

var endDate = node.getValue("a_badge_end_date").getSimpleValue();

if (endDate == null) {
    endDate = "2400-01-01";
    node.getValue("a_badge_end_date").setSimpleValue(endDate);

}

if (endDate < startDate) {
    throw "End Date cannot be before Start Date";
    return;
}


//check if badge is a duplicate
category.queryReferences(ref).forEach(function (referenceInstance) {
    var badge = referenceInstance.getTarget();
    var currentstartDate = badge.getValue("a_badge_start_date").getSimpleValue();
    var currentEndDate = badge.getValue("a_badge_end_date").getSimpleValue();

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
    newBadge.getValue("a_badge_start_date").setSimpleValue(startDate);
    newBadge.getValue("a_badge_end_date").setSimpleValue(endDate);
    newBadge.setName(badgeValue);
    newBadge.getValue(attributeId).setSimpleValue(badgeValue)
    category.createReference(newBadge, "WebCategoryToBadgeRef");
    node.delete()
    node = newBadge;
}

var currentContext = step.getCurrentContext().getID();

if (currentContext.equals("EN_US") && category.getValue("a_CAN_Inherit_Option").getSimpleValue() != null) {
    step.executeInContext("EN_CA", function (manager) {
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
        if (!linkExists) {
            ENCA_category.createReference(newBadge, "WebCategoryToBadgeRef");
        }
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