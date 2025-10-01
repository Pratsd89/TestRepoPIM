/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Check_Old_Style_Product_Tags_Value",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Old Style Product Tags Values",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
if (stepManager.getCurrentWorkspace().getID() == "Main")
{
var attributesArray=[
'a_Boutique_Tag_Inherit',
'a_CategoryGroup_Tag_Inherit',
'a_Category_Tag_Inherit',
'a_Department_Tag_Inherit',
'a_ProductType_Tag_Inherit',
'a_Style_Tag_Inherit'];


var tagsString='';
//the order will be alphabetical attributes
for(var i =0 ; i< attributesArray.length;i++){
    var valueList=node.getValue(attributesArray[i]).getValues().toArray();
    //the values will be sorted alphabetically and added so that each time we get the values in same order
    var valueArray=[];
    for(var j=0;j<valueList.length;j++){
        var tagValue = valueList[j].getSimpleValue();
        valueArray.push(tagValue);
    }
    valueArray.sort();
    for(var j=0;j<valueArray.length;j++){
        var tagValue = valueArray[j];
        tagsString=tagsString+ ' | '+tagValue;
    }
}

var oldTagsString = node.getValue('a_Old_Style_Product_Tags').getSimpleValue();
if(oldTagsString == null || oldTagsString != tagsString){
    node.getValue('a_Old_Style_Product_Tags').setSimpleValue(tagsString);
    logger.info('Value Changed');
}
}
return true;
}