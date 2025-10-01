/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Copying_WebSubCategory_To_WebCategory",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Copying WebSubCategory To WebCategory",
  "description" : "Drives WebUI Copy Category Button on SubCategoryList_Screen. Copies WebSubCategories and SubProducts under each selected WebCategory",
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "SORT_ORDER_BUFFER",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Web_Hierarchy_Sort_Order_Buffer",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "SEO",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_SEO_Slug_Genearation",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,web,SORT_ORDER_BUFFER,SEO) {
function copyAttributeValues(attributeGroup, source, target) {
    //attributes to copy from attribute group
    var attributeGroup = step.getAttributeGroupHome().getAttributeGroupByID(attributeGroup);
    var attributeList = attributeGroup.getAttributes().toArray();

    attributeList.forEach(function (attr) {
        //get value from source
        var attrVal = source.getValue(attr.getID()).getSimpleValue();

        displayLog.push("\n <-- Getting value for <b>" + attr.getID() + "</b>. Value is <b>" + attrVal + "</b>");

        //set value on target
        target.getValue(attr.getID()).setSimpleValue(attrVal);

        displayLog.push("\n --> Setting value <b>" + attr.getID() + "</b> on target to <b>" + attrVal + "</b>");
    });
}

function getBrandNumber(category) {
    //get category object type
    var type = category.getObjectType().getID();
    displayLog.push("\n - Category Object Type is: " + type);

    //get parent
    var parent = category.getParent();

    //get parent object type
    var parentType = parent.getObjectType().getID();
    displayLog.push("\n - First Parent Object Type is: " + parentType);

    //if category object type is WebCategory || WebSubCategory || WebDivision
    if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
        //then keep getting parent until type is WebBU
        while (parentType != "WebBU") {
            parent = parent.getParent();

            parentType = parent.getObjectType().getID();
        }
        displayLog.push("\n - Final Parent Found. Object Type is: " + parentType + ".\n<-- Getting Brand Number...");

        //get a_Brand_Number
        var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
    }

    //else get Brand Number
    else {
        displayLog.push("\n<-- Getting Brand Number...");
        var brandNum = category.getValue("a_Brand_Number").getSimpleValue();
    }

    displayLog.push("\n - Brand Number is: " + brandNum);
    return brandNum;
}

function getChannelNumber(category) {
    //get category object type
    var type = category.getObjectType().getID();
    displayLog.push("\n - Category Object Type is: " + type);

    //get parent
    var parent = category.getParent();

    //get parent object type
    var parentType = parent.getObjectType().getID();
    displayLog.push("\n - First Parent Object Type is: " + parentType);

    //if category object type is WebCategory || WebSubCategory || WebDivision
    if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
        //then keep getting parent until type is WebBU
        while (parentType != "WebBU") {
            parent = parent.getParent();

            parentType = parent.getObjectType().getID();
        }
        displayLog.push("\n - Final Parent Found. Object Type is: " + parentType + ".\n<-- Getting Channel Number...");

        //get a_Channel_Number
        var channelNum = parent.getValue("a_Channel_Number").getSimpleValue();
    }

    //else a_Channel_Number
    else {
        displayLog.push("\n<-- Getting Channel Number...");
        var channelNum = category.getValue("a_Channel_Number").getSimpleValue();
    }

    displayLog.push("\n - Channel Number is: " + channelNum);
    return channelNum;
}

function APICallToCopyProducts(channelNumber, copySource, copyTarget, market) {
    var fromCategoryId = copySource.getValue("a_WebCategory_CID").getSimpleValue();
    var toCategoryId = copyTarget.getValue("a_WebCategory_CID").getSimpleValue();
    var bmcId = brandNumber + "-" + market + "-" + channelNumber;
    var url = new java.net.URL("https://api.gap.com/commerce/pim/data-governance/core/categories/copy");
    var conn = url.openConnection();
    conn.setDoOutput(true);
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/json");
    conn.setRequestProperty("apikey", "tn23uGq0bWOdbxCAKXju1u2GGseATTvn");
    conn.setRequestProperty("env", "prod");
    var input = new java.lang.String("{\"bmcId\":\"" + bmcId +
        "\",\"fromCategoryId\":\"" + fromCategoryId +
        "\",\"toCategoryId\":\"" + toCategoryId +
        "\"}");
    log.info(input);
    var os = conn.getOutputStream();
    os.write(input.getBytes());
    os.flush();
    os.close();
    if (conn.getResponseCode() != java.net.HttpURLConnection.HTTP_OK) {
        log.info("Failed : HTTP error code : " + conn.getResponseCode());
    }
    displayLog.push("\n<b style='color:Blue;'> Invoked DGL API to copy products of source category to copy category </b>");
}

/*
    RULE STARTS HERE
*/

//get todays date
var today = new java.time.ZonedDateTime.now();

//array for webUI log messages
var displayLog = new Array();
var warningMsg = new Array();

//get selected categories
var selected = web.getSelection().iterator();

//for each selected category
while (selected.hasNext()) {
    //current selected category
    var cat = selected.next();
    var catCID = cat.getValue("a_WebCategory_CID").getSimpleValue();
    var catBrand = cat.getValue("a_Brand_Number").getSimpleValue();
    //get Divisions or Categories from picker
    var pickerClass = web.getSelectedSetOfNodes().iterator();

    var fixSortOrder = false;

    //for each picker class
    while (pickerClass.hasNext()) {
        //current picker category
        var picked = pickerClass.next();
        var pickedCID = picked.getValue("a_WebCategory_CID").getSimpleValue();
        var pickedStart = picked.getValue("a_WebCategory_Start_Date").getSimpleValue();
        var pickedEnd = picked.getValue("a_WebCategory_End_Date").getSimpleValue();
        var targetObjectType = picked.getObjectType().getID();
        var PickedBrand = picked.getValue("a_Brand_Number").getSimpleValue();

        if (catBrand != PickedBrand) {
            warningMsg.push("\nCopy was not performed for " + catCID + ", as the selected Web Category (" + pickedCID + ") is different Brand. Please select same brand Web Category");
        }

        if (pickedStart == null || pickedEnd < today) {
            if (targetObjectType == "Web Category")
                warningMsg.push("\nCopy was not performed for " + catCID + ", as the selected Web Category (" + categoryCID + ") is not active in the current market. Please adjust start/end date of the parent Web Division before copying categories.");
            else if (targetObjectType == "Web Division")   /* PPIM-6165 - Added condition if Target is WebDivision */
                warningMsg.push("\nCopy was not performed for " + catCID + ", as the selected Web Divison (" + categoryCID + ") is not active in the current market. Please adjust start/end date of the parent Web Category before copying categories.");
        }
        else {

            /* PPIM-6165 - Adjusted the Classification creation logic to create new SubCategory when Selected Target is WebCategory
                       -	Existing Copy Category functionality */
            var copyCat = null
            if (targetObjectType == "WebCategory") {
                //create new sub category with picker category as parent
                displayLog.push("\nCopying Web Sub Category <b>" + cat.getID() + "</b>\n - under Web Category: <b>" + picked.getID() + "</b>");
                copyCat = picked.createClassification(
                    null,
                    "WebSubCategory"
                );
            }
            /* PPIM-6165 Added the Classification creation logic to create new Category when Selected Target is WebDivision*/
            else if (targetObjectType == "WebDivision") {
                //create new category with picker Division as parent
                displayLog.push("\nCopying Web Sub Category <b>" + cat.getID() + "</b> as WebCategory as Selected Target is Web Division: <b>" + picked.getID() + "</b>");
                copyCat = picked.createClassification(
                    null,
                    "WebCategory"
                );
            }

            //get a_Brand_Number of parent of selected category
            var brandNumber = getBrandNumber(cat);

            var channelNumber = getChannelNumber(cat);

            //copy values from selected category to new sub category for all atts in ag_WebCat_Not_Dimension_Dependent_ATTs
            copyAttributeValues("ag_WebCat_Not_Dimension_Dependent_ATTs", cat, copyCat);
            setSeoNonIndexable(copyCat);
            //copyCat.getValue("a_SEO_Non_Indexable").setSimpleValue("Index");
            //copyCat.getValue("a_Category_Description").setSimpleValue(cat.getValue("a_Category_Description").getSimpleValue()); //PPIM-13630
            //query a_Brand_Number against LKT_Brand_Number_to_Market
            var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNumber);
            var marketsArray = [];
            var inactiveMkts = null;

            if (markets.contains(";")) {
                //split on ";"
                markets.split(";").forEach(function (mkt) {
                    marketsArray.push(mkt);
                });
            }
            else {
                marketsArray.push(markets);
            }

            //for each market
            marketsArray.forEach(function (mkt) {
                displayLog.push("\n<-> Copying attributes and references in market: <b>" + mkt + "</b>");

                step.executeInContext(mkt, function (manager) {
                    //get the current market from mkt
                    var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", mkt);

                    //fetch context specific selected category from executing manager
                    var mSource = manager.getClassificationHome().getClassificationByID(cat.getID());

                    //fetch context specific picked category from executing manager
                    var mTarget = manager.getClassificationHome().getClassificationByID(copyCat.getID());

                    //copy attribute values for ag_WebCat_Market_Dependent_ATTs in context
                    copyAttributeValues("ag_WebCat_Market_Dependent_ATTs", mSource, mTarget);
                    setSeoNonIndexable(mTarget);
                    var parentStartDate = mTarget.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
                    var parentEndDate = mTarget.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();
                    var mSourceStart = mSource.getValue("a_WebCategory_Start_Date").getSimpleValue();
                    var mSourceEnd = mSource.getValue("a_WebCategory_End_Date").getSimpleValue();

                    var USCatActive = true;

                    //set variables if user moves active WebCat to inactive division
                    if (parentStartDate == null || parentEndDate < today) {
                        if (inactiveMkts == null) {
                            inactiveMkts = currentMarket;
                        }
                        else if (inactiveMkts.indexOf(currentMarket) == -1) {
                            inactiveMkts = inactiveMkts + ";" + currentMarket;
                        }

                        mTarget.getValue("a_WebCategory_Sort_Order").setValue("999999");
                    }
                    else {
                        if (mkt != "EN_US") {
                            // determine if cat is active in US
                            var inheritAtt = "a_" + currentMarket + "_Inherit_Option";
                            var parentInheritOption = mTarget.getValue(inheritAtt).getSimpleValue();

                            if (parentInheritOption == "Attributes & Sort Order") {
                                manager.executeInContext("EN_US", function (man) {
                                    var USSource = man.getClassificationHome().getClassificationByID(mSource.getID());

                                    var USStart = USSource.getValue("a_WebCategory_Start_Date").getSimpleValue();
                                    var USEnd = USSource.getValue("a_WebCategory_End_Date").getSimpleValue();

                                    if (USStart == null || USEnd < today) {
                                        USCatActive = false;
                                    }
                                });
                            }

                            if (mSourceStart != null && mSourceEnd == null || mSourceStart != null && mSourceEnd > today) {
                                if (USCatActive == false) {
                                    mTarget.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue("Yes");

                                    mTarget.getValue("a_WebCategory_Sort_Order").setValue("1");

                                    fixSortOrder = true;
                                }
                                else {
                                    mTarget.getValue("a_WebCategory_Sort_Order").setValue("1");

                                    fixSortOrder = true;
                                }
                            }
                            else {
                                mTarget.getValue("a_WebCategory_Sort_Order").setValue("999999");
                            }
                        }
                        else {
                            if (mSourceStart != null && mSourceEnd == null || mSourceStart != null && mSourceEnd > today) {
                                mTarget.getValue("a_WebCategory_Sort_Order").setValue("1");

                                fixSortOrder = true;
                            }
                            else {
                                mTarget.getValue("a_WebCategory_Sort_Order").setValue("999999");
                            }
                        }

                        var webCategoryAssortmentType = mSource.getValue('a_WebCategory_Assortment_Type').getSimpleValue();

                        if (webCategoryAssortmentType == 'Manual') {
                            APICallToCopyProducts(channelNumber, mSource, mTarget, currentMarket);
                        }
                    }
                });
            });
            //query a_Brand_Number of parent against LKT_Brand_Number_to_Context
            var contexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Context", brandNumber);
            var contextsArray = [];

            if (contexts.contains(";")) {
                //split on ";"
                contexts.split(";").forEach(function (ctx) {
                    contextsArray.push(ctx);
                });
            }
            else {
                contextsArray.push(contexts);
            }

            //for each context
            contextsArray.forEach(function (ctx) {
                displayLog.push("\n<-> Copying attributes and references in context: <b>" + ctx + "</b>");

                step.executeInContext(ctx, function (manager) {
                    var mSource = manager.getClassificationHome().getClassificationByID(cat.getID());

                    var mTarget = manager.getClassificationHome().getClassificationByID(copyCat.getID());

                    var parentStartDate = mTarget.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
                    var parentEndDate = mTarget.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();

                    if (parentStartDate != null && parentEndDate == null || parentStartDate != null && parentEndDate > today) {
                        //copy attribute values for ag_WebCat_Market_Language_Dependent_ATTs in context
                        copyAttributeValues("ag_WebCat_Market_Language_Dependent_ATTs", mSource, mTarget);
                        setSeoNonIndexable(mTarget);
                        //copy Name from selected cat to copyCat
                        mTarget.setName(mSource.getName());
                    }
                });
            });

            //build warning msg to alert user of inactve divisions
            if (inactiveMkts != null) {
                var copyCatCID = copyCat.getValue("a_WebCategory_CID").getSimpleValue();
                if (targetObjectType == "Web Category")
                    warningMsg.push("\nThe copied Web Sub Category with CID" + copyCatCID + " was not copied in market(s) " + inactiveMkts + ", as the selected Web Category (" + pickedCID + ") is not active in Market(s) " + inactiveMkts + ".");
                else if (targetObjectType == "Web Division")   /* PPIM-6165 - Added condition if Target is WebDivision */
                    warningMsg.push("\nThe copied Web Category with CID" + copyCatCID + " was not copied in market(s) " + inactiveMkts + ", as the selected Web Division (" + pickedCID + ") is not active in Market(s) " + inactiveMkts + ".");
            }

            //set a_main_last_modified_date on new category
            var time = new java.util.Date();
            var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            copyCat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        }
    }

    // run BR
    if (fixSortOrder == true) {
        SORT_ORDER_BUFFER.execute(cat);
    }
}
if (warningMsg.length > 0) {
    web.showAlert("WARNING", "<b>ALERT: " + warningMsg + "</b>");
}




// added to set the value for the SEO page index tag attribute 

function getContextSpecificObject(object, context) {
    var contextSpecificObject = "";
    contextSpecificObject = step.executeInContext(context, function (specificManager) {
        var ObjectinContext = specificManager.getObjectFromOtherManager(object);
        if (ObjectinContext != "undefined" && ObjectinContext != null) {
            return ObjectinContext;
        }
    });
    return contextSpecificObject;
}

function setValuesAcrossContexts(nodeObject) {

    var currentContext = step.getCurrentContext().getID();
    if (currentContext == "EN_US") {
        var en_CAObject = getContextSpecificObject(nodeObject, "EN_CA");
        var fr_CAObject = getContextSpecificObject(nodeObject, "FR_CA");
        setValuesForChildern(nodeObject);
        setValuesForChildern(en_CAObject);
        setValuesForChildern(fr_CAObject);
    }
    else if (currentContext == "EN_CA") {

        var fr_CAObject = getContextSpecificObject(nodeObject, "FR_CA");
        var en_USObject = getContextSpecificObject(nodeObject, "EN_US");
        setValuesForChildern(nodeObject);
        setValuesForChildern(fr_CAObject);
        setValuesForChildern(en_USObject);
    }
}

function setValuesForChildern(nodeObject) {
    var objectTypeName = nodeObject.getObjectType().getName();
    if (objectTypeName == "Web Sub Category") {
        nodeObject.getValue("a_SEO_Non_Indexable").setSimpleValue("Index");
        nodeObject.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("Index");
    }
}


function setSeoNonIndexable(nodeObject) {
    var objectTypeName = nodeObject.getObjectType().getName();
    if (objectTypeName == "Web Sub Category") {
        setValuesAcrossContexts(nodeObject);
    }
}
//final display message. comment out line when not in development
//web.showAlert("Warning", "Selected Nodes:", displayLog);
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (web) {
//get picker categories
var pickerClass = web.getSelectedSetOfNodes().iterator();

//array for flagged picker categories
var flagged = new Array();

//validate each picker category is a WebCategory
while (pickerClass.hasNext()) {
	var cat = pickerClass.next();

	/* PPIM-6165  - Added Condition check to negate WebDivision */
	if (cat.getObjectType().getID() != "WebCategory" && cat.getObjectType().getID() != "WebDivision") {
		flagged.push("\n"+cat.getID());
	}
}

if (flagged.length > 0) {
	web.showAlert(
		"Error",
		"One or more selected categories are not Web Categories",
		"The following categories from the picker are not Web Categories:"+flagged+"\n\n<b>Please only select Web Categories in the picker dialog.</b>"
	);
	return false;	
}
else { return true; }
}