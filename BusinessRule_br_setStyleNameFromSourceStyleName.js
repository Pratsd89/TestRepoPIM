/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setStyleNameFromSourceStyleName",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetStyleNameFromSourceStyleName-Data Correction",
  "description" : "Update Style Name with a_Source_Style_Name If Name is Null - Data Correction",
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
//PPIM-8257
var today = new java.util.Date()
var mainLastModifiedDateISO = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var isPublishRequired=false;

if(node.getName()==null && node.getValue('a_Source_Style_Name').getSimpleValue()!=null){
	var sourceStyleName=node.getValue('a_Source_Style_Name').getSimpleValue()
	node.setName(sourceStyleName)
	isPublishRequired=true
}
if(node.getValue('a_Style_Name').getSimpleValue()==null && node.getValue('a_Source_Style_Name').getSimpleValue()!=null){
	var sourceStyleName=node.getValue('a_Source_Style_Name').getSimpleValue()
	node.getValue('a_Style_Name').setSimpleValue(sourceStyleName)
	isPublishRequired=true
}

if(isPublishRequired)
	node.getValue('a_main_last_modified_date').setSimpleValue(mainLastModifiedDateISO.format(today))
}