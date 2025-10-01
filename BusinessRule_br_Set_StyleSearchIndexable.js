/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Set_StyleSearchIndexable",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Set_StyleSearchIndexable",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
//PPIM-7782 

//log.info(node.getValue('a_Search_Indexable').getSimpleValue());

if (node.getValue('a_Search_Indexable').getSimpleValue() == null)
	{
		node.getValue('a_Search_Indexable').setSimpleValue('Yes');
	}

else
	{
	
	}

}