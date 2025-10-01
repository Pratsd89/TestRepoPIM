/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Autopop_Manual_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Autopop Manual Action",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style", "WebCategory", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "com.stibo.customer.gapinc.autopop.server.AutoPopBusinessAction",
  "parameters" : [ {
    "id" : "ExcludedContexts",
    "type" : "java.lang.String",
    "value" : "FR_CA"
  } ],
  "pluginType" : "Operation"
}
*/
