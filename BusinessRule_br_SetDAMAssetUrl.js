/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetDAMAssetUrl",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set DAM Asset URL",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestXternakAsset",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToExternalAsset",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,ShotRequestXternakAsset) {
function updateDamUrl(node) {
    var DAMassetAttr = node.getValue("a_DAM_Asset_Paths");
    var DAMassetRaw = DAMassetAttr ? DAMassetAttr.getSimpleValue() : null;
    var DAMasset = DAMassetRaw ? DAMassetRaw.replace("<multisep/>", ";") : "";

    var assetMap = {};
    DAMasset.split(";").forEach(function(pair) {
        var [contentTypeID, assetLink] = pair.split("-");
        if (contentTypeID && assetLink) {
            assetMap[contentTypeID] = assetLink;
        }
    });

    var refs = node.queryReferences(ShotReqXternalAsset).asList(50);
    refs.forEach(function(ref) {
        var asset = ref.getTarget();
        var assetContentTypeID = asset.getValue("a_Content_Type_ID").getSimpleValue();
        if (assetMap.hasOwnProperty(assetContentTypeID)) {
            asset.getValue("a_DAM_Asset_URL").setSimpleValue(assetMap[assetContentTypeID]);

        }
    });

    return;
}

updateDamUrl(node);
}