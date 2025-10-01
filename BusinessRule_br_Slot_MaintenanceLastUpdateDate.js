/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Slot_MaintenanceLastUpdateDate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Slot Maintenance Last Update Date",
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
var catStart = node.getValue('a_WebCategory_Start_Date').getSimpleValue();
var catEnd = node.getValue('a_WebCategory_End_Date').getSimpleValue();
var today = java.time.ZonedDateTime.now();

//if (catStart != null && catEnd > today || catStart != null && catEnd == null) {
    var catChildren = node.getChildren().iterator();

    while (catChildren.hasNext()) {
        var childCat = catChildren.next();
        var childCatStart = childCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
        var childCatEnd = childCat.getValue('a_WebCategory_End_Date').getSimpleValue();

        if (childCatStart != null && childCatEnd > today || childCatStart != null && childCatEnd == null) {
            var time = new java.util.Date();
            var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            //log.info("For child cat: " + childCat.getID());
            //log.info("Current last update date: " + childCat.getValue("a_main_last_modified_date").getSimpleValue());
            childCat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
            //log.info("New last update date: " + childCat.getValue("a_main_last_modified_date").getSimpleValue());
        }
    }
//}
}