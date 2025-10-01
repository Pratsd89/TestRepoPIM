/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Web_Hierarchy_Sort_Order_Fix",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Web Hierarchy Sort Order Fix (Temp)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision" ],
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
function fixExistingSortOrderValues(node, context, manager) {

    manager.executeInContext(context, function (otherManager) {
        var cntxtNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
        var catStart = cntxtNode.getValue('a_WebCategory_Start_Date').getSimpleValue();
        var catEnd = cntxtNode.getValue('a_WebCategory_End_Date').getSimpleValue();
        var today = java.time.ZonedDateTime.now();
        var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

        today = today.format(formatter);

        if (catStart != null && catEnd > today || catStart != null && catEnd == null) {
            var cntxtCatChildren = cntxtNode.getChildren().iterator();
            var childSortOrderArray = [];

            // get sort order value from each child object
            while (cntxtCatChildren.hasNext()) {
                var childCat = cntxtCatChildren.next();
                var childCatID = childCat.getID();
                var childCatObjectType = childCat.getObjectType().getID();

                if (childCatObjectType == "WebCategory" || childCatObjectType == "WebSubCategory") {
                    var childCatStart = childCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                    var childCatEnd = childCat.getValue('a_WebCategory_End_Date').getSimpleValue();

                    if (childCatStart == null || childCatEnd < today) {

                        childCat.getValue('a_WebCategory_Sort_Order').setSimpleValue("999999");
                    }

                    var childCatSortOrder = childCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();

                    if (childCatSortOrder != null && childCatSortOrder != "999999") {
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
                var inheritOptionCAN = cntxtNode.getValue('a_CAN_Inherit_Option').getSimpleValue();
                var inheritOptionJPN = cntxtNode.getValue('a_JPN_Inherit_Option').getSimpleValue();

                if (inheritOptionCAN == "Attributes & Sort Order") {

                    if (context == "EN_CA") {

                        setSortFromUS = true;
                    }
                }
                if (inheritOptionJPN == "Attributes & Sort Order") {

                    if (context == "EN_JP") {

                        setSortFromUS = true;
                    }
                }

                // fix sortOrder for each child cat from above sort
                var newSortOrderValue = 20;
                var lastSortOrderValue = 0;

                childSortOrderArray.forEach(function (currentObject) {
                    var currentChildCat = otherManager.getClassificationHome().getClassificationByID(currentObject.catID);
                    var currentChildCatSort = currentChildCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();
                    var excludeUSSortInherit = currentChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();
                    var time = new java.util.Date();
                    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                    if (excludeUSSortInherit != "Yes") {

                        if (setSortFromUS == true) {

                            otherManager.executeInContext("EN_US", function (usManager) {
                                var usChildCat = usManager.getClassificationHome().getClassificationByID(currentChildCat.getID());
                                var usChildCatSort = usChildCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();

                                newSortOrderValue = parseInt(usChildCatSort);
                            });
                        }

                        if (newSortOrderValue != currentChildCatSort) {

                            currentChildCat.getValue('a_WebCategory_Sort_Order').setSimpleValue(newSortOrderValue);
                            //currentChildCat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        }

                        lastSortOrderValue = newSortOrderValue;
                        newSortOrderValue = newSortOrderValue + 20;
                    }
                    else {
                        lastSortOrderValue = lastSortOrderValue + 2;

                        currentChildCat.getValue('a_WebCategory_Sort_Order').setSimpleValue(lastSortOrderValue);
                        //currentChildCat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                    }
                });
            }
        }
    });
}

function setSortOrderExclusions(node, context, manager) {
    // copy EN_US sort order values to "context" for all child WebCategories (node = Division) OR WebSubCategories (node = WebCategory), if "a_WebCategory_SortOrder_Inherit_US != No" for the child cat
    manager.executeInContext('EN_US', function (usManager) {
        //fetch context specific selected category from executing manager
        var cntxtCat = usManager.getClassificationHome().getClassificationByID(node.getID());
        var cntxtCatChildren = cntxtCat.getChildren().iterator();

        while (cntxtCatChildren.hasNext()) {
            var childCat = cntxtCatChildren.next();
            var childCatObjectType = childCat.getObjectType().getID();

            if (childCatObjectType == "WebCategory" || childCatObjectType == "WebSubCategory") {
                var usCatStart = childCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                var usCatEnd = childCat.getValue('a_WebCategory_End_Date').getSimpleValue();
                var today = java.time.ZonedDateTime.now();

                if (usCatStart == null || usCatEnd < today) {

                    usManager.executeInContext(context, function (otherManager) {
                        //fetch context specific selected category from executing manager
                        var cntxtChildCat = otherManager.getClassificationHome().getClassificationByID(childCat.getID());
                        var cntxtCatStart = cntxtChildCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                        var cntxtCatEnd = cntxtChildCat.getValue('a_WebCategory_End_Date').getSimpleValue();
                        var excludeUSSortInherit = cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();

                        //Set sort order in other markets if category is active
                        if (excludeUSSortInherit != "Yes") {

                            if (cntxtCatStart != null && cntxtCatEnd > today || cntxtCatStart != null && cntxtCatEnd == null) {

                                cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue('Yes');
                            }
                        }
                    });
                }
            }
        }
    });
}

function getBrandNumber(category) {
    //get category object type
    var type = category.getObjectType().getID();

    //get parent
    var parent = category.getParent();

    //get parent object type
    var parentType = parent.getObjectType().getID();

    //if category object type is WebCategory || WebSubCategory || WebDivision
    if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
        //then keep getting parent until type is WebBU
        while ((parentType != "WebBU") && (parentType != "WebHierarchyArchiveBU")) {
            parent = parent.getParent();

            parentType = parent.getObjectType().getID();
        }
        //get a_Brand_Number
        var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
    }
    //else get Brand Number
    else {
        var brandNum = category.getValue("a_Brand_Number").getSimpleValue();
    }

    return brandNum;
}


// start inheritance logic
var inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
var inheritJPN = node.getValue("a_JPN_Inherit_Option").getSimpleValue();
// variables to validate if Sort Order inheritance should apply
var objectType = node.getObjectType().getID();
var displayType = node.getValue('a_Category_Display_Type').getSimpleValue();
var inheritAllowed = true;

// do not allow inheritance when WebCat or WebSubCat are not Standard: Core
if (objectType == "WebCategory" || objectType == "WebSubCategory") {

    if (inheritCAN != null || inheritJPN != null) {

        if (displayType != "Standard: Core") {

            node.getValue("a_CAN_Inherit_Option").setSimpleValue(null);
            node.getValue("a_JPN_Inherit_Option").setSimpleValue(null);

            inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
            inheritJPN = node.getValue("a_JPN_Inherit_Option").getSimpleValue();
        }
    }
}

// determine if Sort Order inheritance should apply
var childCats = node.getChildren().iterator();

while (childCats.hasNext()) {
    var childCat = childCats.next();
    var childCatObjectType = childCat.getObjectType().getID();

    if (childCatObjectType == "WebCategory" || childCatObjectType == "WebSubCategory") {
        // run inheritance functions depending on attribute value selection(s)
        if (inheritCAN == "Attributes & Sort Order") {
            setSortOrderExclusions(node, "EN_CA", step);
        }
        if (inheritJPN == "Attributes & Sort Order") {
            setSortOrderExclusions(node, "EN_JP", step);
        }
        break;
    }
}

var brandNumber = getBrandNumber(node);

if (brandNumber != null) {
    var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNumber);
    var marketsArray = [];

    //fix in EN_US first to guarantee proper inheritance
    fixExistingSortOrderValues(node, "EN_US", step);

    if (markets.contains(";")) {
        //split on ";"
        markets.split(";").forEach(function (currentMarket) {
            marketsArray.push(currentMarket);
        });
    }
    else {
        marketsArray.push(markets);
    }
    //for each market
    marketsArray.forEach(function (mkt) {
        if (mkt != "EN_US") {
            fixExistingSortOrderValues(node, mkt, step);
        }
    });
}
}