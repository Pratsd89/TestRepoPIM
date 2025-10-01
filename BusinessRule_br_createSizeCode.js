/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_createSizeCode",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_createSizeCode",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeModel" ],
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
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "Name",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_SizeCode_Name</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">Name</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
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
exports.operation0 = function (node,Name,manager,webUI) {
var sizeModel = node.getID();
var sizeCode = node.getName();
var classificationID = "SC-" + sizeModel + "-" + Name;
//logger.info("classificationID:"+classificationID);

var Object = manager.getClassificationHome().getClassificationByID(classificationID);
var newObject;
if (Object == null) {
    newObject = node.createClassification(classificationID, "SizeCode");
    newObject.setName(Name);
    webUI.showAlert("INFO",  "The Size Code  has been created with ID " + '<b>' + newObject.getID() + '</b>' + ".");
} else {
    webUI.showAlert("WARN",  "The Object with ID " + '<b>' + classificationID + '</b>' + " is already present.");
}

}