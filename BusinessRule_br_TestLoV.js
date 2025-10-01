/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_TestLoV",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "Test LoV",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeCode" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
//var fetchLov = step.getListOfValuesHome().getListOfValuesByID(lovID);
 //node.getValue("Tag_Outbound_Variable").setSimpleValue(fetchLov.getID());

// node.getValue("a_SizeCodeVariant").addLOVValueByID(6);

 //step.getAttributeHome().getAttributeByID("a_Shared_Markets").getListOfValues().queryValidValues();

/* var ctxtMarketQuery = step.getAttributeHome().getAttributeByID("a_SizeCodeVariant").getListOfValues().queryValidValues();

				ctxtMarketQuery.forEach(function (val) {
					log.info("\n -- val.getID() is: " + val.getID());
					//lo.push("\n -- val.getValue() is: " + val.getValue());

					return true;
				});*/


//var text = step.getAttributeHome().getAttributeByID("a_SizeCodeVariant").getListOfValues().getListOfValuesValueByID("6").getValue();
//log.info(text);
//node.getValue("a_SizeCodeVariant").addLOVValueByID(text);

var templateClassification=step.getClassificationHome().getClassificationByID(node.getID());

templateClassification.getValue('a_SizeCodeVariant').setLOVValueByID("2");
}