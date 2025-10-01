/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SizeModel_XMLDeltaLoad",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SizeModel_XMLDeltaLoad",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Dim1", "Dim2", "SizeCode", "SizeModel" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_IIEP_Size_Model_Status"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "Save_SetLastupdateDate_DeltaLoad"
  } ],
  "pluginType" : "Operation"
}
*/
