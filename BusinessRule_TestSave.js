/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TestSave",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TESTSave",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "badgingGroup",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_badge_details",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "EventProcessor",
    "parameterClass" : "com.stibo.core.domain.impl.eventprocessor.EventProcessorImpl",
    "value" : "step://eventprocessor?id=EP_BadgingPublish",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,badgingGroup,manager,EventProcessor) {
var logArray = new Array();
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var badgingFlags = badgingGroup.getDataContainerTypes().toArray();
var badgingFlagIDs = new Array();
badgingFlags.forEach(function (flag) {
	badgingFlagIDs.push(flag.getID());
});
var currentContext = manager.getCurrentContext().getID();
const [currLang, currMkt] = currentContext.split("_");
var pattern = new RegExp(currMkt);
var loop = 0;
for (var x = 0; x <= badgingFlagIDs.length - 1; x++) {
	if (!pattern.test(badgingFlagIDs[x])) {
		badgingFlagIDs.splice(x, 1);
		x--
	}
	loop++
	if (loop > 100) {
		break;
	}
}

log.info(badgingFlagIDs);
badgingFlagIDs.forEach(function (idf) {
	if (idf.indexOf("Badges") != -1) {
		var dataContainer = node.getDataContainerByTypeID(idf).getDataContainers().toArray();
		if (dataContainer.length > 1) {
			var error = "Multiple badges have been applied to the ";
			error = error.concat(idf);
			error = error.concat("  position, but only one badge is permitted per product. To resolve this, use the Reset button to remove the invalid badges before saving.");
			throw "Errorgyvghv";
		}
		else if (dataContainer.length == 1) {
			var correctBrand = "a_badge_" + brandNum;
			var dataContainerObj = dataContainer[0].getDataContainerObject();
			var brandValue = dataContainerObj.getValue(correctBrand).getSimpleValue();
			if (brandValue != null) {
				var allBrands = ["GO", "AT", "BR", "ON", "BRFS", "GAP"];
				for (var i = 0; i < allBrands.length; i++) {
					if (allBrands[i] != brandNum) {
						var eachBrandValue = "a_badge_" + allBrands[i];
						var currentValue = dataContainerObj.getValue(eachBrandValue).getSimpleValue();
						if (currentValue != null) {
							var error = "The badge for the ";
							error = error.concat(idf);
							error = error.concat("  position has been assigned to the incorrect brand. Please use the Reset button to correct this before saving.");
							throw error;
						}
					}
				}
			}
			else {
				var error = "The badge for the ";
				error = error.concat(idf);
				error = error.concat("  position has not been assigned. Please use the Reset button to correct this before saving.");
				throw error;
			}

		}
	}
});


EventProcessor.republish(node);
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node) {
if(node.getObjectType().getID()=='WebDivision'||node.getObjectType().getID()=='WebCategory'||node.getObjectType().getID()=='WebSubCategory'){
var categoryDescription = node.getValue("a_Category_Description").getSimpleValue();
if(categoryDescription!=null){
	return true;
} else {return false;
}
}else {
	return true;
}

}