/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Test_CG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Test_CG",
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
    "contract" : "BusinessActionBindContract",
    "alias" : "setNewSortOrders",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Web_Hierarchy_Sort_Order_Buffer",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "publishChildCats",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Publish_Child_Cats_to_DGL",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,webUI,LKT,setNewSortOrders,publishChildCats) {
function inheritAttributesForWebCategory(node, engContext, manager) {
    var engMarket = LKT.getLookupTableValue("LKT_Context_to_Market", engContext);
    var inheritAtt = "a_" + engMarket + "_Inherit_Option";
    var parentInheritOption = node.getParent().getValue(inheritAtt).getSimpleValue();

    var mktATG = manager.getAttributeGroupHome().getAttributeGroupByID("ag_WebCat_Market_Dependent_ATTs");
    var mktLangATG = manager.getAttributeGroupHome().getAttributeGroupByID("ag_WebCat_Market_Language_Dependent_ATTs");
    var mktAttributes = [].concat(mktATG.getAttributes().toArray(), mktLangATG.getAttributes().toArray());

    manager.executeInContext("EN_US", function (usManager) {
        var usNode = usManager.getClassificationHome().getClassificationByID(node.getID());
        var nlumsg = slug.checkNLUmessage(node);
        var today = java.time.ZonedDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        var usCatStart = usNode.getValue("a_WebCategory_Start_Date").getSimpleValue();
        var usCatEnd = usNode.getValue("a_WebCategory_End_Date").getSimpleValue();
        var activeCat = !(usCatStart == null || usCatEnd < today);

        for (var i = 0; i < mktAttributes.length; i++) {
            var attributeId = mktAttributes[i].getID();
            var attributeValue = usNode.getValue(attributeId).getSimpleValue();
            var sortOrder = usNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();

            // Handle inactive category
            if (!activeCat) {
                if (currentMarket != "US") {
                    usNode.getValue(inheritAtt).setValue(null);
                    webUI.showAlert("ERROR", `<b>${nlumsg}Inherit Option Removed:</b>`, "<b>This category is not active in the US Market.</b>");
                    return;
                }

                if (sortOrder != "999999") {
                    usNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("999999");
                    fixSortOrders = true;
                }
            } else {
                var usParentStart = usNode.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
                var usParentEnd = usNode.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();

                if (usParentStart == null || usParentEnd < today) {
                    usNode.getValue(inheritAtt).setValue(null);
                    webUI.showAlert("ERROR", `<b>${nlumsg}Inherit Option Removed:</b>`, `<b>The parent ${usNode.getParent().getObjectType().getName()} is not Active in the US market.</b>`);
                    return;
                }

                if (sortOrder == "999999") {
                    usNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("1");
                    if (setSortToTopMkts == null) {
                        setSortToTopMkts = "US";
                        fixSortOrders = true;
                    }
                }
            }
            

            // Track missing sort order
            if (sortOrder == null && missingSortMkts == null && parentInheritOption != "Attributes & Sort Order") {
                missingSortMkts = "US";
            }

            usManager.executeInContext(engContext, function (otherManager) {
                var cntxtMarket = LKT.getLookupTableValue("LKT_Context_to_Market", engContext);
                var cntxtNode = otherManager.getClassificationHome().getClassificationByID(node.getID());

                var cntxtValue = cntxtNode.getValue(attributeId).getSimpleValue();
                var cntxtSortOrder = cntxtNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();
                var cntxtParentStart = cntxtNode.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
                var cntxtParentEnd = cntxtNode.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();

                if (cntxtValue != attributeValue) {
                    if (currentContext == engContext) {
                        webUI.showAlert("WARNING", `<b>${nlumsg}Modification in context ${currentContext} will not apply, as this category is inheriting values from the US market. Please switch to EN_US to modify this category.</b>`);
                    }
                    cntxtNode.getValue(attributeId).setSimpleValue(attributeValue);
                }

                if (cntxtParentStart == null || cntxtParentEnd < today) {
                    cntxtNode.getValue(inheritAtt).setValue(null);
                    cntxtNode.getValue(attributeId).setSimpleValue(null);
                    webUI.showAlert("ERROR", "Error", `<b>${nlumsg}Inherit Option was removed, as the parent ${cntxtNode.getParent().getObjectType().getName()} is not Active in the ${cntxtMarket} market.</b>`);
                    return;
                }

                if (parentInheritOption == "Attributes & Sort Order") {
                    if (cntxtSortOrder != sortOrder) {
                        cntxtNode.getValue("a_WebCategory_Sort_Order").setSimpleValue(sortOrder);
                        cntxtNode.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue(null);
                    }

                    if (sortOrder == null) {
                        webUI.showAlert("WARNING", `<b>${nlumsg}This WebCategory is missing a Sort order value in the US Market.</b>`);
                    } else if (sortOrder == "1") {
                        if (setSortToTopMkts == null) {
                            setSortToTopMkts = engMarket;
                            fixSortOrders = true;
                        } else if (setSortToTopMkts.indexOf(engMarket) == -1) {
                            setSortToTopMkts += ";" + engMarket;
                            fixSortOrders = true;
                        }
                    }
                } else {
                    if (cntxtSortOrder == "999999" && activeCat) {
                        cntxtNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("1");
                        if (setSortToTopMkts == null) {
                            setSortToTopMkts = engMarket;
                            fixSortOrders = true;
                        } else if (setSortToTopMkts.indexOf(engMarket) == -1) {
                            setSortToTopMkts += ";" + engMarket;
                            fixSortOrders = true;
                        }
                    } else if (cntxtSortOrder == null && activeCat) {
                        if (missingSortMkts == null) {
                            missingSortMkts = engMarket;
                        } else if (missingSortMkts.indexOf(engMarket) == -1) {
                            missingSortMkts += ";" + engMarket;
                        }
                    } else if (cntxtSortOrder != "999999" && !activeCat) {
                        cntxtNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("999999");
                        fixSortOrders = true;
                    }
                }
            });
        }
    });
}


function inheritSortOrderForWebCategory(node, context, manager) {
    // Copy EN_US sort order to the specified context for all child WebCategories of the given node (WebDivision or higher-level WebCategory)
    manager.executeInContext('EN_US', function (usManager) {
        var usNode = usManager.getClassificationHome().getClassificationByID(node.getID());
        var usChildren = usNode.getChildren().iterator();
        var nlumsg = slug.checkNLUmessage(node);
        var today = java.time.ZonedDateTime.now();

        while (usChildren.hasNext()) {
            var childCat = usChildren.next();
            var childCatObjectType = childCat.getObjectType().getID();

            // 🚫 Only process WebCategory (not WebSubCategory, CMS, etc.)
            if (childCatObjectType != "WebCategory") {
                continue;
            }

            var excludeInENUS = childCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();

            // ❗ Don't allow setting exclusion in EN_US
            if (excludeInENUS != null) {
                webUI.showAlert("WARNING", nlumsg + "Cannot set exclusion in EN_US. Please switch context to the Market where you are trying to exclude sort order inheritance.");
                childCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue(null);
            }

            var usStart = childCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
            var usEnd = childCat.getValue('a_WebCategory_End_Date').getSimpleValue();
            var usSortOrder = childCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();

            var isUSActive =
                (usStart != null && usEnd == null) ||
                (usStart != null && usEnd > today);

            // ✅ CASE 1: US WebCategory is active
            if (isUSActive) {
                usManager.executeInContext(context, function (otherManager) {
                    var cntxtChildCat = otherManager.getClassificationHome().getClassificationByID(childCat.getID());
                    var cntxtStart = cntxtChildCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                    var cntxtEnd = cntxtChildCat.getValue('a_WebCategory_End_Date').getSimpleValue();
                    var excludeInContext = cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();

                    var isContextActive =
                        (cntxtStart != null && cntxtEnd == null) ||
                        (cntxtStart != null && cntxtEnd > today);

                    // ✅ Set sort order only if not excluded and category is active in context
                    if (excludeInContext != "Yes" && isContextActive) {
                        cntxtChildCat.getValue('a_WebCategory_Sort_Order').setSimpleValue(usSortOrder);
                    }
                });
            }

            // ❗ CASE 2: US WebCategory is inactive — force exclusion in context
            else if (usStart == null || usEnd < today) {
                usManager.executeInContext(context, function (otherManager) {
                    var cntxtChildCat = otherManager.getClassificationHome().getClassificationByID(childCat.getID());
                    var cntxtStart = cntxtChildCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                    var cntxtEnd = cntxtChildCat.getValue('a_WebCategory_End_Date').getSimpleValue();
                    var excludeInContext = cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();

                    var isContextActive =
                        (cntxtStart != null && cntxtEnd == null) ||
                        (cntxtStart != null && cntxtEnd > today);

                    if (excludeInContext != "Yes" && isContextActive) {
                        cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue('Yes');
                    }
                });
            }
        }
    });
}


function setSortOrderForWebCategory(node, manager) {
    var today = java.time.ZonedDateTime.now();
    var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
    today = today.format(formatter);

    var catStart = node.getValue("a_WebCategory_Start_Date").getSimpleValue();
    var catEnd = node.getValue("a_WebCategory_End_Date").getSimpleValue();
    var catSortOrder = node.getValue("a_WebCategory_Sort_Order").getSimpleValue();

    var parentStart = node.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
    var parentEnd = node.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();

    // ✅ Only run for WebCategory (not WebDivision)
    if (objectType != "WebDivision") {
        // 🔴 CASE 1: Inactive category — set sort order to 999999
        if (catStart == null || catEnd < today) {
            if (catSortOrder != "999999") {
                node.getValue("a_WebCategory_Sort_Order").setSimpleValue("999999");
                fixSortOrders = true;
            }
        }

        // 🟢 CASE 2: Active category
        else {
            if (parentStart == null || parentEnd < today) {
                webUI.showAlert("ERROR", "Error:", "<b>" + nlumsg + "The parent " + node.getParent().getObjectType().getName() + " is not Active in the " + currentMarket + " market. Please adjust start/end date of parent before activating this category.</b>\n");
                return;
            }

            // If previously 999999, reset to 1 or inherit from EN_US
            if (catSortOrder == "999999") {
                node.getValue("a_WebCategory_Sort_Order").setSimpleValue("1");
                setSortToTopMkts = currentMarket;
                fixSortOrders = true;

                // 🔁 CASE 2a: Inheritance from EN_US if parent has "Attributes & Sort Order"
                if (currentMarket != "US") {
                    var inheritOptionATT = "a_" + currentMarket + "_Inherit_Option";
                    var catParentInheritOption = node.getParent().getValue(inheritOptionATT).getSimpleValue();

                    if (catParentInheritOption == "Attributes & Sort Order") {
                        var usCatActive = true;

                        manager.executeInContext('EN_US', function (usManager) {
                            var usNode = usManager.getClassificationHome().getClassificationByID(node.getID());
                            var usCatStart = usNode.getValue("a_WebCategory_Start_Date").getSimpleValue();
                            var usCatEnd = usNode.getValue("a_WebCategory_End_Date").getSimpleValue();
                            var usSortOrder = usNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();

                            if (usCatStart == null || usCatEnd < today) {
                                usCatActive = false;
                            } else {
                                node.getValue("a_WebCategory_Sort_Order").setSimpleValue(usSortOrder);
                                setSortToTopMkts = null;

                                if (usSortOrder == null) {
                                    webUI.showAlert("WARNING", "<b>" + nlumsg + "This " + objectType + " is missing a Sort order value in the US Market. Please navigate to the parent " + parentObjType + " and update the sort order in the US market.</b>");
                                }
                            }
                        });

                        if (usCatActive == false) {
                            node.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue("Yes");
                        }
                    }
                }

                // 🔁 CASE 2b: If in EN_US, remove exclusions in CAN and JPN if applicable
                else {
                    manager.executeInContext('EN_CA', function (canManager) {
                        var canNode = canManager.getClassificationHome().getClassificationByID(node.getID());
                        var parentCANInheritOption = canNode.getParent().getValue("a_CAN_Inherit_Option").getSimpleValue();

                        if (parentCANInheritOption == "Attributes & Sort Order") {
                            canNode.getValue("a_Exclude_from_US_Sort_Inherit").setValue(null);
                        }
                    });

                    manager.executeInContext('EN_JP', function (jpnManager) {
                        var jpnNode = jpnManager.getClassificationHome().getClassificationByID(node.getID());
                        var parentJPNInheritOption = jpnNode.getParent().getValue("a_JPN_Inherit_Option").getSimpleValue();

                        if (parentJPNInheritOption == "Attributes & Sort Order") {
                            jpnNode.getValue("a_Exclude_from_US_Sort_Inherit").setValue(null);
                        }
                    });
                }
            }
        }
    }

    // ⚠️ CASE 3: Active but missing sort order in current market
    if ((catStart != null && catEnd > today) || (catStart != null && catEnd == null)) {
        if (catSortOrder == null) {
            webUI.showAlert("WARNING", "<b>" + nlumsg + "This " + objectType + " is missing a Sort order value in the " + currentMarket + " Market. Please navigate to the parent " + parentObjType + " and update the sort order for this market.</b>");
        }
    }
}




}
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
exports.operation1 = function (node,step,LKT) {
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