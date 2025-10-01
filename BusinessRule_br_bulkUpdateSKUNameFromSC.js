/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_bulkUpdateSKUNameFromSC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_bulkUpdateSKUNameFromSC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeCode" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log,helper) {
var mktArray = [];
var marketToUpdate = node.getValue("a_SizeCodeUpdateMkts").getSimpleValue();
if (marketToUpdate != null) {
    var tempMarkets = marketToUpdate.split(";");
    for (var a = 0; a < tempMarkets.length; a++) {
        mktArray.push(tempMarkets[a]);
    }
    var mktSet = new java.util.HashSet(mktArray);
    var mktUniqueArray = mktSet.toArray();
    for (var i = 0; i < mktUniqueArray.length; i++) {
        var contextID = mktUniqueArray[i];
        if (contextID != null && contextID != "") {
            manager.executeInContext(contextID, function(contextManager) {
                var contextSizeCode = contextManager.getClassificationHome().getClassificationByID(node.getID());
                var refSKUs = contextSizeCode.getClassificationProductLinks().toArray();
                for (var j = 0; j < refSKUs.length; j++) {
                    var skuObj = refSKUs[j].getProduct();
                    helper.setSKUNameFromSizeCode(skuObj, manager);
                }
            });
        }
    }
    node.getValue("a_SizeCodeUpdateMkts").setSimpleValue("");
}
}