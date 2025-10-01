/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_createDim1orDim2",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_createDim1orDim2",
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
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "Name",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\"></Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">Name</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "ObjectType",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\"></Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">ObjectType</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,Name,ObjectType,manager,webUI) {
var sizeModel = node.getParent().getID();
var sizeCode = node.getName();
var classificationID = sizeModel+"-"+sizeCode+"-"+Name+"-"+ObjectType;
var Object = manager.getClassificationHome().getClassificationByID(classificationID);
if(Object == null){
var newObject = node.createClassification(classificationID, ObjectType);
newObject.setName(Name);
} else {
	webUI.showAlert("ERROR", null, "The Object "+ ObjectType +" with name " + '<b>'+ Name +'</b>'+ " is already present.");
}

}