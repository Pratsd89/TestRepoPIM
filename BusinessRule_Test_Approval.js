/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Approval",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test_Approval",
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,lookupTable) {
log.info(node.getApprovalStatus());

//Function to get value for 'a_Overview_Bullet1' from specified context
function checkOverviewBullet(node, stepManager, contextID) {

	var status = stepManager.executeInContext(contextID, function (enContextManager) {
		var attributeExistFlag = false;
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());
		var overviewBullet = enCurrentProduct.getValue('a_Overview_Bullet1').getSimpleValue();
		if (overviewBullet != null && overviewBullet != '') {
			attributeExistFlag = true;
		}

		return attributeExistFlag;
	});

	return status;
}

var marketCode = node.getValue('a_Style_Market_Designation').getValues().toArray();
var replicateEngCopy = node.getValue('a_Replicate_US_English_Copy').getSimpleValue();
var translationUrgency = node.getValue('a_Translation_Urgency').getSimpleValue();
var contexts = new Array();

var errorStr = '';
var isErrorOccurred = false;
var existingErrorMsg = '' + node.getValue('a_error_message').getSimpleValue();

if (marketCode.length == 0 || replicateEngCopy == null || translationUrgency == null) {
	errorStr = 'Please fill market code, translation Urgency and Replicate US Values Attributes to proceed';
	isErrorOccurred = true;
}

//Below block will only execute if a_Style_Market_Designation, a_Replicate_US_English_Copy and a_Translation_Urgency are NOT NULL
if (!isErrorOccurred) {
	
  	if(marketCode.length == 1) {
  		var context = lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket",marketCode[0].getSimpleValue())
  		var statusCheck = checkOverviewBullet(node, stepManager, context);
  		if (!statusCheck) {
			errorStr = 'Please fill at least Overview Bullet 1 in ' + context + ' to proceed.';
			isErrorOccurred = true;
		}
  	}
  	else {
  		marketCode.forEach(function (market) {
    			contexts.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket",market.getSimpleValue()));
  		});
  		
		if(replicateEngCopy == 'Yes' && marketCode.indexOf('US') > 0)  {
			var statusCheck = checkOverviewBullet(node, stepManager, 'EN_US');
			if (!statusCheck) {
				errorStr = 'Please fill at least Overview Bullet 1 in EN_US to proceed.';
				isErrorOccurred = true;
			}
		}
		else if (replicateEngCopy == 'No') {
			errorStr = ''
  			contexts.forEach(function (context) {
				var statusCheck = checkOverviewBullet(node, stepManager, context);

					if (!statusCheck) {
						if(!statusCheck && context == 'EN_US') {
							errorStr = errorStr + 'Please fill at least Overview Bullet 1 in EN_US to proceed.';
						}
						else if (!statusCheck && context == 'EN_CA') {
							errorStr = errorStr + 'There is no copy in EN_CA to translate, please populate the Canadian English copy data or click the copy from US English to enable auto copy';
						} 
						else if (!statusCheck && context == 'EN_JP') {
							errorStr = errorStr + 'There is no copy in EN_JP to translate, please populate the Japanese English copy data or click the copy from US English to enable auto copy';
						}
					}
			})
		}
	}
}	

if (isErrorOccurred) {
	log.info('Error occurred at Checking Overview Bullet 1 Value : ' + errorStr);
	return errorStr;
}

return true;
}