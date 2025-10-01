/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Delete_Duplicate_Badges",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Delete_Duplicate_Badges",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "WebCategoryToBadgeRef",
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (ref,node) {
brand = node.getValue("a_Brand_Number").getSimpleValue()
attributeId = "a_badge_" + brand;
var badgerefs = node.queryReferences(ref).asList(10000);


var flagList = [];
for (var i = 0; i < badgerefs.size(); i++) {
  flagList[i] = 0;
}

for (var i = 0; i < badgerefs.size() - 1; i++) {
  badge = badgerefs.get(i).getTarget();
  var currentstartDate = badge.getValue("a_badge_start_date").getSimpleValue();
  var currentEndDate = badge.getValue("a_badge_end_date").getSimpleValue();
  var currentBadgeValue = badge.getValue(attributeId).getSimpleValue();

  for (var j = i + 1; j < badgerefs.size(); j++) {
    badge1 = badgerefs.get(j).getTarget();
    var startDate = badge1.getValue("a_badge_start_date").getSimpleValue();
    var EndDate = badge1.getValue("a_badge_end_date").getSimpleValue();
    var BadgeValue = badge1.getValue(attributeId).getSimpleValue();
    log.info(j)
    if (startDate == currentstartDate && EndDate == currentEndDate && BadgeValue == currentBadgeValue) {
      flagList[j] = 1;
    }
  }
}

//log.info(flagList)
for (var i = 0; i < flagList.length; i++) {
  if (flagList[i] == 1) {
    //log.info(badgerefs.get(i).getTarget().getID())
    var targetBadge = badgerefs.get(i).getTarget();
    badgerefs.get(i).delete()
    targetBadge.delete()
  }
}

}