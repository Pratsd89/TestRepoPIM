/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Setting_CC_Visibility_On_Shot_Request",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Setting CC Visibility On Shot Request",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,lookupTable) {
function createCCToPhotoShotRef(otherContext) {
    var sReferencingCCs = new java.util.ArrayList();
    sReferencingCCs.addAll(node.getReferencedByProducts());
    if (!sReferencingCCs.isEmpty()) {
        for (var num = 0; num < sReferencingCCs.size(); num++) {
            stepManager.executeInContext(otherContext, function (otherContextManager) {

                otherShotRequest = otherContextManager.getEntityHome().getEntityByID(node.getID());
                var currentCC = sReferencingCCs.get(num).getSource();
                var otherCC = otherContextManager.getProductHome().getProductByID(currentCC.getID());
                //since we are creating  link and adding SA Market for BOM CC we should check if cc has this market before creating the link PPIM-13065
                var SR_Market = otherContext.toString().split("_")[1]
                var cc_Market = otherCC.getValue("a_Market_Designation").getSimpleValue();
                if (cc_Market.contains(SR_Market)) {
                    try {
                        otherCC.createReference(otherShotRequest, 'CCToPhotoShotRef');
                    }
                    catch (e) {
                        if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
                            log.info("Shot Request Link already exist for " + otherCC.getID());
                        }
                    }
                }
            });
        }
    }
}

//As part of 7555 - Made below changes as Context Agnostic with help of lookupTable LKT_MarketDesignationToMarket
var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();
var currentContext = stepManager.getCurrentContext().getID();
var contexts = new Array();

// As per existing behaviour, this logic is executed only if the a_Shared_Markets have 2 markets
// Added below condition as part of PPIM-7555(Japan Market), inorder to execute only if a_Shared_Markets have 2 or more Markets
if (sharedMarkets != null && sharedMarkets.length > 1) {
    //get context ID for each market from lookup table
    sharedMarkets.forEach(function (market) {
        log.info('market' + market.getSimpleValue())
        contexts.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", market.getSimpleValue()));
    });
    contexts.forEach(function (context) {
        if (currentContext != context) {

            createCCToPhotoShotRef(context);
        }
    });
}
}