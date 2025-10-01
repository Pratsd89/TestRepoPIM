/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_matchAndLinkBOMCC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_matchAndLinkBOMCC",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,qh) {
/* PPIM-10741
 * 8c9c0c27-62b6-4f08-ac87-361210c06fda > 000372591 > 000372591001
 */
var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");
var refTypeStyle = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_Style");
var c = com.stibo.query.condition.Conditions;

function checkReference(currentParentStyleObj, parentStyle) {
    var isReference = false;
    var currentStyleRefs = currentParentStyleObj.getReferences(refTypeStyle).toArray();
    for (var i = 0; i < currentStyleRefs.length; i++) {
        var refTargetID = ref[i].getTarget().getID();
        if (refTargetID == parentStyle.getID()) {
            isReference = true;
        }
    }
    return isReference;
}

if (marketDesignation != null) {
    if (!marketDesignation.contains("US")) {
        var BOMCCNumber = node.getValue("a_BOM_CC_Number").getSimpleValue();
        var BOMCCRefList = node.getReferences(refType).toArray();
        if (BOMCCRefList.length == 0) {
            var parentStyle = node.getParent();
            var parentSubClass = parentStyle.getParent();
            var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(c.hierarchy().simpleBelow(parentSubClass)
                .and(c.objectType(manager.getObjectTypeHome().getObjectTypeByID("CustomerChoice"))));
            var res = querySpecification.execute();
            res.forEach(function(resNode) {
                var currentMarketDesignation = resNode.getValue("a_Market_Designation").getSimpleValue();
                if (resNode.getID() != node.getID() && currentMarketDesignation.contains("US")) {
                    var currentBOMCCNum = resNode.getValue("a_BOM_CC_Number").getSimpleValue();
                    //log.info(BOMCCNumber + " - " + BOMCCNumber);
                    if (BOMCCNumber != null && currentBOMCCNum != null && currentBOMCCNum == BOMCCNumber) {
                        //log.info("CC Ref creating");
                        var ccRefCreated = node.createReference(resNode, refType);
                        var currentParentStyle = resNode.getParent();
                        if (checkReference(currentParentStyle, parentStyle)) {
                            //log.info("Style Ref creating");
                            var styleRefCreated = parentStyle.createReference(currentParentStyle, refTypeStyle);
                            var inheritCopyOptions = parentStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
                            if (inheritCopyOptions != null) {
                                if (inheritCopyOptions.contains("SA") == false) {
                                    parentStyle.getValue("a_Inherit_US_Copy_Option").addValue("SA");
                                }
                            }
                        }
                    }
                }
                return true;
            });
        }
    }
}
}