/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_updateMarketingFlag",
  "type" : "BusinessAction",
  "setupGroups" : [ "MarketingFlagActions" ],
  "name" : "ba_updateMarketingFlag",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "MarketingFlagName",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">MarketingFlagName</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,webUI,LKT,MarketingFlagName) {
var contextID = manager.getCurrentContext().getID();
manager.executeInContext(contextID, function(currentContextManager) {

    var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
    //var MarketingFlagName = currentContextNode.getName();
    if (MarketingFlagName == null) {
        webUI.showAlert("ERROR",  "Please provide  \"Marketing Flag Name\".");
    }

    if ((MarketingFlagName != null)) {

        //var Object = manager.getNodeHome().getObjectByKey("MarketingFlagKey", Brand + "_" + MarketingFlagType + "_" + MarketingFlagName);
        var Brand = currentContextNode.getValue("MarketingFlagBrand").getSimpleValue();
        var MarketingFlagType = currentContextNode.getValue("MarketingFlagType").getSimpleValue();
        var KeyValue = Brand + "_" + MarketingFlagType + "_" + MarketingFlagName;
        var Object = searchByAttributeValue(manager, "MarketingFlagKey", KeyValue);

        if (Object.size() > 0) {
            webUI.showAlert("ERROR",  "Marketing Flag " + MarketingFlagName + " is already present.");
        } else {

            currentContextNode.getValue("MarketingFlagName").setSimpleValue(MarketingFlagName);
            currentContextNode.getValue("MarketingFlagKey").setSimpleValue(KeyValue);
            currentContextNode.setName(MarketingFlagName);
            currentContextNode.approve();


            var ID = currentContextNode.getValue("MarketingFlagLOVId").getSimpleValue();
            var LOVID = LKT.getLookupTableValue("LKT_MarketingFlagLOVLookup", Brand + "_" + MarketingFlagType);
            var LOVObject = manager.getListOfValuesHome().getListOfValuesByID(LOVID);
            try {
                LOVObject.getListOfValuesValueByID(ID).setValue(MarketingFlagName, null);
            } catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.validatorexception.NonUniqueValuelDValidatorException) {
                    log.warning("Unique Value Exception");
                }
            }

            webUI.showAlert("ACKNOWLEDGMENT",  "The Marketing Flag " + MarketingFlagName + " is updated successfully.");
        }
    }
});


function searchByAttributeValue(manager, attributeID, attributeValue) {
    var attribute = manager.getAttributeHome().getAttributeByID(attributeID);
    searchHome = manager.getHome(com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome);
    searchArg = new com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome.SingleAttributeQuerySpecification(com.stibo.core.domain.Classification, attribute, attributeValue);
    var searchResult = "";
    if ((searchArg != null) && (attributeValue != null) && (attributeValue != "")) {
        searchResult = searchHome.querySingleAttribute(searchArg).asList(200);
    }
    return searchResult;
}
}