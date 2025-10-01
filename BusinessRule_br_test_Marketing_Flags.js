/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_test_Marketing_Flags",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "Test Marketing Flags",
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
exports.operation0 = function (manager) {
var LovValues =null;

var size = 0;
manager.executeInContext("EN_US", function(contextManager) {

LovValues = contextManager.getListOfValuesHome().getListOfValuesByID("LoV_CC_Marketing_Flags_GO").queryValidValues().asList(500).iterator();
while(LovValues.hasNext()){
     var temp = LovValues.next();
	var contextValue=temp.getValue();
	log.info(temp.getID()  + ":" + contextValue);
	size ++;
 }
	
});
log.info(size);



/*var lov = new Array();
var query = manager.getListOfValuesHome().getListOfValuesByID("LoV_CC_Marketing_Flags_ON").queryValidValues();
query.forEach(function (q) {
	lov.push(q);
	return true;
});


for(var i = 0;i<lov.length;i++){
	log.info(lov[i].getID());
	
	}*/

}