/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_matchAndLinkBOMCCStyle",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_matchAndLinkBOMCCStyle",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "bomCC",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_BOM_CC_Number",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "createWPTLink",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "styleLinkToWebProductType",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "brand",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Brand_Number",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av1Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV1",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av2Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV2",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av3Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV3",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av4Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV4",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av5Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV5",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av6Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV6",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av7Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV7",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av8Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV8",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av9Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV9",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ppiRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "swatchRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Swatch",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "videoRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Video",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av10Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV10",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av11Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV11",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,qh,bomCC,createWPTLink,brand,shotRef,av1Ref,av2Ref,av3Ref,av4Ref,av5Ref,av6Ref,av7Ref,av8Ref,av9Ref,ppiRef,swatchRef,videoRef,av10Ref,av11Ref) {
// PPIM-10741
var BOMCClookup = new java.util.HashMap();
BOMCClookup.put("GAP", "GO");
BOMCClookup.put("BR", "BRFS");
var markets = node.getValue("a_Market_Designation").getSimpleValue();
if (markets != null && markets.contains("SA")) {
    var parentStyle = node.getParent();
    var saOption = parentStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
    if (saOption == null || !saOption.contains("SA")) {
        parentStyle.getValue("a_Inherit_US_Copy_Option").addValue("SA");
    }

    //setting the default Web Product Type and Size Chart Values
    var brandNum = node.getValue('a_Brand_Number').getSimpleValue();
    var BOMMCCBrand = BOMCClookup.get(brandNum);
    if (brandNum != null) {
        var brand_wpt_Attr = "a_" + brandNum + "_WebProductType";
        var brand_wpt_Value = node.getValue(brand_wpt_Attr).getSimpleValue();
        var brand_sizeChart_Attr = "a_Size_Chart_" + brandNum;
        var brand_sizeChart_Value = node.getValue(brand_sizeChart_Attr).getSimpleValue();
        if (brand_wpt_Value == null) {
            parentStyle.getValue(brand_wpt_Attr).setSimpleValue("needs wpt");
            parentStyle.getValue("a_Web_Product_Type").setSimpleValue("needs wpt");
            createWPTLink.execute(parentStyle);
        }
        if (brand_sizeChart_Value == null) {
            parentStyle.getValue(brand_sizeChart_Attr).setSimpleValue("No Size Chart");
        }
    }

    var bomCCNumber = node.getValue("a_BOM_CC_Number").getSimpleValue();
    if (bomCCNumber != null) {
        createCCAndStyleBOMReferences(bomCCNumber, BOMMCCBrand);
    }
}

function createCCAndStyleBOMReferences(bomCCNumber, BOMMCCBrand) {
    var c = com.stibo.query.condition.Conditions;

    var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
        c.valueOf(bomCC).eq(bomCCNumber)
            .and(c.valueOf(brand).eq(BOMMCCBrand))
            .and(c.objectType(manager.getObjectTypeHome().getObjectTypeByID("CustomerChoice")))
    );
    var res = querySpecification.execute();

    if (res) {
        res.forEach(function (resNode) {
            log.info("resNode " + resNode);
            var currentMarketDesignation = resNode.getValue("a_Market_Designation").getSimpleValue();
            if (resNode.getID() != node.getID() && (currentMarketDesignation != null && currentMarketDesignation.contains("US")) && !checkIfSameNodeIsLinked(resNode.getID())) {
                if (compareStatus(resNode)) {
                    deleteReferencesIfExists();
                    var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");
                    var ccRefCreated = node.createReference(resNode, refType);
                    var targetBOMStyle = resNode.getParent();
                    var refTypeStyle = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_Style");
                    var parentStyle = node.getParent();
                    var styleRefCreated = parentStyle.createReference(targetBOMStyle, refTypeStyle);
                }
            }
            return true;
        });
    }
}

function checkIfSameNodeIsLinked(targetNode) {
    var flag = false
    var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");
    node.queryReferences(refType).forEach(function (referenceInstance) {
        if (referenceInstance.getTarget().getID() == targetNode) {
            flag = true;
            return false;
        }
        return true;
    });
    return flag;
}

function compareStatus(targetNode) {
    var lcs = node.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
    var photoStatus = node.getValue("a_CC_Photo_Status").getSimpleValue();
    var result = false;
    var photoStatusRank = {
        "Missing Shot Requests": 0,
        "Shot Request Submitted": 1,
        "Ready For Review": 2,
        "Complete: Request Submitted": 3,
        "Complete: Ready for Review": 4,
        "Complete": 5
    };

    if (lcs != "Approved") {
        manager.executeInContext("EN_US", function (ctxManager) {
            var usNode = ctxManager.getObjectFromOtherManager(targetNode);
            var usPhotoStatus = usNode.getValue("a_CC_Photo_Status").getSimpleValue();
            if (usPhotoStatus != null) {
                var currentRank = (typeof photoStatusRank[photoStatus] !== "undefined") ? photoStatusRank[photoStatus] : -1;
                var usRank = photoStatusRank[usPhotoStatus];
                if (usRank >= currentRank) {
                    result = true;
                }
            }
        });
    }
    return result;
}

function deleteReferencesIfExists() {
    var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");
    var BOMCCRefList = node.getReferences(refType).toArray();
    BOMCCRefList.forEach(function (ref) {
        ref.delete();
    });
    var refTypeStyle = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_Style");
    var StyleBOMCCRefList = parentStyle.getReferences(refTypeStyle).toArray();
    StyleBOMCCRefList.forEach(function (ref) {
        ref.delete();
    });

    var ccNum = node.getValue("a_CC_Number").getSimpleValue();
    //Delete Shot links
    node.queryReferences(shotRef).forEach(function (refInstance) {
        var shot = refInstance.getTarget();
        refInstance.delete();
        var shotCCNum = shot.getValue("a_Shot_CC_Number").getSimpleValue();
        if (shotCCNum == ccNum) {
            shot.getValue("a_Shot_CC_Number").setSimpleValue(null);
        }

        var ccList = shot.queryReferencedBy(shotRef).asList(100);
        if (ccList.size() == 0) {
            shot.getValue("a_Shot_Market_Number").setSimpleValue(null);
            var sharedMkts = shot.getValue("a_Shared_Markets").getValues().iterator();
            while (sharedMkts.hasNext()) {
                var nextMkt = sharedMkts.next();
                if (nextMkt.getValue() == "SA") {
                    nextMkt.deleteCurrent();
                    break;
                }
            }
        }
        return true;
    });

    //Delete Asset links
    var imgRef = [av1Ref, av2Ref, av3Ref, av4Ref, av5Ref, av6Ref, av7Ref, av8Ref, av9Ref, av10Ref, av11Ref, ppiRef, swatchRef, videoRef];
    for (var j = 0; j < 14; j++) {
        var refImg = new java.util.ArrayList();
        refImg.addAll(node.getReferences(imgRef[j]));
        for (var k = 0; k < refImg.size(); k++) {
            refImg.get(k).delete();
        }
    }
}
}