/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TestBR3",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TEST_BR(2)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
/*var contextList =  ["EN_US","FR_CA","JA_JP"];
for(var i= 0 ; i < contextList.length ; i++){
	var context = contextList[i];
	manager.executeInContext(context, function(currentContextManager) {
		var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
		currentContextNode.getValue("a_Size_Chart_Name").setSimpleValue(currentContextNode.getName());
	});
}
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));*/

var DC = node.getDataContainerByTypeID('WF_StateTransitionLogDataContainer').getDataContainers().toArray();
for(var i in DC){
	DC[i].deleteLocal();
	/*var DCObject  = DC[i].getDataContainerObject();
	log.info("DCObject="+DCObject);
	DCObject.delete();*/
}

}