/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Checking_Unique_ASLR_Entry",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Checking Unique ASLR Entry",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
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
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {

//Checking number of ASLR Entries
var lov = stepManager.getListOfValuesHome().getListOfValuesByID('Shot_Site_Placements');
var list = lov.queryValidValues().asList(100);
var lovArray = list.toArray();
var lovLength;
var dataContainer;
if(lovArray != null){
	lovLength = lovArray.length;
	dataContainer = node.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
	if(dataContainer.length > lovLength){
		return 'You can not add more entries than the available site placements';
	}
}

//Checking Unique ASLR Entry
var dataContainer = node.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
var combination = {};
var combinationArray=[];
for(var n=0;n<dataContainer.length;n++)
{    
        var dataContainerObject = dataContainer[n]. getDataContainerObject();
        var shotType = dataContainerObject.getValue('a_Shot_Type').getSimpleValue();
        var shotCode = dataContainerObject.getValue('a_Shot_Code').getSimpleValue();
        var sitePlacement = dataContainerObject.getValue('a_Site_Placement').getSimpleValue();
        combination['shotCode'] = shotCode;
        combination['sitePlacement'] = sitePlacement; 
        if(combinationArray.length == 0 ){
        	combinationArray.push(combination);
        	combination = {};
        	continue;
      
        }
        else{
        	for(var k=0;k<combinationArray.length;k++){     
        		if(combinationArray[k]['shotCode'] == shotCode){
        			return 'Duplicate shot code not allowed';
        		}
        		if(combinationArray[k]['sitePlacement']==sitePlacement){
        			return 'Duplicate Site Placement not allowed';
        		}
        	}		
        	combinationArray.push(combination);
        	combination = {};
        	continue;
        }
}
return true;
}