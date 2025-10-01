/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_testerror",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_testerror",
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
  } ],
  "messages" : [ {
    "variable" : "mes",
    "message" : "Multiple Badges",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,badgingGroup,manager,mes) {
/*var logArray = new Array();
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
badgingFlagIDs.forEach(function (idf) {*/
logger.warning("TestErrorBR")
var idf = "BadgesUS3";
	//if (idf.indexOf("Badges") != -1) {
		var dataContainer = node.getDataContainerByTypeID(idf).getDataContainers();
		log.info("TestErrorBR"+dataContainer.size());
		throw "MultipleBadges";
		/*if (dataContainer.size() > 1) {
			//var error = "Multiple badges have been applied to the ";
			//error = error.concat(idf);
			//error = error.concat("  position, but only one badge is permitted per product. To resolve this, use the Reset button to remove the invalid badges before saving.");
			throw "MultipleBadges";
		}*/
	//}
//});


//EventProcessor.republish(node);
}