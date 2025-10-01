/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_inherit_badge",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Inherit Badge",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "WebCategoryToBadgeRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,ref) {
function checkIfLinkExists(context, badge) {
	exists = false;
	step.executeInContext(context, function (manager) {
		var context_badge = manager.getObjectFromOtherManager(badge);

		categoryList = context_badge.queryReferencedBy(ref).asList(10);
		//log.info("size " + categoryList.size() + ", ")
		//log.info(categoryList.size() > 0)
		if (categoryList.size() > 0) exists = true;;
	});
	//log.info("heree")
	return exists;
}

var coveredBadges  = new java.util.ArrayList(); 
var currentContext = step.getCurrentContext().getID();
var inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
log.info(node.getValue("a_CAN_Inherit_Option").getSimpleValue())
if (currentContext == "EN_US" && inheritCAN != null && inheritCAN != "") {
	var startDate = node.getValue("a_suppress_badge_start_date").getSimpleValue();
	var endDate = node.getValue("a_suppress_badge_end_date").getSimpleValue();
	var ca_category;
	//remove ca specific badges
	step.executeInContext("EN_CA", function (manager) {
		ca_category = manager.getObjectFromOtherManager(node);
		badgeList = ca_category.queryReferences(ref);
		badgeList.forEach(function (refInstance) {
			badge = manager.getObjectFromOtherManager(refInstance.getTarget());
			log.info(checkIfLinkExists("EN_US", badge))
			if (!checkIfLinkExists("EN_US", badge)) {
				refInstance.delete();
				badge.delete();
			} else {
				coveredBadges.add(badge);
				updateDate(badge)
			}
			return true;
		});

	})
	//link us specific badges in CA
	badgeList = node.queryReferences(ref);
	badgeList.forEach(function (refInstance) {
		badge = refInstance.getTarget();
		if(!coveredBadges.contains(badge)) {
			ca_category.createReference(badge, ref);
			updateDate(badge, startDate, endDate);
		}
		return true;

	})

}

function updateDate(badge) {
	var endDate,startDate,badgeLovId;
	brand = badge.getValue("a_Brand_Number").getSimpleValue();
	attributeId = "a_suppress_badge_" + brand;
	step.executeInContext("EN_US", function (manager) {		
		us_badge = manager.getObjectFromOtherManager(badge);
		badgeLovId = us_badge.getValue(attributeId).getID();
		startDate = us_badge.getValue("a_suppress_badge_start_date").getSimpleValue();
		endDate = us_badge.getValue("a_suppress_badge_end_date").getSimpleValue();
	});
	step.executeInContext("EN_CA", function (manager) {
		ca_badge = manager.getObjectFromOtherManager(badge);
		ca_badge.getValue(attributeId).setLOVValueByID(badgeLovId)
		value = ca_badge.getValue(attributeId).getSimpleValue()
		ca_badge.setName(value)		
		ca_badge.getValue("a_suppress_badge_start_date").setSimpleValue(startDate);
		ca_badge.getValue("a_suppress_badge_end_date").setSimpleValue(endDate);
		
		ca_badge.getValue("a_suppress_badge_old_start_date").setSimpleValue(startDate);
		ca_badge.getValue("a_suppress_badge_old_end_date").setSimpleValue(endDate);
		ca_badge.getValue("a_suppress_badge_old_value_id").setSimpleValue(badgeLovId);		
	});

}

}