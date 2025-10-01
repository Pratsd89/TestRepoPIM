/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Checking_Atleast_One_Copy_Value",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "(DEP) Checking Atleast One Copy Value (EN_US)",
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
function checkStyleCopyAttributes(node, stepManager, contextID) {
	/* following attributes should be ignored in this check as they do not satisfy the "at least one copy attribute" requirement
	 	a_Replicate_US_English_Copy
		a_Style_Copy_Smartsheet_Identifier
		a_Style_Imported
		a_Translation_Due_Date
		a_Translation_Status
		a_Translation_Urgency
	 */
	 var attributesToIgnore = ["a_Replicate_US_English_Copy", "a_Style_Copy_Smartsheet_Identifier",
	 						"a_Style_Imported","a_Translation_Due_Date","a_Translation_Status","a_Translation_Urgency"];

	 var status = stepManager.executeInContext(contextID,function(enContextManager) {
		
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());
		var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_Style_Copy_Attributes');
		var attributeList = attributeGroup.getAttributes().toArray();
		var attributeExistFlag = false;
		for(var i = 0 ;i<attributeList.length;i++){
			if (enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue() != null 
			 && enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue() != ''
			 && attributesToIgnore.indexOf(String(attributeList[i].getID())) < 0) {
			 	logger.info(attributeList[i].getID());
			 	//logger.info(attributesToIgnore.indexOf(String(attributeList[i].getID())));
				attributeExistFlag = true;
				break;			
			}
		}
		
		return attributeExistFlag;
	});

	 return status;
}


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

var errorStr = '';
var isErrorOccurred = false;
var existingErrorMsg = '' + node.getValue('a_error_message').getSimpleValue();

if(marketCode.length == 0 || replicateEngCopy == null || translationUrgency == null){
	//return 'Please fill market code, translation Urgency and Replicate US Values Attributes to proceed';
	errorStr = 'Please fill market code, translation Urgency and Replicate US Values Attributes to proceed';
	isErrorOccurred = true;
}

//if(marketCode == 'CAN,US' && replicateEngCopy == 'Y' && translationUrgency == 'Urgent'){
/*
 * 121119 - replicateEngCopy values are Yes/No not Y/N. Translation Urgency check is not needed here per the PPT in PPIM-950 so fixing both in entire rule.
 */
if (!isErrorOccurred) {
if (marketCode == 'CAN,US' && replicateEngCopy == 'Yes') {
	var statusCheck = checkStyleCopyAttributes(node, stepManager, 'EN_US');
	if(statusCheck != true){
		//return 'Please fill atleast one Copy Attribute in EN_US to proceed.';
		errorStr = 'Please fill atleast one Copy Attribute in EN_US to proceed.';
		isErrorOccurred = true;
	}
	
} else if (marketCode == 'CAN,US' && replicateEngCopy == 'No') {
	var statusCheck = checkStyleCopyAttributes(node, stepManager, 'EN_US');
	if(statusCheck != true){
		//return 'Please fill atleast one Copy Attribute in EN_US to proceed.';
		errorStr = 'Please fill atleast one Copy Attribute in EN_US to proceed.';
		isErrorOccurred = true;
	}

	var statusCheck = checkStyleCopyAttributes(node, stepManager, 'EN_CA');
	if(statusCheck != true){
		//return 'There is no copy to translate, please populate the Canadian English copy data or click the copy from US English to enable auto copy';
		errorStr = 'There is no copy to translate, please populate the Canadian English copy data or click the copy from US English to enable auto copy';
		isErrorOccurred = true;
	}
} else if (marketCode == 'CAN') {
	var statusCheck = checkStyleCopyAttributes(node, stepManager, 'EN_CA');
	if(statusCheck != true){
		//return 'Please fill atleast one Copy Attribute in EN_CA to proceed.';
		errorStr = 'Please fill atleast one Copy Attribute in EN_CA to proceed.';
		isErrorOccurred = true;
	}
} else if (marketCode=='US') {
	var statusCheck = checkStyleCopyAttributes(node, stepManager, 'EN_US');
	if(statusCheck != true){
		//return 'Please fill atleast one Copy Attribute in EN_US to proceed.';
		errorStr = 'Please fill atleast one Copy Attribute in EN_US to proceed.';
		isErrorOccurred = true;
	}
}
}

if (isErrorOccurred) {
	return errorStr;
}

return true;
}