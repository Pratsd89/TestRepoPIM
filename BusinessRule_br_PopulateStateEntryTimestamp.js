/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PopulateStateEntryTimestamp",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_PopulateStateEntryTimestamp",
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
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Del_wf_StateTransitionLogDC"
  } ],
  "pluginType" : "Operation"
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
exports.operation1 = function (wfID,log,node,manager) {
log.info("STATETEST1="+node.getID());
logger.warning("STATETEST1="+node.getID());
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var flag=0;

var dataContainerType = manager.getHome(com.stibo.core.domain.datacontainertype.DataContainerTypeHome).getDataContainerTypeByID('WF_StateTransitionLogDataContainer');
var task = node.getWorkflowInstance(wfID).getTasks().toArray();
var ExistingdataContainer = node.getDataContainerByTypeID('WF_StateTransitionLogDataContainer').getDataContainers().toArray();

  for(var i =0; i<task.length;i++)
  {
  		var StateID= node.getWorkflowInstance(wfID).getTasks().toArray()[i].getState().getID();
   		var UserID= node.getWorkflowInstance(wfID).getTasks().toArray()[i].getAssignee().getID();
    		var WFid= wfID.getID();
    	     
	     
	for(var n=0;n<ExistingdataContainer.length;n++)
	{
		var dataContainerObject = ExistingdataContainer[n]. getDataContainerObject();
		var DCstate= dataContainerObject.getValue('a_WFStateID').getSimpleValue();
	     var DC_WFid = dataContainerObject.getValue('a_wf_id').getSimpleValue();
	     var Entry=dataContainerObject.getValue("a_WFStateEntryTimestamp").getSimpleValue();
	     var Entry1=iso_product.format(time_product);
	     
		if(WFid==DC_WFid && StateID==DCstate && Entry1==Entry)
		{
			flag=1;
			break;
		}
	}
	
        if (flag==0 && StateID!='NewStyleEnrich_WebMerchandising' && StateID!='NewStyleEnrich_Copy' && StateID!='NewStyleEnrichParallelState') 
        {
        	if( StateID!='NewCCEnrichParallelState' && StateID!='NewCCEnrich_Photo' && StateID!='NewCCEnrich_Copy')
        	{
        var dataContainer = node.getDataContainer(dataContainerType).addDataContainer();
        var exceedCon = false;
        try{
    	   var newDataContainerObject = dataContainer.createDataContainerObject('');
    	   }
    	   catch(e){
    	   	if (e.javaException instanceof com.stibo.core.domain.impl.datacontainer.DataContainerLimitExceededException){
    	   		log.info("The number of data containers has been exceeded");
    	   		exceedCon = true;
    	   		}
    	   	}
    	   if(exceedCon == false){
        newDataContainerObject.getValue('a_wf_id').setSimpleValue(wfID.getID());
        newDataContainerObject.getValue('a_WFStateID').setSimpleValue(StateID);
	   newDataContainerObject.getValue("a_WFStateEntryTimestamp").setSimpleValue(iso_product.format(time_product));
	   newDataContainerObject.getValue('a_WFStateTransitionUserID').setSimpleValue(UserID);
	   }
	   }
	   }

  }
}