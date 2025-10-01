/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setPublicationDateSKU",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Publication Date SKU",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
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
//BR created as part of Ticket : PPIM-8006

var today = new java.util.Date()
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd")
var mainLastModifiedDateISO = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
if (node.getObjectType().getID() == 'CustomerChoice') {
	var ccPublicationDate = node.getValue('a_CC_Start_Date').getSimpleValue();
   	var ccLifeCycleStatus = node.getValue('a_CC_Life_Cycle_Status').getSimpleValue()
    	var skuList = node.getChildren();   
    	for(var i = 0 ; i < skuList.size();i++){
       	var skuPublicationDate = skuList.get(i).getValue('a_SKU_Start_Date').getSimpleValue();
       	var skuLifeCycleStatus = skuList.get(i).getValue('a_SKU_Life_Cycle_Status').getSimpleValue();
           if(ccPublicationDate == null || ccPublicationDate == "") 
                skuList.get(i).getValue("a_SKU_Start_Date").setSimpleValue(iso.format(today))
              
            else 
                skuList.get(i).getValue("a_SKU_Start_Date").setSimpleValue(ccPublicationDate)
            skuList.get(i).getValue("a_main_last_modified_date").setSimpleValue(mainLastModifiedDateISO.format(today))
	log.info('SKU : '+ skuList.get(i).getID()+' which belongs to CC : '+node.getID()+ ' has been updated with Publication Date.') 
    }
                            
}
}