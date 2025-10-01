/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MVGTempObjectInboundAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_MVGTempObjectInboundAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "MVGTempObject" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "RepublishEventQueueOperation",
  "parameters" : [ {
    "id" : "HasEventQueue",
    "type" : "com.stibo.core.domain.haseventqueue.HasEventQueue",
    "value" : "step://eventprocessor?id=EP_MVGTempObjectProcess"
  } ],
  "pluginType" : "Operation"
}
*/
