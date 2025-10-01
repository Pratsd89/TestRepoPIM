/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Checking_And_Creating_New_ASLR_Entity",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Checking And Creating New ASLR Entity",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Brand", "Class", "Department", "Division", "SubClass" ],
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ASLRRef",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EntityBindContract",
    "alias" : "ASLREntityRoot",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "ASLREntityObject",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,ASLRRef,ASLREntityRoot,ASLREntityObject) {
var references = node.getReferences(ASLRRef).toArray();
if(references.length !=0){
		
		return "An ASLR Entity is already linked with the Category. Please remove it and try again.";
}

var newASLREntity = ASLREntityRoot.createEntity('', ASLREntityObject);
node.createReference(newASLREntity,ASLRRef);
newASLREntity.approve();
return true;
}