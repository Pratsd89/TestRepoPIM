/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_checkCCNameChangeEventJapan",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check CC Name Change Event - Japan",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
exports.operation0 = function (node,step,currentEvent,translationEvent) {
/*
 logger.info("CurrentEvent = " + currentEvent);
logger.info("CurrentEvent ID = " + currentEvent.getID());
logger.info("translationEvent = " + translationEvent);
logger.info("translationEvent ID = " + translationEvent.getID());
*/
// if event = Translation && market designation = JPN, return true, else return false

var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();

if (currentEvent.getID() == translationEvent.getID() && marketDesignation.contains("JPN")) {
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	step.executeInContext('EN_JP', function (jaContextManager) {
		var jaCurrentProduct = jaContextManager.getProductHome().getProductByID(node.getID());
		jaCurrentProduct.getValue("a_File_XTM_TimeStamp").setSimpleValue(iso.format(time));
	})
	return true;
}
else {
	return false;
}

}