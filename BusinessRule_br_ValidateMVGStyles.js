/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ValidateMVGStyles",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Validate MVG Styles",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "PPHToMVGTemplate",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,refType,LKT) {
function validateStyles(styleList) {//validateStyles(styleList, parent, identifier)
    //var parent = step.getProductHome().getProductByID(parentID);
    if (checkBrand(styleList)) {
        var template = null;
        var templateID = "MVGTemplate_137";//styleList.get(0).getValue("a_Template_Id").getSimpleValue();

        var baseStyleTemplates = styleList.get(0).queryClassificationProductLinks(refType).asList(100);
        var styleTemplateID = baseStyleTemplates.get(0).getClassification().getID();
        if (templateID == styleTemplateID) {
            var template = baseStyleTemplates.get(0).getClassification()
            var variantObjects = template.getChildren();
            var variantValuesByType = new java.util.HashMap();

            for (var i = 0; i < variantObjects.size(); i++) {
                var variantNode = variantObjects.get(i);
                if (variantNode.getObjectType().getName() == "VariantObject") {
                    var variantTypeId = variantNode.getValue("a_Variant_Type_ID").getSimpleValue();
                    var variantValueId = variantNode.getValue("a_Variant_Value_ID").getSimpleValue();
                    var variantValueClass = step.getClassificationHome().getClassificationByID(variantValueId);
                    var variantValueLovId = variantValueClass.getValue("ValueID").getSimpleValue();
                    if (variantValuesByType.containsKey(variantTypeId)) {
                        variantValuesByType.get(variantTypeId).push(variantValueLovId);
                    } else {
                        var valueIds = [];
                        valueIds.push(variantValueLovId);
                        variantValuesByType.put(variantTypeId, valueIds);
                    }
                }
            }
        }

        var SMGs = new java.util.HashMap();
        for (var k = 0; k < styleList.size(); k++) {
            var logicalGroupID = new java.util.StringJoiner("-");
            var flag = false;
            var variantTypeIter = variantValuesByType.keySet().iterator();
            while (variantTypeIter.hasNext()) {
                var variantTypeId = variantTypeIter.next();
                var allowedTagValues = variantValuesByType.get(variantTypeId);
                logicalGroupID.add(variantTypeId);
                var tagType = step.getClassificationHome().getClassificationByID(variantTypeId);
                var attributeId = tagType.getValue("a_ProductTagLov_AttributeID").getSimpleValue();
                var style = styleList.get(k);
                var styleTagValues = style.getValue(attributeId).getValues().toArray();
                if (styleTagValues.length > 0) {
                    for (var val in styleTagValues) {
                        var value = styleTagValues[val].getLOVValue().getID();
                        if (allowedTagValues.includes(value)) {
                            logicalGroupID.add(value);
                            flag = true;
                            break;
                        }
                    }
                }

                if (flag) {
                    var logicalGroupIDKey = logicalGroupID.toString();
                    log.info(SMGs.containsKey(logicalGroupIDKey));
                    if (SMGs.containsKey(logicalGroupIDKey)) {
                        SMGs.get(logicalGroupIDKey).add(style.getValue("a_Style_Number").getSimpleValue());
                    } else {
                        var eachSMGStyleList = new java.util.ArrayList();
                        eachSMGStyleList.add(style.getValue("a_Style_Number").getSimpleValue());
                        log.info(eachSMGStyleList);
                        SMGs.put(logicalGroupIDKey, eachSMGStyleList);
                    }
                } else {
                    log.info();//tag value not valid
                }
                log.info(style.getValue("a_Style_Number").getSimpleValue() + " " + logicalGroupID);
            }

        }

        var finalList = new java.util.ArrayList();
        var smgIter = SMGs.keySet().iterator();
        while (smgIter.hasNext()) {
            var singleGroup = smgIter.next();
            finalList.add(SMGs.get(singleGroup));
        }
        log.info(finalList);
        return finalList;//return finalList, MVGID, StartDate, EndDate, StartTime
    }
}


function checkBrand(styleList) {
    var brand = new java.util.HashSet();
    styleList.forEach(style => {
        brand.add(style.getValue("a_Brand_Number").getSimpleValue());
    });

    if (brand.size() > 1) return false;
    return true;
}

function validateStylesPartOfAnotherGroup(styleList) {
    styleList.forEach(style => {

    });
}

function DraftCheck(styleList, markets) {
    for (var i = 0; i < styleList.size(); i++) {
        markets.forEach(mkt => {
            var context = LKT.getLookupTableValue("LKT_Context_to_SKU_Enrich_Workflows", mkt);
            step.executeInContextManager(function (otherManager) {
                var ctxNode = otherManager.getObjectFromOtherManager(styleList.get(i));
                var ctxStyleLcs = ctxNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (ctxStyleLcs == "Draft" || ctxStyleLcs == "Purged"){
                	
                }
            });
        });
    }
}

var styleList = new java.util.ArrayList;
var style1 = step.getProductHome().getProductByID("000468762");
var style2 = step.getProductHome().getProductByID("000531321");
var style3 = step.getProductHome().getProductByID("000599749");
var style4 = step.getProductHome().getProductByID("000604373");
styleList.add(style1);
styleList.add(style2);
styleList.add(style3);
styleList.add(style4);
validateStyles(styleList);

}