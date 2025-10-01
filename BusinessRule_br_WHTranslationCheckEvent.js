/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_WHTranslationCheckEvent",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Translation Event - WH - Canada",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentEventTypeBinding",
    "alias" : "currentEvent",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "translationEvent",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "Translation",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,lookupTable,currentEvent,translationEvent) {
// PPIM-10282 - Introducing OIEP event filter for Web Hierarchy Translation - Canada 

var brandNumber = node.getValue("a_Brand_Number").getSimpleValue()

if (brandNumber == null ) {
	return false
}
else {	
	var markets = lookupTable.getLookupTableValue("LKT_Brand_Number_to_Market", brandNumber);
	if (currentEvent.getID() == translationEvent.getID() && markets.contains("CA")) {
		var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		step.executeInContext('EN_CA', function (caContextManager) {
			var caCurrentWH = caContextManager.getClassificationHome().getClassificationByID(node.getID());
			caCurrentWH.getValue("a_File_XTM_TimeStamp").setSimpleValue(iso.format(time));
		})
		return true;
	}
	else
		return false;
}
}