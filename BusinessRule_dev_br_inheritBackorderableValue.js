/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "dev_br_inheritBackorderableValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test Dev br_inheritBackorderableValue",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function () {
if(node.getObjectType().getID()=='Style'){
	var ccList=node.getChildren();
	for(var i=0;i<ccList.size();i++){
		if(!ccList.get(i).getValue('a_Backorderable').isInherited() && ccList.get(i).getValue('a_Backorderable').getSimpleValue()!=node.getValue('a_Backorderable').getSimpleValue())
			ccList.get(i).getValue('a_Backorderable').deleteCurrent();
		var skuList=ccList.get(i).getChildren();
		for(var j=0;j<skuList.size();j++){
			if(!skuList.get(j).getValue('a_Backorderable').isInherited() && skuList.get(j).getValue('a_Backorderable').getSimpleValue()!=ccList.get(i).getValue('a_Backorderable').getSimpleValue())
				skuList.get(j).getValue('a_Backorderable').deleteCurrent()
		}
	}
}


if(node.getObjectType().getID()=='CustomerChoice'){
		var skuList=node.getChildren();
		for(var j=0;j<skuList.size();j++){
			if(!skuList.get(j).getValue('a_Backorderable').isInherited() && skuList.get(j).getValue('a_Backorderable').getSimpleValue()!=node.getValue('a_Backorderable').getSimpleValue())
				skuList.get(j).getValue('a_Backorderable').deleteCurrent();
		}
}

}