/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test12345",
  "type" : "BusinessCondition",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "Test12345",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var ObjectType = node.getObjectType().getID();
var Brand = node.getValue("a_Brand_Number").getSimpleValue();
var LifeCycleStatus = node.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
if(ObjectType == "CustomerChoice" && Brand == "ON" && LifeCycleStatus == "In Progress" ){
	var ColorSellingSeasonCode = node.getValue("a_Source_CC_Selling_Season_Code").getSimpleValue();
	ColorSellingSeasonCode = ColorSellingSeasonCode.slice(0,1).toString();	
   var Compstring = ["J","F","M","A","Y","U","L","G","S","O","N","D"];
   for (var i in Compstring){
   	log.info("Compstring="+Compstring[i]);
   	log.info("ColorSellingSeasonCode="+ColorSellingSeasonCode);
   	if(ColorSellingSeasonCode == Compstring){
   		log.info("2");
   		var CCPublicationDate  = node.getValue("a_CC_Start_Date").getSimpleValue();
   		log.info(CCPublicationDate);
   		return true;
   	}
   }
}

}