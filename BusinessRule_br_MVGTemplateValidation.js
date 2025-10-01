/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MVGTemplateValidation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_MVGTemplateValidation",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,PPHToMVGTemplate,MultiVariant_Group_Reference,EP) {
var ObjType = node.getObjectType().getID();
log.info(ObjType);
if (ObjType == "MultiVariantGroup") {
    manager.executeInContext('EN_US', function(usContextManager) {
        var usCurrentProduct = usContextManager.getProductHome().getProductByID(node.getID());
        MVGValidation(usCurrentProduct);
    });
    manager.executeInContext('EN_CA', function(caContextManager) {
        var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());
        MVGValidation(caCurrentProduct);
    });
}
if (ObjType == "MVGTemplate") {
    manager.executeInContext('EN_US', function(usContextManager) {
        var usCurrentProduct = usContextManager.getClassificationHome().getClassificationByID(node.getID());
        MVGTemplate(usCurrentProduct);
    });
    manager.executeInContext('EN_CA', function(caContextManager) {
        var caCurrentProduct = caContextManager.getClassificationHome().getClassificationByID(node.getID());
        MVGTemplate(caCurrentProduct);
    });
}


if (ObjType == "VariantObject") {
    var validMVG = true;
    var MVGTemplate = node.getParent();
    EP.republish(MVGTemplate);
}

function MVGValidation(node) {
    var validMVG = true;
    var queryMVGTemplate = node.queryClassificationProductLinks(PPHToMVGTemplate).asList(10);
    if (queryMVGTemplate.size() > 0) {
        var MVGTemplate = queryMVGTemplate.get(0).getClassification();
        var UniqueTagType = getUniqueTagTypes(MVGTemplate);
        for (var j in UniqueTagType) {
            var Stylelist = node.queryReferences(MultiVariant_Group_Reference).asList(1000).toArray();
            for (var k in Stylelist) {
                var count = 0;
                //log.info("count=" + count);
                var style = Stylelist[k].getTarget();
                //log.info("style=" + style);
                //log.info(UniqueTagType[j].Attr_ID);
               // log.info(style.getValue(UniqueTagType[j].Attr_ID).getSimpleValue());
                //log.info(UniqueTagType[j].Values);
                var styleValue = style.getValue(UniqueTagType[j].Attr_ID).getSimpleValue();
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
                        }
                    } else {
                        //log.info("Contains=" + (UniqueTagType[j].Values).includes(styleValue));
                        if (!(UniqueTagType[j].Values).includes(styleValue)) {
                            validMVG = false;
                        }
                    }
                } else {
                    validMVG = false;
                }
                //log.info("validMVG=" + validMVG);
            }
            MVGWorkflowMovement(node, validMVG);
        }
    }
}

function MVGTemplate(node) {
    var UniqueTagType = getUniqueTagTypes(node);
    for (var j in UniqueTagType) {
        var ref = node.queryClassificationProductLinks().asList(1000);
        if (ref) {
            var Products = ref.iterator();
            while (Products.hasNext()) {
                var product = Products.next();
                var Obj = product.getProduct();
                if (Obj.getObjectType().getID() == "MultiVariantGroup") {
                    var validMVG = true;
                    var MVG = Obj;
                    //log.info("MVG=" + MVG);
                    var Stylelist = MVG.queryReferences(MultiVariant_Group_Reference).asList(1000).toArray();
                    for (var k in Stylelist) {
                        var count = 0;
                        //log.info("count=" + count);
                        var style = Stylelist[k].getTarget();
                       // log.info("style=" + style);
                        //log.info(UniqueTagType[j].Attr_ID);
                        //log.info(style.getValue(UniqueTagType[j].Attr_ID).getSimpleValue());
                       // log.info(UniqueTagType[j].Values);
                        var styleValue = style.getValue(UniqueTagType[j].Attr_ID).getSimpleValue();
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
                                }
                            } else {
                                //log.info("Contains=" + (UniqueTagType[j].Values).includes(styleValue));
                                if (!(UniqueTagType[j].Values).includes(styleValue)) {
                                    validMVG = false;
                                }
                            }
                        } else {
                            validMVG = false;
                        }
                       // log.info("validMVG=" + validMVG);
                    }
                    MVGWorkflowMovement(MVG, validMVG);
                }
            }
        }
    }
}

function getUniqueTagTypes(MVGTemplate) {
    var UniquesValues = [];
    var VariantObject = MVGTemplate.queryChildren().asList(1000).toArray();
   // log.info(MVGTemplate);
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

function MVGWorkflowMovement(MVG, validMVG) {
   // log.info("MVG=" + MVG.getID());
    //log.info("FinalvalidMVG=" + validMVG);
    //log.info("Workflow=" + MVG.isInWorkflow("wf_MVG_Status"));
    if (!MVG.isInWorkflow("wf_MVG_Status")) {
        MVG.startWorkflowByID("wf_MVG_Status", "Intiating into Workflow");
    }
    if (validMVG == true) {
        if (MVG.isInState("wf_MVG_Status", "MVG_Initial")) {
            MVG.getWorkflowInstanceByID("wf_MVG_Status").getTaskByID("MVG_Initial").triggerByID("Completed", "Completed");
        }
        if (MVG.isInState("wf_MVG_Status", "MVG_ReviewProblemGroup")) {
            MVG.getWorkflowInstanceByID("wf_MVG_Status").getTaskByID("MVG_ReviewProblemGroup").triggerByID("Completed", "Completed");
        }
    } else {
        if (MVG.isInState("wf_MVG_Status", "MVG_Initial")) {
            MVG.getWorkflowInstanceByID("wf_MVG_Status").getTaskByID("MVG_Initial").triggerByID("Error", "Error");
        }
        if (MVG.isInState("wf_MVG_Status", "MVG_Completed")) {
            MVG.getWorkflowInstanceByID("wf_MVG_Status").getTaskByID("MVG_Completed").triggerByID("Error", "Error");
        }
    }
}
}