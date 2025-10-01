/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MVGTemplateValidationwithSMG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_MVGTemplateValidationwithSMG",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "MVGTemplate", "MultiVariantGroup", "VariantObject" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "PPHToMVGTemplate",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "PPHToMVGTemplate",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MultiVariant_Group_Reference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MultiVariant_Group_Reference",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "EP",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "rt_ProductGroups",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,PPHToMVGTemplate,MultiVariant_Group_Reference,EP,rt_ProductGroups) {
var isDeletedNode = manager.getProductHome().getProductByID(node.getID());
if(isDeletedNode != null){
var ObjType = node.getObjectType().getID();
//log.info(ObjType);

if (ObjType == "MultiVariantGroup") {
    manager.executeInContext('EN_US', function(usContextManager) {
        var usCurrentProduct = usContextManager.getProductHome().getProductByID(node.getID());
        usCurrentProduct.getValue("a_MVG_error_reason").deleteCurrent();
        MVGValidation(usCurrentProduct, "EN_US");
    });
    manager.executeInContext('EN_CA', function(caContextManager) {
        var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());
        caCurrentProduct.getValue("a_MVG_error_reason").deleteCurrent();
        MVGValidation(caCurrentProduct,"EN_CA");
    });
}


if (ObjType == "MVGTemplate") {
    var ref = node.queryClassificationProductLinks().asList(1000);
    if (ref) {
        var Products = ref.iterator();
        while (Products.hasNext()) {
            var product = Products.next();
            var Obj = product.getProduct();
            if (Obj.getObjectType().getID() == "MultiVariantGroup") {
                EP.republish(Obj);
            }
        }
    }
}


if (ObjType == "VariantObject") {
    var validMVG = true;
    var MVGTemplate = node.getParent();
    EP.republish(MVGTemplate);
}
}

function MVGValidation(ContextMVG, context) {
    var styleArray = [];
    var ProductGroup = [];
    var result1 = true;
    var result2 = true;
    var queryMVGTemplate = ContextMVG.queryClassificationProductLinks(PPHToMVGTemplate).asList(10);

    if (queryMVGTemplate.size() > 0) {
        var MVGTemplate = queryMVGTemplate.get(0).getClassification();
        var UniqueTagType = getUniqueTagTypes(MVGTemplate);
        var refList = ContextMVG.queryReferences(MultiVariant_Group_Reference).asList(1000).toArray();

        for (var k in refList) {
            var objectType = refList[k].getTarget().getObjectType().getID();
            if (objectType == "Style") {
                styleArray.push(refList[k].getTarget());
                var style = refList[k].getTarget();
                //log.info(style);
                var ref = style.queryReferencedBy(rt_ProductGroups).asList(100).toArray();
                for (var p in ref) {
                    //log.info(ref[p].getSource());
                    ProductGroup.push(ref[p].getSource().getID());
                }

            }
            if (objectType == "Product_Group") {
                ProductGroup.push(refList[k].getTarget().getID());
            }
        }

        var UniqueProductGroup = removeDuplicates(ProductGroup);

        if (styleArray.length > 0) {
            var result1 = checkValidStyleValues(styleArray, UniqueTagType, context, ContextMVG);
        }

        if (ProductGroup.length > 0) {

            var result2 = checkvalidvalueonProductGroup(UniqueProductGroup, UniqueTagType, context, ContextMVG);
        }

        //log.info("result1=" + result1);
        //log.info("result2=" + result2);

        if (result1 == true && result2 == true) {
            MVGWorkflowMovement(ContextMVG, true, context);
        } else {
            MVGWorkflowMovement(ContextMVG, false, context);
        }
    }
}

function checkValidStyleValues(Stylelist, UniqueTagType, context, ContextMVG) {
    var validMVG = true;
    for (var j in UniqueTagType) {
        for (var k in Stylelist) {
            var count = 0;
            //log.info("count=" + count);
            var style = Stylelist[k];
            //log.info("style=" + style);
            //log.info(UniqueTagType[j].Attr_ID);
            //log.info(style.getValue(UniqueTagType[j].Attr_ID).getSimpleValue());
            //log.info(UniqueTagType[j].Values);
            var attr = manager.getAttributeHome().getAttributeByID(UniqueTagType[j].Attr_ID);
            var attr_Name = attr.getName();
            var styleValue = style.getValue(UniqueTagType[j].Attr_ID).getSimpleValue();
            var StyleID = style.getID();
            if (styleValue != null) {
                if (styleValue.includes("<multisep/>")) {
                    var styleValueArr = styleValue.split("<multisep/>");
                    for (var z in styleValueArr) {
                        if ((UniqueTagType[j].Values).includes(styleValueArr[z])) {
                            count = count + 1;
                        }
                    }
                    if (count == 0) {
                        validMVG = false;
                        addMVGErrorReason(ContextMVG, "Context :" + context + " Style : " + StyleID + " the " + attr_Name + " doesn't have any of the value : " + UniqueTagType[j].Values);
                    }
                } else {
                    // log.info("Contains=" + (UniqueTagType[j].Values).includes(styleValue));
                    if (!(UniqueTagType[j].Values).includes(styleValue)) {
                        validMVG = false;
                        addMVGErrorReason(ContextMVG, "Context :" + context + " Style : " + StyleID + " the " + attr_Name + " doesn't have any of the value : " + UniqueTagType[j].Values);
                    }
                }
            } else {
                validMVG = false;
                addMVGErrorReason(ContextMVG, "Context :" + context + " Style : " + StyleID + " there is no value for the " + attr_Name);
            }
            //log.info("validMVG=" + validMVG);
        }
    }
    return validMVG;
}

function checkvalidvalueonProductGroup(ProductGroup, UniqueTagType, context, ContextMVG) {
    var validMVG = true;
    var styleList = [];
    var attributeList = [];
    for (var z in ProductGroup) {
        var PG;
        manager.executeInContext(context, function(ContextManager) {
            PG = ContextManager.getProductHome().getProductByID(ProductGroup[z]);
        });
        var ref = PG.queryReferences(rt_ProductGroups).asList(1000).toArray();
        for (var k in ref) {
            var style = ref[k].getTarget();
            //log.info(style);
            styleList.push(style);
        }
    }

    for (var j in UniqueTagType) {
        attributeList.push(UniqueTagType[j].Attr_ID);
    }
    var validMVG = checkValidStyleValues(styleList, UniqueTagType, context, ContextMVG);

    //log.info("validMVG="+validMVG);

    var StyleSameValues = doAllStylesHaveSameAttributesAndValues(styleList, attributeList, context, ContextMVG);

    //log.info("StyleSameValues="+StyleSameValues);

    if (validMVG == true && StyleSameValues == true) {
        return true;
    } else {
        return false;
    }
}

function doAllStylesHaveSameAttributesAndValues(styleList, attributeList, context, ContextMVG) {
    var isSame = true;

    for (var i = 0; i < styleList.length; i++) {
        var styleA = styleList[i];
        //log.info("styleA=" + styleA);
        for (var j = i + 1; j < styleList.length; j++) {
            var styleB = styleList[j];
            //log.info("styleB=" + styleB);
            for (var p in attributeList) {
            var attr = manager.getAttributeHome().getAttributeByID(attributeList[p]);
            var attr_Name = attr.getName();
            	
                var valueA = getSafeValue(styleA, attributeList[p]);
                var valueB = getSafeValue(styleB, attributeList[p]);
               // log.info("valueA=" + valueA);
               // log.info("valueB=" + valueB);
                if (valueA != valueB) {
                    isSame = false;
                    addMVGErrorReason(ContextMVG, "Context :" + context + " Style : " + styleA.getID() + " , " + styleB.getID() + " doesn't have same value for the attribute " + attr_Name);
                }
            }
        }
    }

    return isSame;
}

function getSafeValue(style, attribute) {
    var value = style.getValue(attribute).getSimpleValue();
    return value;
}


function getUniqueTagTypes(MVGTemplate) {
    var UniquesValues = [];
    var VariantObject = MVGTemplate.queryChildren().asList(1000).toArray();
    //log.info(MVGTemplate);
    for (var i in VariantObject) {
        var TagType = VariantObject[i].getValue("a_Variant_Type_ID").getSimpleValue();
        var TagValue = VariantObject[i].getValue("a_Variant_Value_ID").getSimpleValue();
        var TagTypeClassification = manager.getClassificationHome().getClassificationByID(TagType);
        var TagValueClassification = manager.getClassificationHome().getClassificationByID(TagValue);
        if (TagTypeClassification != null) {
            var Attrid = TagTypeClassification.getValue("a_ProductTagLov_AttributeID").getSimpleValue();
            if (TagValueClassification != null) {
                var value = TagValueClassification.getName();
                UniquesValues.push({
                    Attr_ID: Attrid,
                    Value: value
                });
            }
        }
    }
    var map = {};
    UniquesValues.forEach(entry => {
        var key = entry.Attr_ID;
        if (map[key]) {
            map[key].Values.push(entry.Value);
        } else {
            map[key] = {
                Attr_ID: key,
                Values: [entry.Value]
            };
        }


    });
    var result = [];
    for (var k in map) {
        result.push(map[k]);
    }

    //log.info(result[0].Values);
    return result;

    /*
    var UniqueTagType = [];
    TagTypes.forEach(Tag => {
        if (!UniqueTagType.includes(Tag)) {
            UniqueTagType.push(Tag);
        }
    });
    return UniqueTagType;
    */
}

function addMVGErrorReason(ContextMVG, message) {
    //ContextMVG.getValue("a_MVG_error_reason").addValue(message);

    var error = ContextMVG.getValue("a_MVG_error_reason").getSimpleValue();

    if (error == null) {
        ContextMVG.getValue("a_MVG_error_reason").setSimpleValue(message);

    } else {
        try {
            var msg = error + "," + "\n" + message;
            ContextMVG.getValue("a_MVG_error_reason").setSimpleValue(msg);
        } catch (e) {
            if (e.javaException instanceof com.stibo.core.domain.impl.validation.exception.LengthValidatorException) {
                   
                }
            }
        }
    }

function MVGWorkflowMovement(MVG, validMVG, context) {
    // log.info("MVG=" + MVG.getID());
    //log.info("FinalvalidMVG=" + validMVG);
    //log.info("Workflow=" + MVG.isInWorkflow("wf_MVG_Status"));
    if (!MVG.isInWorkflow("wf_MVG_Status")) {
        MVG.startWorkflowByID("wf_MVG_Status", "Intiating into Workflow");
    }

    if (validMVG == true) {
        if (MVG.isInState("wf_MVG_Status", context + "_MVG_Initial")) {
            MVG.getWorkflowInstanceByID("wf_MVG_Status").getTaskByID(context + "_MVG_Initial").triggerByID("Completed", "Completed");
            MVG.getValue("a_MVG_Status").setSimpleValue("Completed");
        }
        if (MVG.isInState("wf_MVG_Status", context + "_MVG_ReviewProblemGroup")) {
            MVG.getWorkflowInstanceByID("wf_MVG_Status").getTaskByID(context + "_MVG_ReviewProblemGroup").triggerByID("Completed", "Completed");
            MVG.getValue("a_MVG_Status").setSimpleValue("Completed");
            
        }
    } else {
        if (MVG.isInState("wf_MVG_Status", context + "_MVG_Initial")) {
            MVG.getWorkflowInstanceByID("wf_MVG_Status").getTaskByID(context + "_MVG_Initial").triggerByID("Error", "Error");
            MVG.getValue("a_MVG_Status").setSimpleValue("Review-problem group");
        }
        if (MVG.isInState("wf_MVG_Status", context + "_MVG_Completed")) {
            MVG.getWorkflowInstanceByID("wf_MVG_Status").getTaskByID(context + "_MVG_Completed").triggerByID("Error", "Error");
            MVG.getValue("a_MVG_Status").setSimpleValue("Review-problem group");
        }
    }

}

function removeDuplicates(ProductGroup) {
    var rawValue = String(ProductGroup);
    var splitItems = rawValue.split(',');
    var uniqueItems = [];
    var seen = {};

    for (var i = 0; i < splitItems.length; i++) {
        var item = splitItems[i];
        if (!seen[item]) {
            seen[item] = true;
            uniqueItems.push(item);
        }
    }

    var result = uniqueItems.join(',');

    return uniqueItems;
}
}