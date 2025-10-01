/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_AN_Issue_Fix",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_AN_Issue_Fix",
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "TagType_To_AlternateNames",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,refType) {
/*function generateSequenceNumber() {
    var Entity = step.getEntityHome().getEntityByID("AlternateNameID_Generator");
    var IDCounter = Entity.getValue('a_Last_ID_Value').getSimpleValue();
    var IDCounter = parseFloat(IDCounter);
    var ID = IDCounter + 1;
    Entity.getValue('a_Last_ID_Value').setSimpleValue(ID);
    return ID;
}
var refs = node.getReferences(refType).toArray();
for (var i in refs){
	if (refs[i].getValue("a_Display_Default_Flag").getSimpleValue() == "Yes"){
		refs[i].delete();
	}
}

var name = node.getValue("DisplayDefault").getSimpleValue();
var entityRoot = step.getEntityHome().getEntityByID("AN_ON");
var ID = "AN_Object_" + generateSequenceNumber();
log.info(ID);
var newEntity = entityRoot.createEntity(ID, "AlternateNameObject");
newEntity.setName(name);
var ref = node.createReference(newEntity, refType);
ref.getValue("a_Display_Default_Flag").setSimpleValue("Yes");*/



var variantType = node.getValue("a_Variant_Type_ID").getSimpleValue();
var tagType = step.getClassificationHome().getClassificationByID(variantType);
var refs = tagType.getReferences(refType).toArray();
var altNameID = refs[0].getTarget().getID();
node.getValue("a_VariantLableID").setSimpleValue(altNameID);
	
	
}