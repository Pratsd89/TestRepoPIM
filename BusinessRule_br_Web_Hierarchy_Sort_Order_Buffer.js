/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Web_Hierarchy_Sort_Order_Buffer",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Web Hierarchy Sort Order Buffer",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Slot", "WebCategory", "WebDivision" ],
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

function setSortOrderBuffer(node, context, manager) {

    manager.executeInContext(context, function (cntxtManager) {
        var cntxtNode = cntxtManager.getClassificationHome().getClassificationByID(node.getID());
        var catStart = cntxtNode.getValue('a_WebCategory_Start_Date').getSimpleValue();
        var catEnd = cntxtNode.getValue('a_WebCategory_End_Date').getSimpleValue();
        var today = java.time.ZonedDateTime.now();
        var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

        today = today.format(formatter);
        //displayLog.push("\nCurrent Market is " + context);

        if (catStart != null && catEnd > today || catStart != null && catEnd == null) {
            var cntxtCatChildren = cntxtNode.getChildren().iterator();
            var childSortOrderArray = [];

            //get sort order value from each child object
            while (cntxtCatChildren.hasNext()) {
                var childCat = cntxtCatChildren.next();
                var childCatID = childCat.getID();
                var childCatObjectType = childCat.getObjectType().getID();

                if (childCatObjectType == "WebCategory" || childCatObjectType == "WebSubCategory") {
                    var childCatStart = childCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                    var childCatEnd = childCat.getValue('a_WebCategory_End_Date').getSimpleValue();

                    //set inactive category sort order values
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

                if (inheritOptionCAN == "Attributes & Sort Order" && context == "EN_CA") {

                    setSortFromUS = true;
                }
                if (inheritOptionJPN == "Attributes & Sort Order" && context == "EN_JP") {

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

                        if (context == "EN_CA" || context == "EN_JP") {

                            currentChildCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue(null);
                            excludeUSSortInherit = currentChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();
                        }
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
                            //New logic established to publish all active child cats, as seen in br_Publish_Child_Cats_to_DGL
                            //currentChildCat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        }

                        lastSortOrderValue = newSortOrderValue;
                        newSortOrderValue = newSortOrderValue + 20;
                    }
                    //set sort +2
                    else {
                        lastSortOrderValue = lastSortOrderValue + 2;

                        currentChildCat.getValue('a_WebCategory_Sort_Order').setSimpleValue(lastSortOrderValue);
                        currentChildCat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                    }
                });
            }
        }
    });
}

var brandNumber = getBrandNumber(node);
var displayLog = [];

if (brandNumber != null) {
    var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNumber);
    var marketsArray = [];

    if (markets.contains(";")) {
        //split on ";"
        markets.split(";").forEach(function (currentMarket) {
            marketsArray.push(currentMarket);
        });
    }
    else {
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
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node) {
var objectType = node.getObjectType().getID();
if(objectType =="CMS_Content_Group" || objectType =="CMS_Slot"){
	return true;
}
var categoryDescription = node.getValue("a_Category_Description").getSimpleValue();
if(categoryDescription!=null){
	return true;
} else return false;
}