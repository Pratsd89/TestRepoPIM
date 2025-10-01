/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CreateProductTagValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CreateProductTagValue",
  "description" : "Creates Product Tag Values under a Product Tag Type",
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Tag_Type" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ID_Generator_Library",
    "libraryAlias" : "IDGeneratorLibrary"
  } ]
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
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "productTagValue",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Product_Tag</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">a</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,webUI,productTagValue,IDGeneratorLibrary) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
IDGeneratorLibrary.setIDValue(node,step,'ProductTagIDGenerator','a_Product_Tag_ID');
var lovID = node.getID().substring(4);
var tagTypeName = node.getName();
if(productTagValue == null){
	webUI.showAlert("ERROR", "Product Tag was not created. Please ensure that values for required attribute have been filled : Product Tag Name");
}
else {
	//Children of Brand ProductTagTypes object
	var childProductTags = node.getChildren().toArray(); 
	var size = childProductTags.length;
	childProductTags.sort();
	var isUniqueName = true
	childProductTags.forEach( function(tagTypes) {
		var existingName = tagTypes.getValue('a_Product_Tag').getSimpleValue();
		if (existingName != null) {
			if (existingName.trim().toUpperCase() == productTagValue.trim().toUpperCase()) {
				isUniqueName = false
			}
		}
	})
	if(isUniqueName){
		//Create new Product Tag Types classification and populate the values
		var fetchLov = step.getListOfValuesHome().getListOfValuesByID(lovID);
		if (fetchLov != null){
		var productTag = step.getClassificationHome().getClassificationByID(node.getID());
		var newID = "PT-" + productTag.getValue("a_Product_Tag_ID").getSimpleValue();
		var newTagClassification = productTag.createClassification(newID,"Product_Tag_Value");
		newTagClassification.getValue("a_Product_Tag").setSimpleValue(productTagValue);
		newTagClassification.setName(productTagValue);
		//Add new PT value with ID generated to the respective LOV
		fetchLov.createListOfValuesValue(productTagValue, null, productTag.getValue("a_Product_Tag_ID").getSimpleValue());
		newTagClassification.approve();
         	newTagClassification.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
         	var productTagRoot=step.getClassificationHome().getClassificationByID("Product_Tags_Root");
          productTagRoot.getValue("Tag_Outbound_Variable").setSimpleValue(fetchLov.getID());
		webUI.showAlert("SUCCESS", "Product Tag is created successfully");		
		}
		else{
			webUI.showAlert("ERROR", tagTypeName+ " LOV is not yet created at backend. Please wait or reach out to stibo dev team.");
		}
	}
		else{
		webUI.showAlert("ERROR", " Product Tag is case-insensitive. Found <b>"+productTagValue+"</b> already present");
	}
}

}