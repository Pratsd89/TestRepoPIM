/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CCMandatoryAttributeCheck",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CCMandatoryAttributeCheck",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "agRequired",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_Required_CC_Attributes",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,agRequired) {
var result = true;
var obj = node.getObjectType().getID();
if(obj == "CustomerChoice"){
	var sAttributes = new java.util.ArrayList();
	sAttributes.addAll(agRequired.getAllAttributes());
	for (var i=0;i<sAttributes.size();i++){
		var attr = sAttributes.get(i).getID();
		var val = node.getValue(attr).getSimpleValue();
		if(val == null || val == ''){
			var msg = "Mandatory "+attr+" is missing";
			node.getValue("a_error_message").setSimpleValue(msg);
			result = "Missing mandatory attribute "+attr+". Completeness Check failed.";			
			}
		}
	}
	else{
		result = "The object is not a CC";
		}
	return result;
	
}