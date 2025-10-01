/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PopulateStateExitTimestamp",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_PopulateStateExitTimeStamp",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Workflows" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentWorkflowBindContract",
    "alias" : "wfID",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (log,manager,node,wfID) {
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var flag =0;

var dataContainer = node.getDataContainerByTypeID('WF_StateTransitionLogDataContainer').getDataContainers().toArray();
 
     for(var n=0;n<dataContainer.length;n++)
	{    
		var task = node.getWorkflowInstance(wfID).getTasks().toArray();
 		 for(var i =0; i<task.length;i++)
 			 {
		   		var StateID= node.getWorkflowInstance(wfID).getTasks().toArray()[i].getState().getID();
		   		var WFid= wfID.getID();
		          var dataContainerObject = dataContainer[n]. getDataContainerObject();
	        		var DCstate= dataContainerObject.getValue('a_WFStateID').getSimpleValue();
	        		var DC_WFid = dataContainerObject.getValue('a_wf_id').getSimpleValue();
	        
		   		var ExitTime = dataContainerObject.getValue("a_WFStateExitTimestamp").getSimpleValue();
		   
	        		if(WFid==DC_WFid && StateID==DCstate &&  ExitTime== null)
	        		{
					dataContainerObject.getValue("a_WFStateExitTimestamp").setSimpleValue(iso_product.format(time_product));
	     		}
      
       		}
       }
     
    

	
	
}