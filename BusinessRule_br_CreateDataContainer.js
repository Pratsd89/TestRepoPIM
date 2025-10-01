/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CreateDataContainer",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_CreateDataContainer",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Content_Group", "Content" ],
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
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var flag=0;

var dataContainerType = manager.getHome(com.stibo.core.domain.datacontainertype.DataContainerTypeHome).getDataContainerTypeByID('WF_StateTransitionLogDataContainer');

var ExistingdataContainer = node.getDataContainerByTypeID('WF_StateTransitionLogDataContainer').getDataContainers().toArray();
     
        var dataContainer = node.getDataContainer(dataContainerType).addDataContainer();
        for(i=0; i<1000;i++)
        {
        	
        try{
    	   var newDataContainerObject = dataContainer.createDataContainerObject('');
    	   }
    	   catch(e){
    	   	if (e.javaException instanceof com.stibo.core.domain.impl.datacontainer.DataContainerLimitExceededException){
    	   		log.info("The number of data containers has been exceeded");
    	   		exceedCon = true;
    	   		}
    	   	}
    	  
        }

  
}