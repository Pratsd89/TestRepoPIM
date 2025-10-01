/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_Child_WebProductType",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Child Web Product Type",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Web_Product_Type_Brand" ],
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
    "alias" : "wptDescription",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_WPT_Description</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">a</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "wptCCSelectorLabel",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_WPT_CC_Selector_Label</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">b</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "wptDimension1Label1",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_WPT_Dimension1Label1</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">c</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "wptDimension2Label1",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_WPT_Dimension2Label1</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">d</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "wptDimension2Label2",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_WPT_Dimension2Label2</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">e</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "trigger_wpt",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_wpt",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,wptDescription,wptCCSelectorLabel,wptDimension1Label1,wptDimension2Label1,wptDimension2Label2,webUI,trigger_wpt) {
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var lovID = "LoV_" + brandNum + "_WebProductType"
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");


if((wptDescription == null) || (wptCCSelectorLabel == null) || (wptDimension1Label1 == null) ){
	webUI.showAlert("ERROR", "WPT was not created. Please ensure that values for all three required attributes have been filled : WPT Description, Web Product Type CC Selector Label and Web Product Type Dimension 1 Label 1");
}
else {
	var childWPT = node.getChildren().toArray(); //Children of Brand WPT object
	var size = childWPT.length; 
	childWPT.sort();

	// PPIM-10715 : Check if WPT already exists within the respective Brand WPT
	var isUniqueName = true
	childWPT.forEach( function(wpt) {
		var existingName = wpt.getValue('a_WPT_Description').getSimpleValue();
		if (existingName != null) {
			if (existingName.trim().toUpperCase() == wptDescription.trim().toUpperCase()) {
				isUniqueName = false
			}	
		}
	})
	// PPIM-10715 : If WPT name is unique then run the existing logic, else pop error message in UI
	if(isUniqueName){
		var lastID = childWPT[size-1].getID(); //Get the last ID of child wpt objects
		var lastIDNum = lastID.substring(brandNum.length()+6, lastID.length()); //Fetch the numeric part of the ID
		
		//Generate new ID based on the last ID
		var newIDNum = parseInt(lastIDNum, 10) + 1;
		if (lastIDNum.length() <= 3) {
    		var zerosToAdd = 4 - newIDNum.toString().length;
    		for (var x = 0; x < zerosToAdd; x++) {
			newIDNum = "0" + newIDNum;
		}
		}
		
		var newID = "WPT_" + brandNum + "_" + newIDNum;
		
		//Create new wpt classification and populate the values
		var wptBrand = step.getClassificationHome().getClassificationByID(node.getID());
		var newWptClassification = wptBrand.createClassification(newID,"Web_Product_Type");
		newWptClassification.getValue("a_WPT_Description").setSimpleValue(wptDescription);
		newWptClassification.getValue("a_WPT_CC_Selector_Label").setSimpleValue(wptCCSelectorLabel);
		newWptClassification.getValue("a_WPT_Dimension1Label1").setSimpleValue(wptDimension1Label1);
		newWptClassification.getValue("a_WPT_Dimension2Label1").setSimpleValue(wptDimension2Label1);
		newWptClassification.getValue("a_WPT_Dimension2Label2").setSimpleValue(wptDimension2Label2);
		newWptClassification.getValue("a_Brand_Number").setSimpleValue(brandNum);
		newWptClassification.setName(wptDescription);
		
		
		//Add new WPT description value with ID generated to the respective LOV
		var fetchLov = step.getListOfValuesHome().getListOfValuesByID(lovID);
		fetchLov.createListOfValuesValue(wptDescription, null, newID);
		
		newWptClassification.approve();
		//pacmanQueue.queueDerivedEvent(trigger_wpt,newWptClassification);
		newWptClassification.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	
	} else{
		webUI.showAlert("ERROR", "Web Product Type is case-insensitive. Found <b>"+ wptDescription +"</b> already present in "+ brandNum +" WPT Brand.");
	
	} 
}

}