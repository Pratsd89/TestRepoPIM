/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setDefaultReturnLocationType",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetDefaultReturnLocationType",
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
var today = new java.util.Date()
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd")
var mainLastModifiedDateISO = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

node.getValue('a_Return_Location_Type').setLOVValueByID("NON_RETURNABLE")    
  if (node.getObjectType().getID() == 'CustomerChoice') {
	var skuList = node.getChildren();  
	if(skuList !=null) {
		for(var i = 0 ; i < skuList.size();i++){
			var skuReturnLocation=skuList.get(i).getValue('a_Return_Location_Type').getSimpleValue();
			if(skuReturnLocation!=null && skuReturnLocation!='Non-Returnable')
				skuList.get(i).getValue('a_Return_Location_Type').setLOVValueByID("NON_RETURNABLE")
			skuList.get(i).getValue("a_main_last_modified_date").setSimpleValue(mainLastModifiedDateISO.format(today))
		}
	} 
   	node.getValue("a_main_last_modified_date").setSimpleValue(mainLastModifiedDateISO.format(today))                    
  }	
}