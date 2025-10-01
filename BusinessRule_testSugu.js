/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testSugu",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "testSugu",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "photoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "skuSizeCodeRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "sizeModelObjType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SizeModel",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "extS7attr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "ExternalAsset_S7",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,photoShotRef,manager,skuSizeCodeRef,qh,sizeModelObjType,logger,extS7attr) {
var extAsset = manager.getAssetHome().getAssetByID("52533034");
var s7AttrValue = extAsset.getValue("ExternalAsset_S7").getSimpleValue();
logger.info(s7AttrValue);
extAsset.setSimpleValue(extS7attr,"test");
extAsset.approve();
logger.info(extAsset.getValue("ExternalAsset_S7").getSimpleValue());
extAsset.getValue("ExternalAsset_S7").setSimpleValue(s7AttrValue);
var outputStream1 = new java.io.FileOutputStream(new java.io.File("fileName"));
extAsset.download(outputStream1, "15541493");
outputStream1.close();
extAsset.approve();
logger.info(extAsset.getValue("ExternalAsset_S7").getSimpleValue());
var outputStream = new java.io.FileOutputStream(new java.io.File("fileName"));
extAsset.download(outputStream, "15541493");
outputStream.close();
}