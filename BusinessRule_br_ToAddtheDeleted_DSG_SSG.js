/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ToAddtheDeleted_DSG_SSG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_ToAddtheDeleted_DSG_SSG",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "DuplicateStyleGroup", "SimilarStyleGroup" ],
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "rt_mergeDuplicateStyles",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_mergeDuplicateStyles",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "rt_styles",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_styles",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,rt_mergeDuplicateStyles,rt_styles,manager) {
var ObjectType = node.getObjectType().getID();
var References;
if (ObjectType == "DuplicateStyleGroup") {
    manager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        References = getReferences(currentContextNode, rt_mergeDuplicateStyles);
    });

    //log.info("References=" + References);
    var context = ["EN_CA", "FR_CA"];
    for (var j in context) {
        addReferences(node, context[j], rt_mergeDuplicateStyles, References);
    }
}

if (ObjectType == "SimilarStyleGroup") {
    manager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        References = getReferences(currentContextNode, rt_styles);
    });

    //log.info("References=" + References);
    var context = ["EN_CA", "FR_CA"];
    for (var j in context) {
        addReferences(node, context[j], rt_styles, References);
    }
}




function getReferences(node, RefType) {
    var References = node.getReferences(RefType).toArray();
    return References;
}

function addReferences(node, context, RefType, References) {
    manager.executeInContext(context, function(currentContextManager) {
        //log.info("context=" + context);
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        for (var i in References) {
            var metadata = References[i].getValue("a_Primary_Selling_Style").getSimpleValue();
            var Ref = References[i].getTarget();
            //log.info("Ref=" + Ref);
            try {
                var newRef = currentContextNode.createReference(Ref, RefType);
                if (metadata != null) {
                    newRef.getValue("a_Primary_Selling_Style").setSimpleValue(metadata);
                }
            } catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
                    logger.info("Link already Exists");
                }
            }
        }

    });
}
}