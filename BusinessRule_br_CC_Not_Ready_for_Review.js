/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CC_Not_Ready_for_Review",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CC Not Ready for Review",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
//var ccPhotoStatus = node.getValue("a_CC_Photo_Status").getSimpleValue();
//var ccStatus = node.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
//
//if (ccPhotoStatus == "Ready For Review" || ccStatus == "Draft") {
//    return false;
//}
//else if (ccStatus == "Waiting for Style Approval") {
//    return false;
//}
//else {
//    return true;
//}

var ccPhotoStatus = node.getValue("a_CC_Photo_Status").getSimpleValue();
var ccStatus = node.getValue("a_CC_Life_Cycle_Status").getSimpleValue();

if (ccPhotoStatus == "Ready For Review") {
    return false;
}
else if (ccStatus == "Waiting for Style Approval") {
    return false;
}
else {
    return true;
}
}