/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Autopop_Save_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Autopop Save Action",
  "description" : "Autopop logic to be used for Bulk Update, Import, and WebUI Style Screen Save",
  "scope" : "Global",
  "validObjectTypes" : [ "Style", "WebCategory", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Autopop_WebClass_Update"
  } ],
  "pluginType" : "Operation"
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node,manager) {
var Status = node.getValue("a_Autopop_Status").getSimpleValue();
var Hold =  node.getValue("a_Autopop_Hold").getSimpleValue();
var objectType = node.getObjectType().getID();

//get current time
var now = new java.util.Date();
var fmt = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
//format current time
now = fmt.format(now);

//Set Autopop Request Date in Current Context (i.e. Only one event)
if (objectType == "Style") {
	if (Status != "In-Progress") {
		node.getValue("a_Autopop_Request_Date").setValue(now);
	}
}

var enMarkets = new Array();

var query = manager.getListOfValuesHome().getListOfValuesByID("English_Contexts_LoV").queryValidValues();
query.forEach(function (q) {
	enMarkets.push(q);
	return true;
});
//log.info("markets are: " + enMarkets[0].getID() + "," + enMarkets[1].getID());

enMarkets.forEach(function (Mkt) {
	enMarketID = Mkt.getID();

	manager.executeInContext(
		enMarketID,
		function (step) {
			if (objectType == "WebCategory" || objectType == "WebSubCategory"){
				var stepnode = step.getClassificationHome().getClassificationByID(node.getID());
				var Type = stepnode.getValue("a_WebCategory_Assortment_Type").getSimpleValue();
				var Status = stepnode.getValue("a_Autopop_Status").getSimpleValue();
				var Hold =  stepnode.getValue("a_Autopop_Hold").getSimpleValue();
				
				var now = new java.util.Date();
				var fmt = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				//format current time
				now = fmt.format(now);
					
				if (Type == "Autopop" && Status != "In-Progress") {
					stepnode.getValue("a_Autopop_Request_Date").setValue(now);
					stepnode.getValue("a_Autopop_Status").setValue("In-Progress");
	               }
	               else if (Type == "Autopop" && Status == "In-Progress" && Hold != "Yes") {
					//set hold value to yes, if not yes
					stepnode.getValue("a_Autopop_Hold").setValue("Yes");
	               }
			}
			if (objectType == "Style") {
				var stepnode = step.getProductHome().getProductByID(node.getID());
				var Status = stepnode.getValue("a_Autopop_Status").getSimpleValue();
				var Hold =  stepnode.getValue("a_Autopop_Hold").getSimpleValue();
				
				if (Status != "In-Progress") {
					stepnode.getValue("a_Autopop_Status").setValue("In-Progress");
	               }
	               else if (Status == "In-Progress" && Hold != "Yes") {
					//set hold value to yes, if not yes
					stepnode.getValue("a_Autopop_Hold").setValue("Yes");
	               }
			}               
		}
	);
});
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_Autopop_Check_Tag_Updates"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "true"
  } ],
  "pluginType" : "Precondition"
}
*/
