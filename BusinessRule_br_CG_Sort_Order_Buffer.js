/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CG_Sort_Order_Buffer",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Content Group Sort Order Buffer",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Slot" ],
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
exports.operation0 = function (node,step,LKT) {
function getBrandNumber(category) {
    var type = category.getObjectType().getID();
    var parent = category.getParent();
    var parentType = parent.getObjectType().getID();
    if (type == "CMS_Slot") {
        return parent.getValue("a_Brand_Number").getSimpleValue()
    }
    else {
        var brandNum = category.getValue("a_Brand_Number").getSimpleValue();
    }
    return brandNum;
}

function setSortOrderBuffer(node, context, manager) {
    var today = java.time.ZonedDateTime.now();
    var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
    today = today.format(formatter);
    manager.executeInContext(context, function (cntxtManager) {
        var cntxtNode = cntxtManager.getClassificationHome().getClassificationByID(node.getID());
        var catStart = cntxtNode.getValue('a_WebCategory_Start_Date').getSimpleValue();
        var catEnd = cntxtNode.getValue('a_WebCategory_End_Date').getSimpleValue();

        if (objectType == "CMS_Slot") {
            var cntxtCatChildren = cntxtNode.getChildren().iterator();
            var childSortOrderArray = [];

            //get sort order value from each child object
            while (cntxtCatChildren.hasNext()) {
                var childCat = cntxtCatChildren.next();
                var childCatID = childCat.getID();
                var childCatObjectType = childCat.getObjectType().getID();

                if (childCatObjectType == "CMS_Content_Group") {
                    var childCatStart = childCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                    var childCatEnd = childCat.getValue('a_WebCategory_End_Date').getSimpleValue();

                    //set inactive category sort order values
                    if (childCatStart == null || childCatEnd < today) {
                        childCat.getValue('a_WebCategory_Sort_Order').setSimpleValue("9999");
                        childCat.getValue('a_Old_WebCategory_Sort_Order').setSimpleValue("9999");
                    }

                    var childCatSortOrder = childCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();
                    if (childCatSortOrder != null && childCatSortOrder != "9999") {
                        childSortOrderArray.push({ catID: childCatID, sortOrder: childCatSortOrder, startDate: childCatStart });
                    }
                }
            }

            if (childSortOrderArray) {
                // sort childSortOrderArray by sortOrder value
                childSortOrderArray.sort(function (currentObject, nextObject) {
                    if (parseInt(currentObject.sortOrder) > parseInt(nextObject.sortOrder)) {
                        return 1;
                    }
                    else if (parseInt(currentObject.sortOrder) == parseInt(nextObject.sortOrder)) {
                        if (currentObject.startDate < nextObject.startDate) {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    }
                    else {
                        return -1;
                    }
                });

                // determine if inheritance should apply
                var setSortFromUS = false;
                if (objectType == "CMS_Slot" && context == "EN_CA") {
                    setSortFromUS = true;
                }

                // fix sortOrder for each child cat using sorted childSortOrderArray
                var newSortOrderValue = 20;
                var lastSortOrderValue = 0;

                childSortOrderArray.forEach(function (currentObject) {
                    var currentChildCat = cntxtManager.getClassificationHome().getClassificationByID(currentObject.catID);
                    var currentChildCatSort = currentChildCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();
                    var excludeUSSortInherit = currentChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();
                    var time = new java.util.Date();
                    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                    //remove exclude values when there is no inheritance from US
                    if (setSortFromUS == false && excludeUSSortInherit == "Yes") {
                        if (context == "EN_US") {
                            currentChildCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue(null);
                        }
                    }

                    var childCAN = currentChildCat.getValue("a_Content_Group_Can_InheritOption").getSimpleValue();
                    if (context == "EN_CA" && childCAN == null && excludeUSSortInherit == null) {
                        currentChildCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue("Yes");
                        excludeUSSortInherit = currentChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();

                    }

                    //set sort from US when inherited
                    if (excludeUSSortInherit != "Yes") {
                        if (setSortFromUS == true) {
                            cntxtManager.executeInContext("EN_US", function (usManager) {
                                var usChildCat = usManager.getClassificationHome().getClassificationByID(currentChildCat.getID());
                                var usChildCatSort = usChildCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();
                                newSortOrderValue = parseInt(usChildCatSort);
                            });
                        }

                        if (newSortOrderValue != currentChildCatSort) {
                            currentChildCat.getValue('a_WebCategory_Sort_Order').setSimpleValue(newSortOrderValue);
                            currentChildCat.getValue('a_Old_WebCategory_Sort_Order').setSimpleValue(newSortOrderValue);
                        }

                        lastSortOrderValue = newSortOrderValue;
                        newSortOrderValue = newSortOrderValue + 20;
                    }
                    //set sort +2
                    else {
                        lastSortOrderValue = lastSortOrderValue + 2;
                        currentChildCat.getValue('a_WebCategory_Sort_Order').setSimpleValue(lastSortOrderValue);
                        currentChildCat.getValue('a_Old_WebCategory_Sort_Order').setSimpleValue(lastSortOrderValue);
                        currentChildCat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                    }
                });
            }
        }
    });
}



var brandNumber = getBrandNumber(node);
objectType = node.getObjectType().getID();

if (brandNumber != null) {
    var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNumber);
    var marketsArray = [];
    if (markets.contains(";")) {
        markets.split(";").forEach(function (currentMarket) {
            marketsArray.push(currentMarket);
        });
    } else {
        marketsArray.push(markets);
    }

    //always set buffer in US market first to ensure proper inheritance to other markets
    setSortOrderBuffer(node, "EN_US", step);
    //for each market
    marketsArray.forEach(function (mkt) {
        //US buffer is already complete
        if (mkt != "EN_US") {
            //set buffer in other market
            setSortOrderBuffer(node, mkt, step);
        }
    });
}
}