/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TestDev2",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test Dev 2",
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "Name",
    "message" : "Message",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,Name) {
// JavaScript object
//var json = {};
//json.status = true;
//json.prefix = "A prefix";


try 
{
     var val=node.getValue("Name").getSimpleValue();
	//var val2=node.getValue("Style Number").getSimpleValue();
	log.info(val);
	return val;
} 
catch(e) 
{
	log.info(e);
     throw(e); 
}


}
/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateAddAttributeLink",
  "parameters" : [ {
    "id" : "AttributeId",
    "type" : "java.lang.String",
    "value" : "a_CC_Name"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "SetAttributeValueBusinessAction",
  "parameters" : [ {
    "id" : "FromAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_CC_Name"
  }, {
    "id" : "FromWorkflow",
    "type" : "com.stibo.core.domain.state.unstable.stateflow.StateFlow",
    "value" : null
  }, {
    "id" : "FromWorkflowVariableName",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "TextValue",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "ToAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_CC_Name"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateSetName",
  "parameters" : [ {
    "id" : "Formula",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "Value",
    "type" : "java.lang.String",
    "value" : "GAP IT Services"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "SendEmailBusinessAction",
  "parameters" : [ {
    "id" : "Body",
    "type" : "java.lang.String",
    "value" : "Test message"
  }, {
    "id" : "Recipients",
    "type" : "java.util.List",
    "values" : [ "@devojoyti_pal@gap.com" ]
  }, {
    "id" : "Sender",
    "type" : "com.stibo.util.basictypes.EmailRecipient",
    "value" : "@devojoyti_pal@gap.com"
  }, {
    "id" : "Subject",
    "type" : "java.lang.String",
    "value" : "Testing mail"
  } ],
  "pluginType" : "Operation"
}
*/
