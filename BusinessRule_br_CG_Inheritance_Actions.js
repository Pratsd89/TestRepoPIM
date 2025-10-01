/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CG_Inheritance_Actions",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Content Group Inheritance Actions",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Content_Group", "CMS_Slot" ],
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
    "alias" : "step",
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
    "contract" : "BusinessActionBindContract",
    "alias" : "setNewSortOrders",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_CG_Sort_Order_Buffer",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "publishChildCats",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Publish_Child_Cats_to_DGL",
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
exports.operation0 = function (node,step,webUI,setNewSortOrders,publishChildCats,LKT) {
function checkAttributeObjectValidity(node, attribute) {
    var validityFlag = false;
    var validObjectTypes = attribute.getValidForObjectTypes().toArray();

    for (var j = 0; j < validObjectTypes.length; j++) {
        if (validObjectTypes[j].getID() == node.getObjectType().getID()) {
            validityFlag = true;
            break;
        }
    }
    return validityFlag;
}

function inheritAttributes(node, engContext, langContext, manager) {
    var engMarket = LKT.getLookupTableValue("LKT_Context_to_Market", engContext);
    var mktATG = manager.getAttributeGroupHome().getAttributeGroupByID("ag_WebCat_Market_Dependent_ATTs");
    var mktLangATG = manager.getAttributeGroupHome().getAttributeGroupByID("ag_WebCat_Market_Language_Dependent_ATTs");
    var mktAttributes = [];
    var langAttributes = [];

    mktATG.getAttributes().toArray().forEach(function (attr) {
        mktAttributes.push(attr);
    });

    mktLangATG.getAttributes().toArray().forEach(function (attr) {
        mktAttributes.push(attr);
        langAttributes.push(attr);
    });

    manager.executeInContext("EN_US", function (usManager) {
        // populate attribute values from EN_US to engContext for attributes in ag_WebCat_Market_Dependent_ATTs & ag_WebCat_Market_Language_Dependent_ATTs
        var usNode = usManager.getClassificationHome().getClassificationByID(node.getID());
        var usCatStart = usNode.getValue("a_WebCategory_Start_Date").getSimpleValue();
        var usCatEnd = usNode.getValue("a_WebCategory_End_Date").getSimpleValue();
        var sortOrder = usNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();
        var activeCat = true;

        var today = java.time.ZonedDateTime.now();
        var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
        today = today.format(formatter);

        //determine if category is active in US market
        if (usCatStart == null || usCatEnd < today) {
            activeCat = false;
        }

        if (!activeCat) {
            // throw error if user is trying to inherit attributes from an inactive US CG
            if (currentMarket != "US") {
                usNode.getValue("a_Content_Group_Can_InheritOption").setSimpleValue(null);
                webUI.showAlert("ERROR", "<b>" + "Inherit Option Removed:</b>", "<b> This " + objectTypeName + "  is not active in the US Market.</b>");
                return;
            }

            if (sortOrder != "9999") {
                usNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("9999");
                fixSortOrders = true;
            }
        } else {
            if (sortOrder == "9999") {
                usNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("1");
                if (setSortToTopMkts == null) {
                    setSortToTopMkts = "US"
                    fixSortOrders = true;
                }
            }
        }
        sortOrder = usNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();

        for (var i = 0; i < mktAttributes.length; i++) {
            var validityFlag = checkAttributeObjectValidity(usNode, mktAttributes[i]);
            if (validityFlag == true) {
                var attributeId = mktAttributes[i].getID();
                var attributeValue = usNode.getValue(attributeId).getSimpleValue();

                usManager.executeInContext(engContext, function (otherManager) {
                    var cntxtMarket = LKT.getLookupTableValue("LKT_Context_to_Market", engContext);
                    var cntxtNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
                    var cntxtValue = cntxtNode.getValue(attributeId).getSimpleValue();
                    var cntxtSortOrder = cntxtNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();

                    // copy attribute values from US to engContext
                    if (cntxtValue != attributeValue) {
                        if (currentContext == engContext) {
                            webUI.showAlert("WARNING", "<b>" + "Modification in context " + currentContext + " will not apply, as this ContentGroup is inheriting values from the US market. Please switch to EN_US to modify this ContentGroup.</b>");
                        }
                        cntxtNode.getValue(attributeId).setSimpleValue(attributeValue);
                    }

                    // establish new sort order values based on inheritance option & if cat is active in US
                    if (cntxtSortOrder != sortOrder) {
                        cntxtNode.getValue("a_WebCategory_Sort_Order").setSimpleValue(sortOrder);
                        cntxtNode.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue(null);
                        fixSortOrders = true;
                    }

                    if (sortOrder == null) {
                        webUI.showAlert("WARNING", "<b>" + "This " + objectTypeName + "is missing a Sort order value in the US Market. Please navigate to the parent " + parentObjType + " and update the sort order in the US market.</b>");
                    }
                    else if (sortOrder == "1") {
                        if (setSortToTopMkts == null) {
                            setSortToTopMkts = engMarket;
                            fixSortOrders = true;
                        }
                        else if (setSortToTopMkts.indexOf(engMarket) == -1) {
                            setSortToTopMkts = setSortToTopMkts + ";" + engMarket;
                            fixSortOrders = true;
                        }
                    }
                });
            }
        }
    });
}

function inheritSortOrder(node, context, manager) {
    // copy EN_US sort order values to "context" for all child ContentGroups (node = Slot), if not excluded and if the category is active
    manager.executeInContext('EN_US', function (usManager) {
        var cntxtCat = usManager.getClassificationHome().getClassificationByID(node.getID());
        var cntxtCatChildren = cntxtCat.getChildren().iterator();
        var today = java.time.ZonedDateTime.now();
        while (cntxtCatChildren.hasNext()) {
            var childCat = cntxtCatChildren.next();
            var childCatObjectType = childCat.getObjectType().getID();

            if (childCatObjectType == "CMS_Content_Group") {
                var usChildCatExclValue = childCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();
                if (usChildCatExclValue != null) {
                    //force users to set exclusions in desired market
                    childCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue(null);
                }

                var usCatStart = childCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                var usCatEnd = childCat.getValue('a_WebCategory_End_Date').getSimpleValue();
                var usSortOrder = childCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();

                // Case 1: CG is active in EN_US
                if ((usCatStart != null && usCatEnd > today) || (usCatStart != null && usCatEnd == null)) {
                    usManager.executeInContext(context, function (otherManager) {
                        var cntxtChildCat = otherManager.getClassificationHome().getClassificationByID(childCat.getID());
                        var cntxtCatStart = cntxtChildCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                        var cntxtCatEnd = cntxtChildCat.getValue('a_WebCategory_End_Date').getSimpleValue();
                        var inheritOption = cntxtChildCat.getValue('a_Content_Group_Can_InheritOption').getSimpleValue();
                        var cntxtChildCatExclValue = null;
                        if (inheritOption == null) {
                            cntxtChildCatExclValue = "Yes";
                            cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue('Yes');
                        }

                        // Copy sort order only if not excluded and CG is active in context
                        if (cntxtChildCatExclValue != "Yes") {
                            if ((cntxtCatStart != null && cntxtCatEnd > today) || (cntxtCatStart != null && cntxtCatEnd == null)) {
                                cntxtChildCat.getValue('a_WebCategory_Sort_Order').setSimpleValue(usSortOrder);
                            }
                        }
                    });
                }
                // Case 2: US CG is inactive
                else if (usCatStart == null || usCatEnd < today) {
                    usManager.executeInContext(context, function (otherManager) {
                        var cntxtChildCat = otherManager.getClassificationHome().getClassificationByID(childCat.getID());
                        var cntxtCatStart = cntxtChildCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                        var cntxtCatEnd = cntxtChildCat.getValue('a_WebCategory_End_Date').getSimpleValue();
                        var cntxtChildCatExclValue = cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();

                        // If active in this context, explicitly exclude US sort inheritance
                        if (cntxtChildCatExclValue != "Yes") {
                            if ((cntxtCatStart != null && cntxtCatEnd > today) || (cntxtCatStart != null && cntxtCatEnd == null)) {
                                cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue('Yes');
                            }
                        }
                    });
                }
            }
        }
    });
}

function setSortOrderInCurrentMarket(node, manager) {
    var today = java.time.ZonedDateTime.now();
    var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
    today = today.format(formatter);

    var catStart = node.getValue("a_WebCategory_Start_Date").getSimpleValue();
    var catEnd = node.getValue("a_WebCategory_End_Date").getSimpleValue();
    var catSortOrder = node.getValue("a_WebCategory_Sort_Order").getSimpleValue();

    // when no inheritance, ensure Sort Order values are populated for ContentGroups
    if (objectType != "CMS_Slot") {

        // Case 1: Inactive CG — set sort order to 9999
        if (catStart == null || catEnd < today) {
            if (catSortOrder != "9999") {
                node.getValue("a_WebCategory_Sort_Order").setSimpleValue("9999");
                fixSortOrders = true;
            }
        }
        // Case 2: Active CG
        else {
            //If previously 9999, reset to 1 or inherit from EN_US
            if (catSortOrder == "9999") {
                node.getValue("a_WebCategory_Sort_Order").setSimpleValue("1");
                setSortToTopMkts = currentMarket;
                fixSortOrders = true;

                if (currentMarket != "US") {
                    node.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue("Yes");
                } else {
                    manager.executeInContext('EN_CA', function (canManager) {
                        var canNode = canManager.getClassificationHome().getClassificationByID(node.getID());
                        canNode.getValue("a_Exclude_from_US_Sort_Inherit").setValue(null);
                    });
                }
            }
        }
    }
    if ((catStart != null && catEnd > today) || (catStart != null && catEnd == null)) {
        catSortOrder = node.getValue("a_WebCategory_Sort_Order").getSimpleValue();
        if (catSortOrder == null) {
            webUI.showAlert("WARNING", "<b>" + "This " + objectTypeName + "is missing a Sort order value in the " + currentMarket + " Market. Please navigate to the parent " + parentObjType + " and update the sort order for this market.</b>");
        }
    }
}



var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
var objectType = node.getObjectType().getID();
var objectTypeName = node.getObjectType().getName();
var inheritCAN = null;

// variables to validate if Sort Order inheritance should apply
var parentObjType = "";
var missingSortMkts = null;
var setSortToTopMkts = null;
var fixSortOrders = false;

if (objectType == "CMS_Content_Group") {
    // start inheritance logic
    inheritCAN = node.getValue("a_Content_Group_Can_InheritOption").getSimpleValue();
    parentObjType = node.getParent().getObjectType().getName();
}

// determine if Sort Order inheritance should apply
var hasChildCategories = false;
if (objectType == "CMS_Slot") {
    if (node.getChildren().size() > 0) {
        hasChildCategories = true;
    }
}

// run inheritance functions depending on attribute value selection(s)
if (currentMarket != "JPN") {
    if (objectType == "CMS_Slot") {
        if (hasChildCategories == true) {
            inheritSortOrder(node, "EN_CA", step);
        }
    } else if (objectType == "CMS_Content_Group") {
        if (inheritCAN == "CAN") {
            inheritAttributes(node, "EN_CA", "FR_CA", step);
        } else {
            setSortOrderInCurrentMarket(node, step);
        }
    }
}

if (fixSortOrders == true) {
    setNewSortOrders.execute(node.getParent());
    publishChildCats.execute(node.getParent());
}

if (setSortToTopMkts != null) {
    webUI.showAlert("WARNING", "<b>" + "This " + objectTypeName + "  was sorted to top of list for parent " + parentObjType + " in Markets " + setSortToTopMkts + ". Please navigate to the parent " + parentObjType + " and adjust sort orders, if needed.</b>");
}
else if (missingSortMkts != null) {
    webUI.showAlert("WARNING", "<b>" + "This " + objectTypeName + " does not have a Sort Order value in " + missingSortMkts + ". Please navigate to the parent " + parentObjType + " and adjust sort order accordingly, for each market.</b>");
}
}