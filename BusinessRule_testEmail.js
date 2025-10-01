/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testEmail",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "testEmail",
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
  "pluginId" : "SendEmailBusinessAction",
  "parameters" : [ {
    "id" : "Body",
    "type" : "java.lang.String",
    "value" : "Testing email"
  }, {
    "id" : "Recipients",
    "type" : "java.util.List",
    "values" : [ "@vimal_patel@gap.com" ]
  }, {
    "id" : "Sender",
    "type" : "com.stibo.util.basictypes.EmailRecipient",
    "value" : "@noreply@gap.com"
  }, {
    "id" : "Subject",
    "type" : "java.lang.String",
    "value" : "TEST"
  } ],
  "pluginType" : "Operation"
}
*/
