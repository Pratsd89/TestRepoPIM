/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_createMarketingFlag",
  "type" : "BusinessAction",
  "setupGroups" : [ "MarketingFlagActions" ],
  "name" : "ba_createMarketingFlag",
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
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "MarketingFlagName",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">MarketingFlagName</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
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
exports.operation0 = function (node,manager,webUI,MarketingFlagName,LKT) {
var contextID = manager.getCurrentContext().getID();
manager.executeInContext(contextID, function(currentContextManager) {
    var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
    if (MarketingFlagName == null) {
        webUI.showAlert("ERROR",  "Please provide  \"Marketing Flag Name\".");
    }
    var Brand = currentContextNode.getValue("MarketingFlagBrand").getSimpleValue();
    var MarketingFlagType = currentContextNode.getValue("MarketingFlagType").getSimpleValue();
    if ((Brand != null) && (MarketingFlagType != null) && (MarketingFlagName != null)) {
        var KeyValue = Brand + "_" + MarketingFlagType + "_" + MarketingFlagName;
        var Object = searchByAttributeValue(manager, "MarketingFlagKey", KeyValue);
        if (Object.size() > 0) {
            webUI.showAlert("ERROR",  "Marketing Flag " + MarketingFlagName + " is already present.");
        } else {
            var Entity = manager.getEntityHome().getEntityByID("MarketingFlagIDGenerator");
            var IDCounter = Entity.getValue('a_Last_ID_Value').getSimpleValue();
            var IDCounter = parseFloat(IDCounter);
            var ID = IDCounter + 1;
			//CCMF_AT_10001 OR SMF_AT_10002
            if (MarketingFlagType == "CC") {
                var newClassificationObjectID = "CCMF_" + Brand + "_" + ID;
                var newMarketingFlag = currentContextNode.createClassification(newClassificationObjectID, "CCMarketingFlag");
            }
            if (MarketingFlagType == "STYLE") {
                var newClassificationObjectID = "SMF_" + Brand + "_" + ID;
                var newMarketingFlag = currentContextNode.createClassification(newClassificationObjectID, "StyleMarketingFlag");
            }
            newMarketingFlag.getValue("MarketingFlagBrand").setSimpleValue(Brand);
            newMarketingFlag.getValue("MarketingFlagType").setSimpleValue(MarketingFlagType);
            newMarketingFlag.getValue("MarketingFlagName").setSimpleValue(MarketingFlagName);
            newMarketingFlag.getValue("MarketingFlagKey").setSimpleValue(KeyValue);
            newMarketingFlag.setName(MarketingFlagName);
            newMarketingFlag.getValue("MarketingFlagLOVId").setSimpleValue(ID);
            var LOVID = LKT.getLookupTableValue("LKT_MarketingFlagLOVLookup", Brand + "_" + MarketingFlagType);
            var LOVObject = manager.getListOfValuesHome().getListOfValuesByID(LOVID);
            try {
                LOVObject.createListOfValuesValue(MarketingFlagName, null, ID);
                Entity.getValue('a_Last_ID_Value').setSimpleValue(ID);
            } catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.validatorexception.NonUniqueValuelDValidatorException) {
                    log.warning("Unique Value Exception");
                }
            }
            newMarketingFlag.approve();
            webUI.showAlert("ACKNOWLEDGMENT",  "New Marketing Flag " + MarketingFlagName + " is created successfully.");
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