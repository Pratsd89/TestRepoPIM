/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setMaintLastUpdateDate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Maintenance Last Update Date",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
//log.info("PUBLISH:" + node.getID());
//PPIM-13466
var currentDate = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var calender = new java.util.Calendar.getInstance();
var lastModifiedDate = node.getValue("a_main_last_modified_date").getSimpleValue();
var objType = node.getObjectType().getID();

if(objType == "WebDivision" || objType == "WebCategory" || objType == "WebSubCategory")
{
node.getValue("a_main_last_modified_date_Int").setSimpleValue(iso.format(currentDate));	
}

if (lastModifiedDate == iso.format(currentDate)){
	calender.add(calender.SECOND, 10);
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(calender.getTime()));
}
else {
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(currentDate));
}
}