/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Product_Image_Ref",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Product Image References",
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
  "pluginId" : "BulkUpdateRemoveReference",
  "parameters" : [ {
    "id" : "CPLinkTypeID",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "Formula",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "ReferenceTypeID",
    "type" : "java.lang.String",
    "value" : "PrimaryProductImage"
  }, {
    "id" : "Value",
    "type" : "java.lang.String",
    "value" : ""
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateRemoveReference",
  "parameters" : [ {
    "id" : "CPLinkTypeID",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "Formula",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "ReferenceTypeID",
    "type" : "java.lang.String",
    "value" : "ProductImage"
  }, {
    "id" : "Value",
    "type" : "java.lang.String",
    "value" : ""
  } ],
  "pluginType" : "Operation"
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
    "value" : "ProductImage"
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
