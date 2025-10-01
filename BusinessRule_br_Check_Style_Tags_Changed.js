/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Check_Style_Tags_Changed",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Check_Style_Tags_Changed",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
// br_Check_Style_Tags_Changed
// style tag changed to publish all the SKUS under the STYLE 
var attributesArray=[
'a_Department_Tag_Inherit',
'a_ProductType_Tag_Inherit',
'a_CategoryGroup_Tag_Inherit',
'a_Style_Tag_Inherit'];


var tagsString='';
//the order will be alphabetical attributes
for(var i =0 ; i< attributesArray.length;i++){
	//log.info("Node ID is there  " +node.getID());
	//log.info(attributesArray[i]     +  "attributesArray[i]");
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

var oldTags = node.getValue('a_Old_Style_Product_Tags').getSimpleValue();
if(oldTags == null || oldTags != tagsString){
    node.getValue('a_Old_Style_Product_Tags').setSimpleValue(tagsString);
	UpdateLastModifiedDetails(node);
   // logger.info('STYLE TAGS IS CHANGED Value Changed');
}

function UpdateLastModifiedDetails(node){
	
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	var objType = node.getObjectType().getID(); 
	if(objType == "Style" )
	{
		var ccObjects   =  node.getChildren();
		for(var ccIndex = 0 ; ccIndex<ccObjects.size();ccIndex ++)
		{
			var ccObject= ccObjects.get(ccIndex);
			var skuObjects   =  ccObject.getChildren();
			for(var skuIndex = 0 ; skuIndex<skuObjects.size();skuIndex ++)
			{
				var skuObject= skuObjects.get(skuIndex);
				skuObject.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			}
		}
	}
}

}