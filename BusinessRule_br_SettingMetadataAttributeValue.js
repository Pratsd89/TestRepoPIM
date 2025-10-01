/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SettingMetadataAttributeValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_SettingMetadataAttributeValue",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
var SetRefMetaData = setRefMetaData(node,step,"Yes");


function setRefMetaData(node,manager,value) 
{
	var refType = manager.getReferenceTypeHome().getReferenceTypeByID("TagType_To_AlternateNames");
	node.queryReferences(refType).forEach
	(
		function (referenceInstance){
			referenceInstance.getValue("a_Display_Default_Flag").setSimpleValue(value);
			return true;
		
		}
		);
 
    }

}