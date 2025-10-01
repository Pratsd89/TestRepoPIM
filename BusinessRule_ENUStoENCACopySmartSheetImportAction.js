/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ENUStoENCACopySmartSheetImportAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) ENUStoENCACopySmartSheetImportAction",
  "description" : "This BR will allow Style to get its copy attributes replicated through smartsheet from en_us to en_ca after replication attribute is set",
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "attUpdate",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_main_last_modified_date",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,log,attUpdate) {
//SAM adding the trigger to the dgl layer for temp to make this work
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));

//PPIM-8134 - Below are the attributes to be ignored from Attribute Group : ag_English_Replication_Attributes
var attributesToIgnore = ["a_Replicate_US_English_Copy","a_Translation_Due_Date","a_Translation_Urgency"];

var currentContext = stepManager.getCurrentContext().getID();
if (currentContext == "EN_US") {
	var replicateEngCopy = node.getValue('a_Replicate_US_English_Copy').getSimpleValue();
	var copyStatus = node.getValue('a_Copy_Complete_Status').getSimpleValue();
	//log.info("replicateEngCopy "+replicateEngCopy+" copyStatus "+copyStatus);
	if (replicateEngCopy == 'Yes' && copyStatus == 'Complete') {
		if (replicateEngCopy == 'Yes') {
			stepManager.executeInContext('EN_US', function (enContextManager) {
				var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());
				var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_English_Replication_Attributes');
				var attributeList = attributeGroup.getAttributes().toArray();
				for (var i = 0; i < attributeList.length; i++) {
					var enAttributeValue = enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue();
					//PPIM-8111 - Joshna Marpureddy - This condition has been added to ignore Translation Urgency from ENUS if the value is null
					//Note* : As per the latest modifications with Translation in ENUS, which is blank when US Enrichment Workflow initiated - PPIM-7908
					//if (!(attributeList[i].getID() == 'a_Translation_Urgency' && null == enAttributeValue)) {			

						//PPIM-8134 - Added the list of attributes to be ignored while copying from US
						if(attributesToIgnore.indexOf(String(attributeList[i].getID())) < 0) {
							stepManager.executeInContext('EN_CA', function (caContextManager) {
								var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());
								caCurrentProduct.getValue(attributeList[i].getID()).setSimpleValue(enAttributeValue);
							});
						}
					//}
				}

			});

			//SAM Temporary update to force export to EN_CA DGL if there was an update to copy in other context
			//stepManager.executeInContext('EN_CA',function(caContextManager) {
			//	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			//});
		}
	}
	var wfInstances = node.getWorkflowInstances().toArray();
	if (wfInstances.length == 0) {
		node.startWorkflowByID("wf_StyleMaintenanceWorkflow", "Starting Maintenance Workflow through Import");
	}
}
}