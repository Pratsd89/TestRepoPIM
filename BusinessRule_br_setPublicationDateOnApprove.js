/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setPublicationDateOnApprove",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Publication Date On Approve",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
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
//BR created as part of Ticket : PPIM-7475

var today = new java.util.Date()
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd")
    
if (node.getObjectType().getID() == 'SKU') {
	var publicationDate = node.getValue('a_SKU_Start_Date').getSimpleValue();
	if((publicationDate == null || publicationDate == "" ) && node.getValue('a_SKU_Life_Cycle_Status').getSimpleValue() == 'Approved' && node.getValue('a_CC_Life_Cycle_Status').getSimpleValue() == 'Approved') {
		var parentPublicationDate = node.getParent().getValue('a_CC_Start_Date').getSimpleValue();
		if(parentPublicationDate == null || parentPublicationDate == "") {
			node.getValue("a_SKU_Start_Date").setSimpleValue(iso.format(today));//set today as SKU's publication date
			}
		else {
			//set parentPublicationDate to SKU
			node.getValue("a_SKU_Start_Date").setSimpleValue(parentPublicationDate);
			}
			
	}
}

}