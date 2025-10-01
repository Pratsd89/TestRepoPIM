/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Verify_ASLRDataContainerCheck",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Verify ASLR Data Container Check",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Class", "Department", "Division", "SubClass" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "attShotCode",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Shot_Code",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "attShotType",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Shot_Type",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "attSitePlacement",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_ASLR_Site_Placement",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,attShotCode,attShotType,attSitePlacement,manager) {
var aslrContainers = node.getDataContainerByTypeID("a_ASLR_Data_Container").getDataContainers();
logger.info(aslrContainers.size());
var itrtr = aslrContainers.iterator();
while(itrtr.hasNext())
{
	var aslrEntry = itrtr.next().getDataContainerObject();
	if(aslrEntry.getValue("a_Shot_Code").getSimpleValue() == null || aslrEntry.getValue("a_Shot_Code").getSimpleValue() == "" ||
		aslrEntry.getValue("a_Shot_Type").getSimpleValue() == null || aslrEntry.getValue("a_Shot_Type").getSimpleValue() == "" ||
		aslrEntry.getValue("a_ASLR_Site_Placement").getSimpleValue() == null || aslrEntry.getValue("a_ASLR_Site_Placement").getSimpleValue() == "")
		{
			logger.info("Mandatory value missing");
			return false;
		}
}

logger.info("No mandatory value missing");
return true;
}