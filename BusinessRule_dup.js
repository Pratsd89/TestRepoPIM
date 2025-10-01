/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "dup",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "test br ppim-10882(2)",
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


currentValue = node.getValue("a_CC_Marketing_Flag_BRFS").getSimpleValue();

ctxtMarketQuery = step.getAttributeHome().getAttributeByID("a_CC_Marketing_Flag_BRFS").getListOfValues().queryValidValues();

ctxtMarketQuery.forEach(function (val) {
	
	log.info(val.getID());
	log.info(val.getValue());
	return true;
	});



var id =step.getAttributeHome().getAttributeByID("a_CC_Marketing_Flag_BRFS").getListOfValues().getListOfValuesValueByID();
	
log.info(id);

//log.info(currentValue);
//node.getValue("zz_CC_Marketing_Flag_BRFS").setSimpleValue(currentValue);
//updatedValue = node.getValue("zz_CC_Marketing_Flag_BRFS").getSimpleValue();
//log.info(updatedValue);
}