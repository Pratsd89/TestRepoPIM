/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Test_Business_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Test_Business_Action",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "tagref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "TagType_To_AlternateNames",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,tagref) {
node.queryReferences(tagref).forEach(function (referenceInstance) {

//	log.info(referenceInstance.getValue("a_Display_Default_Flag").getSimpleValue())

if(referenceInstance.getValue("a_Display_Default_Flag").getSimpleValue() == "No"){
		var obj = referenceInstance.getTarget();
        	referenceInstance.delete();
		obj.delete();

}

return true;

});
 
}