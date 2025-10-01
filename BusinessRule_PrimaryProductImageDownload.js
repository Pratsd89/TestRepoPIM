/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "PrimaryProductImageDownload",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "PrimaryProductImageDownload",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "CreateAssetFromURLOperation",
  "parameters" : [ {
    "id" : "AssetObjectType",
    "type" : "com.stibo.core.domain.ObjectType",
    "value" : "ProductImage"
  }, {
    "id" : "AssetReferenceType",
    "type" : "com.stibo.core.domain.ReferenceType",
    "value" : "PrimaryProductImage"
  }, {
    "id" : "AutoApprove",
    "type" : "java.lang.Boolean",
    "value" : "true"
  }, {
    "id" : "NodeURLAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : null
  } ],
  "pluginType" : "Operation"
}
*/
