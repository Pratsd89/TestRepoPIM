/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_Prdt_Tag_Type_Classification",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Create_Prdt_Tag_Type_Classification",
  "description" : "Creation of Product Tag Type Classification",
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Tag_Root" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "productTagTypeName",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Product_Tag_Type</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">a</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "triggerProductTagType",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_Product_Tag_Types",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "stiboLovQueue",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,productTagTypeName,webUI,triggerProductTagType,stiboLovQueue) {

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
if (productTagTypeName == null) {
	webUI.showAlert("ERROR", null, "ProductTagType was not created. Please ensure that values for required attribute have been filled : Product Tag Type Name");
}
else {
	var childProductTagTypes = node.getChildren().toArray(); //Children of ProductTagTypes object
	var size = childProductTagTypes.length;
	childProductTagTypes.sort();
	var isUniqueName = true
	childProductTagTypes.forEach(function (tagTypes) {
		var existingName = tagTypes.getValue('a_Product_Tag_Type').getSimpleValue();
		if (existingName != null) {
			if (existingName.trim().toUpperCase() == productTagTypeName.trim().toUpperCase()) {
				isUniqueName = false
			}
		}
	})
	if (isUniqueName) {
		var newID = "PTT-" + productTagTypeName;
		//Create new Product Tag Types classification and populate the values
		var productTagTypes = step.getClassificationHome().getClassificationByID(node.getID());
		var newTagTypeClassification = productTagTypes.createClassification(newID, "Product_Tag_Type");
		newTagTypeClassification.getValue("a_Product_Tag_Type").setSimpleValue(productTagTypeName);
		newTagTypeClassification.setName(productTagTypeName);
		newTagTypeClassification.approve();
		//Sending Email alerts for creation of LOV, once the classification is created
		stiboLovQueue.queueDerivedEvent(triggerProductTagType, newTagTypeClassification);
		newTagTypeClassification.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		webUI.showAlert("SUCCESS", null, "Product Tag Type is recorded. Please wait for the dev team to create it at the backend.");
	}
	else {
		webUI.showAlert("ERROR", null, " Product Tag Type is case-insensitive. Found <b>" + productTagTypeName + "</b> already present");
	}
}

}