/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Del_wf_StateTransitionLogDC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Del_wf_StateTransitionLogDC",
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
var container = node.getDataContainerByTypeID('WF_StateTransitionLogDataContainer').getDataContainers().toArray();

logger.warning(container.length);
var deleteCount = container.length - 30;
if (container.length > 30)
	{
	var list1 = new java.util.ArrayList();
	for(var i=0;i<container.length;i++){
	list1.add(container[i])
	}
var sortedList = sortById(list1);
for(var i=0; i<deleteCount;i++)
	{
	//	logger.warning("1");
	sortedList.get(i).deleteLocal();
	}
}



function sortById(list)
{
	var length = list.size();
	for(var i=0; i<length-1; i++)
	{
	var min = i;
	for(var j = i+1;j<length; j++)
	{
	var  firstDate =list.get(j).getDataContainerObject().getValue("a_WFStateEntryTimestamp").getSimpleValue();
	var  secondDate =list.get(min).getDataContainerObject().getValue("a_WFStateEntryTimestamp").getSimpleValue();
	if(firstDate < secondDate) 
		{
			min = j;
		}
	}
	var temp = list.get(min);
	list.set(min, list.get(i));
	list.set(i,temp);
	}
return list;	
}

}