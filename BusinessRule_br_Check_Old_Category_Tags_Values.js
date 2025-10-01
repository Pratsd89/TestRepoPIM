/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Check_Old_Category_Tags_Values",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Old Category Product Tags Values",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
'a_Boutique_Tag',
'a_CategoryGroup_Tag',
'a_Category_Tag',
'a_Department_Tag',
'a_ProductType_Tag',
'a_Style_Tag',
'a_Boutique_Tag_Exclusions',
'a_CategoryGroup_Tag_Exclusions',
'a_Category_Tag_Exclusions',
'a_Department_Tag_Exclusions',
'a_ProductType_Tag_Exclusions',
'a_Style_Tag_Exclusions'];


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

var oldTagsString = node.getValue('a_Old_Category_Product_Tags').getSimpleValue();
if(oldTagsString == null || oldTagsString != tagsString){
    node.getValue('a_Old_Category_Product_Tags').setSimpleValue(tagsString);
    logger.info('Value Changed');
}
}
return true;
}