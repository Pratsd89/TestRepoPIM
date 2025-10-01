/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_WebSortOrder_Main",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_WebSortOrder_Main",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "brWebSortOrder",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "Save_Category",
    "description" : null
  }, {
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
exports.operation0 = function (manager,brWebSortOrder,node) {
/*var eventID = currentEventBatch.getEvents();
for (var i = 0; i< eventID.size(); i++){
var node = eventID.get(i).getNode();
var objType = node.getObjectType().getID();
if(objType == "WebDivision" || objType == "WebCategory" || objType == "WebSubCategory")
{

node.getValue("a_WebCategory_CID").setSimpleValue("99999");
}
}
*/
var parent = node.getParent();

var lastModifiedDate = node.getValue("a_main_last_modified_date").getSimpleValue();
//logger.warning(lastModifiedDate);
var lastRevision = node.getRevision().getEditedDate();
var fmt = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
lastRevision = fmt.format(lastRevision);
//logger.warning(lastRevision);
if( lastRevision > lastModifiedDate)
{
	brWebSortOrder.execute(parent); 
}

}