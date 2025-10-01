/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Purge_Old_Revisions",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Purge_Old_Revisions",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebBU", "WebCategory", "WebDivision", "WebHierarchyRoot", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
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
    "value" : "step://eventprocessor?id=PurgeOlderRevisions"
  } ],
  "pluginType" : "Operation"
}
*/
