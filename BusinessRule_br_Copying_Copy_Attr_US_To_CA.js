/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Copying_Copy_Attr_US_To_CA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Copying Copy Attributes From US To CA",
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
var marketCode= node.getValue('a_Style_Market_Designation').getValues().toArray();
marketCode.sort();
var temp = [];
for(var j=0;j<marketCode.length;j++){
	temp.push(marketCode[j].getSimpleValue());		
}

temp = temp.sort();
marketCode = temp.join(',');
var replicateEngCopy = node.getValue('a_Replicate_US_English_Copy').getSimpleValue();
var translationUrgency = node.getValue('a_Translation_Urgency').getSimpleValue();

//PPIM-8134 - Below are the attributes to be ignored from Attribute Group : ag_Style_Copy_Attributes
var attributesToIgnore = ["a_Translation_Status_ID","a_Replicate_US_English_Copy", "a_Style_Copy_Smartsheet_Identifier",
	 					"a_Translation_Due_Date","translation_sent_to_publish","a_Translation_Status","a_Translation_Urgency"];


//if(marketCode == 'CA,US' && replicateEngCopy == 'Y' && translationUrgency == 'Urgent'){
/*
 * 121119 - replicateEngCopy values are Yes/No not Y/N. Translation Urgency check is not needed here per the PPT in PPIM-950 so fixing both in entire rule.
 */
 if(marketCode == 'CAN,US' && replicateEngCopy == 'Yes'){
      stepManager.executeInContext('EN_US',function(enContextManager) {	
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());	
		
		var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_Style_Copy_Attributes');
		var attributeList = attributeGroup.getAttributes().toArray();
		var attributeExistFlag=false;
		for(var i = 0 ;i<attributeList.length;i++){
			var enAttributeValue = enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue();
			//PPIM-8111 - Joshna Marpureddy - This condition has been added to ignore Translation Urgency from ENUS if the value is null
			//Note* : As per the latest modifications with Translation in ENUS, which is blank when US Enrichment Workflow initiated - PPIM-7908
			//if(!( attributeList[i].getID() == 'a_Translation_Urgency' && null== enAttributeValue)) {
				//PPIM-8134 - Added the list of attributes to be ignored while copying from US
				if(attributesToIgnore.indexOf(String(attributeList[i].getID())) < 0) {
					stepManager.executeInContext('EN_CA',function(caContextManager) {
						var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());
						caCurrentProduct.getValue(attributeList[i].getID()).setSimpleValue(enAttributeValue);
					})
				}
			//}
		}		
		
	})
}
//PPIM-7562 - Changes for JPN market - Start
if(marketCode == 'JPN,US' && replicateEngCopy == 'Yes'){
      stepManager.executeInContext('EN_US',function(enContextManager) {	
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());	
		
		var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_Style_Copy_Attributes');
		var attributeList = attributeGroup.getAttributes().toArray();
		var attributeExistFlag=false;
		for(var i = 0 ;i<attributeList.length;i++){
			var enAttributeValue = enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue();
			//PPIM-8111 - Joshna Marpureddy - This condition has been added to ignore Translation Urgency from ENUS if the value is null
			//Note* : As per the latest modifications with Translation in ENUS, which is blank when US Enrichment Workflow initiated - PPIM-7908
			//if(!( attributeList[i].getID() == 'a_Translation_Urgency' && null== enAttributeValue)) {
				//PPIM-8134 - Added the list of attributes to be ignored while copying from US
				if(attributesToIgnore.indexOf(String(attributeList[i].getID())) < 0) {
					stepManager.executeInContext('EN_JP',function(jpContextManager) {
						var jpCurrentProduct = jpContextManager.getProductHome().getProductByID(node.getID());
						jpCurrentProduct.getValue(attributeList[i].getID()).setSimpleValue(enAttributeValue);
					})
				}
			//}
		}		
		
	})
}
//PPIM-7562 - Changes for JPN market - End

node.getValue('a_Copy_Complete_Status').setSimpleValue('Complete');

}