/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MailTrigger",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_MailTrigger",
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,mail) {
var id = node.getID();
var mailMethod = mail.mail();
var emailIDTO = mailMethod.addTo("bhagya_lakshmi_annam@gap.com;lakshmi_thammineni@gap.com;prasad_durga@gap.com;srisailam_poleboni@gap.com;venkatesh_bhimavaram@gap.com;aravindan_sakthivel@gap.com");
var emailSubject = mailMethod.subject("SIZE Dimension Modification");
var emailBody = mailMethod.plainMessage("The Classification with ID "+id+" is created/modified, please verify");

var mailSentStatus = mailMethod.send();
}