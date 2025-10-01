/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Customer_Service_Approval_Validation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Customer Service Approval Validation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerServiceBusinessUnit", "CustomerServiceCategory", "CustomerServiceHome" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var marketNumber = node.getValue('a_Market_Number').getSimpleValue();
var description = node.getValue('a_Category_Description').getSimpleValue();
var startDate = node.getValue('a_Customer_Service_Category_Start_Date').getSimpleValue();
var displayType = node.getValue('a_Web_CS_Category_Display_Type').getSimpleValue();

var objectType = node.getObjectType().getID();
if(objectType == "CustomerServiceHome" || objectType == "CustomerServiceCategory")
{
	if(marketNumber == 'US' || marketNumber == 'CAN'){
	    if(description == null || description == '' || startDate == null || startDate == '' || displayType == null || displayType == ''){
	        return 'Missing Required Attribute';
	    }
	}
}

if(node.getObjectType().getID()=='CustomerServiceCategory'){
   	var desc = node.getValue("a_Category_Description").getSimpleValue();
	var cid = node.getValue("a_WebCategory_CID").getSimpleValue();
	var note = node.getValue("a_WebCategory_Note").getSimpleValue();
	var newName = node.getName();
	if(note!=null){
				newName = desc + "-" + cid + "-" + note
				}
	else {
				newName = desc + "-" + cid 
		}

node.setName(newName);

}

return true;

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_CheckCatSyncUserUpdate"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
