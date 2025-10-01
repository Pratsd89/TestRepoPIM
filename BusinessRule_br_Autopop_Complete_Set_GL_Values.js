/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Autopop_Complete_Set_GL_Values",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Autopop Complete Set GL Values",
  "description" : "Set Autopop Complete Date, Status value for EN_US & EN_CA Contexts",
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,logger) {
/**
* This rule works as follows:
* Set Autopop Complete Date, Status value for EN_US & EN_CA Contexts
**/

var objectType = node.getObjectType().getID();
var Hold = node.getValue("a_Autopop_Hold");
var now = new java.util.Date();
var fmt = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
now = fmt.format(now);

if (Hold == "Yes") {
	node.getValue("a_Autopop_Request_Date").setValue(now);
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
				var Hold = stepnode.getValue("a_Autopop_Hold");
				
				stepnode.getValue("a_Autopop_Complete_Date").setValue(now);
				
				if (Hold != "Yes") {
	               	stepnode.getValue("a_Autopop_Status").setValue('Complete');
	               }
	               if (Hold == "Yes") {
	               	stepnode.getValue("a_Autopop_Hold").setValue("No");
	               }
			}
			if (objectType == "Style"){
				var stepnode = step.getProductHome().getProductByID(node.getID());
				var Hold = stepnode.getValue("a_Autopop_Hold");
				
				stepnode.getValue("a_Autopop_Complete_Date").setValue(now);
				
				if (Hold != "Yes") {
	               	stepnode.getValue("a_Autopop_Status").setValue('Complete');
	               }
	               if (Hold == "Yes") {
	               	stepnode.getValue("a_Autopop_Hold").setValue("No");
	               }
			}               
		}
	);
});
}