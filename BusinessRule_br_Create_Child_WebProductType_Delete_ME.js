/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_Child_WebProductType_Delete_ME",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Child Web Product Type(2)",
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
exports.operation0 = function (step,node,trigger_wpt) {
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var lovID = "LoV_" + brandNum + "_WebProductType"
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");


		
		


	var childWPT = node.getChildren().toArray(); //Children of Brand WPT object
	var size = childWPT.length; 
	childWPT.sort();

	// PPIM-10715 : Check if WPT already exists within the respective Brand WPT
	
	// PPIM-10715 : If WPT name is unique then run the existing logic, else pop error message in UI
		log.info(size)
		var lastID = childWPT[size-1].getID(); //Get the last ID of child wpt objects
		log.info(lastID);
		var lastIDNum = lastID.substring(brandNum.length()+6, lastID.length()); //Fetch the numeric part of the ID
		
		//Generate new ID based on the last ID
		var newIDNum = parseInt(lastIDNum, 10) + 1;
		if (lastIDNum.length <= 3) {
    		var zerosToAdd = 4 - newIDNum.toString().length;
    		for (var x = 0; x < zerosToAdd; x++) {
        		newIDNum = "0" + newIDNum;
    			}
		}
		/*if(lastIDNum.length() <= 3){
			newIDNum = "0" + newIDNum;
		}*/
		
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
		pacmanQueue.queueDerivedEvent(trigger_wpt,newWptClassification);
		newWptClassification.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		
	
	


}