/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PopulateStateEntryTimestamp_forEntity",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_PopulateStateEntryTimestamp_forEntity",
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
    "contract" : "CurrentWorkflowBindContract",
    "alias" : "wfID",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (wfID,log,node,manager) {
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var dataContainerType = manager.getHome(com.stibo.core.domain.datacontainertype.DataContainerTypeHome).getDataContainerTypeByID('WF_StateTransitionEntityDataContainer');
var task = node.getWorkflowInstance(wfID).getTasks().toArray();
  for(var i =0; i<task.length;i++)
  {
  		var StateID= node.getWorkflowInstance(wfID).getTasks().toArray()[i].getState().getID();
   		var UserID= node.getWorkflowInstance(wfID).getTasks().toArray()[i].getAssignee().getID(); 
     	var dataContainer = node.getDataContainer(dataContainerType).addDataContainer();
    		var newDataContainerObject = dataContainer.createDataContainerObject('');
        
        newDataContainerObject.getValue('a_wf_id').setSimpleValue(wfID.getID());
        newDataContainerObject.getValue('a_WFStateID').setSimpleValue(StateID);
	   newDataContainerObject.getValue("a_WFStateEntryTimestamp").setSimpleValue(iso_product.format(time_product));
	   newDataContainerObject.getValue('a_WFStateTransitionUserID').setSimpleValue(UserID);

  }
    

	
	
}